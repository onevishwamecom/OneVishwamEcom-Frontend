# OneVishwamEcom-Frontend

A React-based multi-business ecosystem frontend covering real estate, finance, automobile, garments, grocery, jewellery, careers, and more.

## Current Status

| Module | Status | Data Source |
|--------|--------|-------------|
| Real Estate (Properties) | ✅ Live | `http://localhost:5001/api/properties` |
| Finance / Lending | 🚧 Static | Dummy data |
| Automobile | 🚧 Static | Dummy data |
| Garments, Grocery, Jewellery | 🚧 Static | Dummy data |
| Auth (Login/OTP/Reset) | ✅ Live | `http://localhost:5001/api/auth/*` |
| Contact / Enquiry | ✅ Live | EmailJS |

All real estate data has been migrated from static dummy files to live API integration. Other modules still use local dummy data and are pending backend integration.

## Tech Stack

- **React 18** with functional components & hooks
- **React Router v6** — lazy-loaded route splitting
- **Redux Toolkit** — auth (`authSlice`), location (`locationSlice`)
- **Vite** — build tool
- **Tailwind CSS** — utility-first styling
- **Font Awesome** (free) — icon set
- **Jest + React Testing Library** — unit tests
- **EmailJS** — contact/enquiry form delivery

## Project Structure

```
src/
├── App.jsx                          # Root router with lazy routes
├── main.jsx                         # Vite entry point
├── api.js                           # Axios instance & interceptors
├── hooks/
│   └── useProperties.js             # Custom hook — fetches properties from API
├── config/
│   ├── navigation.js                # Custom navigation event helper
│   └── emailjs.js                   # Centralized EmailJS config
├── store/
│   ├── index.js                     # Redux store
│   ├── authSlice.js                 # Auth state (login, logout, session)
│   └── locationSlice.js             # Selected city/area state
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx                   # (rendered in App.jsx)
│   ├── PageHero.jsx
│   ├── Field.jsx
│   ├── FilterSidebar.jsx
│   ├── MobileFilterDrawer.jsx
│   ├── SearchSortBar.jsx
│   ├── SlideinPanel.jsx
│   └── ui/BrandLoader.jsx
├── data/
│   ├── siteContent.js               # Global content strings
│   ├── servicesContent.js           # Service card definitions
│   ├── locations.js                 # Cities & areas lookup
│   ├── homeContent.js
│   ├── aboutContent.js
│   ├── footerContent.js
│   ├── dummyFinance.js              # Still static — pending backend
│   ├── dummyFinanceServices.js      # Still static — pending backend
│   ├── dummyLoans.js                # Still static — pending backend
│   ├── dummyAutomobiles.js          # Still static — pending backend
│   ├── dummyGarments.js             # Still static — pending backend
│   ├── dummyGroceries.js            # Still static — pending backend
│   ├── dummyGrocery.js              # Still static — pending backend
│   └── dummyJewellery.js            # Still static — pending backend
├── pages/
│   ├── home/index.jsx               # Landing page — properties from API
│   ├── about/index.jsx
│   ├── contact/
│   │   ├── index.jsx
│   │   ├── ContactHero.jsx
│   │   ├── ContactSidebar.jsx
│   │   └── EnquiryForm.jsx
│   ├── careers/
│   │   ├── index.jsx
│   │   ├── CareersHero.jsx
│   │   └── ApplicationForm.jsx
│   ├── auth/
│   │   ├── ForgotPassword.jsx
│   │   ├── VerifyOtp.jsx
│   │   ├── ResetPassword.jsx
│   │   └── ResetSuccess.jsx
│   ├── profile/Settings.jsx
│   ├── add-listing/index.jsx
│   └── services/
│       ├── index.jsx                # Service listing grid
│       ├── ServiceDetails.jsx
│       ├── ProductCard.jsx          # Reusable product card
│       ├── GalleryComponents.jsx     # Shared gallery UI
│       ├── property/                # Real Estate module (API-backed)
│       ├── finance/                 # Finance/Lending module
│       ├── automobile/
│       ├── garments/
│       ├── grocery/
│       └── jewellery/
└── services/
    ├── FinanceFlow.jsx              # Finance flow wizard
    └── FinanceDashboard.jsx
```

---

## Real Estate Module

The real estate module lives under `src/pages/services/property/` and is accessible at `/our-services/real-estate-property` (listing) and `/property/:id` (details).

All real estate data is fetched from the backend API at `http://localhost:5001/api/properties`. The static `dummyProperties.js` file has been removed.

### API Integration

| Endpoint | Hook / Function | Used By |
|----------|----------------|---------|
| `GET /api/properties` | `useProperties()` | `PropertyGallery`, `FeaturedProperties`, `Home`, `QuickMatchModal` |
| `GET /api/properties/:id` | `propertyAPI.getById()` | `PropertyDetails` |

#### API Response Format

```
GET /api/properties
```
```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "data": {
    "properties": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 7,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    },
    "filters": {}
  }
}
```

```
GET /api/properties/:id
```
```json
{
  "success": true,
  "data": {
    "property": { ... }
  }
}
```

#### Data Hook: `useProperties()`

```js
// src/hooks/useProperties.js
const { properties, loading, error } = useProperties();
```

Returns:
- `properties` — array of property objects
- `loading` — boolean, true while fetching
- `error` — error object or null

The hook auto-extracts the array from various response shapes (`data.properties`, `data.data`, direct array, etc.).

### Components (11 files + 1 shared hook)

| File | Purpose |
|------|---------|
| `PropertyGallery.jsx` | Main listing page — search bar, filters, grid, finance panel, quick match modal, call centre CTA |
| `PropertyDetails.jsx` | Single property detail hero, description, amenities, facts, agent card, home loan CTA |
| `PropertyFilterSidebar.jsx` | 15-section collapsible filter panel with budget, size, bedrooms, localities, furnishing, etc. |
| `PropertyTypeStrip.jsx` | Horizontal pill strip for All / Lands / Sites / Flat / Villa / Independent House |
| `PostRequirement.jsx` | Multi-section requirement form (property details → location → budget → additional → contact) |
| `RequirementSuccess.jsx` | Post-submission confirmation screen |
| `QuickMatchModal.jsx` | 3-step modal wizard: enter criteria → bucketed results (pre-approved/shortlisted/closed) → next steps |
| `PropertyFinancePanel.jsx` | Finance options panel — home loan (via `FinanceFlow`), construction loan, other finance |
| `propertyConstants.js` | Filter options, budget ranges, amenities list, initial filter/section state |
| `propertyHooks.js` | `useCardTypeStats`, `useActiveChips`, `useFilteredProperties` — all filtering & search logic |
| `propertyHelpers.js` | `getPropertyType`, `getCardType`, `getBedrooms`, `getBuildingType`, `getDetailTags`, `getStatusBadge`, price/area parsing |
| `src/hooks/useProperties.js` | Shared hook — fetches all properties from API, returns `{ properties, loading, error }` |

### Features Implemented

- **6 property card types**: All, Lands, Sites, Flat, Villa, Independent House
- **15 filter categories**: Budget, Size, Building Type, Property Type, Bedrooms (1RK–6+ BHK), Localities (searchable), Furnishing, Gated Community, Loan Availability, Posted By, Possession Status, Amenities (20 options), Facing (8 directions), Property Age, Availability, Listed Within
- **Pre-approved loan mode** — toggle to view only loan-approved properties
- **Family locations only** toggle
- **Quick match modal** — 3-step wizard with bucketed results
- **Post requirement form** — 10+ property types (house/flat/villa/plot/land/farm/commercial/rental), Buy/Rent/Lease, bedrooms, location with searchable areas, pincode, budget, additional requirements, contact details
- **Finance integration** — Home loan (via `FinanceFlow`), Construction Loan, Other Finance (NRI Loans, LAP, etc.)
- **Sorting**: Latest, Price ↑, Price ↓
- **Responsive**: Desktop sidebar + mobile filter drawer with bottom CTA
- **Active filter chips** with individual removal
- **Loading spinner & error states** — graceful handling of API failures

### Current Routes

| Route | Component | Data |
|-------|-----------|------|
| `/our-services/real-estate-property` | `PropertyGallery` (via `ServicesPage` + `ServiceDetails`) | `GET /api/properties` |
| `/property/:id` | `PropertyDetails` | `GET /api/properties/:id` |
| `/property/requirement` | `PostRequirement` | Form submit via `propertyAPI.submitRequirement()` |
| `/property/requirement/success` | `RequirementSuccess` | Static confirmation |

### Data Model — JSON Structure

Below is the property object shape returned by the backend API.

```json
{
  "_id": "6a43d1c593a8e602a4db94c1",
  "id": 10,
  "title": "North Bangalore Development Plot",
  "subtitle": "Development Plot for Sale in Yelahanka, Bangalore",
  "description": "Corner development plot in Yelahanka's fastest-growing corridor...",
  "location": "Yelahanka, Bangalore",
  "city": "bengaluru",
  "zone": "Yelahanka",
  "price": "₹ 1.85 Cr",
  "numericPrice": 18500000,
  "priceSuffix": "Per Acre",
  "bhk": "N/A",
  "bathrooms": "N/A",
  "area": "2.5 Acre",
  "numericArea": 108900,
  "furnishing": "N/A",
  "floor": "N/A",
  "parking": "Open",
  "extraRoom": "Corner Plot",
  "recentlyAdded": true,
  "pincode": "560064",
  "loanApproved": true,
  "shortlisted": false,
  "status": "available",
  "projectCount": 1,
  "totalUnits": 1,
  "availableUnits": 1,
  "buildingType": "Residential",
  "propertyType": "Lands",
  "facing": "",
  "propertyAge": "",
  "availability": "",
  "postedBy": "",
  "possessionStatus": "",
  "gatedCommunity": false,
  "amenities": [],
  "featured": false,
  "agent": {
    "name": "Suresh Patel",
    "type": "LAND EXPERT",
    "avatar": "https://ui-avatars.com/api/?name=Suresh+Patel&background=16A34A&color=fff"
  },
  "images": [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
  ],
  "createdAt": "2026-06-30T14:25:09.019Z",
  "updatedAt": "2026-06-30T14:25:09.019Z"
}
```

#### Field Reference

| Field | Type | Description | Used In |
|-------|------|-------------|---------|
| `id` | number | Unique property identifier | Routing, details lookup |
| `_id` | string | MongoDB ObjectId | Backend reference |
| `title` | string | Property name / project name | Cards, detail hero |
| `subtitle` | string | Short description (e.g. "4 BHK Flat for Rent...") | Cards, search matching |
| `description` | string | Long-form description | Details page |
| `location` | string | Human-readable address | Cards, detail hero, search |
| `city` | string | City slug (`bengaluru`) | City filter, route context |
| `zone` | string | Area/neighbourhood name | Locality filter |
| `price` | string | Display price (e.g. `₹ 3.75 L`, `₹ 1.20 Cr`) | Cards, detail hero |
| `numericPrice` | number | Machine-readable price for sorting & filtering | Sort, budget filter |
| `priceSuffix` | string | Suffix like `/ Per Month`, `Negotiable`, `Contact for Price` | Price display |
| `bhk` | string | Bedroom label (`4 BHK`, `Office Space`, `Commercial Shop`, `N/A`) | Bedroom filter, tags |
| `bathrooms` | string | Bathroom info (`N/A` for plot/land) | Detail facts |
| `area` | string | Area text (`1500 Sq.Ft.`, `2.5 Acre`) | Size filter, tags |
| `numericArea` | number | Machine-readable area in sq.ft | Size filter |
| `furnishing` | string | `Furnished` / `Semi-Furnished` / `Unfurnished` / `N/A` | Furnishing filter |
| `floor` | string | Floor info (`20th of 20 Floors`, `Ground`, `N/A`) | Tags |
| `parking` | string | Parking info (`2 Covered + 2 Open`, `N/A`) | Tags |
| `extraRoom` | string | Notable feature (Pool, Garden, Borewell, etc.) | Card display |
| `recentlyAdded` | boolean | Whether listed today | "New" badge, "Listed Within" filter |
| `pincode` | string | 6-digit PIN code | Pincode filter, detail facts |
| `loanApproved` | boolean | Pre-approved loan availability | Loan filter, loan badge, finance panel |
| `shortlisted` | boolean | Marked as shortlisted | "Shortlisted" badge |
| `status` | string | `available` / `closed` / `under-negotiation` | Status badge, quick match buckets |
| `projectCount` | number | Total projects count | Type strip stats |
| `totalUnits` | number | Total units in project | Gallery stats, detail sidebar |
| `availableUnits` | number | Available units | Gallery stats, detail sidebar |
| `buildingType` | string | `Residential` / `Commercial` | Building type filter |
| `propertyType` | string | `Flats` / `Villas` / `Lands` / `Commercial` etc. | Property type filter |
| `gatedCommunity` | boolean | Whether part of a gated community | Gated community filter |
| `amenities` | string[] | List of amenities | Amenities filter |
| `featured` | boolean | Featured listing flag | Featured badge |
| `agent` | object | Listing agent `{name, type, avatar}` | Card, detail sidebar |
| `images` | string[] | Array of image URLs | Gallery, detail image carousel |
| `createdAt` | string | ISO timestamp of creation | Timestamp display |
| `updatedAt` | string | ISO timestamp of last update | — |

#### Property Type Classification (derived, not stored)

The frontend derives these categories from `subtitle` and `bhk` fields via helpers:

| Card Type (PropertyTypeStrip) | Property Type (filter) | Building Type | Criteria |
|------------------------------|------------------------|---------------|----------|
| Lands | Lands | Residential | subtitle contains "agricultural", "raw land", "development plot" |
| Sites | Plots | Residential | subtitle contains "plot", "site", "land" |
| Flat | Flats | Residential | subtitle contains "flat", "apartment", "penthouse" or bhk contains "bhk" |
| Villa | Villas | Residential | subtitle contains "villa", "farmhouse" |
| Independent House | Houses | Residential | subtitle contains "house" |
| _mapped to Flat_ | Commercial | Commercial | bhk or subtitle contains "office", "shop", "commercial" |

#### Requirement Form Post Body (for backend)

```json
{
  "lookingFor": "flat",
  "requirementType": "Buy",
  "bedrooms": "3 BHK",
  "sizeMin": 1000,
  "sizeMax": 2000,
  "city": "bengaluru",
  "area": "Whitefield",
  "pincode": "560066",
  "budgetMin": 5000000,
  "budgetMax": 10000000,
  "additional": "Near a school and hospital with covered parking",
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com"
}
```

| Field | Type | Values |
|-------|------|--------|
| `lookingFor` | string | `house`, `flat`, `villa`, `plot`, `land`, `farm-land`, `commercial-shop`, `office`, `warehouse`, `rental-house`, `rental-flat` |
| `requirementType` | string | `Buy`, `Rent`, `Lease` |
| `bedrooms` | string | `1 BHK` – `5+ BHK` (omitted for plots/land) |
| `sizeMin` / `sizeMax` | number | Area range in sq.ft |
| `city` | string | City slug |
| `area` | string | Neighbourhood name |
| `pincode` | string | 6-digit PIN |
| `budgetMin` / `budgetMax` | number | Budget range in rupees |
| `additional` | string | Free-text requirements |
| `name` | string | Required |
| `phone` | string | Required, 10-15 digits with optional `+` |
| `email` | string | Optional, validated format |

### Filter Constants Reference

```js
// propertyConstants.js
BUDGET_RANGES:     ['₹5 L – ₹20 L', '₹20 L – ₹50 L', '₹50 L – ₹1 Cr', '₹1 Cr+']
SIZE_OPTIONS:      [600, 1200, 2400]  // sq.ft
BEDROOM_OPTIONS:   ['1 RK','1 BHK','1.5 BHK','2 BHK','2.5 BHK','3 BHK','3.5 BHK','4 BHK','5 BHK','6 BHK','6+ BHK']
FURNISHING_OPTIONS:['Furnished','Semi-Furnished','Unfurnished']
POSTED_BY_OPTIONS: ['Owner','Builder','Partner Agent','Dealer']
POSSESSION_OPTIONS:['Ready To Move','Under Construction','New Launch','Resale']
FACING_OPTIONS:    ['East','West','North','South','North-East','North-West','South-East','South-West']
AGE_OPTIONS:       ['New','0–1 Years','1–5 Years','5–10 Years','10+ Years']
AVAILABILITY_OPTIONS:['Available Now','Available Soon']
LISTED_WITHIN_OPTIONS:['Today','Last 3 Days','Last 7 Days','Last 30 Days']
AMENITIES_LIST:    ['24×7 Security','CCTV','Power Backup','Lift','Swimming Pool','Clubhouse','Gym',
                    "Children's Play Area",'Garden','Jogging Track','Visitor Parking','Covered Parking',
                    'Open Parking','Attached Market','Central AC','Intercom','Wi-Fi',
                    'Rain Water Harvesting','Solar Power','EV Charging','Community Hall']
```

---

## Other Service Modules

- **Finance/Lending** — `src/pages/services/finance/` — gallery, details, post service, loan quick match, filter sidebar, card components, custom hooks, constants
- **Automobile** — `src/pages/services/automobile/` — vehicle gallery, details, finance panel, filter sidebar, showroom modal, quick match, type strip
- **Garments, Grocery, Jewellery** — each follow the same pattern: gallery + details + data
- **Careers** — hero + application form with Cloudinary resume upload
- **Contact** — enquiry form with EmailJS integration

### Pending Backend Integration

The following modules still use local dummy data files and need API endpoints:

| Module | Dummy File | Needed Endpoint |
|--------|-----------|-----------------|
| Finance | `dummyFinance.js` | `GET /api/finance` |
| Loans | `dummyLoans.js` | `GET /api/loans` |
| Finance Services | `dummyFinanceServices.js` | `GET /api/finance-services` |
| Automobile | `dummyAutomobiles.js` | `GET /api/vehicles` |
| Garments | `dummyGarments.js` | `GET /api/garments` |
| Grocery | `dummyGrocery.js`, `dummyGroceries.js` | `GET /api/grocery` |
| Jewellery | `dummyJewellery.js` | `GET /api/jewellery` |

## Available Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build
npm test           # Run Jest tests
```
