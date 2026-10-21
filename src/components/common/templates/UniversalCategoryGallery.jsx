import React, { useState, useMemo } from 'react';
import MarketplaceCategoryGallery from './MarketplaceCategoryGallery';
import CategoryListingCard from './CategoryListingCard';
import { parseIndianPrice } from '../../../utils/priceUtils';

/**
 * UniversalCategoryGallery
 * 
 * Declarative category gallery engine.
 * Eliminates all boilerplate for search, multi-select checkbox filters, dual range sliders,
 * active filter chips, pagination, sorting, empty states, and card rendering.
 * 
 * Any category gallery page can be created with a single declarative configuration file.
 */
export default function UniversalCategoryGallery({
  // Metadata & Navigation
  categoryTitle = 'Verified Inventory',
  categorySubtitle = 'Explore our verified inventory with complete documentation and loan assistance.',
  breadcrumb = 'Marketplace',
  postRequirementLink = null,
  onQuickMatch = null,
  quickMatchLabel = 'Quick Match',
  searchPlaceholder = 'Search inventory by title, brand, locality, or keyword...',

  // Data Source (either pass hook or raw array)
  useItems = null,
  items: directItems = null,
  loading: directLoading = false,
  error: directError = null,

  // Declarative Field Mapping for cards
  mapping = {},

  // Declarative Checkbox Filter Groups: [{ id, title, options, field, search }]
  filterGroups = [],

  // Declarative Range Sliders: [{ id, title, min, max, step, field, maxLabel, unitLabel }]
  rangeFilters = [],

  // Search Fields
  searchFields = ['title', 'name', 'brand', 'model', 'location', 'city', 'locality', 'address', 'category', 'subcategory'],

  // Per page count
  perPage = 9,

  // Optional extensions
  customModals = null,
  customSidebar = null,
}) {
  // 1. Resolve Data Hook if provided
  let fetchedItems = null;
  let fetchedLoading = false;
  let fetchedError = null;

  if (typeof useItems === 'function') {
    const hookResult = useItems();
    if (Array.isArray(hookResult)) {
      fetchedItems = hookResult;
    } else if (hookResult && typeof hookResult === 'object') {
      fetchedItems = hookResult.items || hookResult.vehicles || hookResult.properties || hookResult.data || [];
      fetchedLoading = Boolean(hookResult.loading);
      fetchedError = hookResult.error || null;
    }
  }

  const rawItems = directItems !== null ? directItems : (fetchedItems || []);
  const isLoading = directLoading || fetchedLoading;
  const hasError = directError || fetchedError;

  // 2. Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState(() => {
    const initial = {};
    rangeFilters.forEach((r) => {
      initial[`${r.id}Min`] = '';
      initial[`${r.id}Max`] = '';
    });
    filterGroups.forEach((g) => {
      initial[g.id] = [];
    });
    return initial;
  });

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    const reset = {};
    rangeFilters.forEach((r) => {
      reset[`${r.id}Min`] = '';
      reset[`${r.id}Max`] = '';
    });
    filterGroups.forEach((g) => {
      reset[g.id] = [];
    });
    setActiveFilters(reset);
    setSearchTerm('');
  };

  // 3. Dynamic Active Chips
  const activeChips = useMemo(() => {
    const chips = [];

    rangeFilters.forEach((r) => {
      const minV = activeFilters[`${r.id}Min`];
      const maxV = activeFilters[`${r.id}Max`];
      if (minV) {
        const num = Number(minV);
        const label = num >= 100000 ? `Min ₹${(num / 100000).toFixed(1)}L` : `Min ₹${num}`;
        chips.push({ key: `${r.id}Min`, label });
      }
      if (maxV) {
        const num = Number(maxV);
        const label = num >= 100000 ? `Max ₹${(num / 100000).toFixed(1)}L` : `Max ₹${num}`;
        chips.push({ key: `${r.id}Max`, label });
      }
    });

    filterGroups.forEach((g) => {
      const selected = activeFilters[g.id] || [];
      selected.forEach((val) => {
        chips.push({ key: g.id, label: val, value: val });
      });
    });

    return chips;
  }, [activeFilters, rangeFilters, filterGroups]);

  const handleRemoveChip = (chip) => {
    if (chip.key.endsWith('Min') || chip.key.endsWith('Max')) {
      handleFilterChange(chip.key, '');
    } else {
      const currentList = activeFilters[chip.key] || [];
      handleFilterChange(
        chip.key,
        currentList.filter((x) => x !== chip.value)
      );
    }
  };

  // 4. Transform raw items into unified card items
  const transformedItems = useMemo(() => {
    if (!Array.isArray(rawItems)) return [];

    return rawItems.map((raw) => {
      const id = mapping.id ? mapping.id(raw) : (raw._id || raw.id || '');
      const title = mapping.title ? mapping.title(raw) : (raw.title || raw.name || '');
      const image = mapping.image ? mapping.image(raw) : (raw.images?.[0] || raw.image || raw.coverImage || '');
      const price = mapping.price ? mapping.price(raw) : (raw.price || 'Price on Request');
      const priceSuffix = mapping.priceSuffix ? mapping.priceSuffix(raw) : (raw.priceSuffix || '');
      const location = mapping.location ? mapping.location(raw) : (raw.location || raw.city || raw.showroom?.city || raw.address || '');
      const pincode = mapping.pincode ? mapping.pincode(raw) : (raw.pincode || raw.showroom?.pincode || '');
      const overline = mapping.overline ? mapping.overline(raw) : (raw.brand || raw.category || raw.subcategory || raw.propertyType || '');
      const badges = mapping.badges ? mapping.badges(raw) : (raw.badges || raw.statusBadges || []);
      const pills = mapping.pills ? mapping.pills(raw) : (raw.cardPills || raw.keyAttributes || []);
      const highlightBanner = mapping.highlightBanner ? mapping.highlightBanner(raw) : raw.highlightBanner;
      const link = mapping.detailUrl ? mapping.detailUrl(raw) : (mapping.link ? mapping.link(raw) : raw.link);

      return {
        id,
        title,
        image,
        images: Array.isArray(raw.images) ? raw.images : (image ? [image] : []),
        price,
        priceSuffix,
        location,
        pincode,
        overline,
        badges,
        statusBadges: badges,
        cardPills: pills,
        keyAttributes: pills,
        highlightBanner,
        link,
        raw,
      };
    });
  }, [rawItems, mapping]);

  // 5. Intelligent Filtering Logic
  const filteredItems = useMemo(() => {
    return transformedItems.filter(({ raw, title, location, cardPills }) => {
      // A. Global Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const titleMatch = (title || '').toLowerCase().includes(q);
        const locMatch = (location || '').toLowerCase().includes(q);
        const pillsMatch = (cardPills || []).some((p) => String(p.value || p).toLowerCase().includes(q));

        let fieldMatch = false;
        if (searchFields && searchFields.length > 0) {
          fieldMatch = searchFields.some((field) => {
            const val = raw[field];
            return typeof val === 'string' && val.toLowerCase().includes(q);
          });
        }

        if (!titleMatch && !locMatch && !pillsMatch && !fieldMatch) {
          return false;
        }
      }

      // B. Range Filters
      for (const range of rangeFilters) {
        const minVal = activeFilters[`${range.id}Min`];
        const maxVal = activeFilters[`${range.id}Max`];
        if (minVal || maxVal) {
          let itemNumericVal = 0;
          if (typeof range.field === 'function') {
            itemNumericVal = range.field(raw);
          } else {
            const rawVal = raw[range.field || range.id] || raw.price;
            itemNumericVal = parseIndianPrice(rawVal);
          }

          if (minVal && itemNumericVal < Number(minVal)) return false;
          if (maxVal && itemNumericVal > Number(maxVal)) return false;
        }
      }

      // C. Checkbox Group Filters
      for (const group of filterGroups) {
        const selectedOptions = activeFilters[group.id] || [];
        if (selectedOptions.length > 0) {
          let itemValue;
          if (typeof group.field === 'function') {
            itemValue = group.field(raw);
          } else {
            itemValue = raw[group.field || group.id];
          }

          if (Array.isArray(itemValue)) {
            const hasMatch = itemValue.some((v) =>
              selectedOptions.some((opt) => String(opt).toLowerCase() === String(v).toLowerCase())
            );
            if (!hasMatch) return false;
          } else if (itemValue !== undefined && itemValue !== null) {
            const itemStr = String(itemValue).toLowerCase();
            const hasMatch = selectedOptions.some((opt) => itemStr === String(opt).toLowerCase());
            if (!hasMatch) return false;
          } else {
            return false;
          }
        }
      }

      return true;
    });
  }, [transformedItems, searchTerm, activeFilters, rangeFilters, filterGroups, searchFields]);

  return (
    <>
      <MarketplaceCategoryGallery
        categoryTitle={categoryTitle}
        categorySubtitle={categorySubtitle}
        breadcrumbCategory={breadcrumb}
        items={filteredItems}
        filterGroups={filterGroups}
        rangeFilters={rangeFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        activeChips={activeChips}
        onRemoveChip={handleRemoveChip}
        onResetFilters={handleResetFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        postRequirementLink={postRequirementLink}
        onQuickMatch={onQuickMatch}
        quickMatchLabel={quickMatchLabel}
        perPage={perPage}
        customSidebar={customSidebar}
      />
      {customModals}
    </>
  );
}
