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
- [x] Phase 4: Core Profile Schema & Granular Admin Roles
  - Normalized database schema by expanding `User` model for common forum attributes (`studentId`, `email`, `passwordHash`, `fullName`, `photoUrl`, `gender` enum, `department`, `session`, `bloodGroup`, `phone`, `address`, `socialLinks` JSON, `bio`, and visibility toggles).
  - Established 1:1 split profile architecture with `StudentProfile` (semester, cgpa, skills array, interested sector, club role) and `AlumniProfile` (company, position, industry, location, experience, graduation year, higher study details, and mentorship availability toggles).
  - Implemented `ProfileUpdateRequest` model with draft payload (`requestedData` JSON), status enum (`PENDING`, `APPROVED`, `REJECTED`), and reviewer admin notes for request-based moderation.
  - Enhanced `AdminUser` model with 4 granular capability flags (`canManageProfiles`, `canPostNotices`, `canManageEvents`, `canManageEmergency`).
  - Synchronized updated schema directly with Neon PostgreSQL (`prisma db push`) and generated Prisma Client.
  - Developed Super Admin Capability Management Center (`/admin/super/permissions`) protected by root middleware and server-side session authentication.
  - Implemented interactive capability toggle matrix with optimistic state updates, batch granting/revoking, and server actions (`updateAdminPermissionsAction`).
- [x] Phase 5: Student & Alumni Registration and Login
  - Configured segmented navigation and authentication routing with a prominent "Sign In" trigger and "Join Forum" registration gateway.
  - Implemented the 4-role authentication portal (`/login`) supporting Student, Alumni, General Executive, and Super Admin with contextual badges, placeholders, and error boundaries.
  - Designed the 3-role registration selection hub (`/register`) explicitly excluding Super Admin and directing candidates to dedicated onboarding flows.
  - Built mobile-responsive Student Registration (`/register/student`) with Zod validation, native photo file upload with client-side Base64 preview, and top-of-form Gender Privacy Gatekeeper (cute Framer Motion bounce, rose glow, Sonner toast notification, and unselectable female state).
  - Built dedicated Alumni Registration (`/register/alumni`) capturing employment, industry, work location, and career details with the identical top-level Gender Privacy Gatekeeper.
  - Expanded Auth.js (`src/auth.ts`) and `loginWithCredentialsAction` to authenticate `prisma.user` members (matching bcrypt hash, computing role, verifying active status, and directing to `/profile`).
  - Implemented authenticated `/profile` Server Component wrapped in `<React.Suspense>` rendering role-specific profile overviews and interactive updates (`StudentProfileForm` and `AlumniProfileForm`) wired to transactional Prisma updates.
  - **Auth Scoping & Admin Approvals Updates:**
    - Fixed NextAuth cross-portal login bug by enforcing strict loginType scoping.
    - Added Admin Approval dashboard for Students/Alumni protected by canManageProfiles flag.
    - Secured Auth.js authorize callback to strictly block logins for PENDING accounts
    - Updated registration forms to act as requests without auto-login
    - Added 'Waiting for approval' frontend notification on login attempt
    - Refined student registration fields (removed university, added present/permanent address), split profile into unchangeable identity header and editable academic section, and implemented direct-save PDF CV upload.
- [ ] Phase 6: Request-Based Data Entry System (Draft submission & Admin approval)
- [ ] Phase 7: Notice & Event Modules (Role-protected)
- [ ] Phase 8: Public Directory & Smart Search (Gender-isolation & Privacy masking)
