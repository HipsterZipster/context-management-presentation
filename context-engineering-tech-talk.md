# Context Engineering: Building AI-Native Repositories

## A 20-Minute Engineering Tech Talk

**Speaker Notes Format:** Each slide section includes timing, speaking notes, and Mermaid diagrams ready for live rendering.

---

## Slide 1: Title — "Your Repo Is Fighting Your AI Agents" _(2 min)_

```mermaid
graph LR
    subgraph Before["Legacy Repository"]
        direction TB
        B1["README.md<br/><i>(only human docs)</i>"]
        B2["src/"]
        B3["package.json"]
        B1 ~~~ B2 ~~~ B3
    end

    subgraph After["✅ AI-Native Repository"]
        direction TB
        A1["AGENTS.md"]
        A2[".github/copilot-instructions.md"]
        A3[".github/instructions/*.md"]
        A4["src/"]
        A1 ~~~ A2 ~~~ A3 ~~~ A4
    end

    Before -- "One Afternoon<br/>Transformation" --> After
```

> **Speaking Notes:**
> "70% of AI coding tasks still fail in real-world repos — not because the models are bad, but because the _context_ is wrong. Vercel proved it: baseline repos achieve 53% task success. AI-native repos hit 100%. Today I'll show you the exact engineering blueprint to get there. You can implement it this afternoon."

---

## Slide 2: The Core Problem — Parametric vs. Grounded Knowledge _(3 min)_

```mermaid
graph TB
    subgraph Agent["AI Coding Agent"]
        direction LR
        PK["Parametric Knowledge<br/><i>Training Data</i><br/>General syntax, patterns<br/>Fixed at cutoff"]
        GC["Grounded Context<br/><i>Repository Files</i><br/>Your APIs, conventions<br/>Real-time state"]
    end

    PK -->|"Reconciliation<br/>via Attention Budget"| Decision{"Decision<br/>Point"}
    GC -->|"Injected or<br/>Retrieved"| Decision

    Decision -->|"✅ Context Available"| Good["Correct, Framework-Aligned Code"]
    Decision -->|"Context Missing"| Bad["'Confidently Wrong' Output<br/>Compiles but violates conventions"]

```

> **Speaking Notes:**
> "Every AI agent has two knowledge sources. _Parametric_ — what it learned in training. _Grounded_ — what's in your repo right now. The problem? Parametric knowledge is stale and generic. Your private APIs, your naming conventions, your monorepo structure — none of that is in the training data. When agents can't find grounded context, they guess. And they guess _confidently_. Vercel found agents skip framework docs 44% of the time because they think they already know the answer."

---

## Slide 3: Context Rot — The Silent Killer _(2 min)_

```mermaid
graph LR
    subgraph Window["Context Window (1M tokens)"]
        direction LR
        Zone1["🟢 0–50%<br/>Safe Zone<br/>All instructions retained"]
        Zone2["🟡 50–80%<br/>Compression Zone<br/>Agent starts summarizing"]
        Zone3["🔴 80–95%<br/>Danger Zone<br/>Nuanced rules discarded"]
        Zone4["💀 95%+<br/>Context Rot<br/>Silent auto-compaction<br/>Conventions lost"]
    end

    Zone1 --> Zone2 --> Zone3 --> Zone4
```

> **Speaking Notes:**
> "Even with million-token context windows, there's a ticking time bomb: _context rot_. As the window fills, agents silently auto-compact. Your project conventions — the first things discarded. The agent doesn't tell you. The code compiles. Tests might pass. But it violates your architecture. This is why we need _structured_ context, not just throwing everything into the window."

---

## Slide 4: Two Models of Context Delivery _(3 min)_

```mermaid
graph TB
    subgraph Passive["PASSIVE STEERING (Push)"]
        direction TB
        P1["AGENTS.md"]
        P2["copilot-instructions.md"]
        P3[".instructions.md files"]
        P1 & P2 & P3 --> PS["System Prompt<br/><b>Always Present</b>"]
    end

    subgraph Active["ACTIVE RETRIEVAL (Pull)"]
        direction TB
        A1["read_file"]
        A2["grep_search"]
        A3["semantic_search"]
        A4["Devin Search"]
        AD{"Agent Decides<br/>What to Search"} --> A1 & A2 & A3 & A4
    end

    PS --> Agent["Agent"]
    A1 & A2 & A3 & A4 --> Agent

    Agent --> Output["Generated Code"]
```

> **Speaking Notes:**
> "There are exactly two ways to get context to an agent. _Passive_ — you push it. It's always in the prompt. The agent never decides whether to look for it. _Active_ — the agent pulls it on demand by searching your codebase. Both have trade-offs. Passive wins reliability. Active wins scale. The key insight from Vercel: **passive eliminates the Decision Gap**. The agent can't skip what's already in its prompt."

---

## Slide 5: The Decision Gap — Why Passive Wins _(2 min)_

```mermaid
graph TB
    Task["Developer Request:<br/>'Add a new API endpoint'"] --> PathA & PathB

    subgraph PathA["Path A: Active Only"]
        direction TB
        AA1["Agent decides: 'Do I need docs?'"] --> AA2{"56% invoke<br/>44% skip"}
        AA2 -->|"Invokes"| AA3["Reads docs → Correct output"]
        AA2 -->|"Skips"| AA4["Uses parametric knowledge<br/>→ 'Confidently wrong'"]
    end

    subgraph PathB["Path B: Passive + Active"]
        direction TB
        AB1["AGENTS.md already in prompt<br/>Conventions pre-loaded"] --> AB2["Agent has full context<br/>before it starts"]
        AB2 --> AB3["Correct output<br/>100% of the time"]
    end

```

```mermaid
xychart-beta
    title "Vercel Agent Eval Results (Jan 2026)"
    x-axis ["Baseline (No Context)", "Skills Only (Active)", "Skills + Prompting", "AGENTS.md (Passive)"]
    y-axis "Task Success Rate (%)" 0 --> 100
    bar [53, 53, 79, 100]
```

> **Speaking Notes:**
> "This is the most important slide. Vercel tested teaching agents Next.js 16 APIs — knowledge _absent_ from training data. Skills alone? 53% — same as baseline, because agents only invoked them 56% of the time. Even with explicit prompting: 79%. But a compressed 8KB AGENTS.md passive index? **100% success rate.** The passive file removed the decision point entirely."

---

## Slide 6: The Five Pillars of AI-Native Repos _(3 min)_

```mermaid
graph LR
    subgraph P1["Pillar 1: Unified Knowledge"]
        P1A["AGENTS.md<br/>copilot-instructions.md"]
    end

    subgraph P2["Pillar 2: Scoped Precision"]
        P2A["*.instructions.md<br/>applyTo: '**/*.tsx'"]
    end

    subgraph P3["Pillar 3: Monorepo Mastery"]
        P3A["Root router +<br/>nested AGENTS.md"]
    end

    subgraph P4["Pillar 4: AI-Readable Docs"]
        P4A["Structured headings"]
    end

    subgraph P5["Pillar 5: Living Maintenance"]
        P5A["Validation scripts<br/>Quarterly audits"]
    end

    P1 --> P2 --> P3 --> P4 --> P5

    P5 -->|"Feedback Loop"| P1
```

```mermaid
graph TD
    Root["Repository Root"]

    Root --> AGENTS["AGENTS.md<br/><i>Single source of truth</i>"]
    Root --> GH[".github/"]
    Root --> SRC["src/"]
    Root --> PKG["packages/"]

    GH --> CI["copilot-instructions.md<br/><i>Global standards</i>"]
    GH --> INST["instructions/"]

    INST --> REACT["react.instructions.md<br/><code>applyTo: '**/*.tsx'</code>"]
    INST --> PY["python.instructions.md<br/><code>applyTo: '**/*.py'</code>"]

    PKG --> FE["frontend/"]
    PKG --> BE["backend/"]

    FE --> FEA["AGENTS.md<br/><i>Frontend-specific</i>"]
    BE --> BEA["AGENTS.md<br/><i>Backend-specific</i>"]
```

> **Speaking Notes:**
> "Five pillars. **Unified Knowledge** — one AGENTS.md at root, one copilot-instructions.md. **Scoped Precision** — glob-matched instruction files so React rules only apply to .tsx files. **Monorepo Mastery** — nested AGENTS.md with nearest-file precedence. **AI-Readable Docs** — structured headings. **Living Maintenance** — audit scripts that verify your context files are still accurate. This tree is what your repo should look like when you're done."

---

## Slide 7: Deep Dive — Anthropic's Progressive Disclosure _(2 min)_

```mermaid
graph LR
    subgraph L1["Level 1: SKILL.md Frontmatter"]
        direction LR
        Y1["Always Loaded"]
        Y2["name: code-review<br/>description: 'Use when...'"]
    end

    subgraph L2["Level 2: SKILL.md Body"]
        direction LR
        S1["Loaded on match"]
        S2["## Instructions<br/>Step-by-step workflow<br/>Examples & error handling"]
    end

    subgraph L3["Level 3: Linked Resources<br/>"]
        direction LR
        R1["Loaded when Needed"]
        R2["references/api-guide.md<br/>scripts/validate.py<br/>assets/template.md"]
    end

    User["👤 User Query"] --> Match{"Does query<br/>match L1<br/>description?"}

    Match -->|"No"| Skip["Skill stays dormant<br/>~0 extra tokens"]
    Match -->|"Yes"| L2

    L2 --> Need{"Agent needs<br/>more detail?"}
    Need -->|"No"| Execute["Execute with L2 instructions"]
    Need -->|"Yes"| L3 --> Execute

    L1 -.->|"Always in system prompt"| Match
```

> **Speaking Notes:**
> "Anthropic's Skills framework is the gold standard for progressive disclosure. Level 1 — just the YAML frontmatter, about 100 tokens — is _always_ in the system prompt. It tells Claude _when_ to activate the skill. Level 2 — the full SKILL.md body — loads only when there's a match. Level 3 — reference files and scripts — load only on demand. You can have hundreds of skills installed with minimal token overhead. This is how you scale expertise without bloating context."

---

## Slide 8: The MCP + Skills Architecture _(1 min)_

```mermaid
graph LR
    subgraph Kitchen["🍳 MCP = The Kitchen"]
        direction TB
        K1["API Connections"]
        K2["Data Access"]
        K3["Tool Invocation"]
        K4["Real-time State"]
    end

    subgraph Recipes["Skills = The Recipes"]
        direction TB
        R1["Workflows"]
        R2["Best Practices"]
        R3["Domain Expertise"]
        R4["Error Handling"]
    end

    Kitchen --> Chef["Claude<br/><i>The Chef</i>"]
    Recipes --> Chef

    Chef --> Meal["🍽️ Reliable Output<br/>Consistent, high-quality results"]

```

> **Speaking Notes:**
> "Anthropic uses the kitchen analogy. MCP gives you the kitchen — tools, ingredients, equipment. Skills give you the recipes — _how_ to use those tools effectively. Without skills, users connect an MCP and ask 'now what?' With skills, workflows activate automatically. This is the architecture for scaling AI-powered workflows."

---

## Slide 9: Copilot vs. Devin — Two Architectures _(2 min)_

```mermaid
graph TB
    subgraph Copilot["GitHub Copilot"]
        direction LR
        C1["IDE Plugin"]
        C2["~200K Token Window"]
        C3["Passive: copilot-instructions.md<br/>+ scoped .instructions.md<br/>Active: read_file, semantic_search"]
        C4["⚡ Sub-second latency"]
        C1 --> C2 --> C3 --> C4
    end

    subgraph Devin["Cognition Devin"]
        direction LR
        D1["Autonomous Agent"]
        D2["10M+ Token Window"]
        D3["Passive: AGENTS.md as onboarding<br/>Active: Devin Search (1M+ LOC)"]
        D4["🔄 Full VM + Terminal Access"]
        D1 --> D2 --> D3 --> D4
    end

    Copilot ---|"Complementary<br/>Not Competing"| Devin
```

```mermaid
radar-beta
    title Copilot vs Devin — Architectural Profile
    axis Autonomy, Setup Speed, Context Precision, Large Refactors, Latency
    curve a["Copilot"] { 40, 95, 90, 50, 95 }
    curve b["Devin"] { 95, 60, 85, 95, 40 }
```

> **Speaking Notes:**
> "Two leading tools, two opposite philosophies. Copilot is the _silent partner_ — low latency, surgically precise, lives in your IDE. Devin is the _autonomous engineer_ — give it a task, it spins up a VM, indexes your entire codebase, and works independently. They're complementary. Use Copilot for real-time flow. Use Devin for large-scale refactors. Both read AGENTS.md. Both benefit from the five pillars."

---

## Slide 10: The Academic Reality Check _(2 min)_

```mermaid
graph LR
    subgraph V["Vercel Eval (Jan 2026)"]
        direction TB
        V1["New APIs absent from training<br/>53% → 100% with AGENTS.md"]
    end

    subgraph E["ETH Zürich (arXiv 2602.11988)"]
        direction TB
        E1["SWE-BENCH + AGENTBENCH<br/>138 tasks, 12 repos, 4 agents<br/>Marginal success-rate impact<br/>+3.34 steps per task"]
    end

    V --> R{"Reconciliation"}
    E --> R

    subgraph F["ETH Behavioral Findings"]
        direction TB
        F1["Instructions followed<br/>uv used 1.6x/instance<br/>More testing and exploration<br/>+22% reasoning tokens"]
        F4["LLM-generated files mostly redundant<br/>Marginal gain from human-written files"]
    end

    R --> I["Highest-value context:<br/>1) Knowledge absent from training<br/>2) Project-specific conventions<br/>3) Setup steps not in repo docs"]
    E -. details .-> F
```

> **Speaking Notes:**
> "Let's be honest about the research. Vercel showed dramatic gains — 53% to 100%. But ETH Zürich's rigorous academic study found marginal effects. How do we reconcile this? **Context matters most when knowledge is absent from training.** Vercel tested _new_ APIs. ETH tested tasks where info already existed. The practical takeaway: don't auto-generate AGENTS.md with an LLM — those are redundant. Write it yourself. Encode your _tribal knowledge_: the stuff that's not in any documentation."

---

## Slide 11: Monorepo Routing — Nearest-File Precedence _(1 min)_

```mermaid
graph TD
    Root["Root<br/>AGENTS.md<br/><i>Global router</i>"]

    Root -->|"Routes to"| FE["packages/frontend/<br/>AGENTS.md<br/><i>React + Tailwind rules</i>"]
    Root -->|"Routes to"| BE["packages/backend/<br/>AGENTS.md<br/><i>Express + Prisma rules</i>"]
    Root -->|"Routes to"| Shared["packages/shared/<br/>AGENTS.md<br/><i>Shared types + utils</i>"]

    Agent["Agent editing<br/>packages/frontend/src/Button.tsx"]

    Agent -->|"1. Reads nearest"| FE
    FE -->|"2. Falls back to"| Root

    Agent x-->|"Never loads"| BE
    Agent x-->|"Never loads"| Shared

```

> **Speaking Notes:**
> "In monorepos, nearest-file precedence is everything. The root AGENTS.md acts as a router. Each package has its own. When an agent edits `packages/frontend/src/Button.tsx`, it reads `packages/frontend/AGENTS.md` first, then falls back to root. It _never_ loads backend or shared rules. Zero context leakage. This is how you prevent the agent from applying Express conventions to your React components."

---

## Slide 12: The Hybrid Strategy Stack _(1 min)_

```mermaid
graph LR
    L5["ACTIVE: Large-Scale Navigation<br/>grep_search, semantic_search, Devin Search<br/><i>Codebase exploration at scale</i>"]
    L4["ACTIVE: Vertical Workflows<br/>Anthropic Skills + MCP Integrations<br/><i>Complex multi-step processes</i>"]
    L3["PASSIVE: Documentation Layer<br/>Structured README Headings<br/><i>Machine-discoverable docs</i>"]
    L2["PASSIVE: Scoped Rules<br/>.instructions.md with applyTo Globs<br/><i>Framework/language conventions</i>"]
    L1["PASSIVE: Foundation<br/>AGENTS.md + copilot-instructions.md<br/><i>Always-available project context</i>"]

    L1 --> L2 --> L3 --> L4 --> L5
```

> **Speaking Notes:**
> "Here's the stack. Foundation is passive — always present. Scoped rules are passive — loaded per file type. Documentation is passive — discoverable. Then active layers: Skills and MCP for complex workflows, and search tools for navigating massive codebases. Build from the bottom up. Most teams only need the first two layers to see massive improvements."

---

## Slide 13: The Passive Steering Workflow _(1 min)_

```mermaid
sequenceDiagram
    participant Dev as 👤 Developer
    participant IDE as 💻 IDE
    participant Engine as ⚙️ Context Engine
    participant Agent as Agent

    Dev->>IDE: Opens Button.tsx
    IDE->>Engine: File matches "**/*.tsx"

    Note over Engine: Passive load set:<br/>AGENTS.md<br/>copilot-instructions.md<br/>react.instructions.md (glob match)<br/>nearest package AGENTS.md
    Engine->>Agent: Inject merged context into system prompt

    Dev->>Agent: "Add a loading state to this button"
    Agent-->>Dev: ✅ Correct code (React FC, TS interface, UITK, naming conventions)
```

> **Speaking Notes:**
> "Here's the flow in practice. Developer opens a TSX file. The context engine silently matches globs, loads the nearest AGENTS.md, merges copilot-instructions.md and the scoped React rules. By the time the developer types a request, the agent already has every convention in its prompt. No searching. No guessing. Deterministic output."

---

## Slide 14: Repository Readiness Maturity Model _(1 min)_

```mermaid
graph LR
    L1["Level 1<br/><b>Functional</b><br/>Builds & tests exist"]
    L2["Level 2<br/><b>Documented</b><br/>AGENTS.md +<br/>custom instructions"]
    L3["Level 3<br/><b>Standardized</b><br/>Scoped rules +<br/>monorepo routing"]
    L4["Level 4<br/><b>Optimized</b><br/>Skills + MCP"]
    L5["Level 5<br/><b>Autonomous</b><br/>Living maintenance +<br/>measured metrics"]

    L1 --> L2 --> L3 --> L4 --> L5

```

> **Speaking Notes:**
> "Where is your repo today? Level 1 — it builds and tests run. Level 2 — you've added AGENTS.md. Level 3 — scoped instructions and monorepo routing. Level 4 — Skills and MCP integrations. Level 5 — living maintenance with measured metrics. Most teams are at Level 1. Getting to Level 2 takes 15 minutes. Getting to Level 3 takes an afternoon. That's where the biggest ROI is."

---

## Slide 15: The 15-Minute Audit _(2 min)_

```mermaid
graph LR
    Start["Start Audit"] --> Phase1

    subgraph Phase1["Phase 1: Foundation"]
        direction TB
        P1A["☐ Create AGENTS.md at root"]
        P1B["☐ Add setup/build/test/lint commands"]
        P1C["☐ Create .github/copilot-instructions.md"]
        P1A --> P1B --> P1C
    end

    Phase1 --> Phase2

    subgraph Phase2["Phase 2: Scoped Rules"]
        direction TB
        P2A["☐ Create .github/instructions/"]
        P2B["☐ Add framework .instructions.md"]
        P2C["☐ Set applyTo globs"]
        P2A --> P2B --> P2C
    end

    Phase2 --> Phase3

    subgraph Phase3["Phase 3: Documentation"]
        direction TB
        P3A["☐ Structure README with ## headings"]
        P3B["☐ Monorepo: nested AGENTS.md"]
        P3A --> P3B
    end

    Phase3 --> Phase4

    subgraph Phase4["Phase 4: Verify"]
        direction TB
        P4A["☐ Ask agent: 'How do I build?'"]
        P4B["☐ Ask agent: 'What are naming conventions?'"]
        P4C["☐ Verify commands execute"]
        P4D["☐ Commit & push"]
        P4A --> P4B --> P4C --> P4D
    end

    Phase4 --> Done["✅ AI-Native Repository"]
```

> **Speaking Notes:**
> "Here's your action plan. Four phases, 15 minutes total. Phase 1: create AGENTS.md with your commands. Phase 2: scope framework rules with glob patterns. Phase 3: structure documentation. Phase 4: verify by actually asking your agent questions and confirming correctness. Commit everything. You're done. Your repo is now AI-native."

---

## Slide 16: What Goes in AGENTS.md _(1 min)_

```mermaid
%%{init: {'flowchart': {'nodeSpacing': 20, 'rankSpacing': 35, 'diagramPadding': 8}} }%%
graph TB
    Rule["⚠️ Keep under 2 pages<br/>Concise > Comprehensive"]
    AGENTS["AGENTS.md"]

    Rule --> AGENTS

    AGENTS --> Core
    AGENTS --> Quality

    Core["Core Sections"]
    Quality["Quality & Risk"]

    Core --> Section1["Project Overview<br/><i>One sentence + tech stack</i>"]
    Core --> Section2["Setup & Run Commands<br/><i>install, dev, build, test, lint</i>"]
    Core --> Section3["Code Style & Conventions<br/><i>TypeScript strict, functional React</i>"]

    Quality --> Section4["Testing & Validation<br/><i>Run full suite before PR</i>"]
    Quality --> Section5["Common Pitfalls<br/><i>Never use deprecated X</i>"]
```

> **Speaking Notes:**
> "What goes in AGENTS.md? Five sections. Project overview — one sentence. Setup commands — in execution order. Code style — your non-obvious conventions. Testing requirements. And common pitfalls — the things that burn people. Critical rule: keep it under 2 pages. Concise beats comprehensive. An 8KB compressed index beat 40KB of full docs in Vercel's eval."

---

## Slide 17: The Complete Context Architecture _(1 min)_

```mermaid
graph LR
    subgraph Developer["👤 Developer Intent"]
        DevReq["Request / Prompt"]
    end

    subgraph PassiveLayer["Passive Context Layer"]
        AGENTS["AGENTS.md"]
        CPI["copilot-instructions.md"]
        SCOPED[".instructions.md<br/>(glob-matched)"]
    end

    subgraph ActiveLayer["Active Retrieval Layer"]
        RF["read_file"]
        GS["grep_search"]
        SS["semantic_search"]
        MCP["MCP Servers"]
    end

    subgraph SkillsLayer["Skills Layer"]
        L1F["L1: Frontmatter<br/>(always loaded)"]
        L2F["L2: SKILL.md<br/>(on match)"]
        L3F["L3: Resources<br/>(on demand)"]
    end

    DevReq --> Agent["AI Agent"]

    PassiveLayer -->|"Always in prompt"| Agent
    ActiveLayer -->|"On-demand search"| Agent
    SkillsLayer -->|"Progressive disclosure"| Agent

    Agent --> Output["✅ Deterministic<br/>Framework-Aligned<br/>Convention-Compliant<br/>Code"]
```

> **Speaking Notes:**
> "Here's the complete architecture. Three layers feeding into the agent. Passive context — always in the prompt, zero decision points. Active retrieval — on-demand tools for scale. Skills — Anthropic's progressive disclosure for complex workflows. Together, they produce deterministic, framework-aligned, convention-compliant code. This is context engineering."

---

## Slide 18: Key Takeaways & Call to Action _(2 min)_

```mermaid
graph LR
    subgraph Today["Do Today"]
        direction LR
        T1["1. Create AGENTS.md"]
        T2["2. Add copilot-instructions.md"]
        T3["3. Run the 15-min audit"]
    end

    subgraph Week["📅 This Week"]
        direction LR
        W1["4. Scope framework rules"]
        W2["5. Add monorepo routing"]
        W3["6. Measure before/after"]
    end

    subgraph Month["📊 This Month"]
        direction LR
        M1["7. Explore Skills/MCP"]
        M2["8. Set up quarterly audits"]
        M3["9. Track CI pass rates"]
    end

    Today --> Week --> Month
```

> **Speaking Notes:**
> "Three time horizons. **Today** — 15 minutes — create AGENTS.md, add copilot-instructions.md, run the audit. **This week** — scope your framework rules, add monorepo routing, measure the before/after. **This month** — explore Skills and MCP, set up quarterly audits, start tracking CI pass rates. The difference is night and day. Once the repo is shaped correctly, AI agents stop guessing and start delivering."

---

## Appendix A: Key Metrics Summary

```mermaid
pie title "Where Agent Failures Come From"
    "Context Blindness (no grounded context)" : 44
    "Decision Gap (didn't search)" : 23
    "Context Rot (window overflow)" : 18
    "Hallucination (parametric error)" : 15
```

---

## Appendix B: Context File Impact by Scenario

```mermaid
quadrantChart
    title Context Files: When They Help Most
    x-axis "Low Project Specificity" --> "High Project Specificity"
    y-axis "Knowledge in Training Data" --> "Knowledge NOT in Training Data"
    quadrant-1 "CRITICAL: Write AGENTS.md"
    quadrant-2 "Helpful: Add conventions"
    quadrant-3 "Low impact: Generic tasks"
    quadrant-4 "Moderate: Tribal knowledge"
    "Next.js 16 APIs (Vercel)": [0.8, 0.9]
    "SWE-BENCH tasks": [0.4, 0.3]
    "Private API conventions": [0.9, 0.5]
    "Standard CRUD ops": [0.2, 0.2]
    "Monorepo routing": [0.85, 0.65]
    "Custom test patterns": [0.7, 0.55]
```

---

## Appendix C: Full Presentation Timeline

```mermaid
flowchart LR
    O["OPENING (7 min)<br/>• Title & Hook (2)<br/>• Parametric vs Grounded (3)<br/>• Context Rot (2)"]
    C["CORE CONCEPTS (5 min)<br/>• Push vs Pull Models (3)<br/>• Decision Gap & Vercel (2)"]
    A["ARCHITECTURE (8 min)<br/>• Five Pillars (3)<br/>• Progressive Disclosure (2)<br/>• MCP + Skills (1)<br/>• Copilot vs Devin (2)"]
    E["EVIDENCE & ACTION (5 min)<br/>• Academic Reality Check (2)<br/>• Monorepo Routing (1)<br/>• Hybrid Stack (1)<br/>• Passive Steering Flow (1)"]
    X["CLOSING (7 min)<br/>• Maturity Model (1)<br/>• 15-Min Audit (2)<br/>• AGENTS.md Content (1)<br/>• Complete Architecture (1)<br/>• Takeaways & CTA (2)"]

    O --> C --> A --> E --> X
```

---

## Key Citations

- **Vercel Blog:** _AGENTS.md outperforms skills in our agent evals_ (Jan 27, 2026) — https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- **arXiv 2602.11988:** _Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?_ — https://arxiv.org/abs/2602.11988
- **AGENTS.md Official Specification** — https://agents.md/
- **GitHub Docs:** _Adding custom instructions for GitHub Copilot_ — https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot
- **Anthropic:** _The Complete Guide to Building Skills for Claude_ — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- **GitHub Blog:** _How to write a great agents.md_ — https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/

---

_Tech Talk: "Context Engineering: Building AI-Native Repositories" — ~20 minutes with 18 slides and 20+ Mermaid diagrams._
