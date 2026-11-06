import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketplaceCategoryGallery from './MarketplaceCategoryGallery';
import CategoryListingCard from './CategoryListingCard';
import { parseIndianPrice } from '../../../utils/priceUtils';
import SearchIndex from '../../../utils/searchIndex';
import { matchesSearch } from '../../../utils/searchUtils';

/**
 * UniversalCategoryGallery
 * 
 * Declarative category gallery engine.
 * Eliminates all boilerplate for search, multi-select checkbox filters, dual range sliders,
 * active filter chips, pagination, sorting, empty states, and card rendering.
 * 
 * Any category gallery page can be created with a single declarative configuration file.
 */
function getParamValueForGroup(params, g) {
  if (!g) return null;
  const id = g.id;
  const idLower = id.toLowerCase();
  const keys = new Set([id, idLower]);

  if (id.endsWith('s')) {
    const sing = id.slice(0, -1);
    keys.add(sing);
    keys.add(sing.toLowerCase());
  } else {
    keys.add(`${id}s`);
    keys.add(`${id}s`.toLowerCase());
  }

  // Domain-specific aliases
  if (idLower.includes('fuel')) {
    keys.add('fuel');
    keys.add('fueltype');
    keys.add('fuelType');
    keys.add('fuel_type');
    keys.add('fuelTypes');
  }
  if (idLower.includes('trans')) {
    keys.add('transmission');
    keys.add('transmissions');
  }
  if (idLower.includes('body')) {
    keys.add('bodyType');
    keys.add('bodytype');
    keys.add('body_type');
    keys.add('body');
    keys.add('bodyTypes');
  }
  if (idLower.includes('wheeler') || idLower === 'category') {
    keys.add('wheelerType');
    keys.add('wheelertype');
    keys.add('wheeler');
    keys.add('wheelerTypes');
    keys.add('category');
  }
  if (idLower.includes('condition')) {
    keys.add('condition');
    keys.add('conditions');
  }
  if (idLower === 'subcategory') {
    keys.add('type');
    keys.add('category');
    keys.add('subcat');
  }

  for (const k of keys) {
    const val = params.get(k);
    if (val) return val;
  }
  return null;
}

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

  // Per page count (12 = 3 full rows of 4 columns)
  perPage = 12,
  hidePrice = false,

  // Optional extensions
  customModals = null,
  customSidebar = null,
  customCardRenderer = null,
  topExtra = null,
  customSorter = null,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Resolve Data Hook if provided
  let fetchedItems = null;
  let fetchedLoading = false;
  let fetchedError = null;

  if (typeof useItems === 'function') {
    const hookResult = useItems();
    if (Array.isArray(hookResult)) {
      fetchedItems = hookResult;
    } else if (hookResult && typeof hookResult === 'object') {
      fetchedItems =
        hookResult.items ||
        hookResult.electronics ||
        hookResult.beddings ||
        hookResult.bedding ||
        hookResult.vehicles ||
        hookResult.properties ||
        hookResult.garments ||
        hookResult.groceries ||
        hookResult.jewellery ||
        hookResult.data ||
        Object.values(hookResult).find((v) => Array.isArray(v)) ||
        [];
      fetchedLoading = Boolean(hookResult.loading);
      fetchedError = hookResult.error || null;
    }
  }

  const rawItems = useMemo(() => {
    const list = directItems !== null ? directItems : (fetchedItems || []);
    if (!Array.isArray(list)) return [];
    return list.filter((raw) => {
      if (!raw) return false;
      const status = String(raw.availabilityStatus || '').toLowerCase();
      return status !== 'sold_out' && status !== 'sold' && status !== 'out_of_stock' && raw.isSoldOut !== true;
    });
  }, [directItems, fetchedItems]);
  const isLoading = directLoading || fetchedLoading;
  const hasError = directError || fetchedError;

  // 1. Dynamically discover any new options present in the live loaded items
  const resolvedFilterGroups = useMemo(() => {
    return filterGroups.map((group) => {
      const fieldFn = typeof group.field === 'function'
        ? group.field
        : (item) => item[group.field || group.id];

      const itemOptions = new Set();
      (rawItems || []).forEach((item) => {
        const val = fieldFn(item);
        if (Array.isArray(val)) {
          val.forEach((v) => v && itemOptions.add(String(v).trim()));
        } else if (val !== undefined && val !== null && String(val).trim()) {
          itemOptions.add(String(val).trim());
        }
      });

      const existingOptions = group.options || [];
      const discovered = Array.from(itemOptions).filter(
        (opt) => !existingOptions.some((o) => String(typeof o === 'string' ? o : o.value).toLowerCase() === opt.toLowerCase())
      );

      return {
        ...group,
        options: [...existingOptions, ...discovered].filter(Boolean),
      };
    });
  }, [filterGroups, rawItems]);

  // Helper to extract initial filters from searchParams
  const extractGroupFilters = useCallback((params) => {
    const initial = {};
    rangeFilters.forEach((r) => {
      initial[`${r.id}Min`] = params.get(`${r.id}Min`) || '';
      initial[`${r.id}Max`] = params.get(`${r.id}Max`) || '';
    });
    resolvedFilterGroups.forEach((g) => {
      initial[g.id] = [];
      const paramVal = getParamValueForGroup(params, g);

      if (paramVal) {
        const requestedVals = paramVal.split(',').map((s) => s.trim().toLowerCase());
        const matched = (g.options || []).filter((opt) => {
          const optVal = typeof opt === 'string' ? opt : opt.value || opt.label;
          const optLower = String(optVal).toLowerCase();
          return requestedVals.some((v) => optLower === v || optLower.includes(v) || v.includes(optLower));
        });
        if (matched.length > 0) {
          initial[g.id] = matched;
        }
      }
    });
    return initial;
  }, [rangeFilters, resolvedFilterGroups]);

  // 2. Filter & Search State
  const [searchTerm, setSearchTerm] = useState(() => (searchParams.get('q') || searchParams.get('search') || '').trim());
  const [activeFilters, setActiveFilters] = useState(() => extractGroupFilters(searchParams));

  // Sync from URL search parameters if searchParams change dynamically
  useEffect(() => {
    const q = (searchParams.get('q') || searchParams.get('search') || '').trim();
    setSearchTerm(q);

    const fromUrl = extractGroupFilters(searchParams);
    setActiveFilters((prev) => {
      let isDifferent = false;
      const allKeys = new Set([...Object.keys(fromUrl), ...Object.keys(prev)]);
      for (const k of allKeys) {
        const a = fromUrl[k] || [];
        const b = prev[k] || [];
        if (Array.isArray(a) || Array.isArray(b)) {
          if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || a.some((val) => !b.includes(val))) {
            isDifferent = true;
            break;
          }
        } else if (a !== b) {
          isDifferent = true;
          break;
        }
      }
      return isDifferent ? fromUrl : prev;
    });
  }, [searchParams, extractGroupFilters]);

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (Array.isArray(value)) {
        if (value.length > 0) {
          next.set(key, value.join(','));
        } else {
          next.delete(key);
          if (key.endsWith('s')) next.delete(key.slice(0, -1));
          else next.delete(`${key}s`);
        }
      } else if (value) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
      next.delete('page');
      return next;
    }, { replace: true });
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (!val && (searchParams.has('id') || searchParams.has('productId') || searchParams.has('q') || searchParams.has('search'))) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('id');
        next.delete('productId');
        next.delete('q');
        next.delete('search');
        return next;
      });
    }
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
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('id');
      next.delete('productId');
      next.delete('q');
      next.delete('search');
      next.delete('page');
      return next;
    });
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

  // 4. Transform raw items into unified card items with unique IDs guaranteed
  const transformedItems = useMemo(() => {
    if (!Array.isArray(rawItems)) return [];

    const seenIds = new Set();
    const result = [];

    for (let index = 0; index < rawItems.length; index++) {
      const raw = rawItems[index];
      if (!raw) continue;

      let id = mapping.id ? mapping.id(raw) : (raw._id || raw.id || '');
      if (!id || seenIds.has(String(id))) {
        if (!id) id = `item_${index}`;
        else continue; // Deduplicate identical IDs across pages to prevent crashes
      }
      seenIds.add(String(id));

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

      result.push({
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
      });
    }

    return result;
  }, [rawItems, mapping]);

  // 5. Build High-Performance Search Index (O(N) built once when catalog loads)
  const searchIndex = useMemo(() => {
    const searchableItems = transformedItems.map((t) => {
      const flat = { ...t.raw, id: t.id, title: t.title, location: t.location };
      if (Array.isArray(t.cardPills)) {
        flat.pills = t.cardPills.map((p) => String(p.value || p)).join(' ');
      }
      return flat;
    });
    return new SearchIndex(searchableItems, [...searchFields, 'title', 'location', 'pills']);
  }, [transformedItems, searchFields]);

  // 6. Intelligent Filtering Logic with O(K) Search & O(1) Set Lookups
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim();
    const targetId = (searchParams.get('id') || searchParams.get('productId') || '').trim();

    // Fast O(K) inverted index lookup
    const matchedSearchIds = q
      ? new Set(searchIndex.search(q).map((item) => String(item.id || item._id)))
      : null;

    // Pre-normalize checkbox filter group sets outside the loop (O(1) lookups)
    const activeGroupSets = [];
    for (const group of filterGroups) {
      const selected = activeFilters[group.id] || [];
      if (selected.length > 0) {
        activeGroupSets.push({
          group,
          selectedSet: new Set(selected.map((opt) => String(opt).toLowerCase())),
        });
      }
    }

    // Active range filter checks
    const activeRanges = [];
    for (const range of rangeFilters) {
      const minVal = activeFilters[`${range.id}Min`];
      const maxVal = activeFilters[`${range.id}Max`];
      if (minVal || maxVal) {
        activeRanges.push({
          range,
          minNum: minVal ? Number(minVal) : null,
          maxNum: maxVal ? Number(maxVal) : null,
        });
      }
    }

    return transformedItems.filter(({ id, raw, title, location }) => {
      // A. Direct ID match from search dropdown navigation
      if (targetId && (String(id) === targetId || String(raw._id) === targetId || String(raw.id) === targetId)) {
        return true;
      }

      // B. O(1) Search Match Check with fallback token matching
      if (matchedSearchIds !== null && !matchedSearchIds.has(String(id))) {
        const matches = matchesSearch(
          q,
          title,
          raw.title,
          raw.name,
          raw.brand,
          raw.model,
          location,
          raw.location,
          raw.area,
          raw.city,
          raw.locality,
          raw.subcategory
        );
        if (!matches) return false;
      }

      // C. Range Filters
      for (const { range, minNum, maxNum } of activeRanges) {
        let itemNumericVal = 0;
        if (typeof range.field === 'function') {
          itemNumericVal = range.field(raw);
        } else {
          const rawVal = raw[range.field || range.id] || raw.price;
          itemNumericVal = parseIndianPrice(rawVal);
        }

        if (minNum !== null && itemNumericVal < minNum) return false;
        if (maxNum !== null && itemNumericVal > maxNum) return false;
      }

      // D. O(1) Set Checkbox Group Filters
      for (const { group, selectedSet } of activeGroupSets) {
        if (typeof group.matches === 'function') {
          if (!group.matches(raw, selectedSet)) return false;
          continue;
        }

        let itemValue;
        if (typeof group.field === 'function') {
          itemValue = group.field(raw);
        } else {
          itemValue = raw[group.field || group.id];
        }

        if (Array.isArray(itemValue)) {
          const hasMatch = itemValue.some((v) => {
            const vLower = String(v).toLowerCase();
            return selectedSet.has(vLower) || Array.from(selectedSet).some((s) => vLower.includes(s) || s.includes(vLower));
          });
          if (!hasMatch) return false;
        } else if (itemValue !== undefined && itemValue !== null) {
          const valLower = String(itemValue).toLowerCase();
          const hasMatch = selectedSet.has(valLower) || Array.from(selectedSet).some((s) => valLower.includes(s) || s.includes(valLower));
          if (!hasMatch) return false;
        } else {
          return false;
        }
      }

      return true;
    });
  }, [transformedItems, searchTerm, searchIndex, activeFilters, rangeFilters, filterGroups, searchParams]);

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
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        postRequirementLink={postRequirementLink}
        onQuickMatch={onQuickMatch}
        quickMatchLabel={quickMatchLabel}
        perPage={perPage}
        hidePrice={hidePrice}
        customSidebar={customSidebar}
        customCardRenderer={customCardRenderer}
        topExtra={topExtra}
        customSorter={customSorter}
      />
      {customModals}
    </>
  );
}
