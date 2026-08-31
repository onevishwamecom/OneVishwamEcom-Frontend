import { useMemo } from 'react';
import {
  getPropertyType, getCardType, getNumericPrice, getNumericArea,
  getBedrooms, getBuildingType, getListedWithinDays, isPlotOrLand,
  getCanonicalPossession, getCanonicalFurnishing, getPropertyTypeLabel,
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
        projects: Math.max(items.length > 0 ? 1 : 0, items.reduce((sum, p) => sum + (p.projectCount || 0), 0)),
        keys:     Math.max(items.length, items.reduce((sum, p) => sum + (p.totalUnits || 0), 0)),
        sites:    Math.max(items.length, items.reduce((sum, p) => sum + (p.availableUnits || 0), 0)),
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
    if (!filters) return chips;

    if (filters.budgetMin || filters.budgetMax) {
      const label = [
        filters.budgetMin && `Min ₹${(+filters.budgetMin / 100000).toFixed(1)}L`,
        filters.budgetMax && `Max ₹${(+filters.budgetMax / 100000).toFixed(1)}L`,
      ].filter(Boolean).join(' – ');
      chips.push({ key: 'budget', label: `Budget: ${label}` });
    }
    (filters.buildingType || []).forEach((t)     => chips.push({ key: `bt-${t}`,    label: t }));
    (filters.propertyType || []).forEach((t)     => chips.push({ key: `pt-${t}`,    label: t }));
    (filters.subcategory || []).forEach((t)      => chips.push({ key: `sub-${t}`,   label: t }));
    (filters.bedrooms || []).forEach((b)         => chips.push({ key: `bed-${b}`,   label: b }));
    (filters.localities || []).forEach((l)       => chips.push({ key: `loc-${l}`,   label: l }));
    (filters.furnishing || []).forEach((f)       => chips.push({ key: `furn-${f}`,  label: f }));
    (filters.postedBy || []).forEach((p)         => chips.push({ key: `pb-${p}`,    label: p }));
    (filters.possessionStatus || []).forEach((p) => chips.push({ key: `poss-${p}`,  label: p }));
    (filters.amenities || []).forEach((a)        => chips.push({ key: `amen-${a}`,  label: a }));
    (filters.facing || []).forEach((f)           => chips.push({ key: `face-${f}`,  label: f }));
    (filters.propertyAge || []).forEach((a)      => chips.push({ key: `age-${a}`,   label: a }));
    (filters.availability || []).forEach((a)     => chips.push({ key: `avail-${a}`, label: a }));
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
        const np          = getNumericPrice(p.price);
        const area        = getNumericArea(p.area);
        const bedrooms    = getBedrooms(p.bhk, p);
        const buildingType= getBuildingType(p);
        const listedDays  = getListedWithinDays(p);

        const matchCardType =
          selectedCardType === 'All' || getCardType(p) === selectedCardType;

        const q = (searchTerm || '').trim().toLowerCase();
        const matchSearch = !q ||
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q));

        const qReq = (requirementText || '').trim().toLowerCase();
        const matchRequirement = !qReq ||
          (p.title && p.title.toLowerCase().includes(qReq)) ||
          (p.name && p.name.toLowerCase().includes(qReq)) ||
          (p.location && p.location.toLowerCase().includes(qReq)) ||
          (p.city && p.city.toLowerCase().includes(qReq)) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(qReq)) ||
          (p.description && p.description.toLowerCase().includes(qReq));

        const matchBudget =
          (!filters.budgetMin || np >= +filters.budgetMin) &&
          (!filters.budgetMax || np <= +filters.budgetMax);

        const matchSize =
          (!filters.sizeMin || area >= +filters.sizeMin) &&
          (!filters.sizeMax || area <= +filters.sizeMax);

        const buildingTypes = filters?.buildingType || [];
        const matchBuildingType =
          buildingTypes.length === 0 || buildingTypes.includes(buildingType);

        const propTypes = filters?.propertyType || filters?.subcategory || [];
        const matchPropertyType =
          propTypes.length === 0 ||
          propTypes.some((t) => {
            const ftNorm = String(t).toLowerCase().trim();
            const pType = getPropertyType(p).toLowerCase();

            if (pType === ftNorm) return true;
            if ((ftNorm === 'plots' || ftNorm === 'plot') && isPlotOrLand(p)) return true;
            if ((ftNorm === 'flats' || ftNorm === 'flat') && pType.includes('flat')) return true;
            if ((ftNorm === 'villas' || ftNorm === 'villa') && pType.includes('villa')) return true;
            if ((ftNorm === 'houses' || ftNorm === 'house') && (pType.includes('house') || pType.includes('home'))) return true;
            if (ftNorm === 'commercial' && (pType.includes('commercial') || buildingType === 'Commercial')) return true;
            return false;
          });

        const bedroomsList = filters?.bedrooms || [];
        const matchBedrooms =
          bedroomsList.length === 0 || bedroomsList.includes(bedrooms);

        const localitiesList = filters?.localities || [];
        const matchLocality =
          localitiesList.length === 0 ||
          localitiesList.some((loc) => {
            const l = String(loc).toLowerCase().trim();
            const pLoc = String(p.location || '').toLowerCase();
            const pZone = String(p.zone || '').toLowerCase();
            const pTitle = String(p.title || '').toLowerCase();
            const pSub = String(p.subtitle || '').toLowerCase();
            const pAddr = String(p.address || '').toLowerCase();
            const pArea = String(p.area || '').toLowerCase();

            return (
              pLoc.includes(l) ||
              pZone.includes(l) ||
              pTitle.includes(l) ||
              pSub.includes(l) ||
              pAddr.includes(l) ||
              pArea.includes(l)
            );
          });

        const pFurnishing = getCanonicalFurnishing(p);
        const matchFurnishing =
          (filters?.furnishing || []).length === 0 ||
          filters.furnishing.some((f) => {
            const fNorm = String(f).toLowerCase().replace(/[-\s]/g, '');
            let target = 'unfurnished';
            if (fNorm.includes('semi')) target = 'semi_furnished';
            else if (fNorm.includes('un')) target = 'unfurnished';
            else if (fNorm.includes('furnish')) target = 'furnished';

            return pFurnishing === target;
          });

        const matchGated = !filters?.gatedCommunity || p.gatedCommunity === true || p.gated === true;
        const matchPostedBy = (filters?.postedBy || []).length === 0 || (p.postedBy && filters.postedBy.includes(p.postedBy));

        const pPossession = getCanonicalPossession(p);
        const matchPossession =
          (filters?.possessionStatus || []).length === 0 ||
          filters.possessionStatus.some((status) => {
            const statusNorm = String(status).toLowerCase().trim();
            let targetCanonical = '';
            if (statusNorm.includes('registration') || statusNorm.includes('register')) {
              targetCanonical = 'ready_for_registration';
            } else if (statusNorm.includes('occupy') || statusNorm.includes('move')) {
              targetCanonical = 'ready_for_occupy';
            } else if (statusNorm.includes('construction')) {
              targetCanonical = 'under_construction';
            }

            return pPossession === targetCanonical;
          });

        const matchAmenities        = (filters?.amenities || []).length === 0 || filters.amenities.every(a => p.amenities && p.amenities.includes(a));
        const matchFacing           = (filters?.facing || []).length === 0 || (p.facing && filters.facing.includes(p.facing));
        const matchAge              = (filters?.propertyAge || []).length === 0 || (p.propertyAge && filters.propertyAge.includes(p.propertyAge));
        const matchAvailability     = (filters?.availability || []).length === 0 || (p.availability && filters.availability.includes(p.availability));

        let matchListedWithin = true;
        if      (filters.listedWithin === 'Today')       matchListedWithin = listedDays === 0;
        else if (filters.listedWithin === 'Last 3 Days') matchListedWithin = listedDays <= 3;
        else if (filters.listedWithin === 'Last 7 Days') matchListedWithin = listedDays <= 7;
        else if (filters.listedWithin === 'Last 30 Days')matchListedWithin = listedDays <= 30;

        const cityLower = (selectedCity || '').toLowerCase();
        const pCityLower = (p.city || '').toLowerCase();
        const pLocLower = (p.location || '').toLowerCase();
        const matchCity =
          !cityLower ||
          !pCityLower ||
          pCityLower.includes(cityLower) ||
          pLocLower.includes(cityLower) ||
          (cityLower === 'bengaluru' && (pCityLower.includes('bangalore') || pLocLower.includes('bangalore'))) ||
          (cityLower === 'bangalore' && (pCityLower.includes('bengaluru') || pLocLower.includes('bengaluru')));

        const locInputLower = (locationInput || '').toLowerCase();
        const matchLocation =
          !locInputLower ||
          (p.zone && p.zone.toLowerCase() === locInputLower) ||
          pLocLower.includes(locInputLower);

        const matchPincode        = !pincodeInput    || (p.pincode && String(p.pincode).startsWith(pincodeInput));
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
        return (new Date(b.createdAt || 0).getTime() || 0) - (new Date(a.createdAt || 0).getTime() || 0);
      });
  }, [
    properties, selectedCardType, searchTerm, requirementText, sortBy, filters,
    selectedCity, locationInput, pincodeInput, familyLocationsOnly, preApprovedMode,
  ]);
}
