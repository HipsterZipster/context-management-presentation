# The Architecture of Context: A Comprehensive Report on Engineering AI-Native Repositories

**A Unified Synthesis of Research, Frameworks, and Practical Playbooks for Context Engineering in the Agentic Era (2025–2026)**

---

> _"70% of AI coding tasks still fail in real-world repos because the agent can't find or trust the right context."_
> — Vercel Research, January 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Foundational Theory: Parametric Knowledge vs. Grounded Context](#2-foundational-theory-parametric-knowledge-vs-grounded-context)
3. [The Two Models of Context Delivery](#3-the-two-models-of-context-delivery)
   - 3.1 Passive Context Strategies: The Push Model
   - 3.2 Active Retrieval Strategies: The Pull Model
4. [The Five Pillars of AI-Native Repositories](#4-the-five-pillars-of-ai-native-repositories)
5. [Anthropic Claude Skills Framework: Progressive Disclosure in Depth](#5-anthropic-claude-skills-framework-progressive-disclosure-in-depth)
6. [Architectural Comparison: GitHub Copilot vs. Cognition Devin](#6-architectural-comparison-github-copilot-vs-cognition-devin)
7. [Empirical Evidence: Evaluating AGENTS.md in Practice](#7-empirical-evidence-evaluating-agentsmd-in-practice)
   - 7.1 Vercel's Agent Evaluations (January 2026)
   - 7.2 Academic Research: "Evaluating AGENTS.md" (arXiv 2602.11988)
8. [The Hybrid Strategy: Combining Passive and Active Context](#8-the-hybrid-strategy-combining-passive-and-active-context)
9. [Monorepo Context Hierarchy and Routing](#9-monorepo-context-hierarchy-and-routing)
10. [Practical Implementation: The 15-Minute AI-Readiness Audit](#10-practical-implementation-the-15-minute-ai-readiness-audit)
11. [Templates and Reference Materials](#11-templates-and-reference-materials)
12. [Repository Readiness Maturity Model](#12-repository-readiness-maturity-model)
13. [Key Citations and References](#13-key-citations-and-references)
14. [Source Document Index](#14-source-document-index)

---

## 1. Executive Summary

The structural transformation of software engineering in the early twenty-first century has transitioned from the use of simple autocomplete engines into the deployment of autonomous coding agents capable of complex reasoning and execution. At the center of this transition lies **context engineering** — the specialized discipline of managing the information boundaries of an artificial intelligence agent to ensure deterministic, framework-aligned, and secure outcomes.

This report synthesizes findings from six primary sources spanning academic research papers, industry evaluations, vendor documentation, and practical implementation guides. The central thesis across all sources is consistent: **in the agentic era, the repository itself is the primary interface for developer intent**, and it can be made "AI-native" in as little as one afternoon by focusing on structured instruction files.

### Key Findings Across All Sources

| Finding                                                                                                                          | Source(s)                                   |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Baseline agent task success rate is ~53%; AI-native repos achieve up to 100%                                                     | Vercel Evals (Jan 2026)                     |
| Passive context (push) eliminates "decision fatigue" and outperforms active retrieval alone                                      | Vercel Blog, Architecture of Context Report |
| AGENTS.md is now used by 60,000+ repositories as an open standard                                                                | AGENTS.md Official Spec                     |
| LLM-generated context files have marginal negative effect on task success; developer-written ones provide marginal positive gain | arXiv 2602.11988 (ETH Zürich)               |
| Context files consistently increase the number of steps required to complete tasks                                               | arXiv 2602.11988                            |
| Progressive disclosure (3-level system) minimizes token usage while maintaining expertise                                        | Anthropic Claude Skills Guide               |
| Teams using structured context see 40–60% fewer context-related errors                                                           | GitHub 2026 Analysis                        |
| Hybrid strategies (passive + active) represent the optimal architecture                                                          | All sources converge                        |

---

## 2. Foundational Theory: Parametric Knowledge vs. Grounded Context

The baseline intelligence of any modern AI developer agent is derived from its **parametric knowledge** — the information encoded within the neural weights of the model during its training phase. While this provides broad understanding of general programming syntax, design patterns, and language idioms, it lacks project-specific nuance and is subject to training cutoffs.

To function effectively within a real-world codebase, agents must reconcile this general intelligence with **grounded repository context** — the real-time state of internal utility functions, private APIs, monorepo constraints, team conventions, and deployment configurations.

### Comparison Matrix: Parametric Knowledge vs. Grounded Context

| Feature         | Parametric Knowledge               | Grounded Context                              |
| --------------- | ---------------------------------- | --------------------------------------------- |
| **Origin**      | Large-scale pre-training data      | Real-time repository indexing and local files |
| **Recency**     | Fixed at training cutoff           | Synchronized with current commit              |
| **Specificity** | General-purpose standards          | Project-specific conventions and private APIs |
| **Management**  | Model fine-tuning (rare)           | RAG, MCP, and Instruction Files               |
| **Reliability** | Medium (prone to generic patterns) | High (when properly scoped and managed)       |

### The Attention Budget and Context Rot

The reconciliation process between parametric and grounded knowledge is governed by the agent's **attention budget** — a finite computational resource. As context windows expand, reaching up to 1 million tokens in models like Claude 4.6 Opus, the risk of **"context rot"** increases dramatically.

**Context rot** occurs when a context window reaches approximately 95% of its capacity. At this threshold, agents often auto-compact their working memory, silently discarding nuanced instructions or project-specific conventions in favor of retaining what they deem most relevant. This phenomenon is particularly dangerous because:

- The agent does not signal that it has lost context
- Priority is given to recent instructions over earlier, potentially more important ones
- Project-specific conventions are often the first to be discarded in favor of generic patterns
- The resulting code may compile and pass basic tests while violating critical architectural constraints

The Vercel evaluation (January 2026) proved this empirically: agents were "confidently wrong" based on training data, skipping framework documentation 44% of the time because they believed their parametric knowledge was sufficient. The solution — passive compressed indexes — eliminated the decision point entirely, achieving 100% task success rates.

---

## 3. The Two Models of Context Delivery

Context management for AI coding agents divides into two fundamental paradigms: **passive steering (push)** and **active retrieval (pull)**. Understanding their mechanics, strengths, and failure modes is essential for architecting an effective AI-native repository.

### 3.1 Passive Context Strategies: The Push Model

Passive context management involves pre-loading instructions directly into the system prompt or the agent's persistent context, effectively "pushing" rules into the model's reasoning engine before a task begins. The agent never needs to decide whether to look for these instructions — they are always present.

#### GitHub Copilot Scoping

GitHub Copilot utilizes a **multi-tiered passive context** system:

- **Repository-wide standards** are stored in `.github/copilot-instructions.md`
- **Path-specific rules** are defined in `.instructions.md` files within the `.github/instructions/` directory
- Scoped instructions leverage **YAML frontmatter** to define jurisdiction using glob patterns

Example of a scoped instruction file:

```yaml
---
applyTo: "app/models/**/*.rb"
excludeAgent: "code-review"
---
# Rails Model Rules
- Use ActiveSupport concerns for shared logic.
- Validate all foreign key associations.
- Never use raw SQL queries; use Active Record scopes.
```

This approach ensures that React rules are injected only when the agent is editing `.tsx` files, Rails model conventions only when editing Ruby models, and backend API standards only in the appropriate service directory.

#### Anthropic Claude Skills: Progressive Disclosure

Anthropic's Skills framework implements a sophisticated **3-level "knowledge layer"** to manage tokens efficiently while maintaining specialized expertise:

| Level       | Component        | Token Cost  | Loading Trigger                            |
| ----------- | ---------------- | ----------- | ------------------------------------------ |
| **Level 1** | YAML Frontmatter | ~100 tokens | Always loaded in system prompt             |
| **Level 2** | SKILL.md Body    | Variable    | Loaded when agent recognizes intent match  |
| **Level 3** | Linked Resources | On-demand   | Navigated by agent through Discovery tools |

This progressive disclosure architecture means the agent carries minimal overhead for hundreds of installed skills, loading full instructions only when contextually appropriate.

#### The AGENTS.md Open Standard

The `AGENTS.md` standard (now used by 60,000+ repositories) acts as a "README for robots." Placed at the repository root, it provides:

- Project overview and technology stack
- Setup, build, test, and lint commands
- Code style and naming conventions
- Testing requirements
- Common pitfalls and anti-patterns

Agents from Copilot, Devin, Claude Code, Cursor, and others all read the nearest `AGENTS.md` automatically, using **nearest-file precedence** in nested directory structures.

### 3.2 Active Retrieval Strategies: The Pull Model

Active retrieval, or "pull" context, relies on the agent **autonomously searching the environment through tool invocation**. This is essential for navigating massive codebases that exceed the context window, discovering dynamically generated files, or accessing real-time state.

#### Core Active Retrieval Tools

| Tool Name         | Functional Description                              | Parameters                  |
| ----------------- | --------------------------------------------------- | --------------------------- |
| `read_file`       | Accesses file content up to 250 lines               | `target_file`, `start_line` |
| `list_dir`        | Discovers directory hierarchy                       | `relative_workspace_path`   |
| `grep_search`     | Text-based regex matching for exact patterns        | `pattern`, `directory`      |
| `semantic_search` | Contextual retrieval based on conceptual similarity | `query`, `repository_id`    |
| `Devin Search`    | High-scale indexing for codebases of 1M+ lines      | `query`, `scope`            |

#### The Decision Gap Problem

The critical weakness of pure active retrieval is what the research terms the **"Decision Gap"** — the moment when an agent must decide which tool to invoke, which directory to search, or which file to read. Vercel's January 2026 evaluation demonstrated this conclusively:

- Agents invoked Skills (active retrieval triggers) only **56% of the time** when they were available
- Even with explicit prompting, invocation rates reached only **79%**
- The remaining failures occurred because agents were "confidently wrong" — their parametric knowledge told them they already knew the answer

This finding is the strongest empirical argument for passive context as the default strategy, with active retrieval as a complementary mechanism for scale and freshness.

---

## 4. The Five Pillars of AI-Native Repositories

Drawing from GitHub's 2026 analysis, the AGENTS.md standard, and Vercel's empirical findings, five structural pillars define the architecture of an AI-native repository:

### Pillar 1: Unified Knowledge Layer

**Purpose:** Single source of truth that agents always read first.

**Key Files:**

- `AGENTS.md` at repository root
- `.github/copilot-instructions.md`

**Impact:** Eliminates "where do I start?" failures. Agents immediately know the project's purpose, technology stack, setup commands, and conventions.

**Implementation:**

- Place `AGENTS.md` at root containing setup, build, test, lint commands
- Keep it concise — under 2 pages
- Sync `.github/copilot-instructions.md` with architecture notes and global standards
- Include one-sentence project purpose + languages/frameworks

### Pillar 2: Scoped Precision

**Purpose:** Rules apply only where they are relevant, preventing context window pollution.

**Key Files:**

- `.github/instructions/*.instructions.md` with `applyTo` glob patterns

**Impact:** Prevents context bloat in monorepos. React rules load only when editing TSX files; backend conventions only when editing server code.

**Implementation:**

```yaml
---
applyTo: "**/*.tsx"
---
# React Component Standards
- Use functional components exclusively
- All props must have TypeScript interfaces
- Use Tailwind CSS for styling
```

### Pillar 3: Monorepo Mastery

**Purpose:** Root router with nearest-file precedence prevents context leakage between packages.

**Key Files:**

- Root `AGENTS.md` (acts as router)
- Nested `AGENTS.md` files in `packages/`, `apps/`, etc.

**Impact:** Zero context rot across package boundaries. Each sub-project maintains its own context that overrides root-level instructions.

**Implementation:**

- Root `AGENTS.md` includes routing hints: _"For frontend work, read `packages/frontend/AGENTS.md`"_
- Each package has its own `AGENTS.md` with package-specific commands and conventions
- Nearest-file precedence means `packages/ui/AGENTS.md` overrides `root/AGENTS.md` when working in `packages/ui/`

### Pillar 4: AI-Readable Documentation

**Purpose:** Every document is machine-parseable with structured Markdown headings.

**Key Files:**

- Structured `README.md` with `## Tech Stack`, `## Build Commands`, etc.
- `/llms.txt` at the root or documentation site

**Impact:** Agents discover everything automatically through heading-based navigation.

**Implementation:**

- Use clear `##` headings in README and all Markdown files
- Add `llms.txt` at root telling agents exactly what to read first
- Structure documentation with consistent heading hierarchies
- Avoid prose-heavy documentation; prefer structured lists and tables

### Pillar 5: Living Maintenance

**Purpose:** Documentation that rots is worse than no documentation. Instructions must stay accurate over time.

**Key Files:**

- Validation scripts (e.g., `audit-ai.mjs`)
- Quarterly audit schedules

**Impact:** Long-term reliability. Teams report instructions stay accurate and agents stay reliable for months with regular maintenance.

**Implementation:**

- Implement quarterly "AI Readiness" audits
- Run validation scripts that verify all commands in `AGENTS.md` actually execute
- Version-control all context files
- Track agent success metrics before and after changes

---

## 5. Anthropic Claude Skills Framework: Progressive Disclosure in Depth

The Anthropic Claude Skills Guide provides the most detailed vendor documentation on structured context management for AI agents. Skills represent a paradigm where **instructions are packaged as portable, self-contained folders** that teach Claude how to handle specific tasks or workflows.

### What Is a Skill?

A skill is a folder containing:

| Component     | Required?    | Purpose                                     |
| ------------- | ------------ | ------------------------------------------- |
| `SKILL.md`    | **Required** | Main instruction file with YAML frontmatter |
| `scripts/`    | Optional     | Executable code (Python, Bash, etc.)        |
| `references/` | Optional     | Documentation loaded as needed              |
| `assets/`     | Optional     | Templates, fonts, icons used in output      |

### The Three-Level Progressive Disclosure System

This architecture is the core innovation of the Skills framework, directly addressing the context rot problem:

**Level 1 — YAML Frontmatter (~100 tokens)**

- Always loaded in Claude's system prompt
- Provides just enough information for Claude to know _when_ each skill should be used
- Minimal token overhead even with hundreds of installed skills

```yaml
---
name: project-sprint-planning
description: Manages Linear project workflows including sprint planning,
  task creation, and status tracking. Use when user mentions "sprint",
  "Linear tasks", "project planning", or asks to "create tickets".
---
```

**Level 2 — SKILL.md Body (variable tokens)**

- Loaded only when Claude determines the skill is relevant to the current task
- Contains full instructions, step-by-step workflows, examples, and error handling
- This is where the substantive domain knowledge lives

**Level 3 — Linked Resources (on-demand)**

- Additional files bundled within the skill directory
- Claude navigates to these only when it needs specific reference material
- Examples: API documentation, template files, configuration schemas

### The MCP + Skills Architecture ("Kitchen Analogy")

Anthropic uses a powerful analogy to explain the relationship between MCP (Model Context Protocol) servers and Skills:

- **MCP provides the professional kitchen:** access to tools, ingredients, and equipment (API connections, data access, tool invocation)
- **Skills provide the recipes:** step-by-step instructions on how to create something valuable (workflows, best practices, domain expertise)

**Without Skills:**

- Users connect an MCP but don't know what to do next
- Support tickets accumulate asking "how do I do X with your integration?"
- Each conversation starts from scratch
- Inconsistent results because users prompt differently each time

**With Skills:**

- Pre-built workflows activate automatically when needed
- Consistent, reliable tool usage across all users
- Best practices embedded in every interaction
- Lower learning curve for integrations

### Three Categories of Skill Use Cases

| Category                      | Purpose                                                                             | Example                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Document & Asset Creation** | Creating consistent, high-quality output (docs, presentations, apps, designs, code) | `frontend-design` skill for production-grade UI interfaces |
| **Workflow Automation**       | Multi-step processes with consistent methodology                                    | `skill-creator` skill for guided skill authoring           |
| **MCP Enhancement**           | Workflow guidance layered on top of MCP tool access                                 | `sentry-code-review` skill for bug analysis via Sentry MCP |

### Technical Requirements and Critical Rules

- **SKILL.md naming:** Must be exactly `SKILL.md` (case-sensitive). No variations.
- **Folder naming:** kebab-case only (`notion-project-setup`, not `Notion Project Setup`)
- **No README.md** inside skill folders; all documentation goes in `SKILL.md` or `references/`
- **YAML frontmatter:** Required `---` delimiters, `name` (kebab-case), `description` (what + when)
- **Security:** No XML angle brackets (`< >`) in frontmatter; names cannot include "claude" or "anthropic"
- **Size:** Keep `SKILL.md` under 5,000 words; move detailed docs to `references/`

### Testing Framework for Skills

Anthropic recommends three tiers of testing:

1. **Triggering Tests:** Does the skill load for relevant queries? Does it correctly _not_ load for unrelated queries?
2. **Functional Tests:** Does the skill complete its workflow correctly? Are MCP calls successful?
3. **Quality Tests:** Are outputs consistent across sessions? Do users need to redirect or clarify?

**Debugging Approach:** Ask Claude: _"When would you use the [skill name] skill?"_ Claude will quote the description back, revealing gaps in trigger coverage.

### Troubleshooting Common Issues

| Symptom                   | Likely Cause                          | Solution                                                   |
| ------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| Skill won't upload        | File not named exactly `SKILL.md`     | Rename to exact case-sensitive name                        |
| Skill doesn't trigger     | Description too generic               | Add specific trigger phrases and file types                |
| Skill triggers too often  | Description too broad                 | Add negative triggers and scope clarification              |
| MCP calls fail            | Server not connected or auth expired  | Verify connection status, refresh tokens                   |
| Instructions not followed | Instructions too verbose or ambiguous | Use bullet points, put critical items first                |
| Slow/degraded responses   | Too much content loaded at once       | Move detailed docs to `references/`, reduce enabled skills |

---

## 6. Architectural Comparison: GitHub Copilot vs. Cognition Devin

While both tools are leading the agentic shift, they employ fundamentally different philosophies regarding context management and task autonomy.

### Head-to-Head Comparison

| Metric                | GitHub Copilot Workspace                                | Cognition Devin                                |
| --------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| **Architecture Type** | Integrated Plugin-based                                 | Cloud-based Autonomous Agent                   |
| **Context Strategy**  | Selective Surgical Injection                            | Global State Ingestion                         |
| **Context Window**    | ~200,000 Tokens                                         | 10M+ Tokens                                    |
| **Terminal Access**   | Limited (IDE-bound)                                     | Full (Sandboxed Ubuntu VM)                     |
| **Primary Retrieval** | `read_file`, `semantic_search`                          | Devin Search (Lexical/Semantic)                |
| **Task Engagement**   | 2.3% Ghosting Rate                                      | 0.9% Ghosting Rate                             |
| **Best For**          | Real-time edits, strict syntax enforcement, low latency | Large-scale refactors, exploring new codebases |

### GitHub Copilot: Selective Surgical Injection

Copilot operates as a **"silent partner"** within the IDE, utilizing a push-pull hybrid tailored for interactive development:

- Its context engine **prioritizes the active file and open tabs**, surgically pulling in only the most relevant surrounding code
- Passive rules from `.github/copilot-instructions.md` are always present in the system prompt
- Scoped `.instructions.md` files inject rules only when the agent touches matching files
- **Copilot Spaces** provide additional workspace-level context organization
- Strength: extremely low latency, high precision for targeted edits
- Weakness: lower autonomy, limited ability to handle cross-cutting refactors

### Cognition Devin: Autonomous Active Retrieval

Devin operates as a **fully autonomous software engineer** with its own cloud-based development environment:

- Ingests the entire codebase state into its massive context window (10M+ tokens)
- Uses **Devin Search** to perform lexical and semantic search across codebases of 1M+ lines
- Has full terminal access in a sandboxed Ubuntu VM for running commands, tests, and deployments
- Reads `AGENTS.md` as an "onboarding manual" for understanding the project
- Strength: high autonomy, excellent for large-scale refactors and exploration
- Weakness: higher latency, resource-intensive, less suited for quick interactive edits

### Architectural Profile (Radar Comparison)

| Dimension                | GitHub Copilot | Devin  |
| ------------------------ | -------------- | ------ |
| **Autonomy**             | 40/100         | 95/100 |
| **Setup Speed**          | 95/100         | 60/100 |
| **Context Precision**    | 90/100         | 85/100 |
| **Large-Scale Refactor** | 50/100         | 95/100 |
| **Latency (Speed)**      | 95/100         | 40/100 |

The key insight is that these tools are **complementary, not competing**. Copilot excels in the developer's flow state with sub-second suggestions, while Devin excels when handed a multi-file task and left to execute autonomously.

---

## 7. Empirical Evidence: Evaluating AGENTS.md in Practice

### 7.1 Vercel's Agent Evaluations (January 2026)

Vercel's landmark evaluation, published January 27, 2026, tested how different context strategies affected agent performance when teaching Next.js 16 APIs that were absent from training data.

#### Key Results

| Strategy                                    | Task Success Rate                              |
| ------------------------------------------- | ---------------------------------------------- |
| **Baseline (No Context)**                   | 53%                                            |
| **Skills Only (Active Retrieval)**          | 53% (agents invoked them only 56% of the time) |
| **Skills + Explicit Prompting**             | 79%                                            |
| **AGENTS.md with Compressed Passive Index** | **100%**                                       |

#### Critical Insights

- A compressed 8KB `AGENTS.md` index (pipe-delimited map of 40KB documentation) achieved **100% success** across Build, Lint, and Test evaluation categories
- Skills alone matched baseline (53%) because agents simply didn't invoke them reliably
- The fundamental problem: **agents skip framework docs 44% of the time** because they are "confidently wrong" based on parametric knowledge
- Passive context removed the decision point entirely — the agent never needs to decide whether to look for the information

#### What This Means in Practice

- Teams saw **40–60% fewer context-related errors** after implementing passive context files
- PRs pass CI on first try far more often
- Onboarding drops from days to minutes
- Agents auto-know build/test flows and never guess wrong commands

### 7.2 Academic Research: "Evaluating AGENTS.md" (arXiv 2602.11988)

This rigorous academic evaluation from ETH Zürich provides a more nuanced and sobering perspective on context files. The paper evaluates four major coding agents across two benchmarks: **SWE-BENCH LITE** (established) and **AGENTBENCH** (newly constructed from 138 instances across 12 repositories with developer-written context files).

#### Experimental Setup

**Coding Agents Tested:**

- **Claude Code** with Sonnet 4.5
- **Codex** (OpenAI) with GPT-5.2 and GPT-5.1 Mini
- **Qwen Code** with Qwen3-30B-Coder

**Context File Types:**

- **None** (baseline)
- **LLM-generated** (auto-generated by the agent itself)
- **Developer-written** (hand-crafted by humans)

#### Key Findings

1. **Context files consistently increase the number of steps required to complete tasks** — on average by 3.34 steps and at most 19% higher cost.

2. **LLM-generated context files have a marginal _negative_ effect on task success rates** — they tend to be redundant with existing documentation and add noise rather than signal.

3. **Developer-written context files provide a marginal _positive_ performance gain** — but the effect is modest, not transformative.

4. **Context files are NOT effective as repository overviews** — despite 100% of Sonnet-4.5-generated context files containing codebase overviews, the presence of context files did not meaningfully reduce the number of steps before agents found relevant files.

5. **Instructions in context files ARE generally followed** — agents use tools mentioned in context files (e.g., `uv` used 1.6× per instance when mentioned vs. <0.01× when not), confirming instruction-following works, but it doesn't necessarily improve outcomes.

6. **Context files lead to more testing and broader exploration** — agents run more tests, search more files, read more files, and write more files when context files are present.

7. **Following context files requires more thinking** — LLM-generated context files increase reasoning tokens by 22% for GPT-5.2 and 14% for GPT-5.1 Mini.

8. **LLM-generated context files are redundant with existing documentation** — when all other documentation is removed, LLM-generated context files consistently _improve_ performance by 2.7% on average and outperform developer-written ones. This suggests they are primarily duplicating what already exists.

9. **Stronger models don't generate better context files** — GPT-5.2-generated files improved SWE-BENCH LITE performance but degraded AGENTBENCH performance.

10. **No consistent difference between specific generation prompts** — Codex prompts vs. Claude Code prompts showed no systematic advantage.

#### AGENTBENCH Dataset Statistics

| Metric                       | Mean  | Min  | Max    |
| ---------------------------- | ----- | ---- | ------ |
| PR body word count           | 415.3 | 5    | 4,961  |
| Issue description word count | 211.6 | 96   | 500    |
| Codebase file count          | 3,337 | 151  | 26,602 |
| PR patch lines edited        | 118.9 | 12   | 1,973  |
| PR files edited              | 2.5   | 1    | 23     |
| Test coverage                | 75%   | 2.5% | 100%   |
| Context file word count      | 641.0 | 24   | 2,003  |
| Context file sections        | 9.7   | 1    | 29     |

#### Reconciling Vercel and Academic Findings

The apparent tension between Vercel's dramatic 53% → 100% improvement and the academic paper's "marginal effect" conclusion can be resolved by understanding the difference in evaluation scenarios:

- **Vercel's test case** specifically targeted knowledge _absent_ from training data (Next.js 16 APIs). In this scenario, passive context is indispensable because parametric knowledge is definitionally insufficient.
- **The academic benchmarks** (SWE-BENCH LITE and AGENTBENCH) tested on tasks where most relevant knowledge _already exists_ in the training data and codebase documentation. Here, context files are largely redundant.
- **The academic finding that removing ALL documentation makes LLM-generated context files beneficial** actually _supports_ the passive context thesis — context files are most valuable precisely when other documentation is missing or insufficient.

**The practical takeaway:** Context files are most impactful when they contain information that is (a) project-specific, (b) not inferable from the codebase alone, and (c) not covered in existing documentation. Human-written context files that encode _tribal knowledge_ — conventions, anti-patterns, architectural decisions, and non-obvious setup steps — deliver the greatest value.

---

## 8. The Hybrid Strategy: Combining Passive and Active Context

All sources converge on the same architectural recommendation: **the optimal context strategy is a hybrid of passive steering and active retrieval**.

### The Recommended Stack

| Layer                      | Strategy            | Implementation                                                | Purpose                                 |
| -------------------------- | ------------------- | ------------------------------------------------------------- | --------------------------------------- |
| **Foundation**             | Passive             | `AGENTS.md` at root + `.github/copilot-instructions.md`       | Always-available project context        |
| **Scoped Rules**           | Passive             | `.github/instructions/*.instructions.md` with `applyTo` globs | Framework/language-specific conventions |
| **Vertical Workflows**     | Active (Skills/MCP) | Anthropic Skills + MCP server integrations                    | Complex multi-step processes            |
| **Documentation**          | Passive             | `/llms.txt` at docs site root + structured README headings    | Machine-discoverable documentation      |
| **Large-Scale Navigation** | Active              | `grep_search`, `semantic_search`, Devin Search                | Codebase exploration at scale           |

### Why Passive Wins Reliability, Active Wins Scale

**Passive context** removes the decision point entirely. The agent never needs to decide whether to look for build commands or naming conventions — they're always in the prompt. This makes passive context ideal for:

- Build/test/lint commands
- Naming conventions
- Code style standards
- Architectural constraints
- Common pitfalls

**Active context** provides freshness and handles scale beyond what fits in a context window. This makes active context ideal for:

- Navigating large codebases (1M+ lines)
- Accessing real-time data from external services
- Performing cross-repository searches
- Executing complex multi-tool workflows

### Four Immediate Actions

1. **Create root `AGENTS.md` today** — include project overview, setup commands, and conventions
2. **Scope React/TypeScript/framework rules** with `.instructions.md` files using `applyTo` globs
3. **Test with 10 sample tasks** — ask your agent "How do I build and test this project?" and verify accuracy
4. **Measure invocation rates before/after** — track context-related errors and CI pass rates

---

## 9. Monorepo Context Hierarchy and Routing

Monorepos present a unique context engineering challenge: how to prevent agents from loading irrelevant context from sibling packages while ensuring they have the right context for the package they're working in.

### The Root Router Pattern

```
repository-root/
├── AGENTS.md                           # Root router: points to packages
├── .github/
│   ├── copilot-instructions.md         # Global standards
│   └── instructions/
│       ├── react.instructions.md       # applyTo: "**/*.tsx"
│       └── python.instructions.md      # applyTo: "**/*.py"
├── llms.txt                            # Machine-discoverable doc index
├── packages/
│   ├── frontend/
│   │   └── AGENTS.md                   # Frontend-specific context
│   ├── backend/
│   │   └── AGENTS.md                   # Backend-specific context
│   └── shared/
│       └── AGENTS.md                   # Shared library context
└── apps/
    └── api/
        └── AGENTS.md                   # API app context
```

### Nearest-File Precedence

The AGENTS.md standard uses **nearest-file precedence**: when an agent is working in `packages/frontend/src/`, it reads `packages/frontend/AGENTS.md` first. If a particular instruction isn't found there, it falls back to the root `AGENTS.md`. This mirrors how `package.json` resolution works in Node.js monorepos.

### Before vs. After: Monorepo Context

| Aspect            | Before (Typical Repo)                   | After (AI-Native)                                  |
| ----------------- | --------------------------------------- | -------------------------------------------------- |
| Context files     | Only README.md                          | AGENTS.md + scoped `.instructions.md` + `llms.txt` |
| Monorepo handling | Agents get confused by sibling packages | Root router + nearest-file precedence              |
| Token waste       | High (irrelevant files loaded)          | Minimal (scoped globs filter content)              |
| Agent accuracy    | Inconsistent across packages            | Package-specific context ensures accuracy          |

---

## 10. Practical Implementation: The 15-Minute AI-Readiness Audit

This checklist is designed to be executed immediately after reading this report. Teams that maintain this audit cadence report instructions staying accurate and agents staying reliable for months.

### Phase 1: The Unified Knowledge Layer (Foundation) — 5 minutes

- [ ] **Create `AGENTS.md`** at repository root
  - Include project overview (one sentence)
  - Include setup command (`pnpm install` / `npm install` / `pip install`)
  - Include dev server command (`pnpm dev`)
  - Include build command (`pnpm build`)
  - Include test command (`pnpm test --filter ...`)
  - Include lint command (`pnpm lint`)
- [ ] **Create/sync `.github/copilot-instructions.md`** with architecture notes and global standards
- [ ] **Establish jurisdiction** — ensure instructions apply to current directory and children

### Phase 2: Scoped Precision (Framework-Specific) — 3 minutes

- [ ] **Define framework rules** — create `.github/instructions/react.instructions.md` (or equivalent)
- [ ] **Apply glob patterns** — use YAML frontmatter `applyTo: "**/*.tsx"` to isolate rules
- [ ] **Monorepo routing** — add nested `AGENTS.md` to each package to prevent "context leakage"

### Phase 3: Machine-Readable Project Inventory — 3 minutes

- [ ] **Structure README** — use clear `## Tech Stack` and `## Build Commands` headings
- [ ] **Clean hierarchy** — organize code logically for autonomous navigation
- [ ] **Instruction compression** — keep instruction files concise (under 2 pages / 5,000 words)
- [ ] **Add `llms.txt`** at root telling agents exactly what to read first

### Phase 4: The Verification Audit — 4 minutes

- [ ] **The "How-To" Query:** Ask your agent: _"How do I build and test this project?"_ — verify the answer is correct
- [ ] **The "Style" Query:** Ask: _"What are the naming conventions for new components?"_ — verify accuracy
- [ ] **Command validation:** Verify all commands in `AGENTS.md` actually execute in a fresh environment
- [ ] **Commit & push:** Version-control all context files for persistence and team access

### Automated Audit Script

For continuous validation, use an audit script like the following:

```javascript
const fs = require("node:fs");
const path = require("node:path");

const CHECKLIST = [
  {
    name: "AGENTS.md",
    path: "AGENTS.md",
    fix: "Create root AGENTS.md with setup commands",
  },
  {
    name: "Copilot Instructions",
    path: ".github/copilot-instructions.md",
    fix: "Create .github/copilot-instructions.md",
  },
  {
    name: "Scoped Instructions Dir",
    path: ".github/instructions",
    fix: "Create .github/instructions/ directory",
  },
  {
    name: "llms.txt",
    path: "llms.txt",
    fix: "Create llms.txt with documentation index",
  },
];

async function runAudit() {
  console.log("--- 15-Minute AI-Native Repo Audit ---\n");
  let missingCount = 0;

  for (const item of CHECKLIST) {
    const fullPath = path.join(process.cwd(), item.path);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${item.name}: Found`);
    } else {
      missingCount++;
      console.log(`❌ ${item.name}: Missing! -> Action: ${item.fix}`);
    }
  }

  // Monorepo check
  const pkgPath = path.join(process.cwd(), "packages");
  if (fs.existsSync(pkgPath)) {
    console.log("\n--- Monorepo Routing Check ---");
    fs.readdirSync(pkgPath).forEach((pkg) => {
      const hasAgent = fs.existsSync(path.join(pkgPath, pkg, "AGENTS.md"));
      console.log(
        hasAgent
          ? `✅ Package "${pkg}": AI-Ready`
          : `⚠️ Package "${pkg}": Missing AGENTS.md`,
      );
    });
  }

  console.log(`\nAudit Complete: ${missingCount} items to fix.`);
}
runAudit();
```

---

## 11. Templates and Reference Materials

### Template: Root AGENTS.md

```markdown
# AGENTS.md – Instructions for AI Coding Agents

## Project Overview

[One-sentence purpose + languages/frameworks]

## Setup & Run Commands (always run in this order)

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test --filter ...`
- Lint: `pnpm lint`

## Code Style & Conventions

- TypeScript strict mode
- Functional components only in React
- Use Tailwind CSS for all styling
- [Add your conventions here]

## Testing & Validation

- Always run full test suite before PR
- Minimum 80% code coverage for new modules
- [Add your testing requirements here]

## Common Pitfalls to Avoid

- Never use deprecated API X
- Never import from internal implementation paths
- [Add your anti-patterns here]
```

### Template: Scoped Instruction File

```yaml
---
applyTo: "**/*.tsx"
---
# React Component Standards

## Naming
- Components: PascalCase (e.g., `UserProfile`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth`)
- Utilities: camelCase (e.g., `formatDate`)

## Structure
- One component per file
- Props interface defined above component
- Export component as default

## Styling
- Use Tailwind CSS utility classes
- No inline styles or CSS modules
- Use `cn()` utility for conditional classes

## State Management
- Use React Query for server state
- Use Zustand for client state
- No Redux in new code
```

### Template: Anthropic Skill (SKILL.md)

```yaml
---
name: your-skill-name
description: What this skill does. Use when user asks to [specific
  trigger phrases]. Handles [key capabilities].
---
```

```markdown
# Your Skill Name

## Instructions

### Step 1: [First Major Step]

Clear explanation of what happens.

### Step 2: [Second Major Step]

Continue the workflow.

## Examples

### Example 1: [Common Scenario]

User says: "Set up a new marketing campaign"
Actions:

1. Fetch existing campaigns via MCP
2. Create new campaign with provided parameters
   Result: Campaign created with confirmation link

## Troubleshooting

### Error: [Common error message]

Cause: [Why it happens]
Solution: [How to fix]
```

### Template: llms.txt

```
# Project Name

> One-line project description

## Documentation
- [Architecture Overview](docs/architecture.md): System design and component relationships
- [API Reference](docs/api.md): REST API endpoints and schemas
- [Contributing Guide](CONTRIBUTING.md): How to contribute to this project

## Key Files
- AGENTS.md: AI agent instructions and project context
- .github/copilot-instructions.md: GitHub Copilot custom instructions

## Quick Start
1. Install: `pnpm install`
2. Dev: `pnpm dev`
3. Test: `pnpm test`
```

---

## 12. Repository Readiness Maturity Model

Based on the Primer readiness tool and synthesized from all source materials, repositories can be assessed across five maturity levels:

| Level | Name             | Description                                               | Criteria                                                                                                                |
| ----- | ---------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **1** | **Functional**   | Builds and tests exist                                    | Project compiles; basic test suite runs                                                                                 |
| **2** | **Documented**   | `AGENTS.md` and custom instructions present               | Root `AGENTS.md` created; `.github/copilot-instructions.md` exists                                                      |
| **3** | **Standardized** | CI/CD and security policies are active                    | Scoped instruction files with glob patterns; monorepo routing; automated CI                                             |
| **4** | **Optimized**    | MCP servers and AI Skills are configured                  | Anthropic Skills deployed; MCP integrations active; `llms.txt` present                                                  |
| **5** | **Autonomous**   | Agentic development proceeds with minimal human oversight | Living maintenance with quarterly audits; validation scripts; measured invocation rates; agents handle tasks end-to-end |

### Self-Assessment Questions

- **Level 1:** _Can a new developer clone this repo and run tests in under 10 minutes?_
- **Level 2:** _Can an AI agent answer "How do I build and test this project?" correctly?_
- **Level 3:** _Do framework-specific rules apply only to relevant files? Are monorepo packages isolated?_
- **Level 4:** _Can Claude/Copilot execute domain-specific workflows (deploy, review, analyze) autonomously?_
- **Level 5:** _Has the team measured context-related error rates? Are audit scripts running regularly?_

---

## 13. Key Citations and References

### Primary Research and Evaluations

- **Vercel Blog:** _AGENTS.md outperforms skills in our agent evals_ (January 27, 2026) — https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
- **arXiv 2602.11988:** _Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?_ — https://arxiv.org/abs/2602.11988

### Standards and Specifications

- **AGENTS.md Official Specification & Monorepo Guide** — https://agents.md/
- **llms.txt Proposal** — https://llmstxt.org/

### Vendor Documentation

- **GitHub Docs:** _Adding repository custom instructions for GitHub Copilot_ (2026) — https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot
- **GitHub Blog:** _5 tips for writing better custom instructions for Copilot_ (September 2025) — https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/
- **GitHub Blog:** _How to write a great agents.md: Lessons from over 2,500 repositories_ — https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
- **Anthropic:** _Claude Skills Guide_ — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- **Anthropic:** _Claude Code overview_ — https://code.claude.com/docs/en/overview
- **Anthropic:** _Using CLAUDE.md files_ — https://claude.com/blog/using-claude-md-files
- **VS Code:** _Custom Instructions_ — https://code.visualstudio.com/docs/copilot/customization/custom-instructions

### Tools and Frameworks

- **Primer AI Readiness Tool & Checklist Patterns** — https://github.com/pierceboggan/primer
- **OpenHands:** _Open Platform for AI Software Developers_ — https://openreview.net/forum?id=OJd3ayDDoF
- **SWE-bench:** _Can Language Models Resolve Real-world GitHub Issues?_ — https://openreview.net/forum?id=VTF8yNQM66

### Additional Academic References (from arXiv 2602.11988)

- Chatlatanagulchai et al. _Agent READMEs: An Empirical Study of Context Files for Agentic Coding_ (arXiv 2511.12884)
- Mohsenimofidi et al. _Context Engineering for AI Agents in Open-Source Software_ (arXiv)
- Boyina, G. _Why I Created AGENTS.md: A Simple Solution to a Growing Problem_ (Medium, 2025)
- Sawers, P. _The Rise of Agents.md, an Open Standard and Single Source of Truth for AI Coding Agents_ (Tessl.io, 2025)
- Sewell, S. _Improve your AI code output with AGENTS.md (+ my best tips)_ (Builder.io, 2025)
- Singh et al. _OpenAI GPT-5 System Card_ (arXiv 2601.03267, 2026)
- Sarkar, S. K. _AI agents, productivity, and higher-order thinking: Early evidence from software development_ (SSRN 5713646, 2025)

---

## 14. Source Document Index

This comprehensive report was synthesized from the following primary source materials:

| #   | Source                                    | Type                                     | Key Contribution                                                                                                                                                                                                                                                |
| --- | ----------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `ai-native-repo-pitch-integration.md`     | Academic Report                          | Foundational theory on parametric vs. grounded knowledge; passive/active context models; Copilot vs. Devin comparison; hybrid strategy framework                                                                                                                |
| 2   | `grok-report-4.md`                        | Presentation Playbook                    | 5-pillar framework; copy-paste templates; AGENTS.md templates; before/after comparisons; 15-minute audit checklist; Vercel metrics                                                                                                                              |
| 3   | `AI-Native Repo Pitch Integration-1.html` | Interactive Infographic (SPA)            | Visual data representations (Chart.js bar/doughnut/radar charts, Plotly.js contour plot); CSS-only process flow diagrams; interactive audit checklist                                                                                                           |
| 4   | `Anthropic - Claude Skills Guide.pdf`     | Vendor Documentation (33 pages)          | Complete Skills framework; progressive disclosure system; SKILL.md structure; YAML frontmatter specification; MCP + Skills architecture; testing methodology; troubleshooting guide                                                                             |
| 5   | `2602.11988v1.pdf` (arXiv)                | Peer-Reviewed Research Paper (18+ pages) | Rigorous empirical evaluation of context files; AGENTBENCH benchmark (138 instances, 12 repos); finding that LLM-generated context files have marginal negative effect; developer-written ones provide marginal positive gain; trace analysis of agent behavior |
| 6   | `grok_report (3).pdf`                     | Presentation Outline                     | Slide-by-slide talk outline for "The Architecture of Context"; Vercel eval integration; monorepo routing diagrams; Copilot vs. Devin comparison; hybrid strategy recommendations; key citations                                                                 |

---

_Report generated February 25, 2026. This document synthesizes all available source materials in the content-management-presentation repository and associated Context Presentation reference folder._
