import { dummyProperties } from '../data/dummyProperties';
import { getTotalPropertyPrice, parsePriceRange } from '../pages/services/property/propertyHelpers';

const enrichedProperties = dummyProperties.map((p) => ({
  ...p,
  calculatedTotalAmount: getTotalPropertyPrice(p),
  priceRange: parsePriceRange(p),
}));

export function useProperties() {
  return { properties: enrichedProperties, loading: false, error: null };
}