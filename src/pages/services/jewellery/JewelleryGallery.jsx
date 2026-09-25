import React, { useState, useMemo } from 'react';
import { dummyJewellery } from '../../../data/dummyJewellery';
import MarketplaceCategoryGallery from '../../../components/common/templates/MarketplaceCategoryGallery';
import CategoryListingCard from '../../../components/common/templates/CategoryListingCard';
import { matchesSearch } from '../../../utils/searchUtils';

const FILTER_GROUPS = [
  {
    id: 'metals',
    title: 'Metal & Purity',
    options: ['24K Gold', '22K Gold', '18K Diamond Gold', '925 Sterling Silver', 'Platinum'],
    defaultOpen: true,
  },
  {
    id: 'occasions',
    title: 'Occasion & Design',
    options: ['Bridal / Wedding', 'Daily Wear', 'Festive Special', 'Gifting & Coins'],
    defaultOpen: true,
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Price Range (₹)',
    min: 0,
    max: 1000000,
    step: 5000,
    maxLabel: '₹ 10 L+',
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

export default function JewelleryGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    metals: [],
    occasions: [],
  });

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      budgetMin: '',
      budgetMax: '',
      metals: [],
      occasions: [],
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
    (activeFilters.metals || []).forEach((m) => {
      chips.push({ key: 'metals', label: m, value: m });
    });
    (activeFilters.occasions || []).forEach((o) => {
      chips.push({ key: 'occasions', label: o, value: o });
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
    return (dummyJewellery || []).filter((item) => {
      if (searchTerm.trim()) {
        if (!matchesSearch(
          searchTerm,
          item.title,
          item.brand,
          item.model,
          item.category,
          item.metalType,
          item.description
        )) {
          return false;
        }
      }

      const numPrice = parseNumericPrice(item.price);
      if (activeFilters.budgetMin && numPrice < Number(activeFilters.budgetMin)) return false;
      if (activeFilters.budgetMax && numPrice > Number(activeFilters.budgetMax)) return false;

      if (activeFilters.metals && activeFilters.metals.length > 0) {
        if (!activeFilters.metals.some((m) => `${item.metalType} ${item.purity}`.includes(m))) return false;
      }

      if (activeFilters.occasions && activeFilters.occasions.length > 0) {
        if (!activeFilters.occasions.some((o) => (item.occasion || []).includes(o))) return false;
      }

      return true;
    });
  }, [searchTerm, activeFilters]);

  return (
    <MarketplaceCategoryGallery
      categoryTitle="Explore Certified Jewellery & Precious Metals"
      categorySubtitle="BIS Hallmarked 22K/24K Gold, IGI Certified Diamonds, and 925 Sterling Silver from trusted jewellers."
      breadcrumbCategory="Jewellery & Gold"
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
      searchPlaceholder="Search jewellery by metal, purity, or design (e.g. 22K Gold Necklace, Solitaire Ring)..."
      postRequirementLink="/property/requirement"
      perPage={10}
      customCardRenderer={(item) => (
        <CategoryListingCard
          key={item.id}
          item={item}
          link={`/jewellery/${item.id}`}
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