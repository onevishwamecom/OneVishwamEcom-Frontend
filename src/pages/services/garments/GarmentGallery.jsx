import React, { useState, useMemo } from 'react';
import { dummyGarments } from '../../../data/dummyGarments';
import MarketplaceCategoryGallery from '../../../components/common/templates/MarketplaceCategoryGallery';
import CategoryListingCard from '../../../components/common/templates/CategoryListingCard';
import { matchesSearch } from '../../../utils/searchUtils';

const FILTER_GROUPS = [
  {
    id: 'categories',
    title: 'Category & Style',
    options: ['Ethnic Wear', 'Western Wear', 'Formal Wear', 'Casual & Everyday'],
    defaultOpen: true,
  },
  {
    id: 'fabrics',
    title: 'Fabric & Material',
    options: ['Pure Silk', 'Organic Cotton', 'Linen', 'Denim', 'Wool & Blend'],
    defaultOpen: true,
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Price Range (₹)',
    min: 0,
    max: 50000,
    step: 500,
    maxLabel: '₹ 50 K+',
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

export default function GarmentGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    categories: [],
    fabrics: [],
  });

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      budgetMin: '',
      budgetMax: '',
      categories: [],
      fabrics: [],
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
    (activeFilters.fabrics || []).forEach((f) => {
      chips.push({ key: 'fabrics', label: f, value: f });
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
    return (dummyGarments || []).filter((item) => {
      if (searchTerm.trim()) {
        if (!matchesSearch(
          searchTerm,
          item.title,
          item.brand,
          item.model,
          item.category,
          item.fabric,
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

      if (activeFilters.fabrics && activeFilters.fabrics.length > 0) {
        if (!item.fabric || !activeFilters.fabrics.includes(item.fabric)) return false;
      }

      return true;
    });
  }, [searchTerm, activeFilters]);

  return (
    <MarketplaceCategoryGallery
      categoryTitle="Explore Garments, Fashion & Lifestyle"
      categorySubtitle="Curated ethnic wear, premium formals, designer sarees, and sustainable daily wear."
      breadcrumbCategory="Garments & Fashion"
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
      searchPlaceholder="Search apparel by category, brand, fabric, or style..."
      postRequirementLink="/property/requirement"
      perPage={10}
      customCardRenderer={(item) => (
        <CategoryListingCard
          key={item.id}
          item={item}
          link={`/garments/${item.id}`}
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
