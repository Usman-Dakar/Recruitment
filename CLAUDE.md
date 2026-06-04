# CLAUDE.md — Dakar Recruitment App
> Single source of truth for Claude Code. Read this file IN FULL at the start of every session before touching any code.

---

## 🧠 Memory & Documentation Protocol

This project maintains two living documents. You MUST update both at the end of every session without being asked.

### 1. `docs/PROJECT_STATUS.md` — Session Memory
Update after every session. Use this exact format:

```markdown
# Project Status — Last updated: [DATE]

## ✅ Completed
- [feature/component] [file paths] — one-line note

## 🔄 In Progress
- [feature] — what specifically remains

## 📋 Up Next (in priority order)
1. ...

## ⚠️ Known Issues / Tech Debt
- ...

## 🔗 Decisions Made This Session
- [decision] — reason
```

### 2. `docs/ARCHITECTURE.md` — Architecture Memory
Update whenever a new pattern, folder, convention, or deviation is introduced.
Tracks: folder structure, naming, state management decisions, API patterns, component patterns, and any deliberate departure from bulletproof-react with the reason.

### Session Start Ritual
1. Read `docs/PROJECT_STATUS.md`
2. Read `docs/ARCHITECTURE.md`
3. Say: *"Read project docs. Status: [one line]. Continuing with: [next item from Up Next]."*

### Session End Ritual
1. Update `docs/PROJECT_STATUS.md`
2. Update `docs/ARCHITECTURE.md` if anything changed
3. Say: *"Docs updated. Completed today: [...]. Next session: [...]."*

---

## 📁 Project Overview

**App:** Dakar — Full clone of the Recruitee ATS (Applicant Tracking System)
**Type:** React SPA — admin/recruiter dashboard, no SSR needed
**Source of truth for UI:** The Dakar Obsidian vault (556 screenshots + 9 annotated Excalidraw diagrams + 4 video walkthroughs), documented May 2026
**Reference architecture:** https://github.com/alan2207/bulletproof-react
Study its `/docs/project-structure.md`, `/docs/components.md`, `/docs/state-management.md`, and `/docs/api-layer.md` when making structural decisions.

---

## 🛠 Tech Stack

| Concern | Library |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Bundler | Vite |
| Styling | Tailwind CSS v3 |
| UI Components | Shadcn/ui (copy into `src/components/ui/`) |
| Routing | React Router v6 (data router) |
| Server State | TanStack Query v5 |
| Client/UI State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios (single configured instance) |
| Icons | Lucide React only |
| Charts | Recharts (Analytics module) |
| Testing | Vitest + React Testing Library |
| E2E | Playwright |
| Linting | ESLint + Prettier |

---

## 🗂 Folder Structure

```
src/
├── app/
│   ├── index.tsx           # Entry point, wraps all providers
│   ├── router.tsx          # All routes defined here
│   └── providers.tsx       # QueryClientProvider, RouterProvider, etc.
│
├── components/
│   ├── ui/                 # Shadcn primitives — never modify directly
│   └── layout/
│       ├── Sidebar.tsx     # Collapsible sidebar (see UI spec below)
│       ├── Navbar.tsx      # Top header bar
│       ├── PageWrapper.tsx # Consistent page padding/layout
│       └── index.ts
│
├── features/
│   ├── auth/
│   ├── home/
│   ├── candidates/
│   ├── jobs/
│   ├── mailbox/
│   ├── analytics/
│   ├── talent-pools/
│   ├── acquisitions/
│   ├── marketplace/
│   └── settings/
│       ├── my-account/
│       ├── general/
│       ├── workflow/
│       ├── templates/
│       └── plugins/
│
├── hooks/                  # Shared hooks only (not feature-specific)
├── lib/
│   ├── axios.ts            # Axios instance + auth interceptor
│   ├── query-client.ts     # TanStack Query client config
│   └── utils.ts            # cn(), formatDate(), formatRelativeTime()
│
├── store/
│   ├── ui.store.ts         # sidebar open/closed, active modal
│   └── auth.store.ts       # current user, token, isAuthenticated
│
├── types/
│   ├── api.types.ts        # PaginatedResponse<T>, ApiError, etc.
│   └── index.ts
│
└── pages/                  # Thin route wrappers — logic lives in features/
```

### Feature Module Internal Structure (follow for every feature)
```
features/candidates/
├── components/
│   ├── CandidateList.tsx
│   ├── CandidateFilters.tsx
│   ├── CandidateCard.tsx
│   └── index.ts
├── hooks/
│   ├── useCandidates.ts        # useQuery wrapper
│   ├── useCreateCandidate.ts   # useMutation wrapper
│   └── index.ts
├── services/
│   ├── candidates.service.ts   # All axios calls for this feature
│   └── candidates.mock.ts      # Mock data — mark all with // TODO: replace with API
├── types/
│   └── candidate.types.ts
└── index.ts                    # Public API — only export what other features need
```

---

## 🖥 Platform Modules — Screens & UI Specs

All specs below are derived directly from the Dakar vault screenshots and Excalidraw annotations.

---

### Module 1 — Auth (`features/auth/`)

**Screens:**
- **Login Page** — default landing, SSO options visible
- **Username Login** — email + password form
- **2FA Screen** — 6-digit code entry after password
- **Chatbot widget** — floating chatbot on the login page for access help

**UI Notes:**
- Sidebar, navbar, and widget bar are NOT rendered on auth screens
- After successful login → redirect to Home Dashboard
- Protect all non-auth routes with a `<ProtectedRoute>` wrapper
- Store auth state in `store/auth.store.ts` (user, token, isAuthenticated)

---

### Module 2 — App Shell (`components/layout/`)

**Screens documented:** Sidebar closed, Sidebar opened, Header, Navbar, Widget Bar

**Sidebar behavior (from vault annotations):**
- Two states: **Collapsed** (icons only) and **Expanded** (icons + labels)
- Toggle button within the sidebar controls open/close
- State persisted in `store/ui.store.ts` → `sidebarOpen: boolean`
- Navigation items: Home, Candidates, Jobs, Mailbox, Analytics, Talent Pools, Acquisitions, Marketplace, Settings

**Header:** Fixed top bar — app logo, search bar, notifications bell, user avatar menu

**Widget Bar:** Horizontal bar below navbar on Home showing quick-count widgets (evaluations pending, tasks due, etc.)

---

### Module 3 — Home Dashboard (`features/home/`)

**Sub-views (tabs within Home):** Overview | Calendar | Evaluations | Tasks | Recent Notes | Activity

#### Overview
- Shows sidebar, header, navbar, and widget bar
- Widget bar shows live counts that update based on other actions

#### Calendar
Annotations from vault:
- `CALENDAR SCREEN` — main view
- `New Entry` — clicking a date opens entry modal
- `Full width scroll-able menu on right side` — right panel slides in on entry select
- `Scrollable` — right panel list is scrollable
- `Search` — search within calendar entries
- `After checking 2nd box` → heading changes to **"Request Evaluation"**
- `After Scheduling` — entry appears on calendar grid
- `Day View` — toggle between month / week / day view
- `Evaluation count incremented` — scheduling an evaluation updates the Home widget bar counter
- `Effect of Calendar on Home` — the Home overview updates reactively
- `the CV is applied` — CV can be attached to a calendar entry

#### Evaluations
Annotations from vault:
- `START HERE` — list of requested evaluations is the entry point
- `requested` — initial status label
- `After being dismissed, in the Dismissed table` — dismissed go to a separate table below
- `After being retrieved, back to Requested` — un-dismiss action moves back to Requested
- `Opens both modal at once, with focus on interview questions` — clicking evaluation opens dual-panel view
- `Interview Questions Scroll-able for the selected template` — questions driven by selected template
- `resume` — resume is visible alongside evaluation form
- `Other's Notes unable to edit but deleteable` — own notes editable; other users' notes deleteable only
- `Takes to Overview Tab` — breadcrumb navigates to Overview
- `Takes to evaluation tab` — deep link into evaluation tab
- `More Details` — expandable section in evaluation form
- `Both are Identical except the header` — two evaluation view states share same layout
- `This will move the application to next step` — primary CTA advances candidate in pipeline
- `Task added here` — tasks can be created from within the evaluation form
- `Talent pools get removed` — completing/hiring removes candidate from talent pools automatically
- `Removes the job from side panel` — side panel updates after action
- `Solved Form` — completed evaluation shows a resolved state
- `Moves to next candidate` — after completing, auto-advances to next queued candidate
- `After completion` — completion confirmation state
- `Changes made by guest appeared in the form` — real-time collaborative editing for shared evaluations
- `If multiple people are shared using same link` — shared link supports multiple simultaneous reviewers

#### Tasks
- Global aggregation of tasks from ALL candidate evaluation forms
- Individual evaluation forms only show tasks for that specific candidate
- Tasks have statuses and can be filtered/sorted

#### Recent Notes
- Lists notes from all candidate profiles across the system
- Clicking any note navigates to that candidate's profile
- Own notes are editable inline
- Threaded replies supported

#### Activity
- Full account-wide activity feed
- Notification preference adjustments available from this view

---

### Module 4 — Candidates (`features/candidates/`)

**Annotations from vault:**
- `HOME SCREEN` — navigation link back to home visible in header
- `Applied Filter: Candidate Origin` — active filter shows as chip
- `Referred: Referred` — referral is a filterable origin type
- `Scrollable` — main list scrolls vertically
- `Scrollable and draggable` — column headers are draggable to reorder
- `All columns` — column visibility toggle panel exists
- `Filters change according to the selection` — filter options are dynamic/dependent
- `Can be assigned multiple roles` — multi-role assignment on a candidate record
- `Entry added` — confirmation feedback after adding new candidate
- `It parsed everything automatically` — CV upload triggers auto-parse of name, email, experience

**Key components:**
- `CandidateList` — paginated, filterable, sortable table
- `CandidateFilters` — origin, referral source, status, role; options are dynamic
- `ColumnManager` — drag-to-reorder columns, show/hide toggle
- `CandidateProfile` — full profile view (linked from notes and evaluations)
- `AddCandidateModal` — manual entry OR CV upload with auto-parse

---

### Module 5 — Jobs (`features/jobs/`)

**Annotations from vault:**
- `START HERE` — job list is the entry point
- `Scrollable` (×3) — multiple scrollable regions within job views
- `Draggable` — job list items can be reordered
- `Changes according to the Status Selected` — status dropdown dynamically changes card/list appearance
- `After being published` (×2) — published state changes visual treatment
- `This changed as well` — a secondary element also updates on publish
- `Scrollable with warning modal first` — certain actions (archive, delete) require confirmation modal
- `Location added while adding job automatically got added to General Settings` — ⚠️ cross-module side effect
- `Other steps same as creating job with template` — template creation flow reuses same steps
- `Got Listed` — job appears on public careers page after publishing
- `Clicking on job` — navigates to job detail view
- `Applying through website` — external applicant-facing flow is shown
- `Got listed` — listing confirmation message
- `Notification` — notification triggered on listing
- `This will appear here` — notification appears in the notification center
- `Takes to the workflow tab of same` — deep link from job card to its workflow tab
- `Same as Candidates, but for specific Job` — Pipeline tab = scoped candidate list (reuses Candidates components)
- `Same as Activity on Home, but for specific job` — Activity tab = scoped activity feed
- `Notes for specific job, these don't include notes from the candidates profile` — job notes are separate from candidate notes

**Job detail tabs:** Pipeline | Activity | Notes | (Edit/Settings)

**Key components:**
- `JobList` — filterable list with status-aware visual states
- `JobStatusBadge` — Draft / Published / Archived / Listed
- `CreateJobModal` — create from scratch or from template
- `JobDetail` — tabbed layout container
- `JobPipeline` — scoped candidate list (reuses `CandidateList` with job filter)
- `JobActivity` — scoped activity feed (reuses Activity component with job filter)
- `JobNotes` — job-level notes separate from candidate profile notes

---

### Module 6 — Mailbox (`features/mailbox/`)

**Screens documented:** Inbox list, thread view, compose, folder views

**Key components:**
- `MailboxLayout` — two-panel layout (list + thread)
- `EmailList` — inbox / sent / folder list
- `EmailThread` — full conversation view
- `ComposeModal` — new email composer
- Emails are contextually linked to candidate records and job postings

---

### Module 7 — Analytics (`features/analytics/`)

**Annotations from vault:**
- Visual charts and statistics broken down per job
- `Edit` mode — customize which metrics are shown on the dashboard
- Comparison/benchmarking view (documented via `compete video.webm`)
- Questionnaire response data from Templates feeds into analytics reports

**Key components:**
- `AnalyticsDashboard` — main chart grid
- `JobMetricsChart` — per-job charts using Recharts
- `MetricsFilter` — job selector, date range picker
- `EditMetricsModal` — toggle which metrics are visible

---

### Module 8 — Talent Pools (`features/talent-pools/`)

**Documented via:** `Talent_pools.mp4`

**Key behaviors:**
- Pool list view with candidate count badges
- Manually add candidates to a pool
- When a candidate advances through a job pipeline → **auto-removed from all associated talent pools** (cross-module rule)
- Pool detail shows full candidate list for that pool

---

### Module 9 — Acquisitions (`features/acquisitions/`)

**Documented via:** `acquisition.mp4`

Handles sourcing and intake from external channels (job boards, integrations). Build after core modules are stable.

---

### Module 10 — Marketplace (`features/marketplace/`)

**Documented via:** `marketplace.mp4`

Plugin/integration store — browse available integrations, view plugin detail, enable/disable. Build last.

---

### Module 11 — Settings (`features/settings/`)

Five sub-tabs in the Settings layout.

#### My Account (`features/settings/my-account/`)
- Annotation: `to tick` — toggle/checkbox pattern used throughout
- Profile info, password change, notification preferences

#### General (`features/settings/general/`)
**Annotations from vault:**
- `START HERE` — company info is the first section
- `To edit translation` — locale/translation editing available
- `Nothing if the toggle is off` — toggling a section off hides its content entirely
- `All fields invisible if toggle if off` — full section collapses when toggle is disabled
- `After saving` — success confirmation shown
- `Fields invisible if toggles disabled` — same pattern repeated across multiple sections
- `the list` — scrollable list appears in a sidebar panel
- `Received Email` — email notification preview pane
- `Sidebar on right side` — contextual sidebar slides in from right
- `Comparison of roles` — side-by-side role permission comparison view
- `all others have same General rules` — role groups share inherited permissions
- `with same permissions` — permission grouping display
- `No options available with toggle off` — disabled sections show empty state
- `You need to add referral by going to the specific job and turning on Referals` — referrals are PER JOB, not global
- `Referrals I made` — my referrals list in referral portal
- `Sends to main app` — action cross-links to main Recruitee app
- `Jobs listed in company with referrals enabled` — filtered job list in referral portal
- `After getting referral` — referral received state
- `Recruitment completed on portal after hiring` — end-state for referral tracking
- `After referral getting hired` — hired state shown in referral portal
- `Clicking on profile will open the profile` — user avatar/name is a link

#### Workflow (`features/settings/workflow/`)
**Annotations from vault:**
- `START HERE` — pipeline stage list is the entry point
- `These are used here in job details` — stages defined here appear in job Pipeline tab
- `After making some edit` — inline editing state for stage name
- `Multiple actions can be added` — automations are additive per stage
- `After adding automation` — stage card visually updates to show automation count
- `Same as Tags for candidates` — tag management component is reused
- `Same as other 2` — consistent tag pattern across all three tag types
- `Used in Email templates` — stage names are available as dynamic variables in email templates

**Key components:**
- `WorkflowStageList` — drag-to-reorder pipeline stages
- `StageCard` — individual stage with its automations listed
- `AddAutomationModal` — attach trigger/action automations to a stage
- `TagManager` — reusable component (used for candidate tags, pipeline tags, source tags)

#### Templates (`features/settings/templates/`)
**Annotations from vault:**
- `HERE` — template list entry point
- `as a quick start. Refer here [01_Jobs]` — templates link into job creation flow
- `leaving with unsaved changes` — unsaved changes trigger a confirmation modal before navigating away
- `General templates have Visibility dropdown` — public / private / team-only visibility selector
- `Questionnaires are used in Email templates` — questionnaire fields become variables in email template composer
- `Complete web builder` — full drag-and-drop editor for the careers page

**Template types to support:** Job templates | Email templates | Questionnaire templates | Careers page (web builder)

#### Plugins (`features/settings/plugins/`)
- Plugin listing within settings context (separate from Marketplace browsing)
- Enable/disable toggles per plugin
- Per-plugin configuration screens
- Most recently updated section in vault (screenshots from May 18, 2026)

---

## 🔗 Cross-Module Data Relationships
Hard constraints — the data model and UI must respect all of these:

| Trigger | Effect | Features Involved |
|---|---|---|
| Schedule evaluation in Calendar | Evaluation count increments on Home widget bar | `home/calendar` → `home` |
| Add location when creating a Job | Location auto-added to General Settings | `jobs` → `settings/general` |
| Define Workflow Stage in Settings | Stage appears in Job Pipeline tab | `settings/workflow` → `jobs` |
| Define Workflow Stage in Settings | Stage name available as variable in Email templates | `settings/workflow` → `settings/templates` |
| Select job template when creating job | Pre-fills job creation form fields | `settings/templates` → `jobs` |
| Submit questionnaire in evaluation | Data feeds into Analytics reports | `settings/templates` → `analytics` |
| Add task inside Evaluation form | Task appears in Home global Tasks view | `home/evaluations` → `home/tasks` |
| Complete Evaluation form | Advances candidate to next pipeline stage | `home/evaluations` → `jobs` |
| Candidate moved/hired through job pipeline | Candidate auto-removed from all associated Talent Pools | `jobs` → `talent-pools` |
| Note added on Candidate profile | Note appears in Home Recent Notes widget | `candidates` → `home/notes` |
| Enable referral on a specific Job | Job appears in Referral portal job list in General Settings | `jobs` → `settings/general` |

---

## 📐 Coding Rules

### Non-Negotiable
1. **No API calls in components** — only in `features/[name]/services/`
2. **No `useState` for server data** — TanStack Query only
3. **No `any` type** — define proper types or use `unknown` + narrowing
4. **No inline styles** — Tailwind classes only
5. **No modifying Shadcn/ui source files** — wrap them
6. **No logic in page files** — pages compose, features contain logic
7. **No new pattern without documenting it** in `docs/ARCHITECTURE.md`
8. **No session end without updating** `docs/PROJECT_STATUS.md`
9. **No icon library except Lucide React**
10. **Always ask before refactoring** files outside current feature scope

### Component Rules
- Functional components only — no class components
- Named exports only (except page-level route components)
- One component per file
- Keep under 150 lines — extract if larger
- Props interface in same file: `[ComponentName]Props`
- Use `cn()` from `src/lib/utils.ts` for all conditional class merging

### State Rules
- **TanStack Query** → all server/async state
- **Zustand** → UI-only state (sidebar open, active modal, selected tab)
- **URL params** → filter state that should survive page refresh (status, search query)
- **Local `useState`** → purely local, single-component UI only

### Data Fetching Pattern
```typescript
// features/candidates/hooks/useCandidates.ts
export const useCandidates = (filters: CandidateFilters) =>
  useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => candidatesService.getAll(filters),
    staleTime: 1000 * 60 * 5,
  });

// features/candidates/services/candidates.service.ts
export const candidatesService = {
  getAll: (filters: CandidateFilters): Promise<PaginatedResponse<Candidate>> =>
    api.get('/candidates', { params: filters }).then(r => r.data),
};
```

### Form Pattern
```typescript
const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
});
type FormValues = z.infer<typeof schema>;
const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

### Mock Data Rule
- Use mock data until backend is ready
- Mark every mock usage: `// TODO: replace with API — GET /candidates`
- Keep mocks in `features/[name]/services/[name].mock.ts`

---

## ✅ Feature Done Checklist
Before marking any feature complete:
- [ ] TypeScript — zero `any`, all response types defined
- [ ] Loading state — skeleton or spinner while fetching
- [ ] Error state — user-friendly error message, not a crash
- [ ] Empty state — meaningful message when list is empty
- [ ] Form validation — Zod schema with inline error messages
- [ ] All cross-module relationships respected (see table above)
- [ ] `// TODO` comments on every mock data usage
- [ ] `docs/PROJECT_STATUS.md` updated
- [ ] `docs/ARCHITECTURE.md` updated if patterns changed

---

## 📋 Build Order

Build strictly in this sequence:

| # | What | Key outputs |
|---|---|---|
| 1 | **Scaffold** | Vite, tsconfig strict, ESLint, Prettier, `@/` alias, `.env` |
| 2 | **Providers & Router** | `app/providers.tsx`, `app/router.tsx`, QueryClient, Axios instance |
| 3 | **Zustand stores** | `store/auth.store.ts`, `store/ui.store.ts` |
| 4 | **UI Primitives** | Button, Input, Badge, Table, Modal, Dropdown, Avatar, Skeleton, Toast |
| 5 | **App Shell** | Sidebar (collapsible), Navbar, PageWrapper, ProtectedRoute |
| 6 | **Auth** | Login page, Username form, 2FA screen, Chatbot widget |
| 7 | **Home — Overview + Widget Bar** | Dashboard shell, live count widgets |
| 8 | **Home — Calendar** | Entry modal, day/week/month view, CV attachment, evaluation count update |
| 9 | **Home — Evaluations** | Dual-panel evaluation view, dismiss/retrieve, guest collaboration |
| 10 | **Home — Tasks** | Global task list aggregated from all evaluations |
| 11 | **Home — Recent Notes** | Notes feed, click-to-profile, threaded replies |
| 12 | **Home — Activity** | Activity feed, notification preferences |
| 13 | **Candidates** | List, filters, column manager, profile, CV upload + auto-parse |
| 14 | **Jobs** | List, create flow (scratch + template), detail tabs |
| 15 | **Mailbox** | Two-panel inbox, thread, compose |
| 16 | **Analytics** | Charts dashboard, edit mode, comparison view |
| 17 | **Talent Pools** | Pool list, pool detail, auto-remove hook |
| 18 | **Acquisitions** | Sourcing intake UI |
| 19 | **Marketplace** | Plugin browser, plugin detail |
| 20 | **Settings — My Account** | Profile, password, notifications |
| 21 | **Settings — General** | Company config, roles comparison, locations, referral portal |
| 22 | **Settings — Workflow** | Stage list, automations, TagManager |
| 23 | **Settings — Templates** | Job/Email/Questionnaire templates, web builder |
| 24 | **Settings — Plugins** | Plugin config |
| 25 | **Polish** | Responsive, transitions, a11y, loading/error/empty states everywhere |

---

## 💬 Working With Claude Code

- **Scope tightly:** "Build `CandidateFilters` component in `features/candidates/components/`" — not "do candidates"
- **Plan first:** For any task touching more than 2 files, list all files to be created/modified before writing code
- **One step at a time:** Finish and check off the done checklist before moving to the next step
- **Call out cross-module work explicitly:** If a task touches two features (e.g., evaluations updating task count on home), name both sides
- **To start the project, use this exact prompt:**

```
Read CLAUDE.md, docs/PROJECT_STATUS.md, and docs/ARCHITECTURE.md in full.
Confirm you have read them and state the current project status in one sentence.
Then begin Build Step 1: scaffold the project with Vite + React 18 + TypeScript
strict mode + Tailwind CSS v3 + ESLint + Prettier + absolute path alias @/.
List every file you will create and every config you will set before writing any code.
```
