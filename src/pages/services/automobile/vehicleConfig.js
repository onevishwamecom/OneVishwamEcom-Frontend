/**
 * Automobile Sector Configuration
 */

export const VEHICLE_TYPE_STRIP = [
  { id: 'All', icon: 'fa-layer-group', label: 'All' },
  { id: '2-wheeler', icon: 'fa-motorcycle', label: '2-Wheeler' },
  { id: '3-wheeler', icon: 'fa-truck-pickup', label: '3-Wheeler' },
  { id: '4-wheeler', icon: 'fa-car', label: '4-Wheeler' },
  { id: 'commercial', icon: 'fa-truck', label: 'Commercial' },
];

export const WHEELER_OPTIONS = ['All', '2-wheeler', '3-wheeler', '4-wheeler', 'Commercial'];

export const VEHICLE_BUDGET_CHIPS = [
  { label: 'Under ₹1L', min: 0, max: 100000 },
  { label: '₹1L – ₹5L', min: 100000, max: 500000 },
  { label: '₹5L – ₹15L', min: 500000, max: 1500000 },
  { label: '₹15L – ₹30L', min: 1500000, max: 3000000 },
  { label: '₹30L+', min: 3000000, max: Infinity },
];

export const FUEL_TYPE_OPTIONS = ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'];
export const BODY_TYPE_OPTIONS = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible'];
export const TRANSMISSION_OPTIONS = ['Manual', 'Automatic'];
export const OWNERSHIP_OPTIONS = ['1st Owner', '2nd Owner', '3rd Owner+'];

export const vehicleListingConfig = {
  sector: 'automobile',
  eyebrow: 'OneVishwam · Automobile',
  title: 'Vehicles & Auto Marketplace',
  subtitle: 'Verified new & pre-owned 2-wheelers, cars, commercial vehicles with pre-approved loans.',
  categories: VEHICLE_TYPE_STRIP,
  emptyState: {
    icon: 'fa-solid fa-car',
    title: 'No vehicles found.',
    subtitle: 'Try a different category or condition.',
  },
};
