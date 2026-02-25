import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { execSync } from "child_process";
import { dirname } from "path";

const [url, out] = process.argv.slice(2);

if (!url || !out) {
  console.error("Usage: node scripts/print-slides.mjs <url> <output.pdf>");
  process.exit(1);
}

(async () => {
  mkdirSync(dirname(out), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });
  await page.goto(url, { waitUntil: "networkidle" });

  // Wait for Mermaid to finish rendering
  await page.waitForTimeout(5000);

  const totalSlides = await page.evaluate(
    () => document.querySelectorAll(".slide").length,
  );
  console.log(`Found ${totalSlides} slides`);

  const pdfPaths = [];

  for (let i = 0; i < totalSlides; i++) {
    await page.evaluate((idx) => go(idx), i);
    await page.waitForTimeout(500);

    // Hide UI elements for cleaner export
    await page.evaluate(() => {
      document
        .querySelectorAll(".sn")
        .forEach((n) => (n.style.display = "none"));
      document.getElementById("tb").style.display = "none";
      document.getElementById("counter").style.display = "none";
      document.getElementById("nav-hints").style.display = "none";
      document.getElementById("progress").style.display = "none";
    });

    const path = `/tmp/slide-${String(i + 1).padStart(2, "0")}.pdf`;
    await page.pdf({
      path,
      landscape: true,
      width: "1280px",
      height: "720px",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    pdfPaths.push(path);
    console.log(`  Slide ${i + 1}/${totalSlides} exported`);

    // Restore UI elements
    await page.evaluate(() => {
      document.querySelectorAll(".sn").forEach((n) => (n.style.display = ""));
      document.getElementById("tb").style.display = "";
      document.getElementById("counter").style.display = "";
      document.getElementById("nav-hints").style.display = "";
      document.getElementById("progress").style.display = "";
    });
  }

  await browser.close();

  try {
    const joinCmd = pdfPaths.map((p) => `"${p}"`).join(" ");
    execSync(
      `"/System/Library/Automator/Combine PDF Pages.action/Contents/MacOS/join" -o "${out}" ${joinCmd}`,
    );
    console.log(`\n✅ Merged ${totalSlides} slides into ${out}`);
  } catch {
    console.log(`\n⚠️  Individual PDFs saved to /tmp/slide-*.pdf`);
    console.log(
      `    Merge with: /System/Library/Automator/Combine\\ PDF\\ Pages.action/Contents/MacOS/join -o ${out} /tmp/slide-*.pdf`,
    );
  }
})();
