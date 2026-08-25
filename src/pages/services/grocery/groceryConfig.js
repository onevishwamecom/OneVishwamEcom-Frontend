/**
 * Grocery & Consumer Marketplace Sector Configuration
 */

export const GROCERY_CATEGORIES = [
  { id: 'All', icon: 'fa-basket-shopping', label: 'All' },
  { id: 'Fruits & Vegetables', icon: 'fa-carrot', label: 'F&V' },
  { id: 'Grains & Pulses', icon: 'fa-wheat-awn', label: 'Grains' },
  { id: 'Dairy', icon: 'fa-cow', label: 'Dairy' },
  { id: 'Spices', icon: 'fa-mortar-pestle', label: 'Spices' },
  { id: 'Packaged Foods', icon: 'fa-box', label: 'Packaged' },
  { id: 'Beverages', icon: 'fa-mug-saucer', label: 'Beverages' },
  { id: 'Organic', icon: 'fa-leaf', label: 'Organic' },
];

export const GROCERY_BUDGET_CHIPS = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 – ₹500', min: 100, max: 500 },
  { label: '₹500 – ₹1K', min: 500, max: 1000 },
  { label: '₹1K+', min: 1000, max: Infinity },
];

export const DELIVERY_TYPE_OPTIONS = ['Instant (30m)', 'Same Day', 'Next Day', 'Standard'];

export const groceryListingConfig = {
  sector: 'grocery',
  eyebrow: 'OneVishwam · Marketplace',
  title: 'Groceries & Daily Essentials',
  subtitle: 'Fresh farm produce, staples, dairy & organic goods delivered to your doorstep.',
  categories: GROCERY_CATEGORIES,
  emptyState: {
    icon: 'fa-solid fa-basket-shopping',
    title: 'No items found.',
    subtitle: 'Try adjusting your filters.',
  },
};
