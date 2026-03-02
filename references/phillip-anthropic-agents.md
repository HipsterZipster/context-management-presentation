Philipp Schmid
@\_philschmid

Source: https://x.com/_philschmid/status/2026354033418547444

An `AGENTS(.)md` (or equviliant) is the highest configuration point for agents. It's injected into every conversation. But research shows that doing it wrong actively hurts performance. Here's how to do it right, backed by data.

Less Is More:

- Auto-generated files reduce success rates by ~3% while increasing inference cost by over 20%
- Human-written files only marginally improve performance on benchmarks (~4%)
- Stronger models don't generate better context files.
- Codebase overviews in files don't help agents navigate faster.
- LLM-generated files are redundant with existing docs.
- Instructions ARE followed. Agents respect file instructions, but unnecessary requirements make tasks harder.

What to Include:

- WHAT: Your tech stack, project structure, and what each part does. Critical for monorepos.
- WHY: The purpose of the project and its key components. Help the agent understand intent, not just structure.
- HOW: How to build, test, and verify changes. Include non-obvious tooling (e.g., `uv` instead of `pip`, `bun` instead of `npm`). Tools mentioned in AGENTS(.)md get used 160x more often than unmentioned ones.

What NOT to Include:

- Detailed codebase overviews or directory listings. The paper found these don't help agents navigate faster, and agents can discover structure themselves.
- Code style guidelines. Use linters and formatters instead, they're faster, cheaper, and deterministic.
- Task-specific instructions that only apply sometimes. - Auto-generated content. Don't let the agent write its own without review. The data shows this hurts more than it helps.

How to Structure It:

- Keep it short. General consensus is <300 lines; HumanLayer keeps theirs under 60 lines. Every line goes into every session, make each one count.
- Use progressive disclosure. Don't put everything in Instead, keep task-specific docs in separate files (e.g., `agent_docs/running_tests.md`) and list them with brief descriptions so the agent reads them only when relevant.
- Pointers over copies. Reference `file:line` locations rather than embedding code snippets that will go stale.
- Write it yourself, deliberately. A bad line cascades into bad plans, bad code, and bad results across every session.
