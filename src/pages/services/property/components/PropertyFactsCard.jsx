import React from 'react';
import { isPlotOrLand } from '../propertyHelpers';

export default function PropertyFactsCard({ property }) {
  if (!property) return null;

  const isPlot = isPlotOrLand(property);

  const facts = isPlot
    ? [
        { label: 'Property Type', value: property.propertyType || property.subcategory || 'Residential Plot' },
        { label: 'Plot Area / Extent', value: property.area || property.dimensions },
        { label: 'Dimensions', value: property.dimensions || property.details?.dimensions },
        { label: 'Facing Direction', value: property.facing },
        { label: 'Khata Type', value: property.khataType || property.details?.khataType },
        { label: 'Approval Authority', value: property.approvalAuthority || property.details?.approvalAuthority },
        { label: 'Registration / Possession', value: property.possessionStatus || property.details?.possessionStatus || property.possession || 'Ready for Registration' },
        { label: 'Gated Layout', value: property.gatedCommunity !== undefined ? (property.gatedCommunity ? 'Yes' : 'No') : undefined },
        { label: 'Boundary Wall', value: property.boundaryWall !== undefined ? (property.boundaryWall ? 'Yes' : 'No') : undefined },
        { label: 'Road Width', value: property.details?.roadFacingWidth || property.details?.roadAccessWidth || property.roadWidth },
      ].filter((f) => f.value && f.value !== 'N/A' && f.value !== '')
    : [
        { label: 'Property Type', value: property.propertyType || property.subcategory },
        { label: 'Area', value: property.area },
        { label: 'Size', value: property.sizeRange },
        { label: 'Bedrooms', value: property.bhk },
        { label: 'Bathrooms', value: property.bathrooms },
        { label: 'Balconies', value: property.balcony || property.balconies },
        { label: 'Furnishing', value: property.furnishing },
        { label: 'Facing', value: property.facing },
        { label: 'Floor', value: property.floor },
        { label: 'Total Floors', value: property.totalFloors },
        { label: 'Property Age', value: property.propertyAge || property.age },
        { label: 'Possession', value: property.possessionStatus || property.details?.possessionStatus || property.possession || (property.status === 'available' ? 'Ready to Occupy' : property.status) },
        { label: 'Gated Community', value: property.gatedCommunity ? 'Yes' : 'No' },
        { label: 'Parking', value: property.parking },
        { label: 'Water Source', value: property.waterSource },
        { label: 'Overlooking', value: property.overlooking },
        { label: 'Power Backup', value: property.powerBackup },
        { label: 'Pet Friendly', value: property.petsAllowed ? 'Yes' : 'No' },
      ].filter((f) => f.value && f.value !== 'N/A' && f.value !== '');

  if (facts.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <i className="fa-solid fa-table-list text-gray-600 text-xs" />
        </div>
        <h2 className="text-base font-bold text-brand-charcoal">{isPlot ? 'Plot Facts & Approvals' : 'Property Facts'}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {facts.map((f) => (
          <div key={f.label} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400 text-xs">{f.label}</span>
            <span className="font-semibold text-brand-charcoal">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
