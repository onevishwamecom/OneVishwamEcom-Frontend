import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let idCounter = 0;
function makeId() {
  idCounter += 1;
  return `${Date.now()}-${idCounter}`;
}

const LS_KEY = 'vishwam_notifications';

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

export const addNotification = createAsyncThunk(
  'notifications/add',
  (payload) => {
    const item = {
          id: makeId(),
      read: false,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    const items = [item, ...load()];
    save(items);
    return item;
  }
);

export const fetchNotifications = createAsyncThunk('notifications/fetch', () => load());

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    markRead(state, action) {
      state.items = state.items.map((i) =>
        i.id === action.payload ? { ...i, read: true } : i
      );
      save(state.items);
    },
    markAllRead(state) {
      state.items = state.items.map((i) => ({ ...i, read: true }));
      save(state.items);
    },
    removeNotification(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      save(state.items);
    },
    clearAll(state) {
      state.items = [];
      save(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      });
  },
});

export const {
  markRead,
  markAllRead,
  removeNotification,
  clearAll,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
