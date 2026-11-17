import { isPlotOrLand, getBedrooms, getDetailTags } from '../pages/services/property/propertyHelpers';
import { mapPropertyToEntityItem } from '../components/common/templates/adapters';

describe('Plot & Land feature suppression', () => {
  const mockPlot = {
    _id: 'plot-123',
    title: 'BDA Approved Villa Site in Sarjapur',
    propertyType: 'Residential Plot',
    subcategory: 'Plot',
    area: '1500 Sq.ft',
    dimensions: '30x50',
    facing: 'North Facing',
    bhk: '3 BHK', // residual dummy data
    bathrooms: 2, // residual dummy data
    parking: '1 Car Parking', // residual dummy data
    furnishing: 'Unfurnished',
    floor: 'Ground Floor',
    amenities: ['Swimming Pool', 'Gym', '24/7 Security'],
    details: {
      approvalAuthority: 'BDA Approved',
      khataType: 'A-Khata',
      possessionStatus: 'Ready for Registration',
      parkingAvailability: 'None',
      furnishingStatus: 'N/A',
      floors: 0,
    },
  };

  test('isPlotOrLand correctly identifies plots', () => {
    expect(isPlotOrLand(mockPlot)).toBe(true);
    expect(isPlotOrLand({ propertyType: 'Apartment', subcategory: 'Apartment' })).toBe(false);
    expect(isPlotOrLand({ title: 'Agricultural Land near Mysore', propertyType: 'Land' })).toBe(true);
  });

  test('getBedrooms returns empty string for plots', () => {
    expect(getBedrooms(mockPlot.bhk, mockPlot)).toBe('');
  });

  test('getDetailTags excludes bedroom, bathroom, parking, floor and furnishing for plots', () => {
    const tags = getDetailTags(mockPlot);
    tags.forEach((tag) => {
      expect(tag).not.toMatch(/\b(bhk|bed|beds|bedroom|bath|baths|bathroom|parking|garage|floor|furnish)\b/i);
    });
  });

  test('mapPropertyToEntityItem omits bedroom/parking specs and clears features for plots', () => {
    const adapted = mapPropertyToEntityItem(mockPlot);
    expect(adapted.keyAttributes.find((attr) => attr.label === 'Configuration')).toBeUndefined();
    expect(adapted.features).toEqual([]);

    const infraGroup = adapted.specs.find((g) => g.groupName.includes('Infrastructure'));
    if (infraGroup) {
      expect(infraGroup.items.find((item) => item.key === 'Parking')).toBeUndefined();
      expect(infraGroup.items.find((item) => item.key === 'Furnishing State')).toBeUndefined();
    }
  });
});
