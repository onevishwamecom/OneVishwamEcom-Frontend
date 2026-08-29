import { getNumericPrice } from '../shared/priceUtils';

export { getNumericPrice };

export function getNumericArea(area) {
  const m = area?.match(/^([\d,.]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : 0;
}

export function getPropertyType(property) {
  const s = (property.subtitle || '').toLowerCase();
  const b = String(property.bhk || '').toLowerCase();
  if (s.includes('villa') || s.includes('farmhouse')) return 'Villa';
  if (b.includes('office') || b.includes('shop') || b.includes('commercial') ||
      s.includes('office') || s.includes('shop') || s.includes('commercial')) return 'Commercial';
  if (s.includes('agricultural') || s.includes('raw land') || s.includes('development plot')) return 'Lands';
  if (s.includes('plot') || s.includes('site') || s.includes('land')) return 'Plot';
  if (s.includes('flat') || s.includes('apartment') || s.includes('penthouse') || b.includes('bhk')) return 'Flat';
  if (s.includes('house')) return 'Houses';
  return 'Flat';
}

export function getPropertyTypeLabel(property) {
  if (!property) return 'Flat';
  const sub = String(property.subcategory || property.subCategory || property.category || '').toLowerCase();
  if (sub.includes('plot') || sub.includes('site') || sub.includes('land')) return 'Plot';
  if (sub.includes('villa')) return 'Villa';
  if (sub.includes('flat') || sub.includes('apartment') || sub.includes('house') || !sub) return 'Flat';
  return property.subcategory || property.subCategory || 'Flat';
}

export function getPropertyStatusPill(property) {
  if (!property) return null;
  const s = String(
    property.subcategory ||
    property.subCategory ||
    property.category ||
    property.buildingType ||
    property.subtitle ||
    property.title ||
    ''
  ).toLowerCase();

  if (s.includes('plot') || s.includes('site') || s.includes('land')) {
    return { label: 'Ready for Registration', cls: 'bg-emerald-100 text-emerald-700 font-bold' };
  }
  return { label: 'Ready for Occupy', cls: 'bg-emerald-100 text-emerald-700 font-bold' };
}

export function getBedrooms(bhk) {
  const bhkStr = String(bhk || '');
  const match = bhkStr.match(/(\d+(\.\d+)?)\s*BHK/i);
  if (match) return `${match[1]} BHK`;
  const num = parseFloat(bhkStr);
  return !isNaN(num) ? `${num} BHK` : '';
}

export function getBuildingType(property) {
  const s = (property.subtitle || property.category || '').toLowerCase();
  const b = String(property.bhk || '').toLowerCase();
  if (b.includes('office') || b.includes('shop') || b.includes('commercial') ||
      s.includes('office') || s.includes('shop') || s.includes('commercial')) return 'Commercial';
  return 'Residential';
}

export function getDetailTags(property) {
  const tags = [];
  const bhkStr = String(property.bhk || '').toLowerCase();
  if (property.bhk && !bhkStr.includes('office') && !bhkStr.includes('shop')) {
    tags.push(property.bhk);
  }
  if (property.area)    tags.push(property.area);
  if (property.furnishing) tags.push(property.furnishing);
  if (property.floor)   tags.push(property.floor);
  if (property.parking && property.parking !== 'N/A') tags.push(property.parking);
  return tags.slice(0, 3);
}

export function getCardType(property) {
  const t = getPropertyType(property);
  if (t === 'Lands')   return 'Lands';
  if (t === 'Plot')   return 'Sites';
  if (t === 'Flat')   return 'Flat';
  if (t === 'Villa')  return 'Villa';
  if (t === 'Houses')  return 'Independent House';
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
