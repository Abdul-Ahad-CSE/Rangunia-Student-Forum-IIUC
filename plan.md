# Project Plan: Rangunia Students Forum (IIUC) Platform

## Finalized Technology Stack
- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling & UI Components:** Tailwind CSS, shadcn/ui
- **Animations:** Motion (standard UI interactions) + GSAP (cinematic intro sequences; strictly session-based, playing once per new browser session/visit and never on internal navigation)
- **Database & ORM:** PostgreSQL (via Neon DB) + Prisma ORM
- **Deployment Platform:** Vercel

## Roadmap
- [x] Phase 1: Foundation and architecture (Folder structure, design system, DB schema, auth architecture conventions).
- [x] Phase 2: Cinematic landing page (GSAP opening title animation, hero section, responsive navigation).
  - *Bug Fix (SSR FOUC & Lifecycle Orchestration):* Rendered full-screen intro overlay on the server to prevent FOUC from millisecond zero; coordinated entrance lifecycle from a single source of truth in `page.tsx` (`introFinished`); hard-hid Hero content using Tailwind `invisible` until intro completion.
- [ ] Phase 3: Authentication and student profiles (Verification, login, privacy settings).
- [ ] Phase 4: Community features (Events, announcements, blood donor network, job referrals).
- [ ] Phase 5: Administration dashboard (Role-based access, approval workflows, audit logs).
- [ ] Phase 6: Security and performance audit.
