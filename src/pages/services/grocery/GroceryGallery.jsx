import React, { useState, useMemo } from 'react';
import { dummyGrocery } from '../../../data/dummyGrocery';
import MarketplaceCategoryGallery from '../../../components/common/templates/MarketplaceCategoryGallery';
import CategoryListingCard from '../../../components/common/templates/CategoryListingCard';
import { matchesSearch } from '../../../utils/searchUtils';

const FILTER_GROUPS = [
  {
    id: 'categories',
    title: 'Category & Essentials',
    options: ['Organic Staples', 'Cold-Pressed Oils', 'Dry Fruits & Spices', 'Dairy & Fresh Produce'],
    defaultOpen: true,
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Price Range (₹)',
    min: 0,
    max: 10000,
    step: 100,
    maxLabel: '₹ 10 K+',
    unitLabel: '₹',
    defaultOpen: true,
  },
];

function parseNumericPrice(str) {
  if (!str) return 0;
  const cleaned = String(str).replace(/[^\d.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return num;
}

export default function GroceryGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    categories: [],
  });

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      budgetMin: '',
      budgetMax: '',
      categories: [],
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
    return (dummyGrocery || []).filter((item) => {
      if (searchTerm.trim()) {
        if (!matchesSearch(
          searchTerm,
          item.title,
          item.brand,
          item.model,
          item.category,
          item.description
        )) {
          return false;
        }
      }

      const numPrice = parseNumericPrice(item.price);
      if (activeFilters.budgetMin && numPrice < Number(activeFilters.budgetMin)) return false;
      if (activeFilters.budgetMax && numPrice > Number(activeFilters.budgetMax)) return false;

      if (activeFilters.categories && activeFilters.categories.length > 0) {
        if (!item.category || !activeFilters.categories.includes(item.category)) return false;
      }

      return true;
    });
  }, [searchTerm, activeFilters]);

  return (
    <MarketplaceCategoryGallery
      categoryTitle="Explore Organic Grocery & Essential Commodities"
      categorySubtitle="Pure A2 Desi Cow Ghee, Wood Cold-Pressed Oils, Organic Millets, Unpolished Pulses & Spices."
      breadcrumbCategory="Organic Grocery"
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
      searchPlaceholder="Search organic staples, cold-pressed oils, millets, spices..."
      postRequirementLink="/property/requirement"
      perPage={10}
      customCardRenderer={(item) => (
        <CategoryListingCard
          key={item.id}
          item={item}
          link={`/grocery/${item.id}`}
          overline={item.category}
          title={item.model || item.title}
          price={item.price}
          priceSuffix={item.priceSuffix}
          location=""
          pincode=""
          statusBadges={item.statusBadges}
          cardPills={item.cardPills}
          highlightBanner={null}
        />
      )}
    />
  );
}
