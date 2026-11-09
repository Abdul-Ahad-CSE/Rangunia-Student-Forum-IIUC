# Project Plan: Rangunia Students Forum (IIUC) Platform

## Development Rules
*Every completed phase must include detailed bullet points of the technical implementation before being marked complete.*

## Finalized Technology Stack
- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling & UI Components:** Tailwind CSS, shadcn/ui
- **Animations:** Motion (standard UI interactions) + GSAP (cinematic intro sequences; strictly session-based, playing once per new browser session/visit and never on internal navigation)
- **Database & ORM:** PostgreSQL (via Neon DB) + Prisma ORM
- **Deployment Platform:** Vercel

## Roadmap
- [x] Phase 1: Foundation and architecture
  - Initialized Next.js 15 (App Router) with strict TypeScript and Tailwind CSS.
  - Configured `shadcn/ui` for accessible primitive components.
  - Scaffolded strict feature-based directory structure (`src/features`, `src/components`, `src/lib`).
  - Integrated Prisma ORM and successfully connected to Neon DB (PostgreSQL).
  - Drafted initial `schema.prisma` establishing Role-Based Access Control (Super Admin, Admin, Verified Students) and privacy-first profile fields.
- [x] Phase 2: Cinematic landing page
  - Built a mobile-first, performance-optimized Hero section using `iiuc.jpg` as an optimized Next.js background with a dark overlay.
  - Implemented a GSAP-driven cinematic title sequence ("Rangunia Students Forum IIUC") synchronized with the `rsf_logo.png`.
  - Resolved Next.js SSR Hydration FOUC (Flash of Unstyled Content) by forcing the GSAP dark overlay to render on the server (`page.tsx` state coordination).
  - Ensured Framer Motion entrance animations strictly wait for the GSAP intro to signal completion before hydrating and playing.
- [x] Phase 3: Super Admin & Admin Registration/Authentication
  - Configured Auth.js (NextAuth v5) Credentials provider with hardcoded Super Admin authentication from `.env` bypassing the database.
  - Updated `schema.prisma` with `AdminUser` model and `ApprovalStatus` enum (`PENDING`, `APPROVED`, `REJECTED`) and applied migration to Neon DB.
  - Built mobile-responsive `/admin/register` with shadcn/ui and react-hook-form, enforcing gender privacy restriction (female selection disabled with toast notice; male strictly validated).
  - Added `/admin/super` Server Component dashboard protected by role-checking middleware with approval and rejection actions.
  - Enforced login gating preventing `PENDING` administrators from accessing the system until Super Admin approval.
  - **Phase 3 Design & Functional Updates:**
    - **Global Sans-Serif Typography:** Configured `Plus_Jakarta_Sans` globally in `src/app/layout.tsx` and mapped `--font-serif: var(--font-sans)` in Tailwind `@theme inline`, eliminating serif fonts across all headings.
    - **Login Page UI Spacing Fix:** Corrected flexbox layout and vertical breathing room on `/login`, preventing visual overlap between "← Back to Home" link and the shield icon.
    - **Optional Base64 File Upload:** Replaced text URL input in `/admin/register` with an optional native file picker (`FileReader` client-side Base64 conversion, live preview, and clear action), updating Zod schema and Prisma `photoUrl` to `String? @db.Text`.
  - Fixed infinite loading state bug on login page by properly handling Auth.js promise resolution and state resetting.
  - Added cute Framer Motion animation and privacy toast notification for the Female gender option in admin registration.
  - Reordered Admin Registration form UX to place the Gender selection at the top, preventing time-waste for female applicants restricted by privacy rules.
- [ ] Phase 4: Authentication and student profiles (Verification, login, privacy settings).
- [ ] Phase 5: Community features (Events, announcements, blood donor network, job referrals).
- [ ] Phase 6: Administration dashboard (Role-based access, approval workflows, audit logs).
- [ ] Phase 7: Security and performance audit.
