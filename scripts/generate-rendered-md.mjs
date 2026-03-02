/**
 * generate-rendered-md.mjs
 *
 * Reads context-engineering-tech-talk.md, replaces every ```mermaid ... ```
 * block with a reference to the pre-generated SVG in images/, and writes
 * context-engineering-tech-talk-rendered.md.
 *
 * Naming convention mirrors generate-mermaid.js:
 *   - Single diagram for a slide  → images/N.svg
 *   - Multiple diagrams for slide → images/Na.svg, images/Nb.svg, …
 *
 * Slide number is parsed from the nearest preceding ## Slide N: / ## Appendix …
 * heading, matching the same logic used by generate-mermaid.js.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const INPUT = resolve(ROOT, "context-engineering-tech-talk.md");
const OUTPUT = resolve(ROOT, "gen-context-engineering-tech-talk-rendered.md");
const IMAGES = "images"; // relative path used in the output markdown

const content = readFileSync(INPUT, "utf8");

// ── Build the same diagram list as generate-mermaid.js ──────────────────────

// Mirror the exact logic from generate-mermaid.js:
// - Sections are defined only by "## Slide N" headings
// - Everything after the last slide heading (appendix) belongs to the last slide number
// - Multiple diagrams in the same section get a/b/c suffixes
function buildDiagramMap(src) {
  // Collect slide section boundaries (same regex as generate-mermaid.js)
  const slideRegex = /## Slide (\d+)/g;
  const slides = [];
  let m;
  while ((m = slideRegex.exec(src)) !== null) {
    slides.push({ number: m[1], startIndex: m.index });
  }
  slides.push({ number: null, startIndex: src.length }); // sentinel

  const diagrams = [];
  const slideCount = {};

  for (let i = 0; i < slides.length - 1; i++) {
    const slideNum = slides[i].number;
    const section = src.substring(
      slides[i].startIndex,
      slides[i + 1].startIndex,
    );
    const mermaidRe = /^\s*```\s*mermaid\s*\n([\s\S]*?)\n\s*```/gm;
    let mm;
    let subIndex = 0;
    while ((mm = mermaidRe.exec(section)) !== null) {
      const globalOffset = slides[i].startIndex + mm.index;
      diagrams.push({
        offset: globalOffset,
        length: mm[0].length,
        slideNum,
        subIndex: subIndex++,
      });
    }
    slideCount[slideNum] = subIndex;
  }

  const multiSlides = new Set(
    Object.entries(slideCount)
      .filter(([, c]) => c > 1)
      .map(([n]) => n),
  );

  return { diagrams, multiSlides };
}

const { diagrams, multiSlides } = buildDiagramMap(content);

// ── Replace mermaid blocks with image references ─────────────────────────────

let result = content;
// Process in reverse order so offsets remain valid
for (let i = diagrams.length - 1; i >= 0; i--) {
  const { offset, length, slideNum, subIndex } = diagrams[i];
  const suffix = multiSlides.has(slideNum)
    ? String.fromCharCode(97 + subIndex) // a, b, c …
    : "";
  const imgFile = `${IMAGES}/${slideNum}${suffix}.svg`;
  const altText = `Slide ${slideNum}${suffix} diagram`;
  const replacement = `![${altText}](${imgFile})`;
  result =
    result.slice(0, offset) + replacement + result.slice(offset + length);
}

writeFileSync(OUTPUT, result, "utf8");
console.log(`✅  Written: ${OUTPUT}`);
