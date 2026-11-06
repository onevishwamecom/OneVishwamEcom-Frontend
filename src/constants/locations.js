export const cities = {
  bengaluru: {
    label: 'Bengaluru',
    areas: [
      'Whitefield', 'Koramangala', 'Indiranagar', 'JP Nagar',
      'Vijayanagar', 'Jayanagar', 'HSR Layout', 'Sarjapur Road',
      'MG Road', 'Yelahanka', 'Electronic City', 'Marathahalli',
      'BTM Layout', 'Banashankari', 'Malleshwaram', 'Rajajinagar',
      'Hebbal', 'Kengeri', 'Thanisandra', 'Nagawara',
    ],
  },
  mysuru: {
    label: 'Mysuru (Mysore)',
    areas: [
      'Vijayanagar', 'Jayalakshmipuram', 'Kuvempunagar', 'Saraswathipuram',
      'Gokulam', 'Chamrajpura', 'Bannimantap', 'Hebbal', 'Metagalli',
      'Bogadi', 'Yadavagiri', 'Siddhartha Layout', 'Vontikoppal',
    ],
  },
  mangaluru: {
    label: 'Mangaluru (Mangalore)',
    areas: [
      'Kadri', 'Bejai', 'Hampankatta', 'Falnir', 'Kodialbail',
      'Panambur', 'Surathkal', 'Kankanady', 'Urwa', 'Derlakatte', 'Bondel',
    ],
  },
  hubli: {
    label: 'Hubballi - Dharwad',
    areas: [
      'Vidyanagar', 'Gokul Road', 'Keshwapur', 'Navanagar',
      'Deshpande Nagar', 'PB Road', 'Unkal', 'Dharwad Main', 'Rayapur',
    ],
  },
  belagavi: {
    label: 'Belagavi (Belgaum)',
    areas: [
      'Tilakwadi', 'Camp', 'Shahapur', 'Udyambag',
      'Vadgaon', 'Hindwadi', 'Angol', 'Khasbag',
    ],
  },
  shivamogga: {
    label: 'Shivamogga (Shimoga)',
    areas: [
      'Gandhi Bazaar', 'Durgigudi', 'Vinoba Nagara',
      'Gopalagowda Extension', 'Sagar Road', 'Jayanagar',
    ],
  },
  davangere: {
    label: 'Davangere',
    areas: [
      'MCC A Block', 'MCC B Block', 'PJ Extension',
      'KTJ Nagar', 'Vidyanagar', 'Hadadi Road',
    ],
  },
  mumbai: {
    label: 'Mumbai',
    areas: [
      'Bandra', 'Andheri', 'Juhu', 'Powai', 'Colaba',
      'Worli', 'Thane', 'Navi Mumbai', 'Borivali', 'Dadar',
    ],
  },
  hyderabad: {
    label: 'Hyderabad',
    areas: [
      'Hitec City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills',
      'Madhapur', 'Kondapur', 'Kukatpally', 'Secunderabad', 'Begumpet',
    ],
  },
  chennai: {
    label: 'Chennai',
    areas: [
      'Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery',
      'OMR', 'Besant Nagar', 'Mylapore', 'Guindy', 'Alwarpet',
    ],
  },
  pune: {
    label: 'Pune',
    areas: [
      'Kothrud', 'Baner', 'Wakad', 'Viman Nagar',
      'Hinjewadi', 'Koregaon Park', 'Hadapsar', 'Aundh',
    ],
  },
  delhi: {
    label: 'Delhi NCR',
    areas: [
      'South Delhi', 'Connaught Place', 'Dwarka',
      'Noida', 'Gurgaon', 'Greater Noida', 'Saket', 'Vasant Kunj',
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

  // Check aliases
  if (lower === 'bangalore') return 'Bengaluru';
  if (lower === 'mysore') return 'Mysuru (Mysore)';
  if (lower === 'mangalore') return 'Mangaluru (Mangalore)';
  if (lower === 'hubballi' || lower === 'dharwad') return 'Hubballi - Dharwad';
  if (lower === 'belgaum') return 'Belagavi (Belgaum)';
  if (lower === 'shimoga') return 'Shivamogga (Shimoga)';

  return String(cityId).charAt(0).toUpperCase() + String(cityId).slice(1);
}

export function getAreaLabel(cityId, area) {
  return area || getCityLabel(cityId);
}

export const CITY_ALIASES = {
  bangalore: 'bengaluru',
  bengaluru: 'bengaluru',
  mysore: 'mysuru',
  mysuru: 'mysuru',
  mangalore: 'mangaluru',
  mangaluru: 'mangaluru',
  hubli: 'hubli',
  hubballi: 'hubli',
  dharwad: 'hubli',
  'hubballi-dharwad': 'hubli',
  'hubballi - dharwad': 'hubli',
  belgaum: 'belagavi',
  belagavi: 'belagavi',
  shimoga: 'shivamogga',
  shivamogga: 'shivamogga',
  davangere: 'davangere',
  mumbai: 'mumbai',
  bombay: 'mumbai',
  hyderabad: 'hyderabad',
  secunderabad: 'hyderabad',
  chennai: 'chennai',
  madras: 'chennai',
  pune: 'pune',
  poona: 'pune',
  delhi: 'delhi',
  'delhi ncr': 'delhi',
  'new delhi': 'delhi',
  ncr: 'delhi',
  noida: 'delhi',
  gurgaon: 'delhi',
  gurugram: 'delhi',
};

export function resolveCityId(input) {
  if (!input) return defaultCity;
  const lower = String(input).toLowerCase().trim();
  if (cities[lower]) return lower;
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower];
  for (const [key, c] of Object.entries(cities)) {
    const labelLower = c.label.toLowerCase();
    if (labelLower === lower || labelLower.includes(lower) || lower.includes(key) || lower.includes(labelLower)) {
      return key;
    }
  }
  return defaultCity;
}

export const CITY_OPTIONS = Object.entries(cities).map(([id, data]) => ({
  id,
  label: data.label,
}));
