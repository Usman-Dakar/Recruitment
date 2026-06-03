# Project Plan — Job Portal React Replication
**Source:** https://ax-jobs.dakarhr.com  
**Date:** 2026-05-21  
**Version:** 1.0  

---

## 1. PROPOSED TECH STACK

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Frontend** | React 18 + TypeScript | Modern, type-safe, component-driven |
| **Routing** | React Router v6 | Client-side routing, matches original URL structure |
| **State Management** | Zustand or React Context | Lightweight; search filters + auth state |
| **Styling** | Tailwind CSS + shadcn/ui | Faster than Bootstrap 3, modern, accessible |
| **Forms** | React Hook Form + Zod | Mirrors original jQuery Validate logic with schemas |
| **HTTP Client** | Axios or fetch | AJAX calls matching original API behavior |
| **Backend** | Node.js + Express + TypeScript | Replicate all original endpoints |
| **Database** | PostgreSQL + Prisma ORM | Structured job/user data |
| **Auth** | Passport.js (Local + OAuth2) | Google, Microsoft, LinkedIn strategies |
| **Pagination** | Custom hook | Replace jQuery `.paginate()` |
| **Build** | Vite | Fast dev server, replaces bundled scripts |

---

## 2. REACT APPLICATION STRUCTURE

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Top nav + Register/Login buttons
│   │   ├── Sidebar.tsx          # Left sidebar navigation (Theme 2)
│   │   ├── Footer.tsx
│   │   └── LoadingSpinner.tsx   # Full-page overlay
│   ├── modals/
│   │   ├── MessageModal.tsx     # Generic small message modal
│   │   ├── ConfirmModal.tsx     # Yes/No confirm modal
│   │   ├── LargeMessageModal.tsx
│   │   └── HelpModal.tsx        # Embeds help.dakarhr.com
│   ├── search/
│   │   ├── SearchForm.tsx       # All 6 filter dropdowns
│   │   ├── DepartmentSelect.tsx # Hierarchical optgroups
│   │   ├── TagSelect.tsx        # Multi-tag select (Industry + Job Category)
│   │   └── SearchResults.tsx    # Job card list + pagination
│   ├── jobs/
│   │   ├── JobCard.tsx          # Single job listing card
│   │   └── JobDetail.tsx        # Full job detail (future)
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── OAuthButtons.tsx     # Google, Microsoft, LinkedIn
│   ├── contact/
│   │   └── ContactForm.tsx
│   └── common/
│       ├── Accordion.tsx        # Reusable accordion
│       ├── CookieConsent.tsx
│       └── Pagination.tsx       # Custom pagination component
├── pages/
│   ├── HomePage.tsx             # Hero + search + categories
│   ├── VacancySearchPage.tsx    # Sidebar layout + filters + results
│   ├── LoginPage.tsx            # Login + Register tabs
│   ├── InformationPage.tsx      # Accordion: Career Dev, Links, Provisions
│   ├── AboutUsPage.tsx          # Accordion: Mission, Beliefs
│   └── ContactUsPage.tsx        # Form + Details accordion
├── hooks/
│   ├── useJobSearch.ts          # Search logic, debounce, pagination
│   ├── useAuth.ts               # Auth state, session health check
│   └── useTagSelect.ts          # Multi-tag select logic (max 5, dedup)
├── services/
│   ├── jobService.ts            # GET /api/jobs/search
│   ├── authService.ts           # Login, register, session check
│   └── contactService.ts        # POST /api/contact
├── store/
│   ├── searchStore.ts           # Zustand: filter state
│   └── authStore.ts             # Zustand: user session
├── types/
│   ├── job.types.ts
│   ├── search.types.ts
│   └── auth.types.ts
├── data/
│   ├── departments.ts           # All dept option data with IDs
│   ├── experienceLevels.ts
│   ├── educationLevels.ts
│   ├── employmentTypes.ts
│   ├── industries.ts
│   └── jobCategories.ts
└── App.tsx                      # Router setup
```

---

## 3. BACKEND API STRUCTURE

```
server/
├── routes/
│   ├── jobs.ts          # GET /api/jobs/search
│   ├── auth.ts          # POST /api/auth/login, register, logout
│   ├── oauth.ts         # /api/auth/google, microsoft, linkedin callbacks
│   ├── contact.ts       # POST /api/contact
│   └── session.ts       # GET /api/session/check
├── controllers/
├── middleware/
│   ├── auth.middleware.ts
│   └── validate.middleware.ts
├── models/
│   ├── Job.ts
│   ├── User.ts
│   └── Application.ts
└── prisma/
    └── schema.prisma
```

**API Endpoints to build:**

| Method | Route | Maps to original |
|--------|-------|-----------------|
| GET | `/api/jobs/search` | `/discoverjob/searchjobs` |
| GET | `/api/session/check` | `/userauthentication/checkclient` |
| POST | `/api/auth/login` | Form POST on login |
| POST | `/api/auth/register` | Form POST on register |
| POST | `/api/auth/logout` | Session destroy |
| GET | `/api/auth/google` | `/authenticate/login/google` |
| GET | `/api/auth/google/callback` | Google redirect |
| GET | `/api/auth/microsoft` | `/authenticate/login/microsoft` |
| GET | `/api/auth/microsoft/callback` | Microsoft redirect |
| GET | `/api/auth/linkedin` | `/authenticate/login/linkedin` |
| GET | `/api/auth/linkedin/callback` | LinkedIn redirect |
| POST | `/api/contact` | `/userauthentication/contactus/` |

---

## 4. DEVELOPMENT PHASES & TIMELINE

### Phase 0 — Setup & Foundation
**Duration: 1–2 days**

| Task | Description |
|------|-------------|
| 0.1 | Create React + TypeScript + Vite project |
| 0.2 | Install and configure Tailwind CSS |
| 0.3 | Install shadcn/ui component library |
| 0.4 | Set up React Router v6 with all routes |
| 0.5 | Set up Express backend project |
| 0.6 | Configure PostgreSQL + Prisma schema |
| 0.7 | Set up project folder structure |

**Deliverable:** Empty app with all routes navigating and database connected.

---

### Phase 1 — Static Data & Dropdown Enums
**Duration: 1 day**

| Task | Description |
|------|-------------|
| 1.1 | Create `departments.ts` with all 26 dept options + parent/child hierarchy |
| 1.2 | Create `experienceLevels.ts` — 9 options (IDs 229–237) |
| 1.3 | Create `educationLevels.ts` — 23 options (IDs 199–221) |
| 1.4 | Create `employmentTypes.ts` — 6 options (IDs 193–313) |
| 1.5 | Create `industries.ts` — 145 options (IDs 47–191) |
| 1.6 | Create `jobCategories.ts` — 12 options (IDs 11–29) |

**Deliverable:** All dropdown data as typed TypeScript constants.

---

### Phase 2 — Layout & Navigation
**Duration: 2 days**

| Task | Description |
|------|-------------|
| 2.1 | Build `Navbar` for Theme 1 (Home page) — logo, links, Register/Login |
| 2.2 | Build `Sidebar` + `Navbar` for Theme 2 (inner pages) — left panel, top bar |
| 2.3 | Build `Footer` component |
| 2.4 | Build `LoadingSpinner` full-page overlay |
| 2.5 | Build `CookieConsent` top banner |
| 2.6 | Build 3 Modal components: Message, Confirm (Yes/No), Large Message |
| 2.7 | Build `Accordion` reusable component with auto-open first, hash-scroll |
| 2.8 | Build responsive mobile hamburger menu |

**Deliverable:** Full shell layout for all pages, modals wired up.

---

### Phase 3 — Search Form & Filter Logic
**Duration: 3 days**

| Task | Description |
|------|-------------|
| 3.1 | Build `DepartmentSelect` — hierarchical select with optgroup rendering |
| 3.2 | Build `TagSelect` — multi-select with `+` button, tag chips, `x` remove, max 5, dedup logic |
| 3.3 | Build `SearchForm` assembling all 6 filters + free text |
| 3.4 | Build `useTagSelect` hook — manages `selectedIds`, `selectedItems` arrays |
| 3.5 | Build `useJobSearch` hook — constructs query, calls API, manages loading/error state |
| 3.6 | Build `SearchResults` — renders job cards list or "No Record found" |
| 3.7 | Build `Pagination` component — 10 visible page numbers, calls `loadPage()` |
| 3.8 | Build `JobCard` component — title, dept, type, date, brief |

**Deliverable:** Fully functional search form with tag chips and pagination.

---

### Phase 4 — Home Page
**Duration: 2 days**

| Task | Description |
|------|-------------|
| 4.1 | Hero section — background image, headline text, global search bar |
| 4.2 | `GlobalSearchJob` logic — sync hero input to filter form, trigger search, scroll to results |
| 4.3 | Category quick-filter buttons (12) — navigate with pre-set category ID |
| 4.4 | Offcanvas Filter sidebar — slide-in/out with overlay |
| 4.5 | Sort sidebar — UI-only for now |
| 4.6 | "Clear All" — reset all filters |
| 4.7 | Wire search results `#jobHolder` equivalent below hero |

**Deliverable:** Complete home page matching original layout and behavior.

---

### Phase 5 — Vacancy Search Page
**Duration: 1 day**

| Task | Description |
|------|-------------|
| 5.1 | Left 3-col panel with `SearchForm` |
| 5.2 | Right 9-col panel with `SearchResults` + `Pagination` |
| 5.3 | Handle `/discoverjob/index/:categoryId` route — pre-select job category |
| 5.4 | Help button in top-right opening `HelpModal` |

**Deliverable:** Vacancy Search page fully functional.

---

### Phase 6 — Authentication Pages
**Duration: 3 days**

| Task | Description |
|------|-------------|
| 6.1 | Build `LoginPage` with Login and Register tabs |
| 6.2 | `LoginForm` — UserName, pass, remember checkbox, Forgot Password link, Cancel |
| 6.3 | `RegisterForm` — FirstName, LastName, DisplayName, Email, Sign Up |
| 6.4 | `OAuthButtons` — Google, Microsoft, LinkedIn styled buttons |
| 6.5 | Backend: `POST /api/auth/login` with bcrypt password verification |
| 6.6 | Backend: `POST /api/auth/register` — passwordless email-only creation |
| 6.7 | Backend: Passport.js Google OAuth2 strategy |
| 6.8 | Backend: Passport.js Microsoft OAuth2 strategy |
| 6.9 | Backend: LinkedIn OAuth2 manual flow (code exchange POST) |
| 6.10 | `GET /api/session/check` → returns `{ luid: number }` |
| 6.11 | Hash routing: `#register` auto-switches to Register tab |
| 6.12 | `useAuth` hook + `authStore` for session state |

**Deliverable:** Full login, register, and OAuth flows working.

---

### Phase 7 — Static Content Pages
**Duration: 1 day**

| Task | Description |
|------|-------------|
| 7.1 | `InformationPage` — 3 accordions: Career Development, Links, General Provisions |
| 7.2 | `AboutUsPage` — 2 accordions: Our Mission, Our Beliefs |
| 7.3 | `ContactUsPage` — Contact form + Contact Details accordion |

**Deliverable:** All 3 static pages complete.

---

### Phase 8 — Contact Form & Validation
**Duration: 1 day**

| Task | Description |
|------|-------------|
| 8.1 | `ContactForm` with React Hook Form + Zod schema |
| 8.2 | Zod schema: Name (req, max 40), Email (req, email, max 100), Tel (req, max 25), Message (req, max 250) |
| 8.3 | Error messages matching original exactly |
| 8.4 | `POST /api/contact` backend endpoint |
| 8.5 | On success: clear Telephone and Message, show success modal |
| 8.6 | On failure: show "An error has occurred" modal |

**Deliverable:** Contact form with full validation and submission.

---

### Phase 9 — Backend: Job Search API
**Duration: 2 days**

| Task | Description |
|------|-------------|
| 9.1 | Prisma schema: Job, Department, JobCategory, ExperienceLevel, EducationLevel, EmploymentType, Industry |
| 9.2 | Seed database with all dropdown reference data |
| 9.3 | `GET /api/jobs/search` — filter by all params, paginate (50/page) |
| 9.4 | Return JSON (not HTML fragment like original) |
| 9.5 | `jobTotalRecords` in response for pagination |
| 9.6 | Seed sample job data for testing |

**Deliverable:** Search API returning real data, pagination working end-to-end.

---

### Phase 10 — Polish & Testing
**Duration: 2 days**

| Task | Description |
|------|-------------|
| 10.1 | Responsive design audit — mobile, tablet, desktop |
| 10.2 | Loading states on all async operations |
| 10.3 | Error boundary components |
| 10.4 | Session health check integration (matches `loginHealth()` original) |
| 10.5 | `window.onbeforeunload` loading spinner |
| 10.6 | Cross-browser test (Chrome priority per original spec) |
| 10.7 | Form accessibility audit (labels, ARIA) |
| 10.8 | Code cleanup and TypeScript strict mode fixes |

**Deliverable:** Production-ready, tested application.

---

## 5. TOTAL TIMELINE SUMMARY

| Phase | Description | Days |
|-------|-------------|------|
| 0 | Setup & Foundation | 1–2 |
| 1 | Static Data | 1 |
| 2 | Layout & Navigation | 2 |
| 3 | Search Form & Filter Logic | 3 |
| 4 | Home Page | 2 |
| 5 | Vacancy Search Page | 1 |
| 6 | Authentication | 3 |
| 7 | Static Content Pages | 1 |
| 8 | Contact Form | 1 |
| 9 | Job Search API | 2 |
| 10 | Polish & Testing | 2 |
| **Total** | | **19–20 days** |

> Working estimate for a solo developer. With a team of 2, compress to ~10–12 days.

---

## 6. DECISIONS NEEDED BEFORE STARTING

| # | Decision | Options | Impact |
|---|----------|---------|--------|
| D-01 | Will you use the original backend API or build a new one? | Use original (proxy) vs. build new | Affects Phase 9 entirely |
| D-02 | Target users for authentication in new app? | Keep OAuth client IDs or register new ones | Phase 6 |
| D-03 | Deploy platform? | Vercel, Railway, AWS, Azure | DevOps setup |
| D-04 | Database: use original data or start fresh? | Migrate/seed vs. mock data | Phase 9 |
| D-05 | Candidate dashboard (post-login) in scope? | Yes / No / Phase 2 | Scope of Phase 6+ |
| D-06 | Multi-language in scope for v1? | EN only vs. EN + Arabic/other | All phases |
| D-07 | Admin portal in scope? | Yes / No / Later | Large separate project |

---

## 7. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Original API unreachable (CORS, auth) | High | High | Build own backend from day 1 |
| Authenticated pages (dashboard, apply) are unknown | Medium | Medium | Defer to Phase 2 of project |
| LinkedIn OAuth client ID may be tied to original domain | Medium | Medium | Register new LinkedIn app |
| Job data empty (no vacancies posted) | High | Low | Use seed/mock data for dev |
| `section=2` param has unknown server-side behavior | Low | Low | Include param, test both values |

---

## 8. COMPONENT PRIORITY ORDER

For minimum viable product (MVP) — what to build first:

```
1. Navbar + Layout Shell
2. Home Page Hero + Search Bar
3. SearchForm with all dropdowns
4. TagSelect (Industry + Job Category multi-select)
5. Job Search API + JobCard + Pagination
6. Vacancy Search Page
7. Login + Register Page + OAuth
8. Contact Form
9. Information, About Us, Contact Us pages
10. Polish
```

---

## 9. NOTES ON IMPROVEMENTS OVER ORIGINAL

The original site has several issues we should fix in the React version:

| Original Issue | React Fix |
|----------------|-----------|
| Entire JS block duplicated twice in HTML | Single clean component |
| jQuery Validate for forms | React Hook Form + Zod schemas |
| HTML fragments returned from search API | JSON API + React rendering |
| Synchronous AJAX calls (`async: false`) | Proper async/await |
| `display:none` Industry filter (hidden but in DOM) | Either expose or remove cleanly |
| Sort sidebar not wired to backend | Implement real sort by `datePosted asc/desc` |
| No loading state on page transitions | React Router + Suspense |
| `customErrors mode="Off"` — verbose error pages | Proper error handling |
| Google Chrome only requirement | Modern CSS works in all browsers |
| Typos in DB: "Maintainance", "Resturant", "Employement" | Fix in new data layer |
