import PptxGenJS from "pptxgenjs";

const pptx = new PptxGenJS();

// ── Design Tokens ──
const BG = "020617";
const BG2 = "0F172A";
const CYAN = "06B6D4";
const LIME = "84CC16";
const RED = "EF4444";
const TXT = "F8FAFC";
const TXT2 = "94A3B8";
const BDR = "334155";
const YLW = "FBBF24";

pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "Context Engineering";
pptx.title = "Context Engineering - Visual Blueprint";

// helpers
function tile(s, x, y, w, h, o = {}) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    rectRadius: 0.15,
    fill: { color: o.fill || BG2 },
    line: { color: o.border || BDR, width: 1 },
  });
  if (o.leftBar) {
    s.addShape(pptx.shapes.RECTANGLE, {
      x,
      y,
      w: 0.08,
      h,
      fill: { color: o.leftBar },
      line: { width: 0 },
    });
  }
  if (o.topBar) {
    s.addShape(pptx.shapes.RECTANGLE, {
      x,
      y,
      w,
      h: 0.06,
      fill: { color: o.topBar },
      line: { width: 0 },
    });
  }
}

function title(s, plain, accent) {
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.5,
    y: 0.4,
    w: 0.09,
    h: 0.6,
    fill: { color: CYAN },
    line: { width: 0 },
  });
  const parts = [];
  if (plain)
    parts.push({
      text: plain,
      options: { fontSize: 36, fontFace: "Arial", color: TXT, bold: true },
    });
  if (accent)
    parts.push({
      text: accent,
      options: { fontSize: 36, fontFace: "Arial", color: CYAN, bold: true },
    });
  s.addText(parts, { x: 0.85, y: 0.3, w: 11, h: 0.75, valign: "middle" });
}

function caption(s, text, o = {}) {
  s.addText(text, {
    x: 0.5,
    y: o.y || 6.6,
    w: 12.3,
    h: 0.6,
    align: "center",
    fontSize: o.fs || 20,
    fontFace: "Arial",
    color: o.color || TXT2,
    bold: !!o.bold,
    italic: !!o.italic,
  });
}

// ═══════════════════════════════════════
// SLIDE 1 – Title
// ═══════════════════════════════════════
let s = pptx.addSlide({ bkgd: BG });
s.addText("ENGINEERING TECH TALK", {
  x: 0,
  y: 0.4,
  w: 13.33,
  h: 0.4,
  align: "center",
  fontSize: 14,
  fontFace: "Arial",
  color: CYAN,
  bold: true,
  charSpacing: 6,
});
s.addText(
  [
    {
      text: "Your Repo Is Fighting Your ",
      options: { fontSize: 48, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: "AI Agents",
      options: { fontSize: 48, fontFace: "Arial", color: LIME, bold: true },
    },
  ],
  { x: 0.5, y: 0.9, w: 12.33, h: 1.1, align: "center" },
);
// 70% quote
s.addText(
  [
    {
      text: '"70% of AI coding tasks still fail in real-world repos because the agent can\'t find or trust the right context."',
      options: { fontSize: 14, fontFace: "Arial", color: TXT2, italic: true },
    },
    {
      text: "\n— Vercel Research, January 2026",
      options: { fontSize: 12, fontFace: "Arial", color: CYAN, bold: true },
    },
  ],
  { x: 1.5, y: 2.1, w: 10.33, h: 0.8, align: "center" },
);
s.addShape(pptx.shapes.RECTANGLE, {
  x: 1.8,
  y: 2.95,
  w: 9.73,
  h: 0.04,
  fill: { color: CYAN },
  line: { width: 0 },
});
// Legacy tile
tile(s, 1.8, 3.3, 4.2, 3.2, { border: RED, fill: "0A0510" });
s.addText("❌ LEGACY REPOSITORY", {
  x: 2.0,
  y: 3.45,
  w: 3.8,
  h: 0.35,
  fontSize: 11,
  fontFace: "Arial",
  color: RED,
  bold: true,
});
const legacyFiles = ["README.md", "src/", "package.json"];
legacyFiles.forEach((f, i) => {
  s.addText(f, {
    x: 2.2,
    y: 3.95 + i * 0.5,
    w: 3.4,
    h: 0.4,
    fontSize: 14,
    fontFace: "Courier New",
    color: RED,
    valign: "middle",
  });
});
s.addText("(only human docs)", {
  x: 2.2,
  y: 5.5,
  w: 3.4,
  h: 0.35,
  fontSize: 11,
  fontFace: "Arial",
  color: TXT2,
  italic: true,
});
// Arrow
s.addText("→", {
  x: 6.05,
  y: 4.3,
  w: 1.2,
  h: 0.8,
  align: "center",
  fontSize: 36,
  color: CYAN,
});
// AI-native tile
tile(s, 7.33, 3.3, 4.5, 3.2, { border: LIME, fill: "050A02" });
s.addText("✅ AI-NATIVE REPOSITORY", {
  x: 7.53,
  y: 3.45,
  w: 4.1,
  h: 0.35,
  fontSize: 11,
  fontFace: "Arial",
  color: LIME,
  bold: true,
});
const aiNativeFiles = [
  "AGENTS.md",
  "copilot-instructions.md",
  ".instructions.md",
  "llms.txt",
  "src/",
];
aiNativeFiles.forEach((f, i) => {
  s.addText(f, {
    x: 7.73,
    y: 3.95 + i * 0.45,
    w: 3.8,
    h: 0.38,
    fontSize: 13,
    fontFace: "Courier New",
    color: LIME,
    valign: "middle",
  });
});

// ═══════════════════════════════════════
// SLIDE 2 – Parametric vs. Grounded
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Parametric vs. ", "Grounded Knowledge");
// Left tile
tile(s, 0.5, 1.4, 5.65, 2.8);
s.addText("🧠", { x: 0.9, y: 1.55, w: 0.8, h: 0.6, fontSize: 36 });
s.addText("Parametric Knowledge", {
  x: 0.9,
  y: 2.15,
  w: 4.8,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText(
  "Weights-based memory. Knows general framework syntax and patterns but lacks project-specific truth and private API logic.",
  {
    x: 0.9,
    y: 2.65,
    w: 4.8,
    h: 1.2,
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
    lineSpacingMultiple: 1.3,
  },
);
// Right tile
tile(s, 6.8, 1.4, 5.65, 2.8, { border: LIME });
s.addText("🗄️", { x: 7.2, y: 1.55, w: 0.8, h: 0.6, fontSize: 36 });
s.addText("Grounded Context", {
  x: 7.2,
  y: 2.15,
  w: 4.8,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText(
  [
    {
      text: "Repository truth. Private interfaces, local conventions, and real-time state via ",
      options: { fontSize: 16, fontFace: "Arial", color: TXT2 },
    },
    {
      text: "AGENTS.MD + INSTRUCTIONS",
      options: {
        fontSize: 14,
        fontFace: "Courier New",
        color: LIME,
        bold: true,
      },
    },
    { text: ".", options: { fontSize: 16, fontFace: "Arial", color: TXT2 } },
  ],
  { x: 7.2, y: 2.65, w: 4.8, h: 1.2, lineSpacingMultiple: 1.3 },
);
// Decision Gap callout
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5,
  y: 4.6,
  w: 12,
  h: 1.2,
  rectRadius: 0.15,
  fill: { color: "140808" },
  line: { color: RED, width: 2, dashType: "dash" },
});
s.addText(
  [
    {
      text: "The Decision Gap (Vercel, Jan 2026): ",
      options: { fontSize: 17, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: "Agents skip framework docs 44% of the time because they think they already know the answer. When grounded context is missing, they guess ",
      options: { fontSize: 17, fontFace: "Arial", color: TXT2 },
    },
    {
      text: "confidently.",
      options: {
        fontSize: 17,
        fontFace: "Arial",
        color: RED,
        bold: true,
        italic: true,
      },
    },
  ],
  { x: 0.8, y: 4.6, w: 11.4, h: 1.2, align: "center", valign: "middle" },
);

// ═══════════════════════════════════════
// SLIDE 3 – Context Rot (Two-Panel)
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "The Silent Killer: ", "Context Rot");
// LEFT PANEL – Context Window Zones
const zones = [
  { label: " 0–50%: Safe Zone", w: 6.0, fill: LIME, txtColor: "000000" },
  { label: "50–80%: Compression Zone", w: 4.8, fill: YLW, txtColor: "000000" },
  { label: "80–95%: Danger Zone", w: 5.7, fill: RED, txtColor: "FFFFFF" },
  {
    label: "95%+: Context Rot",
    w: 6.0,
    fill: "000000",
    txtColor: RED,
    border: RED,
  },
];
zones.forEach((z, i) => {
  const yy = 1.5 + i * 1.0;
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5,
    y: yy,
    w: z.w,
    h: 0.7,
    rectRadius: 0.1,
    fill: { color: z.fill },
    line: { color: z.border || z.fill, width: z.border ? 2 : 0 },
  });
  s.addText(z.label, {
    x: 0.8,
    y: yy,
    w: z.w - 0.6,
    h: 0.7,
    valign: "middle",
    fontSize: 16,
    fontFace: "Arial",
    color: z.txtColor,
    bold: true,
  });
});
// RIGHT PANEL – The Ticking Bomb
tile(s, 7.0, 1.5, 5.8, 4.5, { border: RED, fill: "0A0510" });
s.addText("The Ticking Bomb", {
  x: 7.3,
  y: 1.65,
  w: 5.2,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: RED,
  bold: true,
});
s.addText(
  "Even with large context windows, agents auto-compact. Architecture rules are the first to go.",
  {
    x: 7.3,
    y: 2.2,
    w: 5.2,
    h: 0.8,
    fontSize: 15,
    fontFace: "Arial",
    color: TXT2,
    lineSpacingMultiple: 1.3,
  },
);
const bombItems = [
  "Silent failure mode — agent doesn’t signal lost context",
  "Code compiles but violates patterns",
  "Tests pass; Architecture fails",
];
bombItems.forEach((item, i) => {
  s.addText(`•  ${item}`, {
    x: 7.3,
    y: 3.2 + i * 0.65,
    w: 5.2,
    h: 0.55,
    fontSize: 14,
    fontFace: "Arial",
    color: TXT2,
    valign: "middle",
  });
});
caption(s, "Structured context prevents silent architectural erosion.", {
  y: 6.3,
  italic: true,
  fs: 18,
});

// ═══════════════════════════════════════
// SLIDE 4 – Two Models of Context Delivery
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Two Models of ", "Context Delivery");
// Left tile – Passive
tile(s, 0.5, 1.4, 5.65, 4.6, { leftBar: CYAN });
s.addText("Passive Steering (Push)", {
  x: 0.85,
  y: 1.55,
  w: 4.8,
  h: 0.5,
  fontSize: 24,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText("Files:", {
  x: 0.9,
  y: 2.15,
  w: 4.8,
  h: 0.35,
  fontSize: 13,
  fontFace: "Arial",
  color: CYAN,
  bold: true,
});
const passiveFiles = [
  "AGENTS.md",
  "copilot-instructions.md",
  ".instructions.md",
];
passiveFiles.forEach((item, i) => {
  s.addText("•  " + item, {
    x: 1.1,
    y: 2.5 + i * 0.45,
    w: 4.5,
    h: 0.4,
    fontSize: 15,
    fontFace: "Courier New",
    color: LIME,
    valign: "middle",
  });
});
s.addText(
  "Always present in system prompt. Eliminates the Decision Gap. High reliability for small context.",
  {
    x: 0.9,
    y: 3.95,
    w: 4.8,
    h: 0.9,
    fontSize: 13,
    fontFace: "Arial",
    color: TXT2,
    lineSpacingMultiple: 1.3,
  },
);
// Right tile – Active
tile(s, 6.8, 1.4, 5.65, 4.6, { leftBar: LIME });
s.addText("Active Retrieval (Pull)", {
  x: 7.15,
  y: 1.55,
  w: 4.8,
  h: 0.5,
  fontSize: 24,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText("Tools:", {
  x: 7.1,
  y: 2.15,
  w: 4.8,
  h: 0.35,
  fontSize: 13,
  fontFace: "Arial",
  color: CYAN,
  bold: true,
});
const activeTools = ["read_file", "grep_search", "semantic_search"];
activeTools.forEach((item, i) => {
  s.addText("  " + item, {
    x: 7.3,
    y: 2.5 + i * 0.45,
    w: 4.5,
    h: 0.4,
    fontSize: 15,
    fontFace: "Courier New",
    color: CYAN,
    valign: "middle",
  });
});
s.addText(
  'Agent decides what to search. Necessary for scale. Vulnerable to "skipping" documentation 44% of the time.',
  {
    x: 7.1,
    y: 3.95,
    w: 4.8,
    h: 0.9,
    fontSize: 13,
    fontFace: "Arial",
    color: TXT2,
    lineSpacingMultiple: 1.3,
  },
);
caption(s, "Passive eliminates the Decision Gap. Active enables scale.", {
  y: 6.4,
  color: TXT,
  bold: true,
  fs: 20,
});

// ═══════════════════════════════════════
// SLIDE 5 – Vercel Bar Chart
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Vercel: ", "Passive Steering Wins");
const bars = [
  {
    label: "Baseline (README.md only)",
    pct: 53,
    lblColor: RED,
    highlight: false,
  },
  {
    label: "Active Skills (RAG/Pull)",
    pct: 53,
    lblColor: TXT2,
    highlight: false,
  },
  { label: "Skills + Prompting", pct: 79, lblColor: TXT2, highlight: false },
  { label: "Passive (AGENTS.MD)", pct: 100, lblColor: LIME, highlight: true },
];
bars.forEach((b, i) => {
  const yy = 1.6 + i * 1.1;
  // Label
  s.addText(b.label, {
    x: 0.3,
    y: yy,
    w: 3.5,
    h: 0.6,
    align: "right",
    fontSize: 14,
    fontFace:
      b.lblColor === RED || b.lblColor === LIME ? "Courier New" : "Arial",
    color: b.lblColor,
    bold: true,
    valign: "middle",
  });
  // Track
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.0,
    y: yy,
    w: 8.5,
    h: 0.6,
    rectRadius: 0.08,
    fill: { color: "1E293B" },
    line: b.highlight ? { color: LIME, width: 2 } : { width: 0 },
  });
  // Fill
  const fillW = 8.5 * (b.pct / 100);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 4.0,
    y: yy,
    w: fillW,
    h: 0.6,
    rectRadius: 0.08,
    fill: { color: b.highlight ? LIME : CYAN },
    line: { width: 0 },
  });
  s.addText(`${b.pct}% ${b.highlight ? "SUCCESS" : "Success"}`, {
    x: 4.0,
    y: yy,
    w: fillW - 0.2,
    h: 0.6,
    align: "right",
    valign: "middle",
    fontSize: 14,
    fontFace: "Arial",
    color: "000000",
    bold: true,
  });
});
caption(
  s,
  "Passive context (AGENTS.md) removed the decision point entirely, reaching 100% success. Skills were only invoked 56% of the time.",
  { y: 6.1, fs: 17 },
);

// ═══════════════════════════════════════
// SLIDE 6 – Five Pillars (1-3)
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Five Pillars of ", "AI-Native");
const pillars13 = [
  {
    n: "1. Unified Knowledge",
    desc: "Single source of truth in AGENTS.md + copilot-instructions.md. One root file every agent reads.",
    bar: CYAN,
  },
  {
    n: "2. Scoped Precision",
    desc: "Glob-matched .instructions.md files (e.g., applyTo: '**/*.tsx'). React rules only load for .tsx.",
    bar: LIME,
  },
  {
    n: "3. Monorepo Mastery",
    desc: "Nearest-file precedence. Root router + nested AGENTS.md per package. Local overrides root.",
    bar: CYAN,
  },
];
pillars13.forEach((p, i) => {
  const yy = 1.4 + i * 1.7;
  tile(s, 0.5, yy, 6.0, 1.4, { leftBar: p.bar });
  s.addText(p.n, {
    x: 0.85,
    y: yy + 0.15,
    w: 5.3,
    h: 0.45,
    fontSize: 20,
    fontFace: "Arial",
    color: TXT,
    bold: true,
  });
  s.addText(p.desc, {
    x: 0.85,
    y: yy + 0.6,
    w: 5.3,
    h: 0.6,
    fontSize: 15,
    fontFace: "Arial",
    color: TXT2,
  });
});
// Right side placeholder
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.0,
  y: 1.4,
  w: 5.8,
  h: 5.2,
  rectRadius: 0.15,
  fill: { color: BG2 },
  line: { color: BDR, width: 1 },
});
s.addText("[ Repository Structure\n  Visualization ]", {
  x: 7.0,
  y: 1.4,
  w: 5.8,
  h: 5.2,
  align: "center",
  valign: "middle",
  fontSize: 18,
  fontFace: "Arial",
  color: BDR,
  italic: true,
});

// ═══════════════════════════════════════
// SLIDE 7 – Pillars 4-5
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Maintenance & ", "Ingestion");
tile(s, 0.5, 1.5, 6.0, 2.2, { leftBar: LIME });
s.addText("4. AI-Readable Docs", {
  x: 0.85,
  y: 1.65,
  w: 5.3,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText("Structured headings + llms.txt for efficient bot crawling.", {
  x: 0.85,
  y: 2.2,
  w: 5.3,
  h: 0.8,
  fontSize: 16,
  fontFace: "Arial",
  color: TXT2,
});
tile(s, 0.5, 4.0, 6.0, 2.2, { leftBar: CYAN });
s.addText("5. Living Maintenance", {
  x: 0.85,
  y: 4.15,
  w: 5.3,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText(
  "CI-integrated audits to prevent context drift and instructions rot.",
  {
    x: 0.85,
    y: 4.7,
    w: 5.3,
    h: 0.8,
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
  },
);
// Right placeholder
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.0,
  y: 1.5,
  w: 5.8,
  h: 4.7,
  rectRadius: 0.15,
  fill: { color: BG2 },
  line: { color: BDR, width: 1 },
});
s.addText("[ Maintenance Checklist\n  Visual ]", {
  x: 7.0,
  y: 1.5,
  w: 5.8,
  h: 4.7,
  align: "center",
  valign: "middle",
  fontSize: 18,
  fontFace: "Arial",
  color: BDR,
  italic: true,
});

// ═══════════════════════════════════════
// SLIDE 8 – Progressive Disclosure
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Anthropic: ", "Progressive Disclosure");
const levels = [
  {
    t: "Level 1: YAML Frontmatter",
    d: 'Always loaded criteria. Defines "When" to activate.',
    c: CYAN,
  },
  {
    t: "Level 2: SKILL.md Body",
    d: "Loaded ON MATCH. Workflows and logic.",
    c: LIME,
  },
  {
    t: "Level 3: Linked Resources",
    d: "Loaded ON NEED. Heavy guides and references.",
    c: CYAN,
  },
];
levels.forEach((l, i) => {
  const yy = 1.5 + i * 1.5;
  s.addText(l.t, {
    x: 0.8,
    y: yy,
    w: 5.5,
    h: 0.45,
    fontSize: 20,
    fontFace: "Arial",
    color: l.c,
    bold: true,
  });
  s.addText(l.d, {
    x: 0.8,
    y: yy + 0.45,
    w: 5.5,
    h: 0.5,
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
  });
});
// Right placeholder
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.0,
  y: 1.4,
  w: 5.8,
  h: 5.2,
  rectRadius: 0.15,
  fill: { color: "000000" },
  line: { color: BDR, width: 2 },
});
s.addText("[ Code Editor\n  Interface ]", {
  x: 7.0,
  y: 1.4,
  w: 5.8,
  h: 5.2,
  align: "center",
  valign: "middle",
  fontSize: 18,
  fontFace: "Arial",
  color: BDR,
  italic: true,
});

// ═══════════════════════════════════════
// SLIDE 9 – MCP + Skills
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "The ", "MCP + Skills Architecture");
// Left tile
tile(s, 0.5, 1.5, 5.65, 3.0);
s.addText("🍳", { x: 0.9, y: 1.65, w: 0.8, h: 0.7, fontSize: 40 });
s.addText("MCP = The Kitchen", {
  x: 0.9,
  y: 2.35,
  w: 4.8,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText(
  "Data connectivity, tool access, and API state. The infrastructure layer.",
  {
    x: 0.9,
    y: 2.85,
    w: 4.8,
    h: 0.8,
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
  },
);
// Right tile
tile(s, 6.8, 1.5, 5.65, 3.0);
s.addText("📖", { x: 7.2, y: 1.65, w: 0.8, h: 0.7, fontSize: 40 });
s.addText("Skills = The Recipes", {
  x: 7.2,
  y: 2.35,
  w: 4.8,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText(
  "Logic, conventions, and behavioral expertise. The execution layer.",
  {
    x: 7.2,
    y: 2.85,
    w: 4.8,
    h: 0.8,
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
  },
);
// Bottom formula
s.addText(
  [
    {
      text: "Chef (Agent) + Kitchen (MCP) + Recipes (Skills) = ",
      options: { fontSize: 22, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: "\nDeterministic Repository Success",
      options: { fontSize: 22, fontFace: "Arial", color: LIME, bold: true },
    },
  ],
  { x: 0.5, y: 5.3, w: 12.3, h: 1.2, align: "center" },
);

// ═══════════════════════════════════════
// SLIDE 10 – Copilot vs. Devin
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Tooling: ", "Copilot vs. Devin");
// Left
tile(s, 0.5, 1.5, 5.65, 3.2);
s.addText("GitHub Copilot", {
  x: 0.9,
  y: 1.65,
  w: 4.8,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: CYAN,
  bold: true,
});
s.addText(
  "IDE Plugin.\n~200K window.\nLatency: <1s.\nPrimary: copilot-instructions.md",
  {
    x: 0.9,
    y: 2.2,
    w: 4.8,
    h: 2.0,
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
    lineSpacingMultiple: 1.4,
  },
);
// Right
tile(s, 6.8, 1.5, 5.65, 3.2);
s.addText("Cognition Devin", {
  x: 7.2,
  y: 1.65,
  w: 4.8,
  h: 0.5,
  fontSize: 22,
  fontFace: "Arial",
  color: LIME,
  bold: true,
});
s.addText(
  [
    {
      text: "Autonomous Agent.\n10M+ window.\nLatency: >10s.\nPrimary: ",
      options: { fontSize: 16, fontFace: "Arial", color: TXT2 },
    },
    {
      text: "AGENTS.MD",
      options: {
        fontSize: 14,
        fontFace: "Courier New",
        color: LIME,
        bold: true,
      },
    },
  ],
  { x: 7.2, y: 2.2, w: 4.8, h: 2.0, lineSpacingMultiple: 1.4 },
);
// Bottom box
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.5,
  y: 5.2,
  w: 10.3,
  h: 0.9,
  rectRadius: 0.15,
  fill: { color: BG2 },
  line: { color: BDR, width: 2 },
});
s.addText(
  [
    {
      text: "Both benefit from ",
      options: { fontSize: 18, fontFace: "Arial", color: TXT2 },
    },
    {
      text: "Passive Steering",
      options: { fontSize: 18, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: " and the ",
      options: { fontSize: 18, fontFace: "Arial", color: TXT2 },
    },
    {
      text: "Five Pillars",
      options: { fontSize: 18, fontFace: "Arial", color: TXT, bold: true },
    },
    { text: ".", options: { fontSize: 18, fontFace: "Arial", color: TXT2 } },
  ],
  { x: 1.5, y: 5.2, w: 10.3, h: 0.9, align: "center", valign: "middle" },
);

// ═══════════════════════════════════════
// SLIDE 11 – Academic Reality Check (table)
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "The ", "Academic Reality Check");
const tableRows = [
  [
    {
      text: "Study",
      options: {
        bold: true,
        color: CYAN,
        fontSize: 16,
        fill: { color: "0A2030" },
      },
    },
    {
      text: "Tested Task",
      options: {
        bold: true,
        color: CYAN,
        fontSize: 16,
        fill: { color: "0A2030" },
      },
    },
    {
      text: "Outcome",
      options: {
        bold: true,
        color: CYAN,
        fontSize: 16,
        fill: { color: "0A2030" },
      },
    },
  ],
  [
    {
      text: "Vercel (2026)",
      options: { bold: true, color: LIME, fontSize: 15 },
    },
    { text: "New APIs (Novel)", options: { color: TXT2, fontSize: 15 } },
    { text: "100% Task Success", options: { color: LIME, fontSize: 15 } },
  ],
  [
    { text: "ETH Zürich", options: { color: TXT2, fontSize: 15 } },
    { text: "SWE-BENCH (Standard)", options: { color: TXT2, fontSize: 15 } },
    { text: "Marginal Success Gains", options: { color: TXT2, fontSize: 15 } },
  ],
  [
    { text: "ETH Zürich", options: { bold: true, color: CYAN, fontSize: 15 } },
    { text: "Instruction Compliance", options: { color: TXT2, fontSize: 15 } },
    {
      text: "Tool use 1.6x more frequent",
      options: { color: TXT2, fontSize: 15 },
    },
  ],
];
s.addTable(tableRows, {
  x: 0.5,
  y: 1.5,
  w: 12.3,
  border: { type: "solid", pt: 1, color: BDR },
  colW: [3.5, 4.5, 4.3],
  rowH: [0.65, 0.6, 0.6, 0.6],
  fontFace: "Arial",
});
// Conclusion box
tile(s, 0.5, 4.5, 12.3, 1.1, { leftBar: CYAN });
s.addText(
  [
    {
      text: "Conclusion: ",
      options: { fontSize: 18, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: "Focus on ",
      options: { fontSize: 18, fontFace: "Arial", color: TXT2 },
    },
    {
      text: "Tribal Knowledge",
      options: { fontSize: 18, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: ". Don't waste tokens on auto-generated public docs.",
      options: { fontSize: 18, fontFace: "Arial", color: TXT2 },
    },
  ],
  { x: 0.9, y: 4.5, w: 11.5, h: 1.1, valign: "middle" },
);

// ═══════════════════════════════════════
// SLIDE 12 – Monorepo Nearest-File Routing
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Monorepo: ", "Nearest-File Routing");
tile(s, 0.5, 1.5, 6.0, 2.5);
s.addText("Precedence Hierarchy", {
  x: 0.9,
  y: 1.65,
  w: 5.2,
  h: 0.5,
  fontSize: 20,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});
s.addText(
  "Agent editing /frontend/ loads:\n1. /frontend/AGENTS.md (Override)\n2. /Root/AGENTS.md (Global)",
  {
    x: 0.9,
    y: 2.2,
    w: 5.2,
    h: 1.5,
    fontSize: 15,
    fontFace: "Arial",
    color: TXT2,
    lineSpacingMultiple: 1.4,
  },
);
// Warning box
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5,
  y: 4.3,
  w: 6.0,
  h: 0.9,
  rectRadius: 0.1,
  fill: { color: "140808" },
  line: { color: RED, width: 3 },
});
s.addText(
  [
    {
      text: "Zero Leakage: ",
      options: { fontSize: 15, fontFace: "Arial", color: TXT, bold: true },
    },
    {
      text: "No backend rules for frontend agents.",
      options: { fontSize: 15, fontFace: "Arial", color: TXT },
    },
  ],
  { x: 0.8, y: 4.3, w: 5.4, h: 0.9, valign: "middle" },
);
// Right placeholder
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.0,
  y: 1.5,
  w: 5.8,
  h: 3.7,
  rectRadius: 0.15,
  fill: { color: BG2 },
  line: { color: BDR, width: 2 },
});
s.addText("[ Routing Diagram ]", {
  x: 7.0,
  y: 1.5,
  w: 5.8,
  h: 3.7,
  align: "center",
  valign: "middle",
  fontSize: 18,
  fontFace: "Arial",
  color: BDR,
  italic: true,
});

// ═══════════════════════════════════════
// SLIDE 13 – Hybrid Strategy Stack
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "The Hybrid ", "Strategy Stack");
const stackItems = [
  {
    label: "L5: ACTIVE – Large-Scale Navigation (Grep, Search)",
    bar: CYAN,
    bg: BG2,
  },
  {
    label: "L4: ACTIVE – Vertical Workflows (Skills, MCP)",
    bar: LIME,
    bg: BG2,
  },
  {
    label: "L3: PASSIVE – Docs Layer (llms.txt, Headings)",
    bar: CYAN,
    bg: "081520",
  },
  {
    label: "L2: PASSIVE – Scoped Rules (.instructions.md)",
    bar: LIME,
    bg: "0A1A04",
  },
  { label: "L1: PASSIVE – Foundation (AGENTS.MD)", bar: CYAN, bg: "0C2030" },
];
stackItems.forEach((item, i) => {
  const yy = 1.4 + i * 0.9;
  tile(s, 0.5, yy, 12.3, 0.7, { fill: item.bg, leftBar: item.bar });
  s.addText(item.label, {
    x: 0.9,
    y: yy,
    w: 11.5,
    h: 0.7,
    valign: "middle",
    fontSize: 17,
    fontFace: "Arial",
    color: TXT2,
    bold: false,
  });
});
caption(s, "90% of architectural ROI is in Layers 1 and 2.", {
  y: 6.2,
  color: LIME,
  bold: true,
  fs: 22,
});

// ═══════════════════════════════════════
// SLIDE 14 – Passive Steering Flow
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "The Passive ", "Steering Flow");
const flowSteps = [
  { step: "1. OPEN FILE", detail: "Button.tsx", color: CYAN },
  { step: "2. GLOB MATCH", detail: "**/*.tsx", color: LIME },
  { step: "3. INJECTION", detail: "AGENTS.MD", color: CYAN },
  { step: "4. ALIGNMENT", detail: "Pre-loaded rules", color: LIME },
];
flowSteps.forEach((f, i) => {
  const xx = 0.4 + i * 3.2;
  tile(s, xx, 2.0, 2.5, 2.0, { border: f.color });
  s.addText(f.step, {
    x: xx,
    y: 2.15,
    w: 2.5,
    h: 0.5,
    align: "center",
    fontSize: 12,
    fontFace: "Arial",
    color: f.color,
    bold: true,
  });
  s.addText(f.detail, {
    x: xx,
    y: 2.8,
    w: 2.5,
    h: 0.7,
    align: "center",
    fontSize: 16,
    fontFace: i < 2 ? "Courier New" : "Arial",
    color: f.color === LIME && i === 2 ? LIME : TXT,
    bold: true,
  });
  // Arrow between steps
  if (i < 3) {
    s.addText("›", {
      x: xx + 2.5,
      y: 2.5,
      w: 0.7,
      h: 1.0,
      align: "center",
      valign: "middle",
      fontSize: 36,
      color: CYAN,
    });
  }
});
caption(s, "By the time the dev types, context is already live.", {
  y: 5.5,
  color: TXT,
  bold: true,
  fs: 22,
});

// ═══════════════════════════════════════
// SLIDE 15 – Maturity Model
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Readiness ", "Maturity Model");
const maturity = [
  { lbl: "LEVEL 1", desc: "Functional. Builds and tests run.", c: TXT2 },
  { lbl: "LEVEL 2", desc: "Documented. AGENTS.MD added.", c: CYAN },
  { lbl: "LEVEL 3", desc: "Standardized. Scoped routing active.", c: LIME },
  { lbl: "LEVEL 4", desc: "Optimized. Skills & MCP live.", c: TXT2 },
  { lbl: "LEVEL 5", desc: "Autonomous. CI metrics validated.", c: TXT2 },
];
maturity.forEach((m, i) => {
  const xx = 0.4 + i * 2.5;
  tile(s, xx, 1.5, 2.2, 4.0, {
    border: m.c === CYAN || m.c === LIME ? m.c : BDR,
  });
  s.addText(m.lbl, {
    x: xx + 0.15,
    y: 1.7,
    w: 1.9,
    h: 0.4,
    fontSize: 12,
    fontFace: "Arial",
    color: m.c,
    bold: true,
  });
  s.addText(m.desc, {
    x: xx + 0.15,
    y: 4.2,
    w: 1.9,
    h: 1.0,
    fontSize: 14,
    fontFace: "Arial",
    color: TXT2,
  });
});

// ═══════════════════════════════════════
// SLIDE 16 – 15-Minute Audit
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "The ", "15-Minute Audit");
// Phase 1
tile(s, 0.5, 1.5, 5.65, 3.0);
s.addText("Phase 1: Foundation", {
  x: 0.9,
  y: 1.65,
  w: 4.8,
  h: 0.5,
  fontSize: 20,
  fontFace: "Arial",
  color: LIME,
  bold: true,
});
const p1 = ["Create AGENTS.MD", "Add Run Commands", "Set Global Instructions"];
p1.forEach((item, i) => {
  s.addText(`☑ ${item}`, {
    x: 0.9,
    y: 2.3 + i * 0.55,
    w: 4.8,
    h: 0.45,
    fontSize: 15,
    fontFace: "Arial",
    color: TXT2,
  });
});
// Phase 2
tile(s, 6.8, 1.5, 5.65, 3.0);
s.addText("Phase 2: Scoping", {
  x: 7.2,
  y: 1.65,
  w: 4.8,
  h: 0.5,
  fontSize: 20,
  fontFace: "Arial",
  color: CYAN,
  bold: true,
});
const p2 = [
  "Create Scoped dir",
  "Framework instruction files",
  "Define glob patterns",
];
p2.forEach((item, i) => {
  s.addText(`☑ ${item}`, {
    x: 7.2,
    y: 2.3 + i * 0.55,
    w: 4.8,
    h: 0.45,
    fontSize: 15,
    fontFace: "Arial",
    color: TXT2,
  });
});
// CTA
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.0,
  y: 5.0,
  w: 11.3,
  h: 1.1,
  rectRadius: 0.12,
  fill: { color: "0A1A04" },
  line: { color: LIME, width: 2 },
});
s.addText('Audit: Ask the agent "How do I build?" and verify.', {
  x: 1.0,
  y: 5.0,
  w: 11.3,
  h: 1.1,
  align: "center",
  valign: "middle",
  fontSize: 22,
  fontFace: "Arial",
  color: TXT,
  bold: true,
});

// ═══════════════════════════════════════
// SLIDE 17 – Inside AGENTS.md
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Inside ", "AGENTS.md");
const sections = [
  "1. Project Overview & Stack",
  "2. Setup & Execution Commands",
  "3. Code Style & Conventions",
  "4. Test & Validation Suite",
  "5. Tribal Knowledge Pitfalls",
];
sections.forEach((sec, i) => {
  const yy = 1.5 + i * 0.8;
  tile(s, 0.5, yy, 5.5, 0.65);
  s.addText(sec, {
    x: 0.8,
    y: yy,
    w: 4.9,
    h: 0.65,
    valign: "middle",
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
  });
});
// 8KB Rule box
s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8,
  y: 1.5,
  w: 5.8,
  h: 4.5,
  rectRadius: 0.15,
  fill: { color: "140808" },
  line: { color: RED, width: 4 },
});
s.addText("THE 8KB RULE", {
  x: 6.8,
  y: 2.0,
  w: 5.8,
  h: 0.7,
  align: "center",
  fontSize: 28,
  fontFace: "Arial",
  color: RED,
  bold: true,
});
s.addText(
  "8KB compressed index beats 40KB of documentation.\n\nConcise > Comprehensive.",
  {
    x: 7.2,
    y: 3.0,
    w: 5.0,
    h: 2.0,
    align: "center",
    fontSize: 16,
    fontFace: "Arial",
    color: TXT2,
  },
);

// ═══════════════════════════════════════
// SLIDE 18 – Action Plan / Takeaways
// ═══════════════════════════════════════
s = pptx.addSlide({ bkgd: BG });
title(s, "Action Plan: ", "Go AI-Native");
const actions = [
  {
    emoji: "🚀",
    head: "TODAY",
    desc: "Create AGENTS.MD. Add build commands.",
    bar: LIME,
  },
  {
    emoji: "📅",
    head: "THIS WEEK",
    desc: "Scope framework rules. Route your monorepo.",
    bar: CYAN,
  },
  {
    emoji: "📊",
    head: "THIS MONTH",
    desc: "Track CI ROI. Set quarterly audits.",
    bar: LIME,
  },
];
actions.forEach((a, i) => {
  const xx = 0.4 + i * 4.2;
  tile(s, xx, 1.5, 3.8, 2.5, { topBar: a.bar });
  s.addText(`${a.emoji} ${a.head}`, {
    x: xx + 0.2,
    y: 1.75,
    w: 3.4,
    h: 0.5,
    fontSize: 20,
    fontFace: "Arial",
    color: TXT,
    bold: true,
  });
  s.addText(a.desc, {
    x: xx + 0.2,
    y: 2.4,
    w: 3.4,
    h: 1.0,
    fontSize: 14,
    fontFace: "Arial",
    color: TXT2,
  });
});
// Closing statement
s.addText("The Repo Is The Context.", {
  x: 0,
  y: 4.8,
  w: 13.33,
  h: 1.0,
  align: "center",
  fontSize: 40,
  fontFace: "Arial",
  color: LIME,
  bold: true,
});
s.addText("github.com/agents-md/spec", {
  x: 0,
  y: 5.8,
  w: 13.33,
  h: 0.5,
  align: "center",
  fontSize: 16,
  fontFace: "Courier New",
  color: TXT2,
});

// ── Write file ──
const outPath = "outputs/gemini-slides.pptx";
pptx
  .writeFile({ fileName: outPath })
  .then(() => {
    console.log(`✅ Created: ${outPath}`);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
