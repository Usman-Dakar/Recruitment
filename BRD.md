# Business Requirements Document (BRD)
## Job Portal — React Replication
**Source:** https://ax-jobs.dakarhr.com  
**Date:** 2026-05-21  
**Version:** 1.0  

---

## 1. EXECUTIVE SUMMARY

This document captures all business requirements, logic, workflows, forms, and data structures extracted from the AX Jobs recruitment portal — a white-label ASP.NET MVC application built by Dakar Software Systems for AX Group (Malta). The goal is to replicate the full public-facing and authenticated candidate experience as a modern React application with a clean REST API backend.

---

## 2. SYSTEM OVERVIEW

| Attribute | Value |
|-----------|-------|
| Client | AX Group, Malta (est. 1975, 1000+ employees) |
| Portal Type | Recruitment / Job Discovery Portal |
| Original Stack | ASP.NET MVC 5, .NET 4.8, jQuery, Bootstrap 3 |
| Target Stack | React 18 + TypeScript frontend, Node.js/Express or Next.js backend |
| Tenancy | Multi-tenant (client identified by hidden `cl_id = 2`) |
| Languages | English (multi-language architecture present) |

---

## 3. PAGES & ROUTES

| Route | Page | Template |
|-------|------|----------|
| `/` or `/en/home` | Home / Landing | Modern (Theme 1) |
| `/en/discoverjob/Index` | Vacancy Search | Sidebar layout (Theme 2) |
| `/en/discoverjob/index/{categoryId}` | Vacancy Search filtered by category | Same |
| `/en/page/login` | Login + Register | Sidebar layout |
| `/en/page/information` | Information / Career Dev | Sidebar layout |
| `/en/page/aboutus` | About AX Group | Sidebar layout |
| `/en/page/contactus` | Contact Us | Sidebar layout |

---

## 4. PAGE-BY-PAGE BUSINESS REQUIREMENTS

---

### 4.1 HOME PAGE (`/en/home`)

**Purpose:** Marketing landing page — first impression, hero search, and category navigation.

**Sections:**

#### 4.1.1 Navigation Bar
- Logo (links to `/en/home`)
- Nav links: Home, Vacancy Search, Information, About Us, Contact Us
- Right side: `Register` button (opens register tab on login page), `Login` button
- Mobile hamburger menu (collapses nav on small screens)

#### 4.1.2 Hero Section
- Full-width banner with background image
- Headline: *"AX Group offers you countless opportunities"*
- **Global Search Bar:**
  - Input: `id="globalSearchTb"` — placeholder: "Search by Job Title or Skill"
  - Button: "Find Openings" — calls `GlobalSearchJob()`
  - Logic: copies value into `#freeTextSearch` hidden field then calls `SearchJobs()`, and auto-scrolls to `#jobHolder`

#### 4.1.3 Category Quick-Filter Buttons
12 clickable category buttons below the search bar. Each navigates to `/en/discoverjob/index/{id}`:

| ID | Category |
|----|----------|
| 11 | Administrative |
| 12 | Business and Finance |
| 13 | Hotels |
| 14 | Healthcare |
| 15 | Development |
| 16 | Construction |
| 17 | Information Technology |
| 21 | Real Estate |
| 22 | Renewable Energy |
| 27 | Hospitality |
| 28 | Security |
| 29 | Other |

#### 4.1.4 Vacancy Search Results Area
- `id="jobHolder"` — receives HTML fragments from search API
- Shows "No Record found." when no results
- Pagination: jQuery `.paginate()` plugin, page size = 50, shows 10 page numbers

#### 4.1.5 Filter Sidebar (Offcanvas)
- Opened by "Filter" button (`id="openSidebar"`)
- Closes on overlay click or close button
- Slides in from left (`left: -310px` → `left: 0`)
- Contains: full `SearchJobForm` (see §5)
- Buttons: `Search` (calls `SearchJobs()`), `Clear All` (reloads page)

#### 4.1.6 Sort Sidebar (Offcanvas) — UI Only
- Opened by sort button
- Options: "Published: Newest to oldest", "Published: Oldest to newest"
- **Note:** Sort functionality is UI-only in current implementation — no backend sort parameter is actually passed

#### 4.1.7 Cookie Consent Banner
- Top-positioned static bar
- Message: "We use cookies to ensure that we give you the best experience..."
- "Got It" dismiss button
- "More Info" links to `/en/page/cookies`

---

### 4.2 VACANCY SEARCH PAGE (`/en/discoverjob/Index`)

**Purpose:** The primary job discovery interface with left sidebar filters and right results panel.

**Layout:** 3-column left sidebar (filters) + 9-column right main area (job cards)

#### 4.2.1 Search Form (`id="SearchJobForm"`)

All filter fields and their exact database-level option IDs:

**Free Text Search**
- `id="freeTextSearch"`, `name="freeTextSearch"`, no placeholder
- Searches across job title and skills

**Hidden Fields**
- `id="OccupationSearch"` — value="0" (occupation filter, not exposed in UI)
- `id="businessSectorIds"` — comma-separated selected industry IDs
- `id="JobNatureIds"` — comma-separated selected job category IDs

**Department Dropdown** (`id="DepartmentSearch"`)
Hierarchical with parent/child optgroups:

| Value | Label | Type |
|-------|-------|------|
| 0 | Search By Department | Default |
| 1 | Marketing | Parent |
| 8 | Sales | Child of Marketing |
| 16 | Advertising | Child of Marketing |
| 5 | Resturant | Parent |
| 6 | Resturant Service | Child |
| 13 | Resturant Kitchen | Child |
| 7 | Food & Beverage | Parent |
| 20 | F&B Admin | Child |
| 21 | Events | Child |
| 9 | Maintainance | Parent |
| 18 | Plant | Child |
| 19 | Technical | Child |
| 10 | Housekeeping | Parent |
| 17 | Rooms | Child |
| 22 | General | Child |
| 11 | Spa | Parent |
| 12 | Fitness | Child |
| 14 | Front Office | Parent |
| 2 | Reservations | Child |
| 26 | Customer Care | Child |
| 15 | Administration | Parent |
| 3 | General | Child |
| 4 | Security | Child |
| 23 | IT | Parent |
| 24 | Networks | Child |
| 25 | General | Child |

**Experience Level Dropdown** (`id="ExperienceLevelSearch"`)

| Value | Label |
|-------|-------|
| 229 | Student (High school) |
| 230 | Student (College) |
| 231 | Entry level |
| 232 | Mid level |
| 233 | Experienced |
| 234 | Manager |
| 235 | Senior manager / Supervisor |
| 236 | Executive |
| 237 | Senior executive |

**Education Level Dropdown** (`id="EducationLevelSearch"`)

| Value | Label |
|-------|-------|
| 199 | KNOWLEDGEABLE |
| 200 | COMPETENT |
| 201 | O-LEVEL |
| 202 | A-LEVEL |
| 203 | GRADUATE |
| 204 | INTERMEDIATE |
| 205 | DIPLOMA |
| 206 | DIPLOMA GENERIC |
| 207 | FIRST DIPLOMA |
| 208 | NATIONAL DIPLOMA |
| 209 | HIGHER NATIONAL DIPLOMA |
| 210 | HIGHER TECHNICAL DIPLOMA |
| 211 | ADVANCED TECHNICIAN DIPLOMA |
| 212 | SPECIALIZED DIPLOMA |
| 213 | SPECIALIZED CERTIFICATION |
| 214 | TECHNICIAN DIPLOMA |
| 215 | ORDINARY TECHNICIAN DIPLOMA |
| 216 | INTERNATIONAL BACCALAURETE (IB) DIPLOMA |
| 217 | FIRST DEGREE / BACHELORATE |
| 218 | POST GRADUATE DIPLOMA |
| 219 | POST GRADUATE CERTIFICATE |
| 220 | MASTERS |
| 221 | DOCTORAL |

**Employment Type Dropdown** (`id="EmployementTypeSearch"`)

| Value | Label |
|-------|-------|
| 193 | Definite - Part Time |
| 243 | Definite - Full Time |
| 273 | Seasonal |
| 274 | Indefinite - Full Time |
| 276 | Indefinite - Part Time |
| 313 | Extended Role |

**Industry (Business Sector)** (`id="BusinessSector"`) — Multi-tag select
- `display: none !important` in current UI (hidden but functional)
- `+` button adds selected item as a tag chip
- Max 5 selections; duplicate check enforced
- Values: 47 (Airlines/Aviation) → 191 (Writing and Editing), 145 total options
- Selected IDs stored as comma-separated string in `#businessSectorIds`
- Remove tag: click `x` on chip

**Job Category** (`id="JobNature"`) — Multi-tag select
- `+` button adds selected item as a tag chip
- Max 5 selections; duplicate check enforced
- Values: 11–29 (12 categories)
- Selected IDs stored as comma-separated string in `#JobNatureIds`

**Search Button**
- `onclick="SearchJobs()"` — triggers AJAX search

#### 4.2.2 Search API Call Logic

```
GET /discoverjob/searchjobs
  ?jobTypeId=0
  &occupationId={OccupationSearch}
  &pageNo={1 or current page}
  &experienceLevelId={ExperienceLevelSearch}
  &educationLevelId={EducationLevelSearch}
  &bussinessSectorIds={comma-separated IDs}
  &jobNatureIds={comma-separated IDs}
  &employmentTypeId={EmployementTypeSearch}
  &jobCallTypeId={CallTypeSearch — hidden}
  &departmentId={DepartmentSearch}
  &freeText={freeTextSearch}
  [&section=2 — present on home page variant]
```
- Returns: **HTML fragment** injected into `#jobHolder`
- Page size: **50 jobs per page**
- Pagination: jQuery `.paginate()` widget driven by `#jobTotalRecords` hidden value

---

### 4.3 LOGIN & REGISTER PAGE (`/en/page/login`)

**Layout:** Two tabs — Login | Register

#### 4.3.1 Login Tab

**Form:** `id="loginform_Ctrl"` `method="post"` `action="#"`

| Field ID | Name | Type | Placeholder | Notes |
|----------|------|------|-------------|-------|
| UserName | UserName | text | "Email" | User's email address |
| pass | pass | password | "Password" | |
| remember | remember | checkbox | — | "Save Password" |
| login_btn_ctrl | — | submit | "Login" | Submits form |
| btnCancel_ctrl | — | button | "Cancel" | Clears/dismisses |
| forgotpass | — | anchor | — | `href="javascript:void(0)"` — opens modal |

**Forgot Password:** Link triggers modal (endpoint not exposed in public HTML).

**"New to site? Create Account"** link → switches to Register tab.

#### 4.3.2 Register Tab

**Form:** `id="registerUserForm"`

| Field ID | Name | Type | Placeholder | Notes |
|----------|------|------|-------------|-------|
| FirstName | FirstName | text | "First Name" | |
| LastName | LastName | text | "Last Name" | |
| DisplayName | DisplayName | text | "Display Name" | |
| Email | Email | text | "Email" | |
| signUpBtn | — | submit | "Sign Up" | |

**No password field** — passwordless registration. User receives credentials/link via email after sign-up.

**Agreement text:** "By clicking 'Sign up', you agree to our terms of service and privacy policy."

**Terms & Conditions link:** `/en/page/termsandconditions`

#### 4.3.3 OAuth / Social Login Options

| Provider | Client ID | Redirect URI | Scopes |
|----------|-----------|--------------|--------|
| Google | `367546128170-64m5tmjrh55l7ooucg4a0n7h1m7u1g3k.apps.googleusercontent.com` | `/authenticate/login/google` | `plus.login`, `userinfo.email` |
| Microsoft | `3276c2b2-7646-473b-aba8-483739188ac9` | `/authenticate/login/microsoft` | `openid profile email User.Read` |
| LinkedIn | `777v5h6cxfzuya` | `/authenticate/login/linkedin` | `openid profile email` |

**LinkedIn flow:**
1. Front-end generates random 21-char state string
2. Redirects to LinkedIn OAuth URL
3. On return, URL `?code=...` is detected via `URLSearchParams`
4. `POST /Account/LinkedInLogin` with JSON body `{ Code: "<auth_code>" }`
5. Response: `{ success: true, redirect: "<url>" }` → `window.location.href = result.redirect`

#### 4.3.4 eID Login (Malta National eID)
- `GET /userauthentication/eidlogin` — returns HTML shown in large modal

---

### 4.4 INFORMATION PAGE (`/en/page/information`)

**Layout:** Accordion sections (collapse/expand on click, auto-opens first if only one)

| Section ID | Title | Content |
|------------|-------|---------|
| sitePageContent_4 | Career Development | Company overview: AX Group history, 1000+ employees, 4 sectors, employer of choice |
| sitePageContent_5 | Links | AX website: https://axgroup.mt/, Europass CV: https://europass.cedefop.europa.eu/en/documents/curriculum-vitae |
| sitePageContent_23 | General Provisions | "This site should be accessed using Google Chrome" |

**Accordion behavior:** If only 1 section, it auto-clicks open on page load. Hash in URL (`#sectionId`) scrolls to and opens that section.

---

### 4.5 ABOUT US PAGE (`/en/page/aboutus`)

**Layout:** Accordion sections

| Section ID | Title | Content |
|------------|-------|---------|
| sitePageContent_6 | Our Mission | "At AX Group we strive to leverage our entrepreneurial skills to deliver high-quality innovative developments..." |
| sitePageContent_8 | Our Beliefs | Three values: **Creativity** (harness ingenuity), **Determination** (exceptional quality, exceed expectations), **Integrity** (transparency, ethics, trust) |

---

### 4.6 CONTACT US PAGE (`/en/page/contactus`)

**Layout:** Contact form accordion + Contact Details accordion

#### 4.6.1 Contact Form (`id="contactUsForm"`)

| Field ID | Name | Type | Validation |
|----------|------|------|------------|
| Name | Name | text | Required, maxlength 40 |
| Email | Email | text | Required, email format, maxlength 100 |
| Telephone | Telephone | number | Required, maxlength 25 |
| Message | Message | textarea | Required, maxlength 250 |
| Send button | — | button | Triggers `SubmitContactForm()` |

**Validation logic (jQuery Validate):**
1. `SubmitContactForm()` calls `Validation()` then checks `$("#contactUsForm").valid()`
2. If valid: calls `submit()` which POSTs `FormData` to `POST /userauthentication/contactus/`
3. Response: `{ isok: 1, message: "..." }` — if `isok == 1`, clears Telephone and Message fields
4. Shows response message in generic popup modal
5. If invalid: shows `'Please provide valid data for the form.'`

**Error messages:**
- Name required: "Name is required."
- Name too long: "First Name length is 40 characters."
- Email invalid: "Please provide proper email"
- Email required: "Email is required."
- Telephone required: "Telephone is required."
- Message required: "Message is required."
- Message too long: "Message max length is 250 character"

#### 4.6.2 Contact Details (Static)
- **Address:** AX Business Centre, Triq Id-Difiza Civili, Mosta MST 1741, Malta
- **Phone:** +35623312345
- **Email:** info@axgroup.mt

---

## 5. API ENDPOINTS CATALOGUE

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/discoverjob/searchjobs` | No | Search jobs, returns HTML fragment |
| GET | `/userauthentication/checkclient` | No | Session health check; returns `{luid: number}` |
| POST | `/userauthentication/contactus/` | No | Submit contact form (FormData) |
| GET | `/userauthentication/eidlogin` | No | Malta eID login initiation |
| POST | `/Account/LinkedInLogin` | No | LinkedIn code exchange; body: `{Code: string}` |
| GET | `/authenticate/login/google` | No | Google OAuth2 callback |
| GET | `/authenticate/login/microsoft` | No | Microsoft OAuth2 callback |
| GET | `/authenticate/login/linkedin` | No | LinkedIn OAuth2 callback |

---

## 6. SESSION & AUTHENTICATION LOGIC

### Session Health Check
- On every AJAX call start: `loginHealth()` is called
- Calls `GET /userauthentication/checkclient` synchronously
- If response `luid > 0` and mismatches page's `#luid` value → redirect to `/`
- If `luid == 0` (logged out) → force show login modal
- `sessiongottimeout` string in any AJAX response → hide loading, show login

### Session State Indicators
- `#luid` hidden input on authenticated pages holds current user ID
- `#autoLogin` = '1' bypasses health check (auto-login scenario)

### Login Flow
1. POST credentials (UserName, pass) to form action (standard MVC form POST)
2. Server sets auth cookie
3. Redirect to dashboard

### Register Flow
1. POST (FirstName, LastName, DisplayName, Email) via AJAX or form
2. Server creates account
3. Email sent to user with activation/password setup link

---

## 7. GLOBAL UI COMPONENTS

### Loading Spinner
- `id="siteLoadingContainer"` — full-page overlay with spinning Font Awesome icon
- `ShowLoading()` / `HideLoading()` called on every AJAX start/complete
- Also shown on `window.onbeforeunload`

### Generic Message Modal (Small)
- `id="genericPopup"`, `data-target=".bs-generic-modal-sm"`
- Title: "Message", body: dynamic text, footer: "Ok" button
- `ShowGenericMessagePopup(message)` — injects text and triggers modal

### Generic Confirm Modal (500px)
- `id="genericConfirmBoxPopup"`, `data-target=".bs-generic-confirmBox-sm"`
- Dark header with `id="genericConfirmBoxHeading"`, body with `id="genericConfirmMessage"`
- Footer: `id="genericConfirmBtn"` (Yes, danger), `id="genericConfirmCancelBtn"` (No, dismiss)

### Generic Large Message Modal
- `id="genericPopupLarge"`, `data-target=".bs-generic-modal-lg"`
- For rich content (HTML), "Ok" button calls `CloseGenericMessagePopup()`

### Help Modal (Large)
- `id="genericHelpPopupLarge"`, `data-target=".bs-generichelp-modal-lg"`
- Embeds: `https://help.dakarhr.com/article/categoryID/3/menuID/302?embed=1&menu=1`
- Triggered by "Help" button in top-right of every page

### Cookie Consent Banner
- Top-positioned, static
- Theme: dark (`#252e39` bg, `#14a7d0` button)
- Links to `/en/page/cookies`

---

## 8. DATA MODELS (Inferred)

### Job Listing
```typescript
interface Job {
  id: number;
  title: string;
  department: Department;
  jobCategory: JobCategory; // JobNature
  industry: Industry; // BusinessSector
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  employmentType: EmploymentType;
  datePosted: Date;
  description: string;
  // Inferred from search params:
  occupationId?: number;
  callTypeId?: number;
}
```

### Search Params
```typescript
interface SearchParams {
  jobTypeId: number;        // 0 = all
  occupationId: number;     // 0 = all
  pageNo: number;           // 1-based
  experienceLevelId: number;
  educationLevelId: number;
  bussinessSectorIds: string; // comma-separated
  jobNatureIds: string;       // comma-separated
  employmentTypeId: number;
  jobCallTypeId: number;
  departmentId: number;
  freeText: string;
}
```

### Contact Form
```typescript
interface ContactForm {
  Name: string;        // max 40
  Email: string;       // max 100, valid email
  Telephone: string;   // max 25
  Message: string;     // max 250
}
```

### Register Form
```typescript
interface RegisterForm {
  FirstName: string;
  LastName: string;
  DisplayName: string;
  Email: string;
}
```

---

## 9. BUSINESS RULES

| # | Rule |
|---|------|
| BR-01 | Job search requires no authentication — public access |
| BR-02 | Registration and Login required to apply for a job |
| BR-03 | Industry filter: max 5 selections |
| BR-04 | Job Category filter: max 5 selections |
| BR-05 | Duplicate industry or category selections are ignored |
| BR-06 | Page size is fixed at 50 jobs per page |
| BR-07 | Registration is passwordless — email + name only, no password at sign-up |
| BR-08 | Contact form clears Telephone and Message on successful submission |
| BR-09 | Session timeout detected by `sessiongottimeout` string in AJAX response |
| BR-10 | Client is tenant-scoped via `cl_id = 2` hidden field |
| BR-11 | "Clear All" on home page reloads the page (no soft reset) |
| BR-12 | Sort is UI-only (not wired to backend) |
| BR-13 | Category buttons on home page pass `section=2` to search API |

---

## 10. NON-FUNCTIONAL REQUIREMENTS

| NFR | Requirement |
|-----|-------------|
| NFR-01 | Fully responsive — mobile, tablet, desktop |
| NFR-02 | Target browser: Chrome (stated requirement in original) |
| NFR-03 | Multi-language ready architecture (EN first) |
| NFR-04 | Accessibility: form labels, ARIA attributes |
| NFR-05 | Loading states on all async operations |
| NFR-06 | Cookie consent compliance |
| NFR-07 | OAuth2 support: Google, Microsoft, LinkedIn |

---

## 11. OUT OF SCOPE (authenticated/admin areas)

The following were not accessible without authentication and are deferred:
- Candidate dashboard (profile, applications, saved jobs)
- Job detail / Apply page
- Admin portal (`ax-jobsadmin.dakarhr.com`)
- Password reset flow
- Email notifications
- Forgot password flow
- Terms & Conditions page (`/en/page/termsandconditions` — 404)
