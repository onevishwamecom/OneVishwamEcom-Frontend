import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice';
import authReducer from './authSlice';
import notificationsReducer from './notificationsSlice';

const LS_CITY = 'vishwam_city';
const LS_AREA = 'vishwam_area';

const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

let prevLocation = null;
store.subscribe(() => {
  const currentLocation = store.getState().location;
  if (currentLocation === prevLocation) return;

  const { selectedCity, selectedArea } = currentLocation;
  if (!prevLocation || selectedCity !== prevLocation.selectedCity) {
    try { localStorage.setItem(LS_CITY, selectedCity || ''); } catch {}
  }
  if (!prevLocation || selectedArea !== prevLocation.selectedArea) {
    try { localStorage.setItem(LS_AREA, selectedArea || ''); } catch {}
  }
  prevLocation = currentLocation;
});

export default store;
