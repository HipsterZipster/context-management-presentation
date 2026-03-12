---
description: add a new mermaid diagram and a slide that renders with neo fonts and can be turned to pdf
---

Add one new slide to `context-engineering-tech-talk.md` and include one Mermaid diagram for it.

Requirements:

- Fit the existing presentation style, tone, and formatting exactly.
- Insert the new slide in the most logical location in the main deck, not the appendix.
- Keep the total talk coherent for a ~15-minute engineering tech talk.
- Use the existing slide format:
  - `## Slide N: Title _(time)_`
  - one Mermaid code block
  - `> **Speaking Notes:**`
- Renumber subsequent slides if needed.
- The new slide must add genuinely new value and must not repeat existing points.
- The diagram should be visually simple, presentation-friendly, and readable when rendered to SVG.
- Prefer short node labels and strong left-to-right or top-to-bottom flow.
- Do not add comments.
- Keep speaker notes concise but presentation-ready.
- Use `*.instructions.md` consistently; do not use bare `.instructions.md` as the canonical label.
- Use `semantic/code search` instead of tool-specific names like `semantic_search` unless the slide is explicitly product-specific.

Content goal:
Create a new slide on: "[INSERT TOPIC HERE]"

For this new slide:

- Propose a strong slide title
- Write one Mermaid diagram
- Write speaking notes in the same voice as the rest of the deck
- Ensure terminology is consistent with the existing deck:
  - `AGENTS.md`
  - `.github/copilot-instructions.md`
  - `*.instructions.md`
  - passive context
  - active retrieval
  - skills
  - MCP
- Avoid unsupported hard numbers unless they are already sourced in the deck
- Keep the claims practical and defensible

Before finalizing:

- Check for typos, duplicated ideas, and terminology inconsistencies
- Keep naming and file paths consistent with the rest of the deck
- Make sure the new slide strengthens the flow of the talk
- If references are duplicated intentionally, distinguish slide citations from source-note citations
- Match time-horizon capitalization with the deck: `Do Today`, `This Week`, `This Month`
- Keep appendix terminology consistent with the main deck when adding related slides
