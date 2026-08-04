# API Requirements — Jewellery & Gold Module

> Scope: Backend API required by the Vishwam Frontend for the **Jewellery & Gold** module.
> This document covers (1) **creating** a new jewellery product, (2) **fetching** jewellery products (list + details), and (3) **fetching** products in the **Vehicles** section (the reference live API the frontend already consumes).
> Hand this file to the backend codebase / an OpenCode model to implement the endpoints.

---

## 1. Overview

The Jewellery & Gold page (`/our-services/jewellery-gold`) currently renders from **static dummy data** (`src/data/dummyJewellery.js`). The goal is to power it with a real backend.

- **Base URL:** `VITE_API_BASE_URL` env var, falls back to `/api` (see `src/api.js`)
- **Auth:** Optional for reads, required for writes (Bearer token via `Authorization: Bearer <accessToken>`). Token refresh handled automatically by the frontend.
- **HTTP client:** Axios, `validateStatus: 200–399`. Anything outside that range is an error.
- **Success envelope:** `{ data: { items: [...] } }` for lists and `{ data: { ...record } }` for single records (the Vehicles section shows the exact convention the frontend reads: `res.data?.data?.items || res.data?.items`).

---

## 2. Module 1 — Jewellery & Gold

### 2.1 Routes required

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/product/jewellery` | List/filter jewellery products |
| `GET` | `/product/jewellery/:id` | Fetch single product details |
| `GET` | `/product/jewellery/:id/similar` | Fetch related products in the same category (max 4) |
| `GET` | `/product/jewellery/my` | List products posted by the logged-in user |
| `POST` | `/product/jewellery` | **Create a new jewellery product** |
| `PUT` | `/product/jewellery/:id` | Update a jewellery product |
| `DELETE` | `/product/jewellery/:id` | Delete a jewellery product |
| `PATCH` | `/product/jewellery/:id/status` | Toggle active/inactive status |

> The frontend currently exposes only `jewelleryAPI.create` in `src/api.js`. The GET/read endpoints are the ones to be built; the backend should expose all routes so the frontend can switch from dummy data to live API.

### 2.2 Jewellery product — full data model (display model)

The gallery and detail pages consume these fields (from `dummyJewellery.js`). Primary key: `id` (numeric in dummy data; `_id` accepted from MongoDB-style backends — frontend normalises `id: v._id || v.id`).

| Field | Type | Used by | Notes |
|---|---|---|---|
| `id` / `_id` | number/string | card link `/jewellery/:id`, detail lookup | |
| `name` | string | card title, search, detail title | e.g. `"Classic Gold Necklace Set"` |
| `metalType` | string | card tag, metal filter, detail | e.g. `Gold`, `Silver`, `Diamond`, `Platinum` |
| `purity` | string | card tag (`metalType + purity`), metal filter | e.g. `22K`, `18K`, `92.5%`, `950` |
| `weightGrams` | number | weight filter, card tag, detail | e.g. `32.5` |
| `price` | string | card price, budget filter, sort | display string e.g. `"₹ 1,85,000"` (numeric filters parse it — §2.6) |
| `makingCharges` | string | card footer, detail | e.g. `"₹ 8,500"` |
| `category` | string | category strip, category filter, related items | one of §2.5 |
| `occasion` | string[] | occasion filter, card tags, detail | e.g. `["Wedding", "Festival"]` |
| `certified` | boolean | "Certified" badge, detail Certification card | |
| `certificationBody` | string | detail "✓ {body} Certified" | e.g. `BIS Hallmark`, `IGI`, `SGL`, `GIA` |
| `gender` | string | gender filter, detail | `Women` / `Men` / `Kids` / `Unisex` |
| `tryAtHome` | boolean | "Try at Home" badge, filter, CTA button | |
| `aiRecommended` | boolean | "AI Pick" badge, detail AI card | |
| `images` | string[] | card `images[0]`, detail gallery thumbnails | URLs |
| `store` | object | card location/pincode, detail store card | shape below |
| `store.name` | string | detail store card | e.g. `"Vishwam Jewellers"` |
| `store.city` | string | card location, search | e.g. `"Bangalore"`, `"Mysore"` |
| `store.pincode` | string | card pincode | 6-digit |
| `store.address` | string | detail store card | full address string |
| `createdAt` | string (ISO) | "Latest" sort (fallback: `id` desc) | |

### 2.3 Create jewellery product — `POST /product/jewellery`

The frontend create payload (from the "Post Your Listing" flow, `add-listing/index.jsx:498`):

```json
{
  "name": "Classic Gold Necklace Set",
  "category": "Gold",
  "material": "Gold",
  "price": "₹ 1,85,000",
  "city": "bengaluru",
  "purity": "22K",
  "weight": 32.5,
  "weightUnit": "grams",
  "gemstone": "",
  "occasion": "Wedding",
  "images": ["https://.../photo1.jpg", "https://.../photo2.jpg"]
}
```

> **IMPORTANT — create/display model mismatch.** The create payload uses a flattened, generic schema (`material`, `weight`, `weightUnit`, `occasion` as string, `city`), while the gallery/detail UI needs the richer display model (`metalType`, `weightGrams`, `makingCharges`, `certified`, `certificationBody`, `gender`, `tryAtHome`, `aiRecommended`, `store` object, `occasion` as array).
> The backend should **accept the flattened payload on create** and either:
> 1. Accept additional rich fields too, and return the display model on reads, or
> 2. Map/derive them (see §2.4 recommended derivations).

**Validation rules (required):**

| Field | Rule |
|---|---|
| `name` | required, non-empty |
| `price` | required; store as display string + numeric (`priceValue`) for filtering/sorting |
| `city` | required; must be a known city id (e.g. `bengaluru`) |
| `images` | required; at least 1 URL (`canNext` step 3 requires `photos.length > 0`) |
| `category` | optional in create; if empty default to `"Gold"` |
| `weight` | optional; default `0` |

**Success (201):**
```json
{
  "data": {
    "id": "64f1c2...",
    "name": "Classic Gold Necklace Set",
    "...": "all display-model fields",
    "status": "active",
    "featured": false,
    "createdAt": "2026-08-04T10:00:00.000Z"
  }
}
```

**Errors:** `400` validation → `{ "message": "...", "errors": { "<field>": "..." } }`. `401` unauthenticated. `403` no permission.

### 2.4 Recommended server-side derivations (create/update)

Because the create form is generic, the backend should fill display fields so the UI renders correctly:

| Display field | Derivation when absent |
|---|---|
| `metalType` | = `material` (create payload), else `"Gold"` |
| `weightGrams` | = `weight` when `weightUnit === "grams"`, else convert |
| `occasion` (array) | = split `occasion` string by comma/space, else `[]` |
| `makingCharges` | default `"₹ 0"` |
| `certified` | default `false` |
| `certificationBody` | empty string |
| `gender` | default `"Women"` |
| `tryAtHome` | default `false` |
| `aiRecommended` | default `false` |
| `store` | build `{ name: <company or "Vishwam Jewellers">, city: <city label>, pincode: <form pincode or default>, address: "" }` |
| `priceValue` | numeric parse of `price` (strip `₹`, commas, spaces) |
| `status` | `"active"` |
| `featured` | `false` |

### 2.5 Category enum (`category`)

```
Gold
Silver
Diamond
Platinum
Gemstone
Bridal
Antique
```

These map 1:1 to the gallery category pill strip (`CATEGORIES` in `JewelleryGallery.jsx`).

### 2.6 List jewellery products with filters — `GET /product/jewellery`

Query params (all optional). The frontend applies these client-side today; the backend should support them server-side for pagination.

| Param | Type | Semantics |
|---|---|---|
| `category` | string | Exact match on `category` (active category pill) |
| `search` | string | Case-insensitive substring across `name`, `metalType`, `store.city` |
| `occasions` | string[] | Match if **any** selected occasion is present in the product's `occasion` array |
| `budgetMin` | number | `priceValue >= budgetMin` |
| `budgetMax` | number | `priceValue <= budgetMax` |
| `metals` | string[] | Match if `metalType + " " + purity` contains the option **or** `metalType` contains it (e.g. `"Gold 22K"`, `"Gold"`, `"Platinum"`, `"White Gold"`) |
| `weightMin` | number | `weightGrams >= weightMin` |
| `weightMax` | number | `weightGrams <= weightMax` |
| `genders` | string[] | Exact match on `gender` |
| `availability` | string[] | Only `Try At Home` actually filters: product matches if `tryAtHome === true`. (`Store Pickup` / `Home Delivery` are display-only at present) |
| `sortBy` | string | `latest` (default; `createdAt`/`id` desc), `price-low`, `price-high` |
| `page` | number | 1-based (optional) |
| `limit` | number | default 100 (vehicles gallery calls with `limit: 100`) |

**Success (200):**
```json
{
  "data": {
    "items": [ { "id": "64f1c2...", "name": "...", "...": "all fields" } ],
    "total": 42,
    "page": 1,
    "limit": 100
  }
}
```

### 2.7 Single product + related — `GET /product/jewellery/:id`

Return the full display model (§2.2). Detail page needs: `name`, `metalType`, `purity`, `weightGrams`, `price`, `makingCharges`, `category`, `gender`, `occasion[]`, `certified`, `certificationBody`, `tryAtHome`, `aiRecommended`, `images[]`, `store{name, city, pincode, address}`.

`GET /product/jewellery/:id/similar` → up to **4** records with the same `category`, excluding the current record. Used for "More {Category} Jewellery".

**404** → `{ "message": "Item not found" }`.

---

## 3. Module 2 — Vehicles (existing live API, reference for fetch shape)

The Vehicles gallery (`/our-services/automobile`) **already** fetches from the live API. Jewellery reads should follow this exact convention.

### 3.1 Fetch — `GET /product/vehicles`

Called once on mount: `vehicleAPI.getAll({ limit: 100 })`.

**Response shape (IMPORTANT — frontend reads `res.data?.data?.items || res.data?.items`):**
```json
{
  "data": {
    "items": [
      {
        "_id": "64f1c2...",
        "id": "64f1c2...",
        "brand": "Maruti Suzuki",
        "model": "Swift VXI",
        "price": "₹8,00,000",
        "condition": "new",
        "category": "4-wheeler",
        "wheelerType": "4-wheeler",
        "fuelType": "Petrol",
        "year": "2024",
        "kmDriven": 0,
        "location": "Indiranagar, Bengaluru",
        "pincode": "560038",
        "images": ["https://.../1.jpg"],
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
| `condition` | New/Old toggle + badge; km filter only for `old` |
| `category` | vehicle-type strip (`2-wheeler`, `3-wheeler`, `4-wheeler`, `commercial`) |
| `wheelerType` | wheeler-type row filter |
| `fuelType` | fuel filter + tag |
| `year` | card tag |
| `kmDriven` | km filter + card tag (old vehicles) |
| `location` | location filter + card display |
| `pincode` | card display |
| `images` | array; card uses `images[0]` |
| `loanApproved` | "Pre-Approved Loan" badge + pre-approved mode filter |
| `createdAt` | "Latest" sort |

---

## 4. Error-handling & response conventions

- **Envelope:** always `{ data: <record | { items: [] }> }`. Do not wrap errors inside `data`.
- **Errors:** non-2xx with `{ "message": "<human readable>", "errors": { <field>: "<message>" } }` (optional per-field map).
- **Auth:** write endpoints require a valid Bearer token. `401` triggers the frontend's automatic refresh flow (`POST /auth/refresh`).
- **Images:** store absolute URLs. Cards use `images[0]`; the detail page shows all images as a gallery.

---

## 5. Open items / clarifications for the backend team

1. **Create vs display schema:** the "Post Your Listing" form sends the flattened generic payload (§2.3), but the UI needs the rich display model (§2.2). Agree on the mapping/derivations in §2.4, or extend the jewellery-specific create form to send rich fields.
2. **Jewellery is not currently a selectable category** in the add-listing UI (`CATEGORIES` list has real-estate/vehicle/grocery/garment/finance/service only — jewellery is defined in the submit map but has no UI tile). Confirm whether a dedicated jewellery listing flow is planned.
3. **Media upload:** image URLs are currently placeholder (`https://example.com/photoN.jpg`). Recommend `POST /product/jewellery/:id/images` (multipart) mirroring the property module's `uploadImages`, or accept URLs directly in the payload.
4. **Numeric price:** store `priceValue` (parsed number) alongside `price` (display string) for budget filters and price sorting.
5. **Featured/status management:** add endpoints to mark a product `featured` and toggle `status` (the `PATCH /product/jewellery/:id/status` and `GET /product/jewellery/my` routes above).
6. **Seed data:** provide at least one product per category (§2.5) so the category strip, search, and filters render meaningful results.
