import React, { useState, useMemo } from 'react';
import { dummyBedding } from '../../../data/dummyBedding';
import MarketplaceCategoryGallery from '../../../components/common/templates/MarketplaceCategoryGallery';
import CategoryListingCard from '../../../components/common/templates/CategoryListingCard';

const FILTER_GROUPS = [
  {
    id: 'categories',
    title: 'Bedding & Comfort Type',
    options: [
      'Orthopedic Mattresses',
      'Natural Latex Mattresses',
      'Reversible Mattresses',
      'Luxury Bedding & Linen',
      'Orthopedic Pillows & Cushions',
    ],
    defaultOpen: true,
  },
  {
    id: 'brands',
    title: 'Brand',
    options: ['SleepyCat', 'Sunday Rest', 'Wakefit', 'Portico New York', 'The White Willow'],
    defaultOpen: true,
  },
  {
    id: 'sizes',
    title: 'Mattress & Bed Size',
    options: ['King Size (78x72)', 'Queen Size (78x60)', 'Pillows & Linen'],
    defaultOpen: false,
  },
];

const RANGE_FILTERS = [
  {
    id: 'budget',
    title: 'Price Range (₹)',
    min: 0,
    max: 60000,
    step: 1000,
    maxLabel: '₹ 60 K+',
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

export default function BeddingGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    budgetMin: '',
    budgetMax: '',
    categories: [],
    brands: [],
    sizes: [],
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
      sizes: [],
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
    (activeFilters.sizes || []).forEach((s) => {
      chips.push({ key: 'sizes', label: s, value: s });
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
    return dummyBedding.filter((item) => {
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
  }, [searchTerm, activeFilters]);

  return (
    <MarketplaceCategoryGallery
      categoryTitle="Explore Verified Bedding & Sleep Comfort"
      categorySubtitle="Discover orthopedic memory foam mattresses, 100% natural organic latex, Egyptian cotton bedsheets, and cervical contour pillows."
      breadcrumbCategory="Bedding & Comfort"
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
      searchPlaceholder="Search mattresses by brand, material, size, or locality (e.g. Orthopedic King, Latex, Indiranagar)..."
      postRequirementLink="/property/requirement"
      customCardRenderer={(item) => (
        <CategoryListingCard
          key={item.id}
          item={item}
          link={`/bedding/${item.id}`}
          title={item.title}
          price={item.price}
          priceSuffix={item.priceSuffix}
          location={item.location}
          pincode={item.pincode}
          statusBadges={item.statusBadges}
          keyAttributes={item.cardPills}
          highlightBanner={item.highlightBanner}
        />
      )}
    />
  );
}

