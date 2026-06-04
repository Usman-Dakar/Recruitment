# Architecture Decisions
> Last updated: 2026-05-19 | Reference: https://github.com/alan2207/bulletproof-react

---

## Folder Structure

```
src/
├── app/
│   ├── index.tsx           ✅ Entry point — mounts <Providers />
│   ├── router.tsx          ✅ createBrowserRouter — lazy-loaded routes
│   └── providers.tsx       ✅ QueryClientProvider + RouterProvider
│
├── lib/
│   ├── axios.ts            ✅ Axios instance + auth interceptor + 401 redirect
│   ├── query-client.ts     ✅ QueryClient — staleTime 5m, no retry on 401/403
│   └── utils.ts            ✅ cn(), formatDate(), formatRelativeTime()
│
├── store/
│   ├── auth.store.ts       ✅ user, token, isAuthenticated — persisted to localStorage
│   └── ui.store.ts         ✅ sidebarOpen, activeModal — sidebarOpen persisted
│
├── types/
│   ├── api.types.ts        ✅ PaginatedResponse<T>, ApiError
│   └── index.ts            ✅ re-exports
│
├── styles/
│   └── globals.css         ✅ Tailwind directives + CSS custom properties (HSL vars)
│
├── pages/                  ✅ Thin route wrappers — placeholder stubs for now
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   └── NotFoundPage.tsx
│
├── vite-env.d.ts           ✅ Vite ImportMeta env types
└── test/
    └── setup.ts            ✅ jest-dom setup for Vitest
```

---

## Patterns in Use

### Data Fetching
```
useQuery hook (features/[name]/hooks/) 
  → service function (features/[name]/services/[name].service.ts)
  → axios instance (src/lib/axios.ts)
```
Not yet used in components — pattern defined, ready for Step 7+.

### Auth Token Storage
The auth store (Zustand + persist) writes to `localStorage` under key `auth-storage`.  
The Axios interceptor reads from `localStorage` directly (not from the store hook) to avoid React context dependency.  
On 401 response: clears `auth-storage` + hard-redirects to `/login`.

### CSS Variables / Theming
Shadcn/ui-compatible HSL CSS variables defined in `src/styles/globals.css`.  
Tailwind config references them via `hsl(var(--...))`.  
Dark mode: class-based (`.dark` class on `<html>`).

### Router
React Router v6 data router (`createBrowserRouter`).  
All routes use `lazy()` for code splitting.  
Route components are default exports from `src/pages/`.

### State Layers
| State type | Tool | Location |
|---|---|---|
| Server/async | TanStack Query | `features/[name]/hooks/` |
| UI/client | Zustand | `src/store/` |
| URL-persistent | React Router params | route definitions |
| Local only | useState | inside component |

---

## Component Conventions

### Naming
- Components: PascalCase (`CandidateList.tsx`)
- Hooks: camelCase with `use` prefix (`useCandidates.ts`)
- Services: camelCase with `.service.ts` suffix
- Types: PascalCase with `.types.ts` suffix
- Stores: camelCase with `.store.ts` suffix

### App Shell Layout
```
<div h-screen flex flex-col>
  <Navbar />           ← h-14, fixed, full width, logo syncs with sidebar width
  <div flex flex-1 overflow-hidden>
    <Sidebar />        ← w-60 (open) | w-16 (closed), transition-all duration-300
    <main overflow-y-auto flex-1>
      <Outlet />       ← page content renders here
    </main>
  </div>
</div>
```

### Route Structure
```
/             → Navigate to /home
/login        → LoginPage (no AppShell)
/home         → ProtectedRoute → AppShell → HomePage
/* (future)   → ProtectedRoute → AppShell → FeaturePage
* (404)       → NotFoundPage (no AppShell)
```

### Sidebar Active State
`NavLink` with `className` callback — `isActive` applies `bg-accent text-accent-foreground` (light teal bg, dark teal text). `end: true` on `/home` to prevent matching nested paths. All other routes: `end: false` to match sub-routes.

### Sidebar Collapsed State
When `sidebarOpen = false`: icons only, `Tooltip` with `side="right"` shows label on hover. Toggle button shows `ChevronRight` (expand). Width `w-16` (64px).

---

## API Layer
- Base URL: `VITE_API_BASE_URL` env var (falls back to `/api`)
- Auth: Bearer token injected via Axios request interceptor
- Error handling: 401 → clear auth storage + redirect to `/login`
- All calls use mock data until backend is available

---

## Shadcn/ui Components Added
All in `src/components/ui/` — never modify directly, wrap them.

| Component | File | Notes |
|---|---|---|
| Button | `button.tsx` | CVA variants: default/secondary/destructive/outline/ghost/link; sizes: default/sm/lg/icon |
| Input | `input.tsx` | Controlled text input with focus ring |
| Badge | `badge.tsx` | CVA variants + custom: success/warning/info |
| Table | `table.tsx` | Table/Header/Body/Footer/Row/Head/Cell/Caption |
| Dialog | `dialog.tsx` | Radix Dialog with overlay, animated open/close |
| DropdownMenu | `dropdown-menu.tsx` | Full Radix DropdownMenu with checkbox/radio items |
| Avatar | `avatar.tsx` | Radix Avatar — image + initials fallback (teal bg) |
| Skeleton | `skeleton.tsx` | `animate-pulse` placeholder |
| Label | `label.tsx` | Radix Label for form fields |
| Select | `select.tsx` | Radix Select with scroll buttons |
| Separator | `separator.tsx` | Horizontal/vertical divider |
| Tooltip | `tooltip.tsx` | Radix Tooltip — provider at app root |
| Toaster | `sonner.tsx` | Sonner toast — `<Toaster />` in providers.tsx |
| Barrel | `index.ts` | Re-exports all above |

### Toast Usage Pattern
```typescript
import { toast } from 'sonner';
toast.success('Candidate added');
toast.error('Something went wrong');
```

---

## Calendar Layout Pattern

Calendar tab gets full remaining height (no extra padding wrapper) so the grid fills the viewport:
```
HomePage
├── WidgetBar
├── HomeTabNav
└── div (isCalendar ? flex flex-col flex-1 overflow-hidden : flex-1 overflow-y-auto)
    └── CalendarView (flex flex-col h-full)
        ├── CalendarToolbar
        └── div flex flex-1 overflow-hidden
            ├── CalendarGrid (flex-1)
            └── EntryDetailPanel (w-80 shrink-0, conditionally rendered)
```

`exactOptionalPropertyTypes: true` fix for optional string properties in object literals:
```typescript
// WRONG: notes: input.notes  (type is string | undefined, incompatible with notes?: string)
// RIGHT:
...(input.notes !== undefined && { notes: input.notes })
// or for string-only check:
...(input.notes ? { notes: input.notes } : {})
```

Also affects array destructuring after `.map(Number)` — use indexed access instead:
```typescript
// WRONG: const [year, month, day] = str.split('-').map(Number)  (types become number | undefined)
// RIGHT:
const parts = str.split('-');
const year = Number(parts[0]);
```

---

## Home Tab Navigation Pattern

Home page tabs use URL search params (`/home?tab=calendar`) so the active tab survives page refresh and can be deep-linked.

```typescript
const [searchParams, setSearchParams] = useSearchParams();
const activeTab = (searchParams.get('tab') as HomeTab) ?? 'overview';
// clearing params (no ?tab=) = overview (default)
```

`HomeTabNav` drives the URL; `HomePage` reads it and renders the matching content component. Tabs: `overview | calendar | evaluations | tasks | notes | activity`.

### Widget Bar
- Lives inside `HomePage` (not `AppShell`) — it's Home-specific, not global.
- `useWidgetCounts` drives all 4 widgets from a single query; skeleton shown during load.
- Query key: `['home', 'widget-counts']` — invalidate this key from Calendar/Evaluations when counts change.

---

## Auth Flow Pattern

Multi-step login managed with local state in the page component (not Zustand) — ephemeral UI state that resets on navigation.

```
LoginPage (step: 'landing' | 'login' | '2fa', tempToken: string)
  ├─ step === 'landing'  → <LoginLanding onUsernameLogin />
  ├─ step === 'login'    → <LoginForm onBack onSuccess(tempToken) />
  └─ step === '2fa'      → <TwoFactorForm tempToken onBack onSuccess />
```

`useVerify2FA` calls `setAuth(user, token)` in its `onSuccess` callback — the mutation hook owns the store write, not the page.

### Mock Auth
- `mockLogin`: 800ms delay, always returns `{ requires2FA: true, tempToken: 'mock-temp-token' }`
- `mockVerify2FA`: accepts only `code === '000000'` + correct tempToken; throws otherwise
- When real API is ready: replace service methods in `auth.service.ts` only — hooks and components are unchanged

---

## Jobs Module Patterns

### Job Status Flow
```
draft → published → listed
              ↓
           archived (from published or listed)
archived → draft (restore)
```
Status transitions are driven by `useUpdateJobStatus` mutation. Destructive transitions (archive, delete) require a confirmation Dialog.

### Cross-Feature Component Reuse
`JobPipeline` reuses `CandidateList`, `ColumnManager`, `DEFAULT_COLUMNS` from `features/candidates`.  
These are exported via `features/candidates/components/index.ts` → `features/candidates/index.ts`.  
`JobPipeline` passes `{ jobId }` to `useCandidates` which filters the mock via `JOB_CANDIDATE_MAP`.

### Status-Bordered List Pattern
List items use a 4px left border (`border-l-4`) with status-driven color class:
```
listed    → border-l-emerald-500
published → border-l-primary
draft     → border-l-slate-300
archived  → border-l-slate-200
```

### Textarea UI Primitive
Added `src/components/ui/textarea.tsx` (Shadcn/ui pattern). Used in `CreateJobModal` and `JobNotes`.

---

## Candidates Module Patterns

### URL-Driven Filters
Candidate list filters (search, status, origin) live in URL search params — survives refresh, browser back works correctly.
```typescript
const search = searchParams.get('search') ?? '';
const filters: CandidateFilters = {
  ...(search ? { search } : {}),
  ...(status ? { status: status as CandidateStatus } : {}),
};
```
Non-empty values are stored; empty strings are deleted from the URL.

### ColumnManager
Custom dropdown (no Radix) with click-outside detection via `useRef` + `document.addEventListener('mousedown')`.  
`DEFAULT_COLUMNS` typed as `TableColumn[]` — `id`, `label`, `visible` fields.  
`CandidateList` maps over visible columns only, rendering `TableHead` + `TableCell` dynamically.

### Typed Option Arrays
Avoid `string[][]` (destructured elements become `string | undefined` under `exactOptionalPropertyTypes`).  
Use typed object arrays instead:
```typescript
const OPTIONS: { value: string; label: string }[] = [
  { value: 'direct', label: 'Direct' },
  ...
];
// then in JSX:
OPTIONS.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)
```

### CandidateProfile
Uses `useParams<{ id: string }>()` — typed generic for route param safety.  
Profile notes: own notes (`isOwn === true`) are editable inline; all notes are deleteable.  
Multi-role display: `roles: string[]` rendered as `Badge` chips.

---

## Talent Pools Module Patterns

### Pool List → Grid Layout
Pools are displayed as cards in a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).  
Each card navigates to `/talent-pools/:id` on click, with a delete button that shows a confirm dialog.

### Pool Detail — Per-Candidate Queries
`TalentPoolDetail` renders a `CandidateRow` per `candidateId` in the pool.  
Each row independently calls `useCandidateById(id)` — fine for small pools; avoids adding a bulk-fetch filter to candidates service.

### Cross-Module Auto-Remove (Hire Rule)
`talentPoolsService.removeFromAllPools(candidateId)` removes a candidate from every pool at once.  
**TODO**: wire to `useUpdateCandidateStatus` `onSuccess` when `status === 'hired'` (see `talent-pools.mock.ts` comment).  
Mock data already reflects the rule: c8 (Lena Fischer, hired) is absent from all pools.

### AddCandidateToPoolModal — Multi-Select Pattern
Uses a button-list with toggle selection (not checkboxes) to pick multiple candidates.  
Filters already-in-pool candidates client-side before rendering available list.

---

## Deviations from bulletproof-react

| Decision | bulletproof-react default | Our choice | Reason |
|---|---|---|---|
| Vitest config | bundled in vite.config | separate `vitest.config.ts` | Keeps configs focused; avoids merging test/build options |
| Entry CSS | `main.css` in root | `src/styles/globals.css` | Cleaner separation; aligns with Shadcn/ui conventions |
| Toast library | Radix Toast | Sonner | Simpler API, cleaner notifications, no boilerplate |
| TooltipProvider | per-usage | global in `providers.tsx` | All tooltips work without per-component wrapping |

---

## Environment Variables
| Variable | Purpose | Required |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_APP_ENV` | Environment (development/production) | Yes |
