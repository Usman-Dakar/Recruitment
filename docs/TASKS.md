# Task Log — Dakar Recruitment App
> Granular record of every task performed. Read this at session start alongside PROJECT_STATUS.md and ARCHITECTURE.md.
> Last updated: 2026-05-20

---

## How to use this file

- Each task has a status badge: ✅ Done | 🔄 Partial | ❌ Not started
- File paths are relative to `src/`
- "Cross-module" notes call out any query invalidation or data dependencies between features
- Check the **Current Gaps** section at the bottom before starting new work

---

## Step 1 — Scaffold ✅

**Goal:** Vite + React 18 + TypeScript strict + Tailwind v3 + ESLint + Prettier + `@/` alias

**Files created:**
- `vite.config.ts` — `@/` alias via `resolve.alias`, `@vitejs/plugin-react`
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — strict mode, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- `tailwind.config.ts` — content paths, `tailwindcss-animate` plugin, custom HSL color tokens
- `postcss.config.js`
- `.eslintrc.cjs` — TypeScript + React rules
- `.prettierrc`
- `src/styles/globals.css` — Tailwind directives + CSS custom properties (brand teal `#00B3B5`)
- `src/vite-env.d.ts`
- `src/test/setup.ts` — Vitest + jest-dom

---

## Step 2 — Providers & Router ✅

**Files created:**
- `src/app/index.tsx` — `createRoot`, mounts `<Providers>`, wrapped with `<ErrorBoundary>` (added Step 25)
- `src/app/providers.tsx` — `QueryClientProvider`, `TooltipProvider`, `RouterProvider`, `<Toaster>`
- `src/app/router.tsx` — `createBrowserRouter`, all lazy routes, SettingsLayout nesting
- `src/lib/axios.ts` — Axios instance, Bearer token interceptor, 401 → clear auth + redirect
- `src/lib/query-client.ts` — `staleTime: 5m`, no retry on 401/403
- `src/lib/utils.ts` — `cn()`, `formatDate()`, `formatRelativeTime()`
- `src/types/api.types.ts` — `PaginatedResponse<T>`, `ApiError`
- `src/types/index.ts`

---

## Step 3 — Zustand Stores ✅

**Files created:**
- `src/store/auth.store.ts` — `user`, `token`, `isAuthenticated`, `setAuth`, `clearAuth` — persisted under `auth-storage`
- `src/store/ui.store.ts` — `sidebarOpen`, `activeModal`, `toggleSidebar`, `setSidebarOpen`, `openModal`, `closeModal` — `sidebarOpen` persisted under `ui-storage`

---

## Step 4 — UI Primitives ✅

**Files created** (`src/components/ui/`):
- `button.tsx` — CVA variants: default/secondary/destructive/outline/ghost/link
- `input.tsx`
- `badge.tsx` — CVA + custom: success/warning/info
- `table.tsx` — Table/Header/Body/Footer/Row/Head/Cell/Caption
- `dialog.tsx` — Radix Dialog with overlay + animation
- `dropdown-menu.tsx` — Full Radix DropdownMenu including checkbox/radio items
- `avatar.tsx` — Radix Avatar, teal fallback initials
- `skeleton.tsx` — `animate-pulse`
- `label.tsx` — Radix Label
- `select.tsx` — Radix Select with scroll buttons
- `separator.tsx`
- `tooltip.tsx` — Radix Tooltip
- `sonner.tsx` — Sonner `<Toaster>`
- `textarea.tsx` — added during Step 14 (Jobs)
- `switch.tsx` — Radix Switch, added during Step 23 (Templates)
- `empty-state.tsx` — reusable empty state, added Step 25
- `query-error.tsx` — reusable error state with retry, added Step 25
- `error-boundary.tsx` — React class ErrorBoundary, added Step 25

---

## Step 5 — App Shell ✅

**Files created/modified:**
- `src/components/layout/Sidebar.tsx` — collapsible (220px ↔ 60px), hamburger toggle at top, grouped nav (Main/Sourcing/Config), active left-border indicator, user footer with sign-out, mobile overlay (fixed + translate-x), responsive backdrop
- `src/components/layout/Navbar.tsx` — logo synced to sidebar width, workspace dropdown, search bar (CTRL+K hint), action icons, user avatar dropdown, mobile hamburger (md:hidden)
- `src/components/layout/PageWrapper.tsx` — `p-6 animate-slide-up`
- `src/components/layout/AppShell.tsx` — Navbar + Sidebar + main outlet, `ScrollRestoration`, mobile backdrop, auto-close sidebar on navigation, `animate-fade-in` on route change via `key={location.pathname}`
- `src/components/layout/ProtectedRoute.tsx` — checks `isAuthenticated`, redirects to `/login` with `<Navigate replace>`
- `src/components/layout/index.ts`
- `src/pages/NotFoundPage.tsx` — polished 404 with icon, "Back to Home" button

**Sidebar nav groups:**
```
Main:     Home, Candidates, Jobs, Mailbox, Analytics, Talent Pools
Sourcing: Acquisitions, Marketplace
Config:   Settings
```

---

## Step 6 — Auth ✅

**Files created** (`src/features/auth/`):
- `types/auth.types.ts` — `LoginInput`, `LoginResponse`, `VerifyTwoFAInput`, `AuthUser`
- `services/auth.mock.ts` — 800ms delay, always `requires2FA: true`, accepts only `000000`
- `services/auth.service.ts`
- `hooks/useLogin.ts` — `useMutation`, calls `setAuth` in `onSuccess` if no 2FA
- `hooks/useVerify2FA.ts` — calls `setAuth` in `onSuccess`
- `hooks/index.ts`
- `components/AuthLayout.tsx` — white left panel + purple right panel
- `components/LoginLanding.tsx` — SSO buttons + "Sign in with username"
- `components/LoginForm.tsx` — RHF+Zod, eye toggle, error message
- `components/TwoFactorForm.tsx` — 6-digit code, demo hint (`000000`)
- `components/ChatbotWidget.tsx` — floating bottom-right
- `index.ts`

**Page:** `src/pages/LoginPage.tsx` — `step: 'landing' | 'login' | '2fa'` state machine, `tempToken` local state

---

## Step 7 — Home Overview + Widget Bar ✅

**Files created** (`src/features/home/`):
- `types/home.types.ts` — `WidgetCounts`
- `services/home.mock.ts` — 400ms delay, static counts
- `services/home.service.ts`
- `hooks/useWidgetCounts.ts` — query key `['home', 'widget-counts']`
- `hooks/index.ts`
- `components/WidgetBar.tsx` — 4 count widgets with Skeleton
- `components/HomeTabNav.tsx` — 6 URL tabs via `useSearchParams` (`?tab=`)
- `components/OverviewContent.tsx` — 4 stat cards + recent activity feed (last 8 items from `useActivityFeed`)

**Page:** `src/pages/HomePage.tsx` — reads `?tab=`, renders matching content, special flex layout for calendar tab

---

## Step 8 — Home Calendar ✅

**Files created:**
- `types/calendar.types.ts` — `CalendarEntry`, `CalendarEntryType`, `NewEntryInput`
- `services/calendar.mock.ts` + `services/calendar.service.ts`
- `hooks/useCalendarEntries.ts`, `hooks/useCreateCalendarEntry.ts`
- `components/CalendarGrid.tsx` — month grid, 7 cols, overflow "+N more"
- `components/CalendarView.tsx` — prev/next/today toolbar, search, month view
- `components/EntryDetailPanel.tsx` — right slide-in panel, scrollable
- `components/NewEntryModal.tsx` — RHF+Zod: title/date/time/type/notes, 2nd checkbox changes heading to "Request Evaluation"

**Cross-module:** Creating evaluation entry invalidates `['home', 'widget-counts']`

---

## Step 9 — Home Evaluations ✅

**Files created:**
- `types/evaluation.types.ts` — `Evaluation`, `EvaluationCandidate`, `InterviewQuestion`, `EvaluationNote`
- `services/evaluations.mock.ts` + `services/evaluations.service.ts`
- `hooks/useEvaluations.ts`, `hooks/useEvaluationMutations.ts`
- `components/EvaluationList.tsx` — requested evals, avatar, dismiss action
- `components/DismissedTable.tsx` — dismissed evals, retrieve action
- `components/EvaluationPanel.tsx` — dual-panel: left = real candidate data (fetches `useCandidateById`), right = form
- `components/EvaluationForm.tsx` — scrollable questions, notes (own/others), "More Details" collapsible, "Move to next step" CTA, "Add task" button
- `components/EvaluationsTab.tsx` — list ↔ panel state, auto-advance after complete

**Cross-module:** Completing eval invalidates `['home', 'widget-counts']`

---

## Step 10 — Home Tasks ✅

**Files created:**
- `types/task.types.ts` — `Task`, `TaskPriority`, `TaskStatus`
- `services/tasks.mock.ts` + `services/tasks.service.ts`
- `hooks/useTasks.ts`, `hooks/useTaskMutations.ts`
- `components/TaskList.tsx` — cycle status via icon click, priority badge, overdue highlight, delete
- `components/TasksTab.tsx` — filter by status, sort priority+due date, count badges
- `components/AddTaskModal.tsx` — RHF+Zod: title/priority/status/due date

**Cross-module:** `EvaluationForm` "Add task" button wired → tasks appear in global Tasks tab (shared `['home', 'tasks']` key)

---

## Step 11 — Home Recent Notes ✅

**Files created:**
- `types/note.types.ts` — `CandidateNote`, `NoteReply`
- `services/notes.mock.ts` + `services/notes.service.ts`
- `hooks/useRecentNotes.ts`, `hooks/useNoteMutations.ts`
- `components/NoteCard.tsx` — inline edit (own), delete, threaded replies (collapsible), click → candidate profile
- `components/RecentNotesTab.tsx` — search filter, sorted newest-first

---

## Step 12 — Home Activity ✅

**Files created:**
- `types/activity.types.ts` — `ActivityItem`, `ActivityType`, `NotificationPref`
- `services/activity.mock.ts` — 13 items across 3 days
- `hooks/useActivityFeed.ts`, `hooks/useNotificationPrefs.ts`
- `components/ActivityFeed.tsx` — day-grouped, type-colored circles, relative timestamps
- `components/NotificationPrefsPanel.tsx` — 6 toggle switches
- `components/ActivityTab.tsx` — feed + prefs panel side-by-side

---

## Step 13 — Candidates ✅

**Files created** (`src/features/candidates/`):
- `types/candidate.types.ts` — `Candidate`, `CandidateFilters`, `CreateCandidateInput`, `CandidateStatus`, `CandidateOrigin`
- `services/candidates.mock.ts` — 8 candidates, client-side filtering, pagination
- `services/candidates.service.ts`
- `hooks/useCandidates.ts` — `useCandidates(filters)` + `useCandidateById(id)`
- `hooks/useCandidateMutations.ts` — `useCreateCandidate`
- `hooks/index.ts`, `components/index.ts`, `index.ts`
- `components/ColumnManager.tsx` — show/hide + drag order, click-outside detection
- `components/CandidateFilters.tsx` — URL search params, search + status + origin selects
- `components/CandidateList.tsx` — dynamic columns, row → profile navigation
- `components/AddCandidateModal.tsx` — manual entry OR CV upload (1.5s auto-parse sim)
- `components/CandidateProfile.tsx` — avatar, status/origin badges, notes (inline edit, add, delete)

**Routes:** `/candidates`, `/candidates/:id`

---

## Step 14 — Jobs ✅

**Files created** (`src/features/jobs/`):
- `types/job.types.ts` — `Job`, `JobStatus`, `JobNote`, `JobActivityItem`, `CreateJobInput`
- `services/jobs.mock.ts` — 6 jobs, `JOB_CANDIDATE_MAP` for pipeline scoping
- `services/jobs.service.ts`
- `hooks/useJobs.ts` — `useJobs(filters)`, `useJobById(id)`
- `hooks/useJobMutations.ts` — create/update/delete/status mutations
- `hooks/index.ts`, `components/index.ts`, `index.ts`
- `components/JobStatusBadge.tsx`
- `components/JobFiltersBar.tsx` — search + status select
- `components/JobList.tsx` — status-bordered cards, archive/delete confirm dialogs
- `components/CreateJobModal.tsx` — scratch form + **"From template" tab** (loads job templates from `useJobTemplates`, pre-fills form on select)
- `components/JobTabNav.tsx` — pipeline/activity/notes URL tabs
- `components/JobPipeline.tsx` — reuses `CandidateList` with `jobId` filter
- `components/JobActivity.tsx` — day-grouped feed
- `components/JobNotes.tsx` — add/delete, Ctrl+Enter submit
- `components/JobDetailHeader.tsx` — status-aware action buttons + confirm dialogs
- `components/JobDetail.tsx`
- `components/JobsView.tsx`

**Routes:** `/jobs`, `/jobs/:id`

**Cross-module:** `CreateJobModal` imports `useJobTemplates` from `@/features/settings/templates` (Settings → Jobs)

---

## Step 15 — Mailbox ✅

**Files created** (`src/features/mailbox/`):
- `types/mailbox.types.ts` — `EmailThread`, `EmailMessage`, `FolderCounts`, `ComposeEmailInput`
- `services/mailbox.mock.ts` — 6 threads (4 inbox, 2 sent)
- `hooks/useMailbox.ts`, `hooks/useMailboxMutations.ts`
- `components/FolderList.tsx` — inbox/sent/drafts/trash with unread badges
- `components/EmailList.tsx` — thread list, bold unread, candidate name chip
- `components/EmailThreadView.tsx` — messages + reply input, auto-mark-read on open, Ctrl+Enter
- `components/ComposeModal.tsx` — RHF+Zod
- `components/MailboxView.tsx` — two-panel, URL-driven folder+thread selection

**Route:** `/mailbox`

---

## Step 16 — Analytics ✅

**Files created** (`src/features/analytics/`):
- `types/analytics.types.ts` — `AnalyticsData`, `AnalyticsFilters`, `MetricId`
- `services/analytics.mock.ts` — deterministic data per date range + job filter
- `hooks/useAnalytics.ts`
- `components/MetricCard.tsx`
- `components/MetricsFilter.tsx` — job select (cross-module: `useJobs`) + date range
- `components/ApplicationsChart.tsx` — Recharts LineChart
- `components/PipelineChart.tsx` — BarChart with Cell colors
- `components/SourceChart.tsx` — BarChart
- `components/TimeToHireChart.tsx` — BarChart
- `components/EditMetricsModal.tsx` — checkbox toggles per metric
- `components/AnalyticsDashboard.tsx` — 4 stat cards + charts grid + edit mode

**Route:** `/analytics`

---

## Step 17 — Talent Pools ✅

**Files created** (`src/features/talent-pools/`):
- `types/talent-pools.types.ts` — `TalentPool`, `PoolMember`, `CreateTalentPoolInput`
- `services/talent-pools.mock.ts` — 4 pools, `removeFromAllPools` cross-module method
- `services/talent-pools.service.ts`
- `hooks/useTalentPools.ts`, `hooks/useTalentPoolMutations.ts`
- `components/TalentPoolCard.tsx` — candidate count, delete confirm dialog
- `components/TalentPoolList.tsx` — responsive grid (1→4 cols)
- `components/CreatePoolModal.tsx` — RHF+Zod
- `components/AddCandidateToPoolModal.tsx` — multi-select, filters already-in-pool candidates
- `components/TalentPoolDetail.tsx` — `CandidateRow` per member, `useCandidateById` per row
- `components/TalentPoolsView.tsx`

**Routes:** `/talent-pools`, `/talent-pools/:id`

**Cross-module (TODO):** `removeFromAllPools` should be called from `useUpdateCandidateStatus` `onSuccess` when `status === 'hired'`

---

## Step 18 — Acquisitions ✅

**Files created** (`src/features/acquisitions/`):
- `types/acquisitions.types.ts` — `AcquisitionSource`, `AcquisitionEntry`, `SourceType`, `EntryStatus`
- `services/acquisitions.mock.ts` — 6 sources, 8 entries
- `hooks/useAcquisitions.ts`, `hooks/useAcquisitionMutations.ts`
- `components/SourceCard.tsx` — icon/color per source type, stats, import CTA
- `components/SourceDetailPanel.tsx` — slide-in right panel, recent imports, pause/activate toggle
- `components/ImportModal.tsx` — multi-row form, valid-row count on CTA
- `components/SourceList.tsx` — grid + summary stats, selected panel slot
- `components/AcquisitionsView.tsx`

**Route:** `/acquisitions`

---

## Step 19 — Marketplace ✅

**Files created** (`src/features/marketplace/`):
- `types/marketplace.types.ts` — `Plugin`, `PluginCategory`, `PluginStatus`, `MarketplaceFilters`
- `services/marketplace.mock.ts` — 12 plugins (3 installed, 2 coming-soon)
- `hooks/useMarketplace.ts`, `hooks/useMarketplaceMutations.ts`
- `components/PluginCard.tsx` — category icon/color/label, star rating, status states
- `components/PluginDetailPanel.tsx` — slide-in, features checklist, install/uninstall/enable/disable
- `components/MarketplaceFilters.tsx` — renamed to `MarketplaceFilterBar` (type collision fix)
- `components/MarketplaceView.tsx`

**Route:** `/marketplace`

**Fix applied:** Renamed component `MarketplaceFilters` → `MarketplaceFilterBar` to avoid barrel export collision with type `MarketplaceFilters`

---

## Step 20 — Settings: My Account ✅

**Files created** (`src/features/settings/`):
- `components/SettingsLayout.tsx` — left-nav (5 items), `<Outlet>` for sub-routes
- `index.ts` — exports `SettingsLayout`

**Files created** (`src/features/settings/my-account/`):
- `types/my-account.types.ts` — `UserProfile`, `UpdateProfileInput`, `ChangePasswordInput`, `AccountNotificationPref`
- `services/my-account.mock.ts` + `services/my-account.service.ts`
- `hooks/useMyAccount.ts`, `hooks/useMyAccountMutations.ts`
- `components/ProfileSection.tsx` — name/email(disabled)/phone/title/dept + language/timezone selects
- `components/PasswordSection.tsx` — eye toggle, Zod `.refine` confirm match
- `components/NotificationPrefsSection.tsx` — 6 prefs × email + in-app toggle grid
- `components/MyAccountView.tsx`

**Route:** `/settings` → redirect to `/settings/my-account` + nested sub-routes via `SettingsLayout`

---

## Step 21 — Settings: General ✅

**Files created** (`src/features/settings/general/`):
- `types/general.types.ts` — `CompanyInfo`, `Location`, `TeamMember`, `TeamRole`, `RolePermission`, `Referral`
- `services/general.mock.ts` — company info, 5 locations, 5 members, 10 permission rows, 3 referrals
- `hooks/useGeneral.ts`, `hooks/useGeneralMutations.ts`
- `components/CompanyInfoSection.tsx` — collapsible, RHF+Zod, industry/size selects
- `components/LocationsSection.tsx` — HQ badge, hover-reveal delete, Enter-to-add
- `components/TeamMembersSection.tsx` — role badges, "Compare roles" toggle
- `components/RoleComparisonPanel.tsx` — permission matrix table with Check/X icons
- `components/ReferralPortalSection.tsx` — cross-module: `useJobs()` filtered by `referralsEnabled`
- `components/GeneralSettingsView.tsx`

**Cross-module:** `ReferralPortalSection` imports `useJobs` from `@/features/jobs`

---

## Step 22 — Settings: Workflow ✅

**Files created** (`src/features/settings/workflow/`):
- `types/workflow.types.ts` — `PipelineStage`, `StageAutomation`, `WorkflowTag`, `TagType`, `AutomationTrigger`, `AutomationAction`
- `services/workflow.mock.ts` — 6 stages (Applied/Screening/Interview/Assessment/Offer/Hired), 8 tags
- `hooks/useWorkflow.ts`, `hooks/useWorkflowMutations.ts`
- `components/StageCard.tsx` — inline rename (Enter=commit, Esc=cancel), up/down reorder, automation rows
- `components/AddAutomationModal.tsx` — trigger + action selects
- `components/WorkflowStageList.tsx` — ordered list, add-stage input, `move()` swaps + calls `reorderMutation`
- `components/TagManager.tsx` — 10 preset color swatches, add/delete color pills — reusable by type
- `components/TagsSection.tsx` — 3 `<TagManager>` instances (candidate/pipeline/source)
- `components/WorkflowSettingsView.tsx`

---

## Step 23 — Settings: Templates ✅

**Files created** (`src/features/settings/templates/`):
- `types/templates.types.ts` — `JobTemplate`, `EmailTemplate`, `Questionnaire`, `QuestionnaireQuestion`, `CareersPage`, `CareersPageSection`, `TemplateVisibility`, `QuestionType`, `TemplateTab`
- `services/templates.mock.ts` — 3 job, 4 email, 3 questionnaire templates + 1 careers page
- `services/templates.service.ts`
- `hooks/useTemplates.ts` — 4 separate query hooks + exported query keys
- `hooks/useTemplateMutations.ts` — delete mutations + `useUpdateCareersPage`
- `components/TemplateTabNav.tsx` — 4-tab switcher (job/email/questionnaire/careers)
- `components/JobTemplateList.tsx` — type badge, department, description
- `components/EmailTemplateList.tsx` — visibility icon+badge, subject, body preview, variable chips
- `components/QuestionnaireList.tsx` — expand/collapse to view questions with type badges
- `components/CareersPageBuilder.tsx` — section toggle/edit (hero/about/perks/jobs), brand colour picker, publish switch
- `components/TemplatesView.tsx`

---

## Step 24 — Settings: Plugins ✅

**Files created** (`src/features/settings/plugins/`):
- `types/plugins.types.ts` — `InstalledPlugin`, `PluginConfigField`, `PluginConfigFieldType` (text/password/select/toggle), `UpdatePluginConfigInput`
- `services/plugins.mock.ts` — 4 plugins: LinkedIn (enabled), Slack (enabled), Google Calendar (enabled), Codility (disabled)
- `services/plugins.service.ts`
- `hooks/useInstalledPlugins.ts`, `hooks/usePluginMutations.ts` — toggle/update-config/sync
- `components/PluginRow.tsx` — name/category/version, last-synced, sync button (spinner), configure CTA, enable switch
- `components/PluginConfigPanel.tsx` — inline expand, field-type-aware inputs (text/password/select/toggle), dirty-state Save
- `components/PluginsView.tsx` — sorted enabled-first, "Browse marketplace" link

---

## Step 25 — Polish ✅

**Files created:**
- `src/components/ui/empty-state.tsx` — icon + title + description + action slot, `animate-fade-in`
- `src/components/ui/query-error.tsx` — destructive border, retry button
- `src/components/ui/error-boundary.tsx` — React class component, `getDerivedStateFromError`, recovery UI
- `src/hooks/useDocumentTitle.ts` — sets `<title>Page — Dakar</title>`, resets on unmount

**Files modified:**
- `src/styles/globals.css` — `animate-fade-in` / `animate-slide-up` keyframes, `:focus-visible` global ring
- `src/components/layout/PageWrapper.tsx` — added `animate-slide-up`
- `src/components/layout/AppShell.tsx` — `ScrollRestoration`, mobile backdrop, auto-close on nav, `key={location.pathname}` fade-in on `<main>`
- `src/components/layout/Sidebar.tsx` — mobile overlay (`fixed inset-y-0 left-0 z-50`), `-translate-x-full` when closed on mobile, `md:relative md:z-auto md:translate-x-0` for desktop
- `src/components/layout/Navbar.tsx` — mobile hamburger (`md:hidden`) when sidebar closed, `z-50` on header
- `src/app/index.tsx` — wrapped `<Providers>` with `<ErrorBoundary>`
- `src/pages/NotFoundPage.tsx` — polished: icon, "404" heading, description, "Back to Home" button

---

## Ad-hoc Improvements (post Step 25)

### Sidebar UI Redesign ✅
**Date:** 2026-05-20
**Files modified:** `src/components/layout/Sidebar.tsx`, `src/components/layout/Navbar.tsx`

Changes:
- Background `bg-slate-50` (distinct from main white)
- Nav grouped: Main / Sourcing / Config with section labels (hidden when collapsed)
- Active state: 3px left border pill (`bg-primary`) + `bg-primary/10 text-primary`
- **Top hamburger**: collapsed state = full `h-14` clickable hamburger; expanded = logo-left + hamburger-right
- User footer: avatar + name + email + LogOut icon (sign out on click); collapsed = avatar only with tooltip
- Removed bottom collapse button — hamburger at top is the single toggle

### Home Overview — Removed Placeholder ✅
**Date:** 2026-05-20
**File:** `src/features/home/components/OverviewContent.tsx`
- Replaced `"Full overview dashboard — coming in Build Step 7 detail pass"` placeholder with live recent-activity feed (last 8 items from `useActivityFeed`, actor + description + relative timestamp)

### CreateJobModal — Template Picker Wired ✅
**Date:** 2026-05-20
**File:** `src/features/jobs/components/CreateJobModal.tsx`
- "From template" tab now loads real templates via `useJobTemplates()` from `@/features/settings/templates`
- Skeleton loading state while templates fetch
- Each template rendered as a clickable card (name, type badge, department, description preview)
- Clicking a template calls `reset({ title, department, type, description, requirements })` and switches to the scratch form — pre-filled and editable

### EvaluationPanel — Real Candidate Data ✅
**Date:** 2026-05-20
**File:** `src/features/home/components/EvaluationPanel.tsx`
- Left panel replaced: fetches full candidate via `useCandidateById(evaluation.candidate.id)`
- Shows: avatar initials, name, position, status badge, origin
- Contact card: email, phone, location, applied date, referredBy
- Tags card, Roles card, Profile notes count
- Skeleton while loading; graceful fallback if candidate not found

---

## Current Gaps / Known TODOs

| # | Gap | File | Priority |
|---|-----|------|----------|
| 1 | `removeFromAllPools` not called on candidate hire | `talent-pools.service.ts:18` | Medium |
| 2 | New job location not auto-added to General Settings | `jobs/components/CreateJobModal.tsx:48` | Low |
| 3 | Calendar week/day views stubbed | `home/components/CalendarView.tsx` | Low |
| 4 | All services use mock data — no real API | `features/*/services/*.service.ts` | Future |
| 5 | No Vitest unit tests written | `src/test/` | Future |
| 6 | No Playwright E2E tests | — | Future |
| 7 | ESLint v8 deprecated — upgrade to v9 flat-config | `eslintrc.cjs` | Low |

---

## File Map — Key Locations

| What you need | Where it lives |
|---|---|
| All routes | `src/app/router.tsx` |
| Auth state | `src/store/auth.store.ts` |
| Sidebar open/close | `src/store/ui.store.ts` |
| Axios instance | `src/lib/axios.ts` |
| Brand colors | `src/styles/globals.css` |
| Shadcn UI components | `src/components/ui/` |
| App shell layout | `src/components/layout/AppShell.tsx` |
| Sidebar | `src/components/layout/Sidebar.tsx` |
| Mock credentials | `src/features/auth/services/auth.mock.ts` — email: any, password: any, 2FA: `000000` |
| Job templates (shared) | `src/features/settings/templates/hooks/useTemplates.ts` |
| Candidate lookup by ID | `src/features/candidates/hooks/useCandidates.ts` → `useCandidateById` |
| Widget count invalidation key | `['home', 'widget-counts']` |
| Task list query key | `['home', 'tasks']` |
| Pipeline stages | `src/features/settings/workflow/services/workflow.mock.ts` |
