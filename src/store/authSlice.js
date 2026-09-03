import { useCallback } from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { authAPI } from '../api';
import { cacheUser, cachedUserIsFresh, clearAllUserCaches } from '../services/cache/userCache';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    cacheUser(data.data.user);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    cacheUser(data.data.user);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    // Fresh cached profile → skip the network call entirely (no duplicate /auth/me).
    const storedRaw = localStorage.getItem('user');
    const stored = storedRaw ? JSON.parse(storedRaw) : null;
    if (stored && cachedUserIsFresh(stored)) {
      return stored;
    }
    const { data } = await authAPI.getMe();
    cacheUser(data.data.user);
    return data.data.user;
  } catch (err) {
    if (err.response?.status === 401) {
      clearStorage();
      clearAllUserCaches();
    }
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (body, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.updateProfile(body);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    cacheUser(data.data.user);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const updateUserNotifications = createAsyncThunk('auth/updateNotifications', async (prefs, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.updateProfile({
      notifications: {
        email: prefs.email,
        whatsapp: prefs.whatsapp,
      },
    });
    localStorage.setItem('user', JSON.stringify(data.data.user));
    cacheUser(data.data.user);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const changeUserPassword = createAsyncThunk('auth/changePassword', async (body, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.changePassword(body);
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password change failed');
  }
});

export const forgotUserPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.forgotPassword(email);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Request failed');
  }
});

export const verifyUserOtp = createAsyncThunk('auth/verifyOtp', async (body, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.verifyOtp(body);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

export const resendUserOtp = createAsyncThunk('auth/resendOtp', async (email, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.resendOtp(email);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Resend failed');
  }
});

export const resetPasswordWithOtp = createAsyncThunk('auth/resetPasswordWithOtp', async (body, { rejectWithValue }) => {
  try {
    await authAPI.resetPasswordWithOtp(body);
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Reset failed');
  }
});

export const deleteUserAccount = createAsyncThunk('auth/deleteAccount', async (_, { rejectWithValue }) => {
  try {
    await authAPI.deleteAccount();
    clearStorage();
    clearAllUserCaches();
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

function clearStorage() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

const storedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!storedUser,
    user: storedUser ? JSON.parse(storedUser) : null,
    showAuthModal: false,
    authModalMode: 'login',
    loading: false,
    error: null,
    successMessage: null,
    forgotEmail: null,
    verifyToken: null,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      clearStorage();
      clearAllUserCaches();
    },
    openAuthModal(state, action) {
      state.showAuthModal = true;
      state.authModalMode = action.payload || 'login';
      state.error = null;
      state.successMessage = null;
      state.forgotEmail = null;
      state.verifyToken = null;
    },
    closeAuthModal(state) {
      state.showAuthModal = false;
      state.error = null;
      state.successMessage = null;
      state.forgotEmail = null;
      state.verifyToken = null;
    },
    switchAuthMode(state, action) {
      state.authModalMode = action.payload;
      state.error = null;
      state.successMessage = null;
    },
    setForgotEmail(state, action) {
      state.forgotEmail = action.payload;
    },
    setVerifyToken(state, action) {
      state.verifyToken = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.successMessage = null;
    },
    forceLogout(state) {
      state.isLoggedIn = false;
      state.user = null;
      clearStorage();
      clearAllUserCaches();
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; state.successMessage = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.successMessage = 'Login successful!';
      })
      .addCase(loginUser.rejected, handleRejected)
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
        state.successMessage = 'Account created successfully!';
      })
      .addCase(registerUser.rejected, handleRejected)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(updateUserProfile.pending, handlePending)
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateUserProfile.rejected, handleRejected)
      .addCase(changeUserPassword.pending, handlePending)
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Password changed successfully';
      })
      .addCase(changeUserPassword.rejected, handleRejected)
      .addCase(forgotUserPassword.pending, handlePending)
      .addCase(forgotUserPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotUserPassword.rejected, handleRejected)
      .addCase(verifyUserOtp.pending, handlePending)
      .addCase(verifyUserOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyUserOtp.rejected, handleRejected)
      .addCase(resendUserOtp.pending, handlePending)
      .addCase(resendUserOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendUserOtp.rejected, handleRejected)
      .addCase(resetPasswordWithOtp.pending, handlePending)
      .addCase(resetPasswordWithOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordWithOtp.rejected, handleRejected)
      .addCase(deleteUserAccount.pending, handlePending)
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(deleteUserAccount.rejected, handleRejected);
  },
});

export const { logout, openAuthModal, closeAuthModal, switchAuthMode, clearError, clearSuccess, forceLogout, setForgotEmail, setVerifyToken } = authSlice.actions;
export default authSlice.reducer;

export function useAuth() {
  const dispatch = useDispatch();
  return {
    isLoggedIn: useSelector((s) => s.auth.isLoggedIn),
    user: useSelector((s) => s.auth.user),
    showAuthModal: useSelector((s) => s.auth.showAuthModal),
    authModalMode: useSelector((s) => s.auth.authModalMode),
    loading: useSelector((s) => s.auth.loading),
    error: useSelector((s) => s.auth.error),
    successMessage: useSelector((s) => s.auth.successMessage),
    forgotEmail: useSelector((s) => s.auth.forgotEmail),
    verifyToken: useSelector((s) => s.auth.verifyToken),
    login: useCallback((credentials) => dispatch(loginUser(credentials)), [dispatch]),
    register: useCallback((userData) => dispatch(registerUser(userData)), [dispatch]),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
    openAuthModal: useCallback((mode) => dispatch(openAuthModal(mode)), [dispatch]),
    closeAuthModal: useCallback(() => dispatch(closeAuthModal()), [dispatch]),
    switchAuthMode: useCallback((mode) => dispatch(switchAuthMode(mode)), [dispatch]),
    clearError: useCallback(() => dispatch(clearError()), [dispatch]),
    clearSuccess: useCallback(() => dispatch(clearSuccess()), [dispatch]),
    fetchMe: useCallback(() => dispatch(fetchMe()), [dispatch]),
    updateProfile: useCallback((body) => dispatch(updateUserProfile(body)), [dispatch]),
    updateNotifications: useCallback((prefs) => dispatch(updateUserNotifications(prefs)), [dispatch]),
    changePassword: useCallback((body) => dispatch(changeUserPassword(body)), [dispatch]),
    forgotPassword: useCallback((email) => dispatch(forgotUserPassword(email)), [dispatch]),
    verifyOtp: useCallback((body) => dispatch(verifyUserOtp(body)), [dispatch]),
    resendOtp: useCallback((email) => dispatch(resendUserOtp(email)), [dispatch]),
    resetPasswordWithOtp: useCallback((body) => dispatch(resetPasswordWithOtp(body)), [dispatch]),
    deleteAccount: useCallback(() => dispatch(deleteUserAccount()), [dispatch]),
    forceLogout: useCallback(() => dispatch(forceLogout()), [dispatch]),
    setForgotEmail: useCallback((email) => dispatch(setForgotEmail(email)), [dispatch]),
    setVerifyToken: useCallback((token) => dispatch(setVerifyToken(token)), [dispatch]),
  };
}
