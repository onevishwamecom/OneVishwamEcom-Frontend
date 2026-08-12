import { getNumericPrice } from '../GalleryComponents';

export { getNumericPrice };

export function getNumericArea(area) {
  const m = area?.match(/^([\d,.]+)/);
  return m ? parseFloat(m[1].replace(/,/g, '')) : 0;
}

export function getPropertyType(property) {
  const s = (property.subtitle || property.propertyType || '').toLowerCase();
  const b = String(property.bhk || '').toLowerCase();
  if (s.includes('villa') || s.includes('farmhouse')) return 'Villas';
  if (b.includes('office') || b.includes('shop') || b.includes('commercial') ||
      s.includes('office') || s.includes('shop') || s.includes('commercial')) return 'Commercial';
  if (s.includes('agricultural') || s.includes('raw land') || s.includes('development plot')) return 'Lands';
  if (s.includes('plot') || s.includes('site') || s.includes('land')) return 'Plots';
  if (s.includes('flat') || s.includes('apartment') || s.includes('penthouse') || b.includes('bhk')) return 'Flats';
  if (s.includes('house')) return 'Houses';
  return 'Flats';
}

export function getPropertyTypeLabel(property) {
  const s = (property.subtitle || property.propertyType || '').toLowerCase();
  const b = String(property.bhk || '').toLowerCase();
  if (s.includes('villa'))       return 'Villa';
  if (s.includes('farmhouse'))   return 'Farmhouse';
  if (s.includes('penthouse'))   return 'Penthouse';
  if (b.includes('office'))      return 'Office';
  if (b.includes('shop') || s.includes('shop')) return 'Shop';
  if (s.includes('flat') || b.includes('bhk'))  return 'Flat';
  if (s.includes('agricultural') || s.includes('raw land') || s.includes('development plot')) return 'Land';
  if (s.includes('plot') || s.includes('site') || s.includes('land')) return 'Plot';
  if (s.includes('house')) return 'House';
  return 'Property';
}

export function getBedrooms(bhk) {
  const bhkStr = String(bhk || '');
  const match = bhkStr.match(/(\d+(\.\d+)?)\s*BHK/i);
  if (match) return `${match[1]} BHK`;
  const num = parseFloat(bhkStr);
  return !isNaN(num) ? `${num} BHK` : '';
}

export function getBuildingType(property) {
  const s = (property.subtitle || property.propertyType || '').toLowerCase();
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
  if (t === 'Plots')   return 'Sites';
  if (t === 'Flats')   return 'Flat';
  if (t === 'Villas')  return 'Villa';
  if (t === 'Houses')  return 'Independent House';
  return 'Flat';
}

export function getStatusBadge(property) {
  if (property.loanApproved)          return { label: 'Pre-Approved Loan', cls: 'bg-emerald-100 text-emerald-700' };
  if (property.status === 'closed')   return { label: 'Closed',            cls: 'bg-red-100 text-red-700' };
  if (property.shortlisted)           return { label: 'Shortlisted',       cls: 'bg-amber-100 text-amber-700' };
  return null;
}

export function getListedWithinDays(property) {
  return property.recentlyAdded ? 0 : 30;
}
