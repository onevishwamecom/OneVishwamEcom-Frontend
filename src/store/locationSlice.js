import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { cities, defaultCity, defaultArea, resolveCityId } from '../constants/locations';

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null && v !== '' ? v : fallback;
  } catch {
    return fallback;
  }
}

function save(key, val) {
  try {
    if (val !== undefined && val !== null) {
      localStorage.setItem(key, String(val));
    }
  } catch {}
}

const savedCity = resolveCityId(load('vishwam_city', defaultCity));
const initialCity = cities[savedCity] ? savedCity : defaultCity;
const savedArea = load('vishwam_area', defaultArea);
const initialArea = cities[initialCity]?.areas?.includes(savedArea)
  ? savedArea
  : (cities[initialCity]?.areas?.[0] || defaultArea);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    selectedCity: initialCity,
    selectedArea: initialArea,
    detectStatus: 'idle',
  },
  reducers: {
    selectCity(state, action) {
      const cityId = resolveCityId(action.payload);
      state.selectedCity = cityId;
      state.selectedArea = cities[cityId]?.areas?.[0] || defaultArea;
      save('vishwam_city', state.selectedCity);
      save('vishwam_area', state.selectedArea);
    },
    selectArea(state, action) {
      const cityId = resolveCityId(action.payload?.city);
      state.selectedCity = cityId;
      state.selectedArea = action.payload?.area || cities[cityId]?.areas?.[0] || defaultArea;
      save('vishwam_city', state.selectedCity);
      save('vishwam_area', state.selectedArea);
    },
    setCity(state, action) {
      const cityId = resolveCityId(action.payload);
      state.selectedCity = cityId;
      save('vishwam_city', state.selectedCity);
    },
    setArea(state, action) {
      state.selectedArea = action.payload;
      save('vishwam_area', state.selectedArea);
    },
    setDetectStatus(state, action) {
      state.detectStatus = action.payload;
    },
  },
});

export const { selectCity, selectArea, setCity, setArea, setDetectStatus } = locationSlice.actions;
export default locationSlice.reducer;

export function useLocation() {
  const dispatch = useDispatch();
  const selectedCity = useSelector((s) => s.location.selectedCity);
  const selectedArea = useSelector((s) => s.location.selectedArea);
  const detectStatus = useSelector((s) => s.location.detectStatus);
  return {
    selectedCity,
    selectedArea,
    detectStatus,
    selectArea: (city, area) => dispatch(selectArea({ city, area })),
    selectCity: (cityId) => dispatch(selectCity(cityId)),
    setCity: (cityId) => dispatch(setCity(cityId)),
    setArea: (area) => dispatch(setArea(area)),
    setDetectStatus: (status) => dispatch(setDetectStatus(status)),
  };
}
