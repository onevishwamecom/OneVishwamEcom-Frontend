# API Requirements — Finance & Loan Services Module

> Scope: Backend API required by the Vishwam Frontend for the **Finance & Loan Services** module.
> This document covers (1) **creating** a new finance product, (2) **fetching** finance products (list + details), and (3) **fetching** products in the **Vehicles** section (the reference live API the frontend already consumes).
> Hand this file to the backend codebase / an OpenCode model to implement the endpoints.

---

## 1. Overview

The Finance & Loan Services page (`/our-services/finance-lending`) currently renders from **static dummy data** (`src/data/dummyFinanceServices.js`). The goal is to power it with a real backend.

- **Base URL:** `VITE_API_BASE_URL` env var, falls back to `/api` (see `src/api.js`)
- **Auth:** Optional for reads, required for writes (Bearer token via `Authorization: Bearer <accessToken>`). Token refresh handled automatically by the frontend.
- **HTTP client:** Axios, `validateStatus: 200–399`. Any response outside that range is treated as an error.
- **Success envelope:** `{ data: { items: [...] } }` for lists and `{ data: { ...record } }` for single records (see Vehicle section — the frontend reads `res.data?.data?.items || res.data?.items`).

---

## 2. Module 1 — Finance & Loan Services

### 2.1 Routes required

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/product/finance` | List/filter finance services |
| `GET` | `/product/finance/:id` | Fetch single finance service details |
| `GET` | `/product/finance/:id/similar` | Fetch related services in the same category (max 4) |
| `GET` | `/product/finance/my` | List services posted by the logged-in user |
| `POST` | `/product/finance` | **Create a new finance product** |
| `PUT` | `/product/finance/:id` | Update a finance product |
| `DELETE` | `/product/finance/:id` | Delete a finance product |
| `PATCH` | `/product/finance/:id/status` | Toggle active/inactive status |

> The frontend currently exposes only `financeAPI.create` in `src/api.js`. The GET/read endpoints above are the ones to be built; the backend should expose all so the frontend can be switched from dummy data to live API.

### 2.2 Finance product — full data model

Primary key: `id` (numeric in dummy data; `_id` accepted from MongoDB-style backends — the frontend normalises `id: v._id || v.id`).

| Field | Type | Required on Create | Source in UI | Notes |
|---|---|---|---|---|
| `serviceName` | string | **Yes (gap — see §2.4)** | Card title / search / loan-type filter | e.g. `"Home Loan"`, `"Instant Personal Loan"` |
| `category` | string | **Yes** | `FINANCE_CATEGORIES` dropdown | Must match one of the categories in §2.5 |
| `companyName` | string | **Yes** | Form "Company Name" | e.g. `"HDFC Ltd."` |
| `providerType` | string | No | `FINANCE_PROVIDER_TYPES` | `Bank` / `NBFC` / `Financial Institution` / `Individual Consultant` |
| `logo` | string (URL) | No | Upload "logo" (media optional) | Used on card + detail. Empty string falls back to a placeholder |
| `banner` | string (URL) | No | Upload "banner" (media optional) | Card hero image |
| `interestRate` | string | No | Form "Interest Rate" | Display string like `"7%"`, `"10.5% – 24%"`, `"N/A"`, `"Varies"`. **Also used for numeric filtering/sorting — see §2.6** |
| `minAmount` | string | No | Form "Minimum Amount (₹)" | Display string like `"₹5,00,000"`. Numeric filters parse this — see §2.6 |
| `maxAmount` | string | No | Form "Maximum Amount (₹)" | Display string like `"₹5,00,00,000"` |
| `tenure` | string | No | Not in create form | e.g. `"Up to 30 years"`, `"1 – 5 years"`. Shown in detail page; used for tenure filter |
| `description` | string | **Yes** | Form "Description" | Long text |
| `eligibility` | string[] | No | Form "Eligibility" (textarea, one per line) | Array of criteria |
| `documentsRequired` | string[] | No | Form "Documents Required" (textarea, one per line) | Array of docs |
| `processingTime` | string | No | Form "Processing Time" | e.g. `"3 – 7 working days"` |
| `features` | string[] | No | Not in create form | Benefit bullet list shown in detail page |
| `location` | string | No | Derived from City + Area | Display string e.g. `"Indiranagar, Bengaluru"` |
| `city` | string | **Yes** | Form "City" | City id from the locations list (e.g. `"bengaluru"`) |
| `area` | string | No | Form "Area" | Locality within the city |
| `pincode` | string | No | Not in create form | 6-digit; used by pincode filter |
| `contactPhone` | string | **Yes** | Form "Phone Number" | 10-digit; rendered as `tel:` link |
| `contactEmail` | string | **Yes** | Form "Email" | Rendered as `mailto:` link |
| `serviceMode` | string | No | `FINANCE_SERVICE_MODES` | `Online` / `Offline` / `Both` |
| `postedBy` | string | No | `FINANCE_POSTED_BY` | `Bank` / `Agent` / `Financial Consultant` |
| `availability` | string | No | `FINANCE_AVAILABILITY` | `Available Now` / `Appointment Required` |
| `status` | string | No | — | `"active"` / `"inactive"` (default `"active"`) |
| `featured` | boolean | No | — | Marks a card with a yellow "Featured" badge |
| `createdAt` | string (ISO) | No | — | Used for "Latest" sort (desc) |

### 2.3 Create finance product — `POST /product/finance`

Request body (JSON):

```json
{
  "serviceName": "Business Loan – Mudra & MSME",
  "category": "Business Loans",
  "companyName": "State Bank of India",
  "providerType": "Bank",
  "logo": "https://.../logo.svg",
  "banner": "https://.../banner.jpg",
  "interestRate": "9% – 14%",
  "minAmount": "₹1,00,000",
  "maxAmount": "₹2,00,00,000",
  "tenure": "1 – 10 years",
  "description": "Business loans under Mudra Yojana and MSME schemes...",
  "eligibility": ["Business owner / Proprietor", "CIBIL: 650+"],
  "documentsRequired": ["Aadhaar Card", "PAN Card", "ITR (2 years)"],
  "processingTime": "5 – 10 working days",
  "features": ["Government-backed schemes", "Collateral-free up to ₹10L"],
  "location": "MG Road, Bengaluru",
  "city": "bengaluru",
  "area": "MG Road",
  "pincode": "560001",
  "contactPhone": "+91 1800-456-7890",
  "contactEmail": "sme@example.com",
  "serviceMode": "Both",
  "postedBy": "Bank",
  "availability": "Available Now",
  "featured": false
}
```

**Validation rules** (mirrors `PostFinanceService.jsx`):

| Field | Rule |
|---|---|
| `companyName` | required, non-empty |
| `category` | required, must be one of §2.5 categories |
| `contactPhone` | required; digits-only after stripping `+`, spaces, dashes must equal 10 |
| `contactEmail` | required; valid email format |
| `city` | required; must be a known city id |
| `description` | required, non-empty |
| `interestRate` / `minAmount` / `maxAmount` | optional; store as display strings. Backend **must also store numeric equivalents** (`interestRateMin`, `interestRateMax`, `minAmountNumeric`, `maxAmountNumeric`) so the frontend filters can run server-side (see §2.6) |

**Success (201):**
```json
{
  "data": {
    "id": "64f1c2...",
    "serviceName": "Business Loan – Mudra & MSME",
    "...": "all created fields",
    "status": "active",
    "featured": false,
    "createdAt": "2026-08-03T10:00:00.000Z"
  }
}
```

**Errors:** `400` validation errors → `{ "message": "Company name is required", "errors": { "companyName": "Company name is required" } }`. `401` when unauthenticated. `403` when the user lacks permission.

### 2.4 Known data gaps (backend should accommodate)

The current create form does **not** collect: `serviceName`, `tenure`, `features`, `location`, `pincode`, `featured`, `status`. The UI still needs these.

**Recommended handling:**
- `serviceName` → **add to the form eventually**, but for now backend should derive it (e.g. from `category` + `companyName`) if absent, or default to `category`.
- `location` → backend derives as `"<Area>, <CityLabel>"` when not provided.
- `tenure` → default to a sensible value per category (e.g. `"1 – 5 years"`) when absent.
- `features` / `pincode` → default to empty/`null` when absent.
- `status` → always default `"active"`.
- `featured` → always default `false` on create.

### 2.5 Category enum (`category`)

```
Home Loans
Personal Loans
Vehicle Loans
Business Loans
Gold Loans
Education Loans
Insurance
Investment Services
Credit Cards
Financial Advisors
```

These also map 1:1 to the gallery tab strip (`FINANCE_TABS`) and to `FINANCE_CATEGORIES`.

### 2.6 List finance products with filters — `GET /product/finance`

Query params (all optional). The frontend currently applies these client-side in `financeHooks.js`; the backend should support them server-side (with equivalent semantics) so pagination is possible.

| Param | Type | Semantics |
|---|---|---|
| `category` | string | Exact match on `category` (from active tab) |
| `search` | string | Case-insensitive substring across `serviceName`, `companyName`, `category`, `location` |
| `loanTypes` | string[] | Match if any value appears (case-insensitive) inside `serviceName` |
| `amountMin` | number | `minAmountNumeric >= amountMin` |
| `amountMax` | number | `maxAmountNumeric <= amountMax` |
| `interestMin` | number | Services whose interest range **max** `>= interestMin` |
| `interestMax` | number | Services whose interest range **min** `<= interestMax` |
| `tenure` | string | One of `1–5 Years` / `5–10 Years` / `10–20 Years` / `20+ Years`; fuzzy match against `tenure` string (see §2.7) |
| `providerTypes` | string[] | Exact match on `providerType` |
| `serviceModes` | string[] | Exact match on `serviceMode` |
| `city` | string | Exact match on `city` |
| `localities` | string[] | Exact match on `area` |
| `pincode` | string | Exact match on `pincode` |
| `postedBy` | string[] | Exact match on `postedBy` |
| `availability` | string[] | Exact match on `availability` |
| `sortBy` | string | `latest` (default; `createdAt` desc / `id` desc), `interest-low` (min interest asc), `interest-high` (min interest desc) |
| `page` | number | 1-based (optional) |
| `limit` | number | default 100 (the vehicles API is called with `limit: 100`) |

**Success (200):**
```json
{
  "data": {
    "items": [ { "id": "64f1c2...", "serviceName": "...", "...": "all fields" } ],
    "total": 42,
    "page": 1,
    "limit": 100
  }
}
```

### 2.7 Interest / amount / tenure parsing rules (must match frontend)

The frontend parses display strings. To keep filters equivalent, the backend must store derived numeric fields on create/update:

- **Amount:** strip `₹`, commas, spaces; parse leading number. If value starts with `0` or is `N/A` → treat as `0`.
  - `"₹5,00,000"` → `500000`
- **Interest rate:** remove `%`, split on `–` (en-dash), parse floats.
  - `"10.5% – 24%"` → min `10.5`, max `24`
  - `"7%"` → min `7`, max `7`
  - `"N/A"` / `"Varies"` → min `0`, max `0`
- **Tenure filter** is intentionally fuzzy on the display string:
  - `1–5 Years` → tenure contains any of `1,2,3,4,5`
  - `5–10 Years` → contains any of `5,6,7,8,9,10`
  - `10–20 Years` → contains any of `10,15,20`
  - `20+ Years` → contains any of `20,25,30`

### 2.8 Single finance product — `GET /product/finance/:id`

Return the full record (§2.2). The detail page additionally needs:

- All fields in §2.2 (serviceName, category, companyName, providerType, logo, banner, interestRate, minAmount, maxAmount, tenure, description, features[], eligibility[], documentsRequired[], processingTime, location, contactPhone, contactEmail, availability).
- `GET /product/finance/:id/similar` → up to **4** records with the same `category`, excluding the current record. Used for "Related {Category}" section.

**Success (200):**
```json
{
  "data": {
    "id": "64f1c2...",
    "serviceName": "Business Loan – Mudra & MSME",
    "category": "Business Loans",
    "...": "all fields"
  }
}
```

**404** → `{ "message": "Service not found" }`.

---

## 3. Module 2 — Vehicles (existing live API, reference for fetch shape)

The Vehicles gallery (`/our-services/automobile`) **already** fetches from the live API. Finance reads should follow this exact convention.

### 3.1 Fetch — `GET /product/vehicles`

Called once on mount: `vehicleAPI.getAll({ limit: 100 })`.

**Response shape (IMPORTANT — the frontend reads `res.data?.data?.items || res.data?.items`):**
```json
{
  "data": {
    "items": [
      {
        "_id": "64f1c2...",          // Mongo id; frontend maps id = _id || id
        "id": "64f1c2...",
        "brand": "Maruti Suzuki",
        "model": "Swift VXI",
        "price": "₹8,00,000",
        "condition": "new",          // "new" | "old"
        "category": "4-wheeler",     // wheeler type: 2-wheeler | 3-wheeler | 4-wheeler | commercial
        "wheelerType": "4-wheeler",
        "fuelType": "Petrol",
        "year": "2024",
        "kmDriven": 0,
        "location": "Indiranagar, Bengaluru",
        "pincode": "560038",
        "images": ["https://.../1.jpg", "https://.../2.jpg"],
        "loanApproved": true,
        "createdAt": "2026-08-01T10:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 100
  }
}
```

### 3.2 Required vehicle fields (what the frontend consumes)

| Field | Used by |
|---|---|
| `id` / `_id` | card link `/vehicle/:id`, detail lookup |
| `brand`, `model` | card title, search |
| `price` | card price, price sort (`getNumericPrice`), budget filter |
| `condition` | New/Old toggle; `"new"` vs `"old"` badge; km filter only for `old` |
| `category` | vehicle-type strip filter (`2-wheeler`, `3-wheeler`, `4-wheeler`, `commercial`) |
| `wheelerType` | wheeler-type row filter |
| `fuelType` | fuel filter + tag |
| `year` | card tag |
| `kmDriven` | km-driven filter + card tag (old vehicles) |
| `location` | location filter + card display |
| `pincode` | card display |
| `images` | array; card uses `images[0]` |
| `loanApproved` | "Pre-Approved Loan" badge + pre-approved mode filter |
| `createdAt` | "Latest" sort |

---

## 4. Error-handling & response conventions

- **Envelope:** always `{ data: <record | { items: [] }> }`. Do not wrap errors inside `data`.
- **Errors:** non-2xx status with `{ "message": "<human readable>", "errors": { <field>: "<message>" } }` (optional per-field map).
- **Network errors:** frontend shows `"Cannot reach server. Make sure the backend is running on port 5001."` when the request never reaches the server — no backend change needed, just awareness.
- **Auth:** write endpoints require a valid Bearer token. `401` triggers the frontend's automatic refresh flow (`POST /auth/refresh`).

---

## 5. Open items / clarifications for the backend team

1. **Pagination:** Finance `GET` should default to `limit: 100` to match the vehicle gallery behaviour.
2. **Seed data:** Provide at least one finance service per category (§2.5) so tabs, search, and filters render meaningful results.
3. **Images:** Media upload in the create form is currently UI-only (file inputs are hidden, no upload wiring). Recommend a `POST /product/finance/:id/images` (multipart) endpoint mirroring the property module's `uploadImages`, or allow image URLs directly in the create payload.
4. **`serviceName`:** Form does not collect it today — agree with product on deriving it server-side or adding it to the form (documented gap, §2.4).
5. **Featured/status management:** Add admin/user endpoints to mark a service `featured` and toggle `status` (the `PATCH /product/finance/:id/status` and `GET /product/finance/my` routes above).
