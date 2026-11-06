import { cities, defaultCity, defaultArea, CITY_ALIASES, resolveCityId } from '../constants/locations';

const BIGDATACLOUD_CLIENT_API = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

// Greater Bengaluru Metropolitan Area Bounding Box
const BENGALURU_BBOX = {
  minLat: 12.65,
  maxLat: 13.35,
  minLng: 77.25,
  maxLng: 77.95,
};

function isWithinBengaluru(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  return (
    lat >= BENGALURU_BBOX.minLat &&
    lat <= BENGALURU_BBOX.maxLat &&
    lng >= BENGALURU_BBOX.minLng &&
    lng <= BENGALURU_BBOX.maxLng
  );
}

/**
 * Attempts to get browser GPS coordinates.
 * Uses standard accuracy and a reasonable timeout to prevent hanging on desktop browsers.
 */
function getBrowserCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not supported by browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 300000,
      }
    );
  });
}

/**
 * Reverse geocodes using BigDataCloud's free browser-friendly client API.
 * Supports passing coordinates, or omitting them for IP-based geolocation fallback.
 */
async function fetchReverseGeocode(lat, lng) {
  try {
    const url = (typeof lat === 'number' && typeof lng === 'number')
      ? `${BIGDATACLOUD_CLIENT_API}?latitude=${lat.toFixed(6)}&longitude=${lng.toFixed(6)}&localityLanguage=en`
      : `${BIGDATACLOUD_CLIENT_API}?localityLanguage=en`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      source: 'bigdatacloud',
      lat: data.latitude || lat,
      lng: data.longitude || lng,
      city: data.city || '',
      locality: data.locality || '',
      state: data.principalSubdivision || '',
      details: data.localityInfo?.administrative || [],
    };
  } catch {
    // If BigDataCloud fails and we have coordinates, fallback to OSM Nominatim
    if (typeof lat === 'number' && typeof lng === 'number') {
      try {
        const params = new URLSearchParams({
          lat: lat.toFixed(6),
          lon: lng.toFixed(6),
          format: 'json',
          addressdetails: 1,
        });
        const res = await fetch(`${NOMINATIM_API}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const addr = data.address || {};
        return {
          source: 'nominatim',
          lat,
          lng,
          city: addr.city || addr.town || addr.county || '',
          locality: addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.road || '',
          state: addr.state || '',
          addr,
        };
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Identifies the city from reverse geocoding data.
 */
function resolveCity(geoData) {
  if (!geoData) return defaultCity;

  // Check coordinates bounding box for Bengaluru
  if (isWithinBengaluru(geoData.lat, geoData.lng)) {
    return 'bengaluru';
  }

  // Text search in all address fields
  const textBag = [
    geoData.city,
    geoData.locality,
    geoData.state,
    ...(geoData.details ? geoData.details.map((d) => d.name) : []),
    ...(geoData.addr ? Object.values(geoData.addr) : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // 1. Direct match with aliases & city keys
  for (const [alias, canonicalId] of Object.entries(CITY_ALIASES)) {
    const regex = new RegExp(`\\b${alias}\\b`, 'i');
    if (regex.test(textBag)) {
      return canonicalId;
    }
  }

  // 2. Direct match with city labels
  for (const [cityId, cityData] of Object.entries(cities)) {
    if (textBag.includes(cityId)) return cityId;
    const labelClean = cityData.label.toLowerCase().replace(/[^a-z]/g, ' ');
    const parts = labelClean.split(/\s+/).filter((p) => p.length > 3);
    for (const part of parts) {
      if (textBag.includes(part)) return cityId;
    }
  }

  // Default fallback
  return defaultCity;
}

/**
 * Finds the closest matched area or extracts clean locality name for the resolved city.
 */
function resolveArea(geoData, cityId) {
  const cityAreas = cities[cityId]?.areas || [];
  const candidates = [
    geoData.locality,
    geoData.city,
    ...(geoData.details ? geoData.details.map((d) => d.name) : []),
    ...(geoData.addr ? [geoData.addr.suburb, geoData.addr.neighbourhood, geoData.addr.quarter, geoData.addr.road] : []),
  ]
    .filter(Boolean)
    .map((s) => String(s).trim());

  // 1. Try finding a known area match in the resolved city
  for (const candidate of candidates) {
    const candLower = candidate.toLowerCase();
    for (const known of cityAreas) {
      const knownLower = known.toLowerCase();
      if (candLower.includes(knownLower) || knownLower.includes(candLower)) {
        return known;
      }
    }
  }

  // 2. Use detected clean suburb / locality if available and not simply the city name
  for (const candidate of candidates) {
    const candLower = candidate.toLowerCase();
    if (
      candidate.length >= 3 &&
      !candLower.includes('bengaluru') &&
      !candLower.includes('bangalore') &&
      !candLower.includes('karnataka') &&
      !candLower.includes('india') &&
      !candLower.includes('corporation') &&
      !candLower.includes('district')
    ) {
      return candidate;
    }
  }

  // 3. Fallback to first area of this city or defaultArea
  return cityAreas[0] || defaultArea;
}

/**
 * Main location detection function.
 * Tries GPS first, then falls back seamlessly to IP geolocation.
 */
export async function detectCurrentLocation() {
  let geoData = null;

  // 1. Try browser GPS
  try {
    const coords = await getBrowserCoordinates();
    if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
      geoData = await fetchReverseGeocode(coords.latitude, coords.longitude);
    }
  } catch (gpsError) {
    console.warn('[detectLocation] Browser GPS unavailable or denied, falling back to IP geolocation:', gpsError.message);
  }

  // 2. Fallback to IP geolocation if GPS wasn't available or didn't yield geodata
  if (!geoData) {
    geoData = await fetchReverseGeocode();
  }

  if (!geoData) {
    throw new Error('Unable to retrieve location coordinates');
  }

  const resolvedCityId = resolveCity(geoData);
  const matchedArea = resolveArea(geoData, resolvedCityId);

  return {
    cityId: resolvedCityId,
    area: matchedArea,
    lat: geoData.lat,
    lng: geoData.lng,
    isBengaluru: resolvedCityId === 'bengaluru',
  };
}
