/**
 * Jewellery & Gold Sector Configuration
 */

export const JEWELLERY_CATEGORIES = [
  { id: 'All', icon: 'fa-gem', label: 'All' },
  { id: 'Gold', icon: 'fa-coins', label: 'Gold' },
  { id: 'Silver', icon: 'fa-ring', label: 'Silver' },
  { id: 'Diamond', icon: 'fa-crown', label: 'Diamond' },
  { id: 'Platinum', icon: 'fa-star', label: 'Platinum' },
  { id: 'Gemstone', icon: 'fa-gem', label: 'Gemstone' },
  { id: 'Bridal', icon: 'fa-heart', label: 'Bridal' },
  { id: 'Antique', icon: 'fa-landmark', label: 'Antique' },
];

export const JEWELLERY_BUDGET_CHIPS = [
  { label: 'Under ₹10K', min: 0, max: 10000 },
  { label: '₹10K – ₹50K', min: 10000, max: 50000 },
  { label: '₹50K – ₹2L', min: 50000, max: 200000 },
  { label: '₹2L – ₹5L', min: 200000, max: 500000 },
  { label: '₹5L+', min: 500000, max: Infinity },
];

export const METAL_OPTIONS = ['Gold', 'Diamond', 'Silver', 'Platinum', 'Rose Gold'];
export const PURITY_OPTIONS = ['24K (999)', '22K (916)', '18K (750)', '14K (585)', '925 Silver'];
export const GENDER_OPTIONS = ['Women', 'Men', 'Unisex', 'Kids'];
export const OCCASION_OPTIONS = ['Daily Wear', 'Bridal & Wedding', 'Festive', 'Party', 'Gifting'];

export const jewelleryListingConfig = {
  sector: 'jewellery',
  eyebrow: 'OneVishwam · Precious',
  title: 'Jewellery & Gold Marketplace',
  subtitle: 'Hallmarked gold, certified diamonds, fine silver and custom bridal collections.',
  categories: JEWELLERY_CATEGORIES,
  emptyState: {
    icon: 'fa-solid fa-gem',
    title: 'No items found.',
    subtitle: 'Try adjusting your filters.',
  },
};
