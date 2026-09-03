import { getNumericPrice } from '../shared/priceUtils';

export { getNumericPrice };

export function getNumericArea(area) {
  const m = area?.match(/^([\d,.]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : 0;
}

export function isPlotOrLand(property) {
  if (!property) return false;
  const fullText = (
    String(property.propertyType || '') + ' ' +
    String(property.subcategory || '') + ' ' +
    String(property.subCategory || '') + ' ' +
    String(property.category || '') + ' ' +
    String(property.buildingType || '') + ' ' +
    String(property.subtitle || '') + ' ' +
    String(property.title || '')
  ).toLowerCase();

  return (
    fullText.includes('plot') ||
    fullText.includes('site') ||
    fullText.includes('land') ||
    fullText.includes('farm') ||
    fullText.includes('acres') ||
    fullText.includes('guntas')
  );
}

export function getPropertyType(property) {
  if (!property) return 'Flats';
  const isPlot = isPlotOrLand(property);
  const fullText = (
    String(property.propertyType || '') + ' ' +
    String(property.subcategory || '') + ' ' +
    String(property.subCategory || '') + ' ' +
    String(property.category || '') + ' ' +
    String(property.buildingType || '') + ' ' +
    String(property.subtitle || '') + ' ' +
    String(property.title || '')
  ).toLowerCase();

  if (fullText.includes('commercial') || fullText.includes('industrial') || fullText.includes('showroom') || fullText.includes('office')) {
    if (isPlot) return 'Plots';
    return 'Commercial';
  }
  if (isPlot) return 'Plots';
  if (fullText.includes('villa')) return 'Villas';
  if (fullText.includes('house') || fullText.includes('home') || fullText.includes('duplex') || fullText.includes('triplex')) return 'Houses';
  if (fullText.includes('flat') || fullText.includes('apartment') || fullText.includes('penthouse') || fullText.includes('bhk')) return 'Flats';

  return 'Flats';
}

export function getPropertyTypeLabel(property) {
  if (!property) return 'Flat';
  const pt = getPropertyType(property);
  if (pt === 'Plots') return 'Plot';
  if (pt === 'Villas') return 'Villa';
  if (pt === 'Houses') return 'House';
  if (pt === 'Commercial') return 'Commercial';
  return 'Flat';
}

export function getBedrooms(bhk, property) {
  if (property && isPlotOrLand(property)) return '';
  const bhkStr = String(bhk || '').trim();
  if (bhkStr === 'N/A' || bhkStr.toLowerCase().includes('plot') || bhkStr.toLowerCase().includes('site')) return '';
  const match = bhkStr.match(/(\d+(\.\d+)?)\s*BHK/i);
  if (match) return `${match[1]} BHK`;
  const num = parseFloat(bhkStr);
  return !isNaN(num) ? `${num} BHK` : '';
}

export function getBuildingType(property) {
  if (!property) return 'Residential';
  const fullText = (
    String(property.propertyType || '') + ' ' +
    String(property.subcategory || '') + ' ' +
    String(property.subCategory || '') + ' ' +
    String(property.category || '') + ' ' +
    String(property.buildingType || '') + ' ' +
    String(property.subtitle || '') + ' ' +
    String(property.title || '')
  ).toLowerCase();

  if (
    fullText.includes('commercial') ||
    fullText.includes('industrial') ||
    fullText.includes('showroom') ||
    fullText.includes('office space') ||
    fullText.includes('shop')
  ) {
    return 'Commercial';
  }

  return 'Residential';
}

export function getDetailTags(property) {
  if (!property) return [];
  const tags = [];
  const isPlot = isPlotOrLand(property);
  const bhkStr = String(property.bhk || '').trim();
  const bhkLower = bhkStr.toLowerCase();

  const isBhkValid =
    property.bhk &&
    property.bhk !== 'N/A' &&
    !bhkLower.includes('office') &&
    !bhkLower.includes('shop') &&
    !bhkLower.includes('plot') &&
    !bhkLower.includes('site') &&
    !bhkLower.includes('land') &&
    !isPlot;

  if (isBhkValid) {
    tags.push(property.bhk);
  } else if (isPlot && property.bhk && !bhkLower.includes('plot') && !bhkLower.includes('site') && !bhkLower.includes('land')) {
    tags.push(property.bhk);
  }

  if (property.area) tags.push(property.area);
  if (property.furnishing && property.furnishing !== 'NA' && property.furnishing !== 'N/A' && !isPlot) {
    tags.push(property.furnishing);
  }
  if (property.floor && !isPlot) tags.push(property.floor);
  if (property.parking && property.parking !== 'N/A' && !isPlot) tags.push(property.parking);
  return tags.slice(0, 3);
}

export function getCardType(property) {
  if (!property) return 'Flat';
  const isPlot = isPlotOrLand(property);
  const pt = getPropertyType(property);

  if (isPlot) {
    const fullText = (
      String(property.propertyType || '') + ' ' +
      String(property.subtitle || '') + ' ' +
      String(property.title || '')
    ).toLowerCase();
    if (fullText.includes('farm') || fullText.includes('acres') || fullText.includes('agricultural')) {
      return 'Lands';
    }
    return 'Sites';
  }
  if (pt === 'Villas') return 'Villa';
  if (pt === 'Houses') return 'Independent House';
  return 'Flat';
}

export function getPropertyStatusPill(property) {
  if (!property) return null;
  const canonical = getCanonicalPossession(property);

  if (canonical === 'ready_for_registration') {
    return { label: 'Ready for Registration', cls: 'bg-emerald-100 text-emerald-700 font-bold' };
  }
  if (canonical === 'ready_for_occupy') {
    return { label: 'Ready for Occupy', cls: 'bg-emerald-100 text-emerald-700 font-bold' };
  }
  if (canonical === 'under_construction') {
    return { label: 'Under Construction', cls: 'bg-amber-100 text-amber-700 font-bold' };
  }

  const raw = String(property.possession || property.possessionStatus || '').trim();
  return { label: raw || 'Ready for Occupy', cls: 'bg-emerald-100 text-emerald-700 font-bold' };
}

export function getStatusBadge(property) {
  const statusPill = getPropertyStatusPill(property);
  if (statusPill)                     return { label: statusPill.label, cls: statusPill.cls };
  if (property.loanApproved)          return { label: 'Pre-Approved Loan', cls: 'bg-emerald-100 text-emerald-700' };
  if (property.status === 'closed')   return { label: 'Closed',            cls: 'bg-red-100 text-red-700' };
  if (property.shortlisted)           return { label: 'Shortlisted',       cls: 'bg-amber-100 text-amber-700' };
  return null;
}

export function getCanonicalPossession(property) {
  if (!property) return '';
  if (isPlotOrLand(property)) {
    return 'ready_for_registration';
  }

  const val = String(property.possession || property.possessionStatus || '').toLowerCase().trim();

  if (val.includes('registration') || val.includes('register')) {
    return 'ready_for_registration';
  }
  if (val.includes('occupy') || val.includes('move')) {
    return 'ready_for_occupy';
  }
  if (val.includes('construction')) {
    return 'under_construction';
  }
  return 'ready_for_occupy';
}

export function getCanonicalFurnishing(property) {
  if (!property) return 'unfurnished';

  if (isPlotOrLand(property)) {
    return 'unfurnished';
  }

  if (property.furnishing) {
    const f = String(property.furnishing).toLowerCase().replace(/[-\s]/g, '');
    if (f.includes('semi')) return 'semi_furnished';
    if (f.includes('un')) return 'unfurnished';
    if (f.includes('furnish')) return 'furnished';
  }

  const text = (
    String(property.title || '') + ' ' +
    String(property.subtitle || '') + ' ' +
    String(property.description || '') + ' ' +
    String(property.details || '')
  ).toLowerCase();

  if (text.includes('fully furnished') || text.includes('fully-furnished')) {
    return 'furnished';
  }
  if (text.includes('semi furnished') || text.includes('semi-furnished') || text.includes('semifurnished') || text.includes('modular kitchen')) {
    return 'semi_furnished';
  }
  if (text.includes('unfurnished') || text.includes('bare shell')) {
    return 'unfurnished';
  }

  return 'semi_furnished';
}

export function getListedWithinDays(property) {
  return property.recentlyAdded ? 0 : 30;
}

export function hasPropertyImages(property) {
  return Array.isArray(property.images) &&
    property.images.some((src) => src && !src.startsWith('data:'));
}

export function getPropertyCoverImage(property) {
  if (Array.isArray(property.images)) {
    return property.images.find((src) => src && !src.startsWith('data:')) ||
      property.images[0] || '';
  }
  return property.image || '';
}

/**
 * Returns true if property subtitle or vendor is 'Onevishwam'.
 * Gives top priority placement in listings.
 */
export function isOneVishwamProperty(property) {
  if (!property) return false;
  const sub = String(property.subtitle || property.vendorName || '').trim().toLowerCase().replace(/\s+/g, '');
  return sub === 'onevishwam';
}

/**
 * Priority sort helper:
 * 1. Subtitle = 'Onevishwam' top priority
 * 2. Has images priority
 * 3. Recent ID (b.id - a.id)
 */
export function sortPropertiesWithPriority(list = []) {
  return [...list].sort((a, b) => {
    const aOv = isOneVishwamProperty(a) ? 1 : 0;
    const bOv = isOneVishwamProperty(b) ? 1 : 0;
    if (aOv !== bOv) return bOv - aOv;

    const aImg = hasPropertyImages(a) ? 1 : 0;
    const bImg = hasPropertyImages(b) ? 1 : 0;
    if (aImg !== bImg) return bImg - aImg;

    return (b.id || 0) - (a.id || 0);
  });
}
