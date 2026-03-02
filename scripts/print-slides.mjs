import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { execSync } from "child_process";
import { dirname } from "path";

const [url, out] = process.argv.slice(2);

if (!url || !out) {
  console.error("Usage: node scripts/print-slides.mjs <url> <output.pdf>");
  process.exit(1);
}

const W = 1920;
const H = 1080;

(async () => {
  mkdirSync(dirname(out), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle" });

  // Wait for images/SVGs to finish rendering
  await page.waitForTimeout(5000);

  const totalSlides = await page.evaluate(
    () => document.querySelectorAll(".slide").length,
  );
  console.log(`Found ${totalSlides} slides`);

  const pngPaths = [];

  for (let i = 0; i < totalSlides; i++) {
    await page.evaluate((idx) => go(idx), i);
    await page.waitForTimeout(500);

    // Hide UI chrome for clean export
    await page.evaluate(() => {
      document
        .querySelectorAll(".sn")
        .forEach((n) => (n.style.display = "none"));
      document.getElementById("tb").style.display = "none";
      document.getElementById("counter").style.display = "none";
      document.getElementById("nav-hints").style.display = "none";
      document.getElementById("progress").style.display = "none";
    });

    const pngPath = `/tmp/slide-${String(i + 1).padStart(2, "0")}.png`;
    await page.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width: W, height: H },
    });
    pngPaths.push(pngPath);
    console.log(`  Slide ${i + 1}/${totalSlides} exported`);

    // Restore UI
    await page.evaluate(() => {
      document.querySelectorAll(".sn").forEach((n) => (n.style.display = ""));
      document.getElementById("tb").style.display = "";
      document.getElementById("counter").style.display = "";
      document.getElementById("nav-hints").style.display = "";
      document.getElementById("progress").style.display = "";
    });
  }

  await browser.close();

  // Convert PNGs to a single PDF using sips + join
  try {
    // Convert each PNG to a single-page PDF
    const pdfPaths = pngPaths.map((png) => {
      const pdf = png.replace(".png", ".pdf");
      execSync(`sips -s format pdf "${png}" --out "${pdf}"`);
      return pdf;
    });

    const joinCmd = pdfPaths.map((p) => `"${p}"`).join(" ");
    execSync(
      `"/System/Library/Automator/Combine PDF Pages.action/Contents/MacOS/join" -o "${out}" ${joinCmd}`,
    );
    console.log(`\n✅ Merged ${totalSlides} slides into ${out}`);
  } catch (e) {
    console.error(e.message);
    console.log(`\n⚠️  Individual PNGs saved to /tmp/slide-*.png`);
  }
})();
