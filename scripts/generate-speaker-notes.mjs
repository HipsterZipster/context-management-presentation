/**
 * generate-speaker-notes.mjs
 *
 * Reads context-engineering-tech-talk.md and produces a clean speaker-notes
 * markdown file with:
 *   - All headings and speaking notes preserved
 *   - Mermaid blocks replaced with a one-line diagram summary
 *   - No mermaid code, no image embeds
 *
 * Output: context-engineering-speaker-notes.md
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const INPUT = resolve(ROOT, "context-engineering-tech-talk.md");
const OUTPUT = resolve(ROOT, "gen-context-engineering-speaker-notes.md");

const content = readFileSync(INPUT, "utf8");

// Extract first meaningful line from a mermaid block to build a summary
function summarizeMermaid(mermaidCode) {
  const lines = mermaidCode.trim().split("\n");

  // Check for a title line
  for (const line of lines) {
    const titleMatch = line.match(/title\s+["']?(.+?)["']?\s*$/i);
    if (titleMatch) return titleMatch[1].trim();
  }

  // Detect chart type from first line
  const first = lines[0].trim().toLowerCase();

  if (first.startsWith("pie")) return "Pie chart";
  if (first.startsWith("quadrantchart")) return "Quadrant chart";
  if (first.startsWith("xychart")) return "Bar chart";
  if (first.startsWith("sequencediagram")) return "Sequence diagram";
  if (first.startsWith("flowchart")) return "Flowchart";
  if (first.startsWith("graph lr")) return "Horizontal flowchart";
  if (first.startsWith("graph tb") || first.startsWith("graph td"))
    return "Vertical flowchart";

  // Look for a subgraph title as fallback
  for (const line of lines) {
    const subMatch = line.match(/subgraph\s+\w+\["(.+?)"\]/);
    if (subMatch) return `Diagram: ${subMatch[1]}`;
  }

  return "Diagram";
}

// Replace mermaid blocks with one-line summaries
const result = content.replace(
  /^\s*```\s*mermaid\s*\n([\s\S]*?)\n\s*```/gm,
  (_match, mermaidCode) => {
    const summary = summarizeMermaid(mermaidCode);
    return `*[${summary}]*`;
  },
);

writeFileSync(OUTPUT, result, "utf8");
console.log(`✅  Written: ${OUTPUT}`);
