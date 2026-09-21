import React, { useState, useMemo } from 'react';
import MarketplaceCategoryGallery from '../../../components/common/templates/MarketplaceCategoryGallery';
import CategoryListingCard from '../../../components/common/templates/CategoryListingCard';

const FILTER_GROUPS = [
  {
    id: 'categories',
    title: 'Category & Device Type',
    options: [
      'Television & Home Audio',
      'Laptops & Computers',
      'Smartphones & Tablets',
      'Home & Kitchen Appliances',
      'Audio & Wearables',
    ],
    defaultOpen: true,
  },
  {
    id: 'brands',
    title: 'Brand',
    options: ['Sony', 'Apple', 'Samsung', 'LG'],
    defaultOpen: true,
  },
  {
    id: 'conditions',
    title: 'Condition & Warranty',
    options: ['Brand New Sealed', 'Official Brand Warranty', 'EMI Available'],
    defaultOpen: false,
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Budget (₹)',
    min: 0,
    max: 400000,
    step: 5000,
    maxLabel: '₹ 4 L+',
    unitLabel: '₹',
    defaultOpen: true,
  },
];

function parseNumericPrice(str) {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (/cr/i.test(str)) return num * 10000000;
  if (/lakh|lac|l/i.test(str)) return num * 100000;
  return num;
}

export default function ElectronicsGallery({ items = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    categories: [],
    brands: [],
    conditions: [],
  });

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      budgetMin: '',
      budgetMax: '',
      categories: [],
      brands: [],
      conditions: [],
    });
    setSearchTerm('');
  };

  const activeChips = useMemo(() => {
    const chips = [];
    if (activeFilters.budgetMin) {
      chips.push({ key: 'budgetMin', label: `Min ₹${Number(activeFilters.budgetMin).toLocaleString('en-IN')}` });
    }
    if (activeFilters.budgetMax) {
      chips.push({ key: 'budgetMax', label: `Max ₹${Number(activeFilters.budgetMax).toLocaleString('en-IN')}` });
    }
    (activeFilters.categories || []).forEach((c) => {
      chips.push({ key: 'categories', label: c, value: c });
    });
    (activeFilters.brands || []).forEach((b) => {
      chips.push({ key: 'brands', label: b, value: b });
    });
    (activeFilters.conditions || []).forEach((cond) => {
      chips.push({ key: 'conditions', label: cond, value: cond });
    });
    return chips;
  }, [activeFilters]);

  const handleRemoveChip = (chip) => {
    if (chip.key === 'budgetMin' || chip.key === 'budgetMax') {
      handleFilterChange(chip.key, '');
    } else {
      const currentList = activeFilters[chip.key] || [];
      handleFilterChange(chip.key, currentList.filter((x) => x !== chip.value));
    }
  };

  const filteredItems = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((item) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchBrand = (item.brand || '').toLowerCase().includes(q);
        const matchModel = (item.model || '').toLowerCase().includes(q);
        const matchCategory = (item.category || '').toLowerCase().includes(q);
        const matchLocation = (item.location || '').toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchModel && !matchCategory && !matchLocation) {
          return false;
        }
      }

      // Budget
      const numPrice = parseNumericPrice(item.price);
      if (activeFilters.budgetMin && numPrice < Number(activeFilters.budgetMin)) {
        return false;
      }
      if (activeFilters.budgetMax && numPrice > Number(activeFilters.budgetMax)) {
        return false;
      }

      // Categories
      if (activeFilters.categories.length > 0) {
        if (!item.category || !activeFilters.categories.includes(item.category)) {
          return false;
        }
      }

      // Brands
      if (activeFilters.brands.length > 0) {
        if (!item.brand || !activeFilters.brands.includes(item.brand)) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchTerm, activeFilters]);

  return (
    <MarketplaceCategoryGallery
      categoryTitle="Explore Verified Consumer Electronics & Appliances"
      categorySubtitle="Browse certified OLED televisions, premium laptops, flagship smartphones, and smart home appliances with official brand warranties."
      breadcrumbCategory="Consumer Electronics"
      items={filteredItems}
      filterGroups={FILTER_GROUPS}
      rangeFilters={RANGE_FILTERS}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      activeChips={activeChips}
      onRemoveChip={handleRemoveChip}
      onResetFilters={handleResetFilters}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search electronics by brand, model, category, or locality (e.g. Sony OLED, MacBook M3, Indiranagar)..."
      postRequirementLink="/property/requirement"
      customCardRenderer={(item) => (
        <CategoryListingCard
          key={item.id || item._id}
          item={item}
          link={`/electronics/${item.id || item._id}`}
          title={item.title}
          price={item.price}
          priceSuffix={item.priceSuffix}
          location={item.location}
          pincode={item.pincode}
          statusBadges={item.statusBadges}
          keyAttributes={item.cardPills || item.keyAttributes}
          highlightBanner={item.highlightBanner}
        />
      )}
    />
  );
}

