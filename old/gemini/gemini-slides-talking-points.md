# Slide-by-Slide Talking Points: "Your Repo Is Fighting Your AI Agents"

---

## Slide 1 — Title Slide

**"Your Repo Is Fighting Your AI Agents"**

> _"70% of AI coding tasks still fail in real-world repos because the agent can't find or trust the right context."_
> — Vercel Research, January 2026 ([source](https://vercel.com/blog/ai-agent-evaluations))

- **Hook:** Frame the core tension — most repositories were designed for humans, not AI agents. It's not the model that's failing, it's the _context_.
- **Vercel proved it:** Baseline repos achieve 53% task success. AI-native repos hit 100%. Today's talk is the exact engineering blueprint to get there.
- Set the tone: this is an _engineering blueprint_, not hype — practical, actionable, grounded in data. You can implement it this afternoon.
- **Visual contrast on screen** — Legacy vs. AI-Native:

  | ❌ Legacy Repository | ✅ AI-Native Repository           |
  | -------------------- | --------------------------------- |
  | `README.md`          | `AGENTS.md`                       |
  | `src/`               | `.github/copilot-instructions.md` |
  | `package.json`       | `.github/instructions/*.md`       |
  | _(only human docs)_  | `llms.txt`                        |
  |                      | `src/`                            |

---

## Slide 2 — Parametric vs. Grounded Knowledge

- **Define the two types of knowledge** an AI agent can draw from:
  - **Parametric** — baked into model weights during training. General patterns, public API syntax, common idioms. _Not your project's truth._ Fixed at training cutoff.
  - **Grounded** — injected at runtime from the repo itself. Private interfaces, local conventions, real-time state via AGENTS.md and instruction files. Synchronized with current commit.
- **Key stat to land (Vercel, Jan 2026):** Agents skip framework docs **44% of the time** because they think they already know the answer — the "Decision Gap." ([Vercel Blog: AI Agent Evaluations](https://vercel.com/blog/ai-agent-evaluations))
- When agents can't find grounded context, they guess. And they guess _confidently_. The result: code that compiles but violates your conventions.
- Emphasize: if your repo doesn't provide grounded context, the agent _will_ make it up.

---

## Slide 3 — The Silent Killer: Context Rot

**Two-panel layout:**

### Left Panel — Context Window Zones (Chart)

- Walk through the **four zones** visually:
  - **🟢 0–50%** fill: Safe zone — all instructions retained.
  - **🟡 50–80%**: Compression zone — agent starts summarizing, losing nuance.
  - **🔴 80–95%**: Danger zone — nuanced rules discarded outright.
  - **💀 95%+**: Context rot — silent auto-compaction, conventions lost.

### Right Panel — The Ticking Bomb

- Even with large context windows, agents auto-compact. **Architecture rules are the first to go.**
  - **Silent failure mode** — the agent doesn't signal that it has lost context.
  - **Code compiles but violates patterns** — passes syntax checks, breaks conventions.
  - **Tests pass; Architecture fails** — basic tests don't catch convention violations.
- This is why we need _structured_ context, not just throwing everything into the window.

---

## Slide 4 — Two Models of Context Delivery

**Two-panel layout:**

### Passive Steering (Push)

- **Files:**
  - `AGENTS.md`
  - `copilot-instructions.md`
  - `.instructions.md`
- **How it works:** Always present in system prompt. The agent never decides whether to look for these instructions — they're pre-loaded.
- **Strengths:** Eliminates the Decision Gap. High reliability for small context.

### Active Retrieval (Pull)

- **Tools:**
  - `read_file`
  - `grep_search`
  - `semantic_search`
- **How it works:** Agent decides what to search. Necessary for scale in large codebases.
- **Vulnerability:** Agents skip documentation 44% of the time — vulnerable to "skipping" docs when they believe parametric knowledge is sufficient.

**Guiding principle:** "Passive ensures reliability. Active enables scale." The key insight from Vercel: **passive eliminates the Decision Gap**. The agent can't skip what's already in its prompt.

---

## Slide 5 — Vercel: Passive Steering Wins

- **Present the Vercel benchmark data** (horizontal bar chart — Vercel Agent Eval Results, Jan 2026):
  - Baseline (README only): **53%** success
  - Active Skills (RAG/Pull alone): **53%** — _no improvement!_ Agents only invoked skills 56% of the time.
  - Skills + Prompting: **79%**
  - Passive (AGENTS.md): **100% success**
- **Key takeaway:** Passive context (AGENTS.md) **removed the decision point entirely**, reaching 100% success. A compressed 8KB AGENTS.md passive index beat everything.
- RAG alone didn't help — the agent needs to _know what to look for_ before it can search effectively. Skills weren't even invoked 56% of the time.

---

## Slide 6 — Five Pillars of AI-Native (Pillars 1–3)

- Introduce the **Five Pillars** framework — the architecture of an AI-Native repo:
  1. **Unified Knowledge** — Single source of truth in `AGENTS.md` + `copilot-instructions.md`. One root file that every agent reads.
  2. **Scoped Precision** — Glob-matched `.instructions.md` files (e.g., `applyTo: '**/*.tsx'`) for token efficiency. Don't send backend rules to the frontend agent.
  3. **Monorepo Mastery** — Nested routing with precedence. Root router + nested `AGENTS.md` per package/workspace. Each domain gets its own context.
  4. **AI-Readable Docs** — `llms.txt` + structured README with headings optimized for bot crawling.
  5. **Living Maintenance** — Validation scripts & quarterly audit loops to prevent context drift.
- These five pillars define the _complete architecture_ of how context flows to agents.
- Pillars 1–3 are shown on this slide; Pillars 4–5 continue on the next.

---

## Slide 7 — Five Pillars (Pillars 4–5): Maintenance & Ingestion

- 4. **AI-Readable Docs** — Structured headings + `llms.txt` for efficient bot crawling. Documentation isn't just for humans anymore.
- 5. **Living Maintenance** — CI-integrated audits to prevent context drift. Instructions must evolve with the codebase or they become harmful lies.
- Emphasize: Pillars 4 and 5 are what separate a one-time setup from a _sustainable_ practice.

---

## Slide 8 — Anthropic: Progressive Disclosure

- **Explain Anthropic's layered loading strategy** for Claude Code Skills:
  - **Level 1: YAML Frontmatter** — always loaded, lightweight metadata. Defines _when_ a skill should activate.
  - **Level 2: SKILL.md Body** — loaded _on match_. Contains the actual workflows and logic.
  - **Level 3: Linked Resources** — loaded _on need_. Heavy reference guides and documentation.
- **Key principle:** Progressive disclosure keeps the context window lean. Only load what's needed, when it's needed.
- This is how you scale to hundreds of skills without blowing the context budget.

---

## Slide 9 — The MCP + Skills Architecture

- **Use the chef analogy** to make it concrete:
  - **MCP = The Kitchen** — data connectivity, tool access, API state. The infrastructure layer.
  - **Skills = The Recipes** — logic, conventions, behavioral expertise. The execution layer.
  - **Agent = The Chef** — orchestrates kitchen + recipes to produce results.
- **Formula:** Chef (Agent) + Kitchen (MCP) + Recipes (Skills) = Deterministic Repository Success.
- MCP without skills is a kitchen with no recipes. Skills without MCP is recipes with no ingredients.

---

## Slide 10 — Tooling: Copilot vs. Devin

- **Compare the two ends of the agent spectrum:**
  - **GitHub Copilot** — IDE plugin, ~200K window, <1s latency. Uses `copilot-instructions.md`.
  - **Cognition Devin** — autonomous agent, 10M+ window, >10s latency. Uses AGENTS.md.
- **Unifying point:** Despite radically different architectures, _both_ benefit from Passive Steering and the Five Pillars.
- The takeaway: invest in context engineering once, get returns across every tool in your stack.

---

## Slide 11 — The Academic Reality Check

- **Present three key studies:**
  - **Vercel (2026):** Tested novel API tasks → **100% success** with passive context.
  - **ETH Zürich (SWE-BENCH):** Standard bug-fix tasks → only marginal gains from context engineering. _The model already knows this stuff._
  - **ETH Zürich (Instruction Compliance):** Tool use was **1.6x more frequent** with proper context → agents _behave better_.
- **Conclusion:** Focus on **tribal knowledge** — the stuff your team knows but isn't in public docs. Don't waste tokens on auto-generated public API docs the model already has in its weights.

---

## Slide 12 — Monorepo: Nearest-File Routing

- **Explain the routing mechanism:** When an agent edits `/frontend/Button.tsx`, it loads:
  1. `/frontend/AGENTS.md` (local override)
  2. `/Root/AGENTS.md` (global fallback)
- **"Zero Leakage"** principle: No backend rules bleed into frontend agent context. Each domain stays clean.
- This matters for token budget _and_ correctness — conflicting rules from the wrong domain cause hallucinations.

---

## Slide 13 — The Hybrid Strategy Stack

- **Present the 5-layer stack** (bottom to top):
  - **L1: PASSIVE** — Foundation (AGENTS.md)
  - **L2: PASSIVE** — Scoped Rules (.instructions.md)
  - **L3: PASSIVE** — Docs Layer (llms.txt, Headings)
  - **L4: ACTIVE** — Vertical Workflows (Skills, MCP)
  - **L5: ACTIVE** — Large-Scale Navigation (Grep, Search)
- **Key stat:** "90% of architectural ROI is in Layers 1 and 2." Start there.
- This stack gives teams a clear adoption path — don't try to do everything at once.

---

## Slide 14 — The Passive Steering Flow

- **Walk through the 4-step flow** visually:
  1. **Open File** — Developer opens `Button.tsx`
  2. **Glob Match** — IDE matches `**/*.tsx` pattern
  3. **Injection** — AGENTS.md + scoped rules injected into context
  4. **Alignment** — Agent has pre-loaded rules _before the developer even types_
- **Punchline:** "By the time the dev types, context is already live."
- Zero friction, zero ceremony — the developer doesn't even know it's happening.

---

## Slide 15 — Readiness Maturity Model

- **Frame this as a self-assessment** for teams:
  - **Level 1:** Functional — builds and tests run.
  - **Level 2:** Documented — AGENTS.md added.
  - **Level 3:** Standardized — scoped routing active.
  - **Level 4:** Optimized — Skills & MCP live.
  - **Level 5:** Autonomous — CI metrics validated.
- Ask the audience: "Where is your repo today?"
- Most teams are at Level 1. Getting to Level 2 takes 15 minutes.

---

## Slide 16 — The 15-Minute Audit

- **Make it immediately actionable** with two phases:
  - **Phase 1 — Foundation:** Create AGENTS.md, add run commands, set global instructions.
  - **Phase 2 — Scoping:** Create scoped directories, add framework instruction files, define glob patterns.
- **Litmus test:** "Ask the agent 'How do I build?' and verify the answer." If it's wrong, your context engineering has gaps.
- This should feel achievable — 15 minutes to get to Level 2 on the maturity model.

---

## Slide 17 — Inside AGENTS.md

- **Outline the five sections** every AGENTS.md should contain:
  1. Project Overview & Stack
  2. Setup & Execution Commands
  3. Code Style & Conventions
  4. Test & Validation Suite
  5. Tribal Knowledge Pitfalls
- **The 8KB Rule:** An 8KB compressed index beats 40KB of verbose documentation. **Concise > Comprehensive.**
- Agents don't need prose — they need structured, scannable, unambiguous instructions.

---

## Slide 18 — Action Plan: Go AI-Native

- **Three-horizon call to action:**
  - **TODAY:** Create AGENTS.md. Add build commands.
  - **THIS WEEK:** Scope framework rules. Route your monorepo.
  - **THIS MONTH:** Track CI ROI. Set quarterly audits.
- **Closing line:** _"The Repo Is The Context."_
- Leave the audience with the spec reference: `github.com/agents-md/spec`
- End strong — this isn't about AI hype, it's about engineering discipline applied to a new consumer of your codebase.
