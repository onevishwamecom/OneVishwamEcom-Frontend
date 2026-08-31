import { getNumericPrice } from '../../../utils/formatters';

export { getNumericPrice };

export function getNumericArea(area) {
  const m = area?.match(/^([\d,.]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : 0;
}

export function getPropertyType(property) {
  if (!property) return 'Flats';

  const type = String(
    property.propertyType ||
    property.subcategory ||
    property.subCategory ||
    property.category ||
    property.buildingType ||
    ''
  ).toLowerCase().trim();

  const sub = String(property.subtitle || '').toLowerCase();
  const title = String(property.title || property.name || '').toLowerCase();
  const bhk = String(property.bhk || '').toLowerCase();
  const fullText = `${type} ${sub} ${title} ${bhk}`;

  if (
    type.includes('commercial') ||
    type.includes('industrial') ||
    type.includes('showroom') ||
    type.includes('office') ||
    type.includes('shop') ||
    fullText.includes('commercial') ||
    fullText.includes('industrial') ||
    fullText.includes('showroom') ||
    fullText.includes('office space') ||
    fullText.includes('shop')
  ) {
    return 'Commercial';
  }

  if (
    type.includes('plot') ||
    type.includes('site') ||
    type.includes('land') ||
    fullText.includes('plot') ||
    fullText.includes('site') ||
    fullText.includes('land') ||
    fullText.includes('layout') ||
    fullText.includes('enclave')
  ) {
    return 'Plots';
  }

  if (
    type.includes('villa') ||
    type.includes('farmhouse') ||
    fullText.includes('villa') ||
    fullText.includes('farmhouse')
  ) {
    return 'Villas';
  }

  if (
    type.includes('house') ||
    fullText.includes('house') ||
    fullText.includes('independent house')
  ) {
    return 'Houses';
  }

  return 'Flats';
}

export function getPropertyTypeLabel(property) {
  if (!property) return 'Flat';
  const sub = String(property.subcategory || property.subCategory || property.category || '').toLowerCase();
  if (sub.includes('plot') || sub.includes('site') || sub.includes('land')) return 'Plot';
  if (sub.includes('villa')) return 'Villa';
  if (sub.includes('flat') || sub.includes('apartment') || sub.includes('house') || !sub) return 'Flat';
  return property.subcategory || property.subCategory || 'Flat';
}

export function isPlotOrLand(property) {
  if (!property) return false;
  const sub = String(
    property.subcategory ||
    property.subCategory ||
    property.propertyType ||
    property.category ||
    property.buildingType ||
    property.subtitle ||
    property.title ||
    ''
  ).toLowerCase();
  const bhk = String(property.bhk || '').toLowerCase();
  return (
    sub.includes('plot') ||
    sub.includes('site') ||
    sub.includes('land') ||
    sub.includes('farm plot') ||
    bhk.includes('plot') ||
    bhk.includes('site') ||
    bhk.includes('guntas')
  );
}

export function getPropertyStatusPill(property) {
  if (!property) return null;
  const canonical = getCanonicalPossession(property);

  if (canonical === 'ready_for_registration') {
    return { label: 'Ready for Registration', cls: 'bg-emerald-100 text-emerald-700' };
  }
  if (canonical === 'ready_for_occupy') {
    return { label: 'Ready for Occupy', cls: 'bg-emerald-100 text-emerald-700' };
  }
  if (canonical === 'under_construction') {
    return { label: 'Under Construction', cls: 'bg-amber-100 text-amber-700' };
  }

  const raw = String(property.possession || property.possessionStatus || '').trim();
  return { label: raw || 'Ready for Occupy', cls: 'bg-emerald-100 text-emerald-700' };
}

export function getBedrooms(bhk, property) {
  if (property && isPlotOrLand(property)) return '';
  const bhkStr = String(bhk || '').trim();
  if (
    !bhkStr ||
    bhkStr === 'N/A' ||
    bhkStr.toLowerCase().includes('plot') ||
    bhkStr.toLowerCase().includes('site') ||
    bhkStr.toLowerCase().includes('land')
  ) {
    return '';
  }
  const match = bhkStr.match(/(\d+(\.\d+)?)\s*BHK/i);
  if (match) return `${match[1]} BHK`;
  const num = parseFloat(bhkStr);
  return !isNaN(num) ? `${num} BHK` : bhkStr;
}

export function getBuildingType(property) {
  if (!property) return 'Residential';

  const type = String(
    property.buildingType ||
    property.propertyType ||
    property.subcategory ||
    property.subCategory ||
    property.category ||
    ''
  ).toLowerCase().trim();

  const sub = String(property.subtitle || '').toLowerCase();
  const title = String(property.title || property.name || '').toLowerCase();
  const bhk = String(property.bhk || '').toLowerCase();
  const area = String(property.area || '').toLowerCase();
  const fullText = `${type} ${sub} ${title} ${bhk} ${area}`;

  if (
    type.includes('commercial') ||
    type.includes('industrial') ||
    type.includes('showroom') ||
    type.includes('office') ||
    type.includes('shop') ||
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

  const type = getPropertyType(property);
  const sub = String(property.subcategory || property.subCategory || property.category || property.title || '').toLowerCase();
  const subtitle = String(property.subtitle || '').toLowerCase();

  if (sub.includes('agricultural') || sub.includes('raw land') || subtitle.includes('agricultural')) {
    return 'Lands';
  }
  if (type === 'Plots' || sub.includes('plot') || sub.includes('site') || sub.includes('land')) {
    return 'Sites';
  }
  if (type === 'Villas' || sub.includes('villa') || sub.includes('farmhouse')) {
    return 'Villa';
  }
  if (type === 'Houses' || sub.includes('house') || sub.includes('independent house')) {
    return 'Independent House';
  }
  return 'Flat';
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

/**
 * True when a property has at least one real (non-placeholder) image.
 * Used to show properties-with-images first across listings.
 */
export function hasPropertyImages(property) {
  return Array.isArray(property.images) &&
    property.images.some((src) => src && !src.startsWith('data:'));
}

/**
 * Best available cover image: prefers a real property/building image,
 * falls back to the first entry, then to a legacy single `image` field.
 */
export function getPropertyCoverImage(property) {
  if (Array.isArray(property.images)) {
    return property.images.find((src) => src && !src.startsWith('data:')) ||
      property.images[0] || '';
  }
  return property.image || '';
}
