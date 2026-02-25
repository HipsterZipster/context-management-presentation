const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { spawnSync } = require("child_process");

const DEFAULT_IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "generated",
  "_site",
  ".sass-cache",
  ".jekyll-cache",
  "vendor",
]);

function isDebugEnabledFromEnv() {
  return process.env.DEBUG_MERMAID === "1" || process.env.DEBUG === "1";
}

function toRelativeFromCwd(p) {
  return toPosixPath(path.relative(process.cwd(), p));
}

function debugLog(debug, message) {
  if (!debug) {
    return;
  }

  console.log(`[debug] ${message}`);
}

function toPosixPath(p) {
  return p.split(path.sep).join("/");
}

function isGitIgnoredPath(absPath, rootDir) {
  const relPath = path.relative(rootDir, absPath);
  if (!relPath || relPath.startsWith("..")) {
    return false;
  }

  const result = spawnSync(
    "git",
    ["check-ignore", "-q", toPosixPath(relPath)],
    {
      cwd: rootDir,
      stdio: "ignore",
    },
  );

  if (result.error) {
    return false;
  }

  return result.status === 0;
}

function shouldSkipMermaidForFile(content) {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontMatterMatch) {
    return false;
  }

  const frontMatter = frontMatterMatch[1];
  const skipPatterns = [
    /^\s*skip_mermaid\s*:\s*true\s*$/im,
    /^\s*generate_mermaid\s*:\s*false\s*$/im,
    /^\s*render_mermaid\s*:\s*false\s*$/im,
  ];

  return skipPatterns.some((pattern) => pattern.test(frontMatter));
}

// Function to find all markdown files in the selected subtree
function findMarkdownFiles(dir, rootDir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (
        file.startsWith(".") ||
        DEFAULT_IGNORED_DIRS.has(file) ||
        isGitIgnoredPath(filePath, rootDir)
      ) {
        return;
      }

      findMarkdownFiles(filePath, rootDir, fileList);
    } else if (file.endsWith(".md")) {
      if (isGitIgnoredPath(filePath, rootDir)) {
        return;
      }

      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to extract Mermaid diagrams with slide numbers
function extractMermaidDiagrams(content) {
  const diagrams = [];
  const slideRegex = /## Slide (\d+)/g;

  // Find all slide boundaries
  const slides = [];
  let match;
  while ((match = slideRegex.exec(content)) !== null) {
    slides.push({
      number: match[1],
      startIndex: match.index,
    });
  }

  // Add end of file boundary
  slides.push({
    number: null,
    startIndex: content.length,
  });

  // For each slide section, find mermaid diagrams
  for (let i = 0; i < slides.length - 1; i++) {
    const slideNum = slides[i].number;
    const sectionContent = content.substring(
      slides[i].startIndex,
      slides[i + 1].startIndex,
    );

    const mermaidRegex = /^\s*```\s*mermaid\s*\n([\s\S]*?)\n\s*```/gm;
    let mermaidMatch;
    let slideDiagramIndex = 0;

    while ((mermaidMatch = mermaidRegex.exec(sectionContent)) !== null) {
      diagrams.push({
        slideNumber: slideNum,
        subIndex: slideDiagramIndex++,
        code: mermaidMatch[1].trim(),
      });
    }
  }

  return diagrams;
}

function normalizeMermaidDefinition(definition) {
  const trimmed = definition.trimStart();
  if (!trimmed.startsWith("radar-beta")) {
    return definition;
  }

  return definition.replace(/^(\s*axis\s+)(.+)$/m, (_, prefix, axisValues) => {
    const labels = axisValues
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => label.replace(/[^A-Za-z0-9_]/g, "_"));

    return `${prefix}${labels.join(", ")}`;
  });
}

// Inline diagram styling so all render paths (single + bulk) use the same theme.
// This is a trimmed version of the previous neo.css without rules that are
// always overridden later by runtime element-level styles.
const INLINE_NEO_CSS = `
#my-svg {
  font-family: 'trebuchet ms', verdana, arial, sans-serif;
  font-size: 16px;
  fill: #e0dfdf;
}

#my-svg .cluster rect {
  fill: transparent;
  stroke: url(#my-svg-gradient);
  stroke-width: 1.5px;
  filter: drop-shadow(1px 2px 2px rgba(185, 185, 185, 0.2));
}

#my-svg .cluster text,
#my-svg .cluster span,
#my-svg p,
#my-svg .label text,
#my-svg span {
  fill: #e0dfdf;
  color: #e0dfdf;
}

#my-svg .node rect,
#my-svg .node circle,
#my-svg .node ellipse,
#my-svg .node polygon,
#my-svg .node path {
  fill: #1f2024;
  stroke: #cccccc;
  stroke-width: 1px;
}

#my-svg .edgePath .path,
#my-svg .flowchart-link {
  stroke: #cccccc;
  fill: none;
}

#my-svg .marker,
#my-svg .marker.cross,
#my-svg .arrowheadPath {
  fill: #cccccc;
  stroke: #cccccc;
}

#my-svg .edgeLabel,
#my-svg .edgeLabel p,
#my-svg .labelBkg {
  background-color: #1f2024;
  fill: #1f2024;
  text-align: center;
}

#my-svg .edgeLabel text,
#my-svg .edgeLabel span {
  fill: #e0dfdf;
  color: #e0dfdf;
}

#my-svg .edge-thickness-normal {
  stroke-width: 2px;
}

#my-svg .edge-thickness-thick {
  stroke-width: 3.5px;
}

#my-svg .edge-pattern-solid {
  stroke-dasharray: 0;
}

#my-svg .edge-pattern-dashed {
  stroke-dasharray: 3;
}

#my-svg .edge-pattern-dotted {
  stroke-dasharray: 2;
}

#my-svg :root {
  --mermaid-font-family: 'trebuchet ms', verdana, arial, sans-serif;
}
`;

// Render a Mermaid diagram using Puppeteer
async function renderMermaid(definition, outputFile, options = {}) {
  const {
    format = "svg",
    backgroundColor = "transparent",
    width = 1200,
    height = 800,
    viewport = null,
    mermaidConfig = {},
    svgId = null,
  } = options;

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  page.on("console", (msg) => {
    console.warn(msg.text());
  });

  try {
    if (viewport) {
      await page.setViewport(viewport);
    }

    // Read the local mermaid script
    const mermaidScriptPath = path.join(
      __dirname,
      "../node_modules/mermaid/dist/mermaid.min.js",
    );
    const mermaidScript = fs.readFileSync(mermaidScriptPath, "utf8");

    // Create a simple HTML template with gradient definitions
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      background: ${backgroundColor};
      margin: 0;
      padding: 0;
    }
    #container {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  <svg width="0" height="0">
    <defs>
      <linearGradient id="my-svg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0042eb;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#eb0042;stop-opacity:1" />
      </linearGradient>
    </defs>
  </svg>
</head>
<body>
  <div id="container"></div>
  <script>${mermaidScript}</script>
</body>
</html>`;

    await page.setContent(htmlTemplate);

    // Load inline custom CSS
    await page.addStyleTag({ content: INLINE_NEO_CSS });

    // Initialize mermaid and render the diagram
    await page.evaluate(
      async (payload) => {
        const { definition, mermaidConfig, backgroundColor, svgId } = payload;
        const container = document.querySelector("#container");
        if (!container) {
          throw new Error("#container not found");
        }

        try {
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
              darkMode: true,
              background: "#333",
              primaryColor: "#1f2024",
              primaryTextColor: "#e0dfdf",
              primaryBorderColor: "#cccccc",
              lineColor: "#cccccc",
              secondaryColor: "#1c1e22",
              tertiaryColor: "#1c1e22",
              mainBkg: "#1f2024",
              secondBkg: "#1c1e22",
              textColor: "#e0dfdf",
              border1: "#cccccc",
              border2: "#cccccc",
              arrowheadColor: "#cccccc",
              fontFamily: "trebuchet ms, verdana, arial, sans-serif",
              fontSize: "16px",
              pie1: "#00d1ff",
              pie2: "#7a5cff",
              pie3: "#00e5a8",
              pie4: "#ff5ea8",
              pie5: "#ffc857",
              pie6: "#3de0ff",
              pie7: "#9d7dff",
              pie8: "#2df2c1",
              pie9: "#ff7bb6",
              pie10: "#ffd166",
              pie11: "#59e6ff",
              pie12: "#b197ff",
              pieTitleTextColor: "#e0dfdf",
              pieSectionTextColor: "#e0dfdf",
              pieLegendTextColor: "#e0dfdf",
              pieStrokeColor: "#1f2024",
              pieOuterStrokeColor: "#1f2024",
              pieOpacity: "0.95",
              quadrant1Fill: "#12273a",
              quadrant2Fill: "#2a1f47",
              quadrant3Fill: "#13362d",
              quadrant4Fill: "#3a1f31",
              quadrant1TextFill: "#e0dfdf",
              quadrant2TextFill: "#e0dfdf",
              quadrant3TextFill: "#e0dfdf",
              quadrant4TextFill: "#e0dfdf",
              quadrantPointFill: "#00d1ff",
              quadrantPointTextFill: "#e0dfdf",
              quadrantXAxisTextFill: "#e0dfdf",
              quadrantYAxisTextFill: "#e0dfdf",
              quadrantInternalBorderStrokeFill: "#cccccc",
              quadrantExternalBorderStrokeFill: "#cccccc",
              quadrantTitleFill: "#e0dfdf",
              sectionBkgColor: "#16263d",
              sectionBkgColor2: "#2a1f47",
              altSectionBkgColor: "#13362d",
              taskBkgColor: "#1f2024",
              taskBorderColor: "#00d1ff",
              activeTaskBkgColor: "#2a2f3f",
              activeTaskBorderColor: "#7a5cff",
              doneTaskBkgColor: "#143126",
              doneTaskBorderColor: "#2df2c1",
              gridColor: "#3a3d44",
              todayLineColor: "#ff5ea8",
              taskTextColor: "#e0dfdf",
              taskTextOutsideColor: "#e0dfdf",
              taskTextLightColor: "#e0dfdf",
              taskTextDarkColor: "#e0dfdf",
            },
            ...mermaidConfig,
          });

          const { svg: svgText } = await mermaid.render(
            svgId || "my-svg",
            definition,
            container,
          );
          container.innerHTML = svgText;

          const svg = container.getElementsByTagName("svg")?.[0];
          if (svg?.style) {
            svg.style.backgroundColor = backgroundColor;
          }

          const rects = svg.querySelectorAll("rect");
          const circles = svg.querySelectorAll("circle");
          const ellipses = svg.querySelectorAll("ellipse");
          const polygons = svg.querySelectorAll("polygon");
          const paths = svg.querySelectorAll("path");

          [...rects, ...circles, ...ellipses, ...polygons, ...paths].forEach(
            (el) => {
              const parentG = el.closest("g.node");
              if (parentG) {
                el.style.setProperty("fill", "#1f2024", "important");
                el.style.setProperty(
                  "stroke",
                  "url(#my-svg-gradient)",
                  "important",
                );
                el.style.setProperty("stroke-width", "1.5px", "important");
                el.style.setProperty(
                  "filter",
                  "drop-shadow(1px 2px 2px rgba(185, 185, 185, 0.2))",
                  "important",
                );
              }
            },
          );

          const clusterRects = svg.querySelectorAll("g.cluster rect");
          clusterRects.forEach((el) => {
            el.style.setProperty("fill", "transparent", "important");
            el.style.setProperty("fill-opacity", "0", "important");
            el.style.setProperty(
              "stroke",
              "url(#my-svg-gradient)",
              "important",
            );
            el.style.setProperty("stroke-width", "1.5px", "important");
            el.style.setProperty(
              "filter",
              "drop-shadow(1px 2px 2px rgba(185, 185, 185, 0.2))",
              "important",
            );
          });

          const edgeLabels = svg.querySelectorAll(".edgeLabel rect");
          edgeLabels.forEach((el) => {
            el.style.setProperty("fill", "#1f2024", "important");
            el.style.setProperty("stroke", "none", "important");
            el.style.setProperty("opacity", "1", "important");
          });

          const edgeLabelBgs = svg.querySelectorAll(".labelBkg");
          edgeLabelBgs.forEach((el) => {
            const tagName = (el.tagName || "").toLowerCase();
            if (tagName === "rect") {
              el.style.setProperty("fill", "#1f2024", "important");
              el.style.setProperty("opacity", "1", "important");
            } else {
              el.style.setProperty("background-color", "#1f2024", "important");
              el.style.setProperty("background", "#1f2024", "important");
            }
          });

          const edgeLabelHtml = svg.querySelectorAll(
            ".edgeLabel span, .edgeLabel p",
          );
          edgeLabelHtml.forEach((el) => {
            el.style.setProperty("background-color", "#1f2024", "important");
            el.style.setProperty("background", "#1f2024", "important");
          });

          const edgeLabelGroups = svg.querySelectorAll("g.edgeLabel");
          edgeLabelGroups.forEach((el) => {
            el.style.setProperty("fill", "none", "important");
          });
        } catch (error) {
          const message =
            error && error.message ? error.message : String(error);
          throw new Error(`Mermaid render failed: ${message}`);
        }
      },
      {
        definition,
        mermaidConfig,
        backgroundColor,
        svgId,
      },
    );

    // Capture the diagram
    if (format === "svg") {
      const svg = await page.evaluate(() => {
        const container = document.querySelector("#container");
        const svg = container ? container.querySelector("svg") : null;
        if (!svg) {
          return "";
        }

        const hiddenSvg = document.querySelector('svg[width="0"][height="0"]');
        const defs = hiddenSvg ? hiddenSvg.querySelector("defs") : null;
        if (defs && svg.querySelector("defs") === null) {
          svg.insertBefore(defs.cloneNode(true), svg.firstChild);
        }

        return new XMLSerializer().serializeToString(svg);
      });
      if (!svg) {
        throw new Error("No SVG generated from Mermaid diagram");
      }
      fs.writeFileSync(outputFile, svg);
    } else if (format === "png") {
      const screenshot = await page.screenshot();
      fs.writeFileSync(outputFile, screenshot);
    } else if (format === "pdf") {
      await page.pdf({
        path: outputFile,
        printBackground: true,
        width: width + "px",
        height: height + "px",
      });
    }
  } finally {
    await browser.close();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
let inputFile = "context-engineering-tech-talk.md";
let outputDir = "images";
let options = {
  format: "svg",
  backgroundColor: "transparent",
  width: 1200,
  height: 800,
  debug: isDebugEnabledFromEnv(),
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--format":
      options.format = args[++i];
      break;
    case "--background":
      options.backgroundColor = args[++i];
      break;
    case "--width":
      options.width = parseInt(args[++i]);
      break;
    case "--height":
      options.height = parseInt(args[++i]);
      break;
    case "--debug":
      options.debug = true;
      break;
    case "--input":
      inputFile = args[++i];
      break;
    case "--output-dir":
      outputDir = args[++i];
      break;
    default:
      break;
  }
}

// Render all diagrams from the presentation file
async function generatePresentationDiagrams() {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const content = fs.readFileSync(inputFile, "utf8");
  const diagrams = extractMermaidDiagrams(content);

  console.log(`Found ${diagrams.length} diagrams in ${inputFile}`);

  for (const diagram of diagrams) {
    // Generate filename based on slide number and sub-index (e.g. 1.svg, 6a.svg, 6b.svg)
    const suffix =
      diagram.subIndex === 0 &&
      !diagrams.some(
        (d) => d.slideNumber === diagram.slideNumber && d.subIndex > 0,
      )
        ? ""
        : String.fromCharCode(97 + diagram.subIndex); // a, b, c...

    const outputFileName = `${diagram.slideNumber}${suffix}.${options.format}`;
    const outputFile = path.join(outputDir, outputFileName);

    try {
      console.log(`Generating ${outputFile} for Slide ${diagram.slideNumber}`);
      const normalizedDefinition = normalizeMermaidDefinition(diagram.code);
      await renderMermaid(normalizedDefinition, outputFile, options);
    } catch (error) {
      console.error(`Error generating ${outputFile}:`, error.message);
    }
  }

  console.log("Finished generating presentation diagrams.");
}

// Run if called directly
if (require.main === module) {
  generatePresentationDiagrams().catch(console.error);
}

module.exports = { renderMermaid };
