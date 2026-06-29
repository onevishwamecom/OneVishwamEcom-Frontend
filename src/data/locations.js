export const cities = {
  bengaluru: {
    label: 'Bengaluru',
    areas: [
      'Whitefield', 'Koramangala', 'Indiranagar', 'JP Nagar',
      'Vijayanagar', 'Jayanagar', 'HSR Layout', 'Sarjapur Road',
      'MG Road', 'Yelahanka', 'Electronic City', 'Marathahalli',
      'BTM Layout', 'Banashankari', 'Malleshwaram', 'Rajajinagar',
      'Basavanagudi', 'Hebbal',
    ],
  }
};

export const defaultCity = 'bengaluru';
export const defaultArea = 'Koramangala';

export function getCityLabel(cityId) {
  return cities[cityId]?.label || cityId;
}

export function getAreaLabel(cityId, area) {
  return area || getCityLabel(cityId);
}
