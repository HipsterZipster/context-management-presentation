import { writeFile, mkdir } from "node:fs/promises";
import { basename } from "node:path";

const DEST = "images/slides";

const images = [
  {
    url: "https://raw.githubusercontent.com/glato/assets/emerge/emerge-1-3-0-screenshot-01.png",
    filename: "slide6-repo-structure.png",
    alt: "Digital visualization of a software repository file structure",
  },
  {
    url: "https://a0.anyrgb.com/pngimg/1472/1358/checklist-audit-clipboard-software-testing-survey-report-form-test-document-internet.png",
    filename: "slide7-maintenance-checklist.png",
    alt: "Technical checklist icon representing maintenance",
  },
  {
    url: "https://cdn.dribbble.com/userupload/15895748/file/original-643d690bf971a0d821420a10600acfd5.png?crop=3x99-3076x2404&format=webp&resize=400x300&vertical=center",
    filename: "slide8-code-editor.png",
    alt: "Modern code editor interface",
  },
  {
    url: "https://www.aviator.co/blog/wp-content/uploads/2024/12/monorepo-dir.png",
    filename: "slide12-monorepo-diagram.png",
    alt: "Monorepo architecture diagram",
  },
];

await mkdir(DEST, { recursive: true });

for (const img of images) {
  const dest = `${DEST}/${img.filename}`;
  try {
    console.log(`⬇  ${img.filename} ...`);
    const res = await fetch(img.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log(`   ✅ saved (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (err) {
    console.error(`   ❌ failed: ${err.message}`);
  }
}

console.log("\nDone.");
