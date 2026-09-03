import { getNumericPrice } from '../../../utils/formatters';

export { getNumericPrice };

/**
 * Parses area strings into numeric square feet with multi-unit support.
 * Handles:
 * - "8000 Sq.ft" / "8000 sqft" -> 8000
 * - "1200 - 2400 Sq.ft" -> 1200 (min area)
 * - "2 Acres" -> 87,120 sq.ft (43,560 sq.ft / acre)
 * - "5 Guntas" -> 5,445 sq.ft (1,089 sq.ft / gunta)
 * - "200 Sq.Yds" -> 1,800 sq.ft (9 sq.ft / sq.yd)
 * - "10 Cents" -> 4,356 sq.ft (435.6 sq.ft / cent)
 */
export function getNumericArea(area) {
  if (!area) return 0;
  const str = String(area).trim();
  const lower = str.toLowerCase();

  const m = str.match(/([\d,.]+)/);
  if (!m) return 0;
  const num = parseFloat(m[1].replace(/,/g, ''));
  if (isNaN(num) || num <= 0) return 0;

  if (lower.includes('acre')) return Math.round(num * 43560);
  if (lower.includes('gunta')) return Math.round(num * 1089);
  if (lower.includes('cent')) return Math.round(num * 435.6);
  if (lower.includes('ground')) return Math.round(num * 2400);
  if (lower.includes('sq.yd') || lower.includes('sq yd') || lower.includes('sqyd') || lower.includes('yard')) {
    return Math.round(num * 9);
  }

  return num;
}

/**
 * Extracts { min, max } area range in sq.ft from an area string.
 */
export function parseAreaRange(area) {
  if (!area) return { min: 0, max: 0 };
  const str = String(area).trim();
  const lower = str.toLowerCase();
  
  let unitMultiplier = 1;
  if (lower.includes('acre')) unitMultiplier = 43560;
  else if (lower.includes('gunta')) unitMultiplier = 1089;
  else if (lower.includes('cent')) unitMultiplier = 435.6;
  else if (lower.includes('ground')) unitMultiplier = 2400;
  else if (lower.includes('sq.yd') || lower.includes('sq yd') || lower.includes('sqyd') || lower.includes('yard')) {
    unitMultiplier = 9;
  }

  // Check for range e.g. "1200 - 2400 Sq.ft"
  const rangeMatch = str.match(/([\d,.]+)\s*(?:-|–|to)\s*([\d,.]+)/);
  if (rangeMatch) {
    const minVal = parseFloat(rangeMatch[1].replace(/,/g, '')) * unitMultiplier;
    const maxVal = parseFloat(rangeMatch[2].replace(/,/g, '')) * unitMultiplier;
    return {
      min: Math.round(Math.min(minVal, maxVal)),
      max: Math.round(Math.max(minVal, maxVal)),
    };
  }

  const single = getNumericArea(str);
  return { min: single, max: single };
}

/**
 * Parses price range and computes total property valuation.
 * If price is per sqft (e.g. "₹ 2500/Sq.ft" with 8000 sqft area = ₹ 2.00 Cr),
 * accurately multiplies rate * area to calculate true total worth.
 */
export function parsePriceRange(property) {
  if (!property) return { min: 0, max: 0 };

  const rawPriceStr = String(
    (typeof property === 'object' ? (property.price || property.cost || property.amount) : property) || ''
  ).trim();

  if (!rawPriceStr || rawPriceStr.toLowerCase() === 'on request') {
    return { min: 0, max: 0 };
  }

  const areaRange = parseAreaRange(
    typeof property === 'object' ? (property.area || property.size || property.plotSize || property.bhk || '') : ''
  );
  const isPerSqft = /(?:\/|\bper\s*)(?:sq|sft|sqft|sq\.ft)/i.test(rawPriceStr);

  // Check for price range e.g. "₹ 1.80 Cr – 2.50 Cr" or "₹ 78 Lakhs – 1.22 Cr"
  const priceRangeMatch = rawPriceStr.match(/₹?\s*([\d,.]+)\s*(cr|crore|l|lakh|lakhs|k)?\s*(?:-|–|to)\s*₹?\s*([\d,.]+)\s*(cr|crore|l|lakh|lakhs|k)?/i);

  if (priceRangeMatch) {
    const num1 = parseFloat(priceRangeMatch[1].replace(/,/g, ''));
    const unit1 = (priceRangeMatch[2] || priceRangeMatch[4] || '').toLowerCase();
    const num2 = parseFloat(priceRangeMatch[3].replace(/,/g, ''));
    const unit2 = (priceRangeMatch[4] || priceRangeMatch[2] || '').toLowerCase();

    const mult1 = unit1.startsWith('cr') ? 10000000 : (unit1.startsWith('l') ? 100000 : (unit1.startsWith('k') ? 1000 : 1));
    const mult2 = unit2.startsWith('cr') ? 10000000 : (unit2.startsWith('l') ? 100000 : (unit2.startsWith('k') ? 1000 : 1));

    let p1 = num1 * mult1;
    let p2 = num2 * mult2;

    if (isPerSqft || (p1 < 100000 && areaRange.min > 0)) {
      p1 = p1 * (areaRange.min || 1);
      p2 = p2 * (areaRange.max || areaRange.min || 1);
    }

    return {
      min: Math.round(Math.min(p1, p2)),
      max: Math.round(Math.max(p1, p2)),
    };
  }

  // Single price point
  const baseNumPrice = getNumericPrice(rawPriceStr);

  if (isPerSqft || (baseNumPrice > 0 && baseNumPrice < 100000 && areaRange.min > 0)) {
    const rateMatch = rawPriceStr.match(/([\d,.]+)/);
    const rate = rateMatch ? parseFloat(rateMatch[1].replace(/,/g, '')) : baseNumPrice;
    if (rate > 0 && areaRange.min > 0) {
      return {
        min: Math.round(rate * areaRange.min),
        max: Math.round(rate * (areaRange.max || areaRange.min)),
      };
    }
  }

  return { min: baseNumPrice, max: baseNumPrice };
}

/**
 * Returns single representative total valuation in INR for sorting & filters.
 */
export function getTotalPropertyPrice(property) {
  const { min } = parsePriceRange(property);
  return min;
}

/**
 * True if property's total valuation range overlaps the user's budget filter.
 */
export function matchesBudgetRange(property, budgetMin, budgetMax) {
  if (!budgetMin && !budgetMax) return true;
  const { min: pMin, max: pMax } = parsePriceRange(property);
  if (pMin === 0 && pMax === 0) return true; // Keep "On Request" or unpriced properties accessible

  const bMin = budgetMin ? +budgetMin : 0;
  const bMax = budgetMax ? +budgetMax : Infinity;

  // Overlap condition: property max >= budget min && property min <= budget max
  return (pMax || pMin) >= bMin && pMin <= bMax;
}

/**
 * True if property's size in sq.ft overlaps the user's size filter.
 */
export function matchesSizeRange(property, sizeMin, sizeMax) {
  if (!sizeMin && !sizeMax) return true;
  const { min: aMin, max: aMax } = parseAreaRange(property.area || property.size || property.plotSize || '');
  if (aMin === 0 && aMax === 0) return true;

  const sMin = sizeMin ? +sizeMin : 0;
  const sMax = sizeMax ? +sizeMax : Infinity;

  return (aMax || aMin) >= sMin && aMin <= sMax;
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
    return { label: 'Ready to Occupy', cls: 'bg-emerald-100 text-emerald-700' };
  }
  if (canonical === 'under_construction') {
    return { label: 'Under Construction', cls: 'bg-amber-100 text-amber-700' };
  }

  const raw = String(property.possession || property.possessionStatus || '').trim();
  return { label: raw || 'Ready to Occupy', cls: 'bg-emerald-100 text-emerald-700' };
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

export const PRIORITY_TITLES = [
  'VEDANT SURAKSHA',
  'Whispering Waves',
  'Bren Annanta',
  'Bren Avaana',
];

/**
 * Returns true if property subtitle or vendor is 'Onevishwam'.
 * Gives top priority placement in listings.
 */
export function isOneVishwamProperty(property) {
  if (!property) return false;
  const sub = String(property.subtitle || '').trim().toLowerCase().replace(/\s+/g, '');
  const vendor = String(property.vendorName || '').trim().toLowerCase().replace(/\s+/g, '');
  return sub === 'onevishwam' || vendor === 'onevishwam';
}

/**
 * Priority sort helper:
 * 1. Specific in-house projects ('VEDANT SURAKSHA', 'Whispering Waves', 'Bren Annanta', 'Bren Avaana')
 * 2. Any other Onevishwam properties
 * 3. Has images priority
 * 4. Recent ID (b.id - a.id)
 */
export function sortPropertiesWithPriority(list = []) {
  return [...list].sort((a, b) => {
    const aTitle = String(a.title || a.name || '').trim().toLowerCase();
    const bTitle = String(b.title || b.name || '').trim().toLowerCase();
    const aPriIndex = PRIORITY_TITLES.findIndex((t) => t.toLowerCase() === aTitle);
    const bPriIndex = PRIORITY_TITLES.findIndex((t) => t.toLowerCase() === bTitle);

    if (aPriIndex !== -1 && bPriIndex !== -1) {
      return aPriIndex - bPriIndex;
    }
    if (aPriIndex !== -1) return -1;
    if (bPriIndex !== -1) return 1;

    const aOv = isOneVishwamProperty(a) ? 1 : 0;
    const bOv = isOneVishwamProperty(b) ? 1 : 0;
    if (aOv !== bOv) return bOv - aOv;

    const aImg = hasPropertyImages(a) ? 1 : 0;
    const bImg = hasPropertyImages(b) ? 1 : 0;
    if (aImg !== bImg) return bImg - aImg;

    return (b.id || 0) - (a.id || 0);
  });
}
