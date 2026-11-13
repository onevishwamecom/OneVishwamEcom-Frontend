export const cities = {
  bengaluru: {
    label: 'Bengaluru',
    areas: [
      'Whitefield', 'Koramangala', 'Indiranagar', 'JP Nagar',
      'Vijayanagar', 'Jayanagar', 'HSR Layout', 'Sarjapur Road',
      'MG Road', 'Yelahanka', 'Electronic City', 'Marathahalli',
      'BTM Layout', 'Banashankari', 'Malleshwaram', 'Rajajinagar',
      'Hebbal',
    ],
  },
};

export const defaultCity = 'bengaluru';
export const defaultArea = 'Koramangala';

export function getCityLabel(cityId) {
  if (!cityId) return 'Bengaluru';
  const lower = String(cityId).toLowerCase().trim();
  const c = cities[lower];
  if (c) return c.label;
  if (lower === 'bangalore') return 'Bengaluru';
  return 'Bengaluru';
}

export function getAreaLabel(cityId, area) {
  return area || getCityLabel(cityId);
}

export const CITY_ALIASES = {
  bangalore: 'bengaluru',
  bengaluru: 'bengaluru',
};

export function resolveCityId(input) {
  return defaultCity;
}

export const CITY_OPTIONS = Object.entries(cities).map(([id, data]) => ({
  id,
  label: data.label,
}));
