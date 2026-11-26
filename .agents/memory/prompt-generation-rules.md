---
type: user-preference
created: 2026-11-26
updated: 2026-11-26
---

# Prompt Generation Rules & Workflow Standards

These rules MUST ALWAYS be followed whenever writing or generating execution prompts for the user in this project:

1. **Start with Slash-Command Skill Tags:**
   Open every prompt with a skill-selection line prioritizing `/coordinator-mode` and `/orchestrate`, followed by relevant specialist tags (e.g. `/database-design`, `/frontend-architecture`, `/frontend-design`, `/nextjs-react-expert`, `/clean-code`, `/tailwind-patterns`).

2. **Standardized Header Block:**
   Always structure the top of the prompt with:
   - **Project:** Rangunia Students Forum (IIUC) Platform
   - **Current Status:** [Current phase/milestone]
   - **Role:** [e.g., Principal Software Engineer and UI/UX Architect / Cloud Architect]
   - **Task Details:** [High-level summary of the task]

3. **One-Task-at-a-Time Workflow:**
   Keep each prompt strictly scoped to a single module, phase, or focused batch of fixes. Break down into clear, numbered **Step-by-Step Execution Instructions** ensuring the codebase remains functional and compiling at every step.

4. **Analyze Before Prompting on Complex/Bug Tasks:**
   Before presenting the prompt block, provide a clear breakdown of the root cause, UI/architectural considerations, and affected files/components.

5. **Strict Scope Isolation:**
   Explicitly instruct the executing agent to modify only the targeted files and components, strictly forbidding changes to unrelated modules, existing UI layouts, form fields, validation logic, or authentication flows.

6. **Non-Generic, Modern UI & Project Standards:**
   Enforce modern, human-designed UI aesthetics (clean typography, no generic AI-slop styling, strict color guidelines, robust mobile responsiveness, zero dead links/dummy handlers).

7. **Track Progress in plan.md:**
   Include an explicit instruction for the agent to update `plan.md` at the end of the task, recording the phase/milestone with a numbered phase, sub-checkboxes, and detailed bullet points documenting technical changes.

8. **Automated Git Execution:**
   Instruct the agent to automatically stage, commit, and push changes (`git add . && git commit -m "..." && git push`) upon task completion without asking for confirmation, keeping the remote repo synchronized in real time.

9. **Single Copy-Paste Code Block Delivery:**
   Deliver the prompt as a single, clean plain-text markdown code block that can be directly copied and pasted into the Anti-Gravity IDE prompt box.
