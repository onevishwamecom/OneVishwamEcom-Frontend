import { dummyProperties } from '../data/dummyProperties';
import { getTotalPropertyPrice, parsePriceRange, formatPropertyDisplayPrice } from '../pages/services/property/propertyHelpers';

const enrichedProperties = dummyProperties.map((p) => {
  const display = formatPropertyDisplayPrice(p);
  return {
    ...p,
    rawPrice: p.price,
    rawPriceSuffix: p.priceSuffix,
    calculatedTotalAmount: getTotalPropertyPrice(p),
    priceRange: parsePriceRange(p),
    price: display.price,
    priceSuffix: display.priceSuffix,
  };
});

export function useProperties() {
  return { properties: enrichedProperties, loading: false, error: null };
}