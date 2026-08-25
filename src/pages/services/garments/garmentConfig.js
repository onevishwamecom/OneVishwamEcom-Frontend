/**
 * Garments & Fashion Sector Configuration
 */

export const GARMENT_TABS = [
  'All',
  'Men',
  'Women',
  'Kids',
  'Ethnic Wear',
  'Western',
  'Formals',
  'Casuals',
  'Sportswear',
  'Accessories',
];

export const GARMENT_BUDGET_CHIPS = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹2K', min: 500, max: 2000 },
  { label: '₹2K – ₹5K', min: 2000, max: 5000 },
  { label: '₹5K+', min: 5000, max: Infinity },
];

export const BRAND_TYPE_OPTIONS = ['Local Brand', 'National Brand', 'International', 'Handloom', 'Designer'];
export const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
export const FABRIC_OPTIONS = ['Cotton', 'Silk', 'Linen', 'Polyester', 'Wool', 'Denim', 'Khadi', 'Chiffon'];

export const garmentListingConfig = {
  sector: 'garments',
  eyebrow: 'OneVishwam · Lifestyle',
  title: 'Garments, Fashion & Apparel',
  subtitle: 'Trending ethnic, western, everyday casuals and premium designer wear for all ages.',
  categories: GARMENT_TABS.map((t) => ({ id: t, label: t })),
  emptyState: {
    icon: 'fa-solid fa-shirt',
    title: 'No items found.',
    subtitle: 'Try adjusting your filters.',
  },
};
