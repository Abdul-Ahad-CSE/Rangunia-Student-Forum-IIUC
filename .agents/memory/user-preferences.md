---
type: user
created: 2026-07-18
updated: 2026-11-26
---

# User Preferences

## Prompt Generation Instructions
- Always format task prompts following the 9 standardized instructions:
  1. Slash-Command Skill Tags (`/coordinator-mode /orchestrate ...`)
  2. Standardized Header Block (Project, Current Status, Role, Task Details)
  3. One-Task-at-a-Time Workflow with numbered Step-by-Step Execution Instructions
  4. Root cause and design analysis before the prompt block
  5. Strict scope isolation (do not alter unrelated modules/auth)
  6. Non-generic modern UI & project standards
  7. Progress tracking in `plan.md` (numbered phase with sub-checkboxes and bullet points)
  8. Automated git execution (`git add . && git commit -m "..." && git push`)
  9. Single copy-paste code block delivery for Anti-Gravity IDE
- See `prompt-generation-rules.md` for full details.
