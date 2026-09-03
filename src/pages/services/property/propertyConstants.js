/* ── Property Type Card Definitions ── */
export const PROPERTY_CARD_TYPES = [
  { id: 'All',              icon: 'fa-layer-group',    label: 'All' },
  { id: 'Lands',            icon: 'fa-tree',            label: 'Lands' },
  { id: 'Sites',            icon: 'fa-map',             label: 'Sites' },
  { id: 'Flat',             icon: 'fa-building',        label: 'Flat' },
  { id: 'Villa',            icon: 'fa-house-chimney',   label: 'Villa' },
  { id: 'Independent House',icon: 'fa-home',            label: 'Independent House' },
];

export const CITY_OPTIONS = [{ id: 'bengaluru', label: 'Bangalore' }];

/* ── Filter Constants ── */
export const BUDGET_RANGES = [
  { label: '₹5 L – ₹20 L',  min: 500000,    max: 2000000  },
  { label: '₹20 L – ₹50 L', min: 2000000,   max: 5000000  },
  { label: '₹50 L – ₹1 Cr', min: 5000000,   max: 10000000 },
  { label: '₹1 Cr+',         min: 10000000,  max: Infinity },
];

export const SIZE_OPTIONS        = [600, 1200, 2400];
export const BEDROOM_OPTIONS     = ['1 RK','1 BHK','1.5 BHK','2 BHK','2.5 BHK','3 BHK','3.5 BHK','4 BHK','5 BHK','6 BHK','6+ BHK'];
export const FURNISHING_OPTIONS  = ['Furnished','Semi-Furnished','Unfurnished'];
export const POSTED_BY_OPTIONS   = ['Owner','Builder','Partner Agent','Dealer'];
export const POSSESSION_OPTIONS  = ['Ready for Registration','Ready to Occupy'];
export const FACING_OPTIONS      = ['East','West','North','South','North-East','North-West','South-East','South-West'];
export const AGE_OPTIONS         = ['New','0–1 Years','1–5 Years','5–10 Years','10+ Years'];
export const AVAILABILITY_OPTIONS= ['15 Days','1 Month','3 Months','6 Months','1 Year','More than a year'];
export const AMENITIES_LIST = [
  '24×7 Security', 'CCTV', 'Power Backup', 'Lift', 'Swimming Pool',
  'Clubhouse', 'Gym', "Children's Play Area", 'Garden',
  '2 Wheeler Parking', '4 Wheeler Parking', 'Visitor Parking',
  'Intercom', 'Wi-Fi', 'Solar Power', 'EV Charging', 'Community Hall',
];

export const FINANCE_STATS        = { enquiries: 5, enrolled: 6, slots: 25 };
export const FINANCE_FOCUS_AREAS  = ['NRI Loans','Loan Against Property','Construction Loans'];
export const FINANCE_INCENTIVES   = ['0% Processing Fee','Quick Approval','Flexible EMI'];

/* ── Initial State ── */
export const INITIAL_FILTERS = {
  budgetMin: '', budgetMax: '',
  sizeMin: '', sizeMax: '',
  buildingType: [], propertyType: [], bedrooms: [], localities: [],
  furnishing: [], gatedCommunity: false, postedBy: [], possessionStatus: [],
  amenities: [], facing: [], propertyAge: [], availability: [],
  loanApprovedOnly: false,
};

export const INITIAL_SECTIONS = {
  budget: true, size: true, buildingType: true, propertyType: true,
  bedrooms: true, localities: true, furnishing: true, gatedCommunity: true,
  loanAvailability: true,
  postedBy: true, possessionStatus: true, amenities: false, facing: false,
  propertyAge: false, availability: false,
};
