/**
 * Adapters to transform Housing/Land properties and Automobiles/Vehicles
 * from their respective database / mock structures into the unified EntityItem contract.
 */

import { cleanProductName } from '../../../utils/searchUtils';

function isPerSqft(priceStr = '', suffix = '') {
  const combined = `${priceStr} ${suffix}`.toLowerCase();
  return (
    /(?:\/|\bper\s*)(?:sq|sft|sqft|sq\.ft|square\s*feet|square\s*foot|feet|ft)/i.test(combined) ||
    /rs\s*per/i.test(combined) ||
    /\/\s*sq/i.test(combined) ||
    /sq\.?\s*f?t/i.test(combined)
  );
}

/**
 * Transforms a Property entity (from dummyProperties or backend Mongoose doc)
 * into a unified EntityItem.
 *
 * @param {Object} property
 * @returns {import('./types').EntityItem}
 */
export function mapPropertyToEntityItem(property) {
  if (!property) return null;

  const id = property.id || property._id || '';
  const title = cleanProductName(property.propertyName || property.title || 'Featured Property');
  const rawPrice = property.rawPrice || property.price || property.expectedPrice || property.priceRange?.formattedMin || '';
  const rawSuffix = property.rawPriceSuffix || property.priceSuffix || '';
  const inSqft = isPerSqft(rawPrice, rawSuffix);
  const price = inSqft ? rawPrice : 'This is negotiable';
  const priceSubtext = inSqft ? (rawSuffix || (property.negotiable ? 'Negotiable' : (property.priceRange?.isRange ? 'Onwards' : ''))) : '';
  const location = property.location || property.city || property.address || '';
  const pincode = property.pincode || '';

  // Images resolution
  const images = [];
  if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    images.push(...property.images);
  } else if (property.coverImage) {
    images.push(property.coverImage);
  } else if (property.image) {
    images.push(property.image);
  }

  // Badges resolution
  const badges = [];
  if (property.status) {
    badges.push({
      label: property.status === 'approved' ? 'Verified' : property.status,
      className: 'bg-emerald-600 text-white',
    });
  }
  if (property.bankLoanDetails || property.loanApproved) {
    badges.push({ label: 'Loan Approved', className: 'bg-blue-600 text-white' });
  }
  if (property.featured) {
    badges.push({ label: 'Featured', className: 'bg-amber-500 text-white' });
  }

  // Key Attributes (Dynamic Highlights)
  const keyAttributes = [];
  const pType = property.propertyType || property.category || property.type;
  if (pType) {
    keyAttributes.push({ label: 'Type', value: String(pType) });
  }

  const details = property.details || {};
  const bhk = details.bhk || property.bhk;
  if (bhk) {
    keyAttributes.push({ label: 'Configuration', value: String(bhk) });
  }

  const area = details.superBuiltUpArea || details.totalLandArea || details.totalLandExtent || property.superBuiltUpArea || property.dimensions;
  if (area) {
    keyAttributes.push({ label: 'Area / Dimensions', value: String(area) });
  }

  const facing = details.facing || property.facing;
  if (facing) {
    keyAttributes.push({ label: 'Facing', value: String(facing) });
  }

  // Specifications Breakdown mapped over groups
  const specs = [];

  // Group 1: Dimensions & Overview
  const dimItems = [];
  if (property.propertyType) dimItems.push({ key: 'Property Type', value: property.propertyType });
  if (details.dimensions || property.dimensions) dimItems.push({ key: 'Dimensions', value: String(details.dimensions || property.dimensions) });
  if (area) dimItems.push({ key: 'Total Extent / Area', value: String(area) });
  if (facing) dimItems.push({ key: 'Facing Direction', value: String(facing) });
  if (details.cornerPlot !== undefined) dimItems.push({ key: 'Corner Plot', value: details.cornerPlot ? 'Yes' : 'No' });
  if (details.floors) dimItems.push({ key: 'Total Floors', value: String(details.floors) });
  if (dimItems.length > 0) {
    specs.push({ groupName: 'Dimensions & Layout', items: dimItems });
  }

  // Group 2: Approvals & Legal Status
  const legalItems = [];
  const authority = details.approvalAuthority || property.approvalAuthority;
  if (authority) legalItems.push({ key: 'Approval Authority', value: String(authority) });
  if (property.khataType) legalItems.push({ key: 'Khata Type', value: String(property.khataType) });
  if (details.conversionStatus) legalItems.push({ key: 'Land Conversion', value: String(details.conversionStatus) });
  if (property.bankLoanDetails) legalItems.push({ key: 'Bank Loan Approval', value: String(property.bankLoanDetails) });
  if (legalItems.length > 0) {
    specs.push({ groupName: 'Approvals & Legal Documents', items: legalItems });
  }

  // Group 3: Infrastructure & Amenities
  const infraItems = [];
  if (details.roadFacingWidth || details.roadAccessWidth) {
    infraItems.push({ key: 'Road Width', value: String(details.roadFacingWidth || details.roadAccessWidth) });
  }
  if (details.waterAvailability) infraItems.push({ key: 'Water Supply', value: String(details.waterAvailability) });
  if (details.furnishingStatus) infraItems.push({ key: 'Furnishing State', value: String(details.furnishingStatus) });
  if (details.parkingAvailability) infraItems.push({ key: 'Parking', value: String(details.parkingAvailability) });
  if (infraItems.length > 0) {
    specs.push({ groupName: 'Infrastructure & Features', items: infraItems });
  }

  // Seller Information
  const seller = {
    name: property.vendorName || property.channelPartnerName || property.builderName || 'OneVishwam Partner',
    type: property.channelPartnerName ? 'Channel Partner' : (property.builderName ? 'Verified Builder' : 'Authorized Associate'),
    phone: property.contactPhone || '8546996622',
    whatsapp: property.whatsapp || property.contactPhone || '8546996622',
    verified: true,
  };

  return {
    id,
    title,
    price,
    priceSubtext,
    location,
    pincode,
    images,
    badges,
    keyAttributes,
    description: property.description || property.overviewText || 'Verified residential/commercial property listed under the OneVishwam network with complete legal and bank loan assistance.',
    specs,
    seller,
    raw: property,
  };
}

/**
 * Transforms an Automobile/Vehicle entity (from dummyAutomobiles or backend)
 * into a unified EntityItem.
 *
 * @param {Object} vehicle
 * @returns {import('./types').EntityItem}
 */
export function mapVehicleToEntityItem(vehicle) {
  if (!vehicle) return null;

  const id = vehicle.id || vehicle._id || '';
  const title = cleanProductName(
    vehicle.brand && vehicle.model
      ? `${vehicle.brand} ${vehicle.model}`
      : (vehicle.title || 'Vehicle Listing')
  );

  const price = vehicle.price || 'Price on Request';
  const priceSubtext = vehicle.condition === 'old' ? 'Pre-Owned' : 'Ex-Showroom';
  const location = vehicle.location || vehicle.showroom?.city || 'Bangalore';
  const pincode = vehicle.pincode || vehicle.showroom?.pincode || '';

  const images = Array.isArray(vehicle.images) ? vehicle.images : (vehicle.image ? [vehicle.image] : []);

  const badges = [];
  if (vehicle.loanApproved) {
    badges.push({ label: 'Loan Approved', className: 'bg-blue-600 text-white' });
  }
  if (vehicle.condition) {
    badges.push({
      label: vehicle.condition === 'new' ? 'Brand New' : 'Certified Pre-Owned',
      className: vehicle.condition === 'new' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white',
    });
  }
  if (vehicle.featured) {
    badges.push({ label: 'Featured', className: 'bg-amber-500 text-white' });
  }

  // Key Attributes
  const keyAttributes = [];
  if (vehicle.fuelType) keyAttributes.push({ label: 'Fuel', value: vehicle.fuelType });
  if (vehicle.year) keyAttributes.push({ label: 'Year', value: String(vehicle.year) });
  if (vehicle.kmDriven !== undefined) keyAttributes.push({ label: 'KM Driven', value: `${vehicle.kmDriven} km` });
  if (vehicle.category) keyAttributes.push({ label: 'Type', value: vehicle.category });

  // Specifications Breakdown
  const specs = [
    {
      groupName: 'Vehicle Specifications',
      items: [
        { key: 'Brand', value: vehicle.brand || 'N/A' },
        { key: 'Model', value: vehicle.model || 'N/A' },
        { key: 'Model Year', value: String(vehicle.year || 'N/A') },
        { key: 'Fuel Type', value: vehicle.fuelType || 'Petrol' },
        { key: 'Wheeler Type', value: vehicle.wheelerType || vehicle.category || '4-wheeler' },
        { key: 'Available Variants', value: String(vehicle.variants || 'Standard') },
      ],
    },
    {
      groupName: 'Condition & Usage',
      items: [
        { key: 'Condition', value: vehicle.condition === 'new' ? 'Brand New' : 'Pre-Owned' },
        { key: 'KM Driven', value: `${vehicle.kmDriven || 0} km` },
        { key: 'Loan Availability', value: vehicle.loanApproved ? 'Pre-Approved Loans Available' : 'Available on Application' },
      ],
    },
  ];

  if (vehicle.showroom) {
    specs.push({
      groupName: 'Authorized Showroom & Dealer',
      items: [
        { key: 'Dealer Name', value: vehicle.showroom.name || 'Authorized Dealer' },
        { key: 'Address', value: vehicle.showroom.address || location },
        { key: 'City', value: location },
      ],
    });
  }

  const seller = {
    name: vehicle.showroom?.name || `${vehicle.brand || 'Authorized'} Dealer`,
    type: 'Authorized Automobile Dealer',
    phone: vehicle.showroom?.phone || '8546996622',
    whatsapp: '8546996622',
    verified: true,
  };

  return {
    id,
    title,
    price,
    priceSubtext,
    location,
    pincode,
    images,
    badges,
    keyAttributes,
    description: `Brand-new or verified pre-owned ${title} available with comprehensive loan approvals, doorstep test drive assistance, and full warranty support under the OneVishwam Automotive Network.`,
    specs,
    seller,
    raw: vehicle,
  };
}
