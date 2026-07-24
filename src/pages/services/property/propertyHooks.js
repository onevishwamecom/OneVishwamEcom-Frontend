import { useMemo } from 'react';
import {
  getPropertyType, getCardType, getNumericPrice, getNumericArea,
  getBedrooms, getBuildingType, getListedWithinDays,
} from './propertyHelpers';

/**
 * Builds card-type stats (projects / keys / sites) for each property type.
 */
export function useCardTypeStats(properties, PROPERTY_CARD_TYPES) {
  return useMemo(() => {
    const stats = {};
    PROPERTY_CARD_TYPES.forEach((ct) => {
      const items = ct.id === 'All'
        ? properties
        : properties.filter((p) => getCardType(p) === ct.id);
      stats[ct.id] = {
        projects: items.reduce((sum, p) => sum + (p.projectCount || 0), 0),
        keys:     items.reduce((sum, p) => sum + (p.totalUnits   || 0), 0),
        sites:    items.reduce((sum, p) => sum + (p.availableUnits || 0), 0),
      };
    });
    return stats;
  }, [properties, PROPERTY_CARD_TYPES]);
}

/**
 * Builds the list of active filter chips from the current filters state.
 */
export function useActiveChips(filters) {
  return useMemo(() => {
    const chips = [];
    if (filters.budgetMin || filters.budgetMax) {
      const label = [
        filters.budgetMin && `Min ₹${(+filters.budgetMin / 100000).toFixed(1)}L`,
        filters.budgetMax && `Max ₹${(+filters.budgetMax / 100000).toFixed(1)}L`,
      ].filter(Boolean).join(' – ');
      chips.push({ key: 'budget', label: `Budget: ${label}` });
    }
    filters.buildingType.forEach((t)     => chips.push({ key: `bt-${t}`,    label: t }));
    filters.propertyType.forEach((t)     => chips.push({ key: `pt-${t}`,    label: t }));
    filters.bedrooms.forEach((b)         => chips.push({ key: `bed-${b}`,   label: b }));
    filters.localities.forEach((l)       => chips.push({ key: `loc-${l}`,   label: l }));
    filters.furnishing.forEach((f)       => chips.push({ key: `furn-${f}`,  label: f }));
    filters.postedBy.forEach((p)         => chips.push({ key: `pb-${p}`,    label: p }));
    filters.possessionStatus.forEach((p) => chips.push({ key: `poss-${p}`,  label: p }));
    filters.amenities.forEach((a)        => chips.push({ key: `amen-${a}`,  label: a }));
    filters.facing.forEach((f)           => chips.push({ key: `face-${f}`,  label: f }));
    filters.propertyAge.forEach((a)      => chips.push({ key: `age-${a}`,   label: a }));
    filters.availability.forEach((a)     => chips.push({ key: `avail-${a}`, label: a }));
    if (filters.listedWithin) chips.push({ key: 'listed', label: `Listed: ${filters.listedWithin}` });
    if (filters.gatedCommunity) chips.push({ key: 'gated', label: 'Gated Community' });
    if (filters.loanApprovedOnly) chips.push({ key: 'loan', label: 'Pre‑approved loan only' });
    return chips;
  }, [filters]);
}

/**
 * Returns the filtered + sorted property list.
 */
export function useFilteredProperties({
  properties, selectedCardType, searchTerm, requirementText, sortBy,
  filters, selectedCity, locationInput, pincodeInput,
  familyLocationsOnly, preApprovedMode,
}) {
  return useMemo(() => {
    return properties
      .filter((p) => {
        const type        = getPropertyType(p);
        const np          = getNumericPrice(p.price);
        const area        = getNumericArea(p.area);
        const bedrooms    = getBedrooms(p.bhk);
        const buildingType= getBuildingType(p);
        const listedDays  = getListedWithinDays(p);

        const matchCardType =
          selectedCardType === 'All' || getCardType(p) === selectedCardType;

        const q = searchTerm.toLowerCase();
        const matchSearch = !q ||
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q);

        const qReq = requirementText.toLowerCase();
        const matchRequirement = !qReq ||
          p.title.toLowerCase().includes(qReq) ||
          p.location.toLowerCase().includes(qReq) ||
          p.subtitle.toLowerCase().includes(qReq) ||
          (p.description && p.description.toLowerCase().includes(qReq));

        const matchBudget =
          (!filters.budgetMin || np >= +filters.budgetMin) &&
          (!filters.budgetMax || np <= +filters.budgetMax);

        const matchSize =
          (!filters.sizeMin || area >= +filters.sizeMin) &&
          (!filters.sizeMax || area <= +filters.sizeMax);

        const matchBuildingType =
          filters.buildingType.length === 0 || filters.buildingType.includes(buildingType);

        const matchPropertyType =
          filters.propertyType.length === 0 || filters.propertyType.includes(type);

        const matchBedrooms =
          filters.bedrooms.length === 0 || filters.bedrooms.includes(bedrooms);

        const matchLocality =
          filters.localities.length === 0 || filters.localities.includes(p.zone);

        const matchFurnishing =
          filters.furnishing.length === 0 || filters.furnishing.includes(p.furnishing);

        const matchGated            = !filters.gatedCommunity;
        const matchPostedBy         = filters.postedBy.length === 0;
        const matchPossession       = filters.possessionStatus.length === 0;
        const matchAmenities        = filters.amenities.length === 0;
        const matchFacing           = filters.facing.length === 0;
        const matchAge              = filters.propertyAge.length === 0;
        const matchAvailability     = filters.availability.length === 0;

        let matchListedWithin = true;
        if      (filters.listedWithin === 'Today')       matchListedWithin = listedDays === 0;
        else if (filters.listedWithin === 'Last 3 Days') matchListedWithin = listedDays <= 3;
        else if (filters.listedWithin === 'Last 7 Days') matchListedWithin = listedDays <= 7;
        else if (filters.listedWithin === 'Last 30 Days')matchListedWithin = listedDays <= 30;

        const matchCity           = !selectedCity    || p.city === selectedCity;
        const matchLocation       = !locationInput   || p.zone === locationInput;
        const matchPincode        = !pincodeInput    || (p.pincode && p.pincode.startsWith(pincodeInput));
        const matchFamilyLocation = !familyLocationsOnly || getBuildingType(p) === 'Residential';
        const matchPreApproved    = !preApprovedMode || p.loanApproved === true;
        const matchLoanApproved   = !filters.loanApprovedOnly || p.loanApproved === true;

        return (
          matchCardType && matchSearch && matchRequirement && matchBudget && matchSize &&
          matchBuildingType && matchPropertyType && matchBedrooms &&
          matchLocality && matchFurnishing && matchGated &&
          matchPostedBy && matchPossession && matchAmenities &&
          matchFacing && matchAge && matchAvailability && matchListedWithin &&
          matchCity && matchLocation && matchPincode &&
          matchFamilyLocation && matchPreApproved && matchLoanApproved
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-low')  return getNumericPrice(a.price) - getNumericPrice(b.price);
        if (sortBy === 'price-high') return getNumericPrice(b.price) - getNumericPrice(a.price);
        return b.id - a.id;
      });
  }, [
    properties, selectedCardType, searchTerm, requirementText, sortBy, filters,
    selectedCity, locationInput, pincodeInput, familyLocationsOnly, preApprovedMode,
    // filters.loanApprovedOnly is included via filters object
  ]);
}
