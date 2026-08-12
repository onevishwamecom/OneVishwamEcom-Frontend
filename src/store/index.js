import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';

const LS_CITY = 'vishwam_city';
const LS_AREA = 'vishwam_area';

const store = configureStore({
  reducer: {
    location: locationReducer,
  },
});

let prev;
store.subscribe(() => {
  const { selectedCity, selectedArea } = store.getState().location;
  if (selectedCity !== prev?.city) {
    try { localStorage.setItem(LS_CITY, selectedCity); } catch {}
  }
  if (selectedArea !== prev?.area) {
    try { localStorage.setItem(LS_AREA, selectedArea); } catch {}
  }
  prev = { city: selectedCity, area: selectedArea };
});

export default store;
