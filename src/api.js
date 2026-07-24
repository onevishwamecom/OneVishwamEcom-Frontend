import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5001/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(
          `${client.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccess = data.data.accessToken;
        const newRefresh = data.data.refreshToken;

        localStorage.setItem('accessToken', newAccess);
        localStorage.setItem('refreshToken', newRefresh);

        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return client(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (body) => client.post('/auth/login', body),
  register: (body) => client.post('/auth/register', body),
  refresh: (refreshToken) => client.post('/auth/refresh', { refreshToken }),
  getMe: () => client.get('/auth/me'),
  updateProfile: (body) => client.put('/auth/profile', body),
  changePassword: (body) => client.put('/auth/password', body),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  verifyOtp: (body) => client.post('/auth/verify-otp', body),
  resendOtp: (email) => client.post('/auth/resend-otp', { email }),
  resetPasswordWithOtp: (body) => client.post('/auth/reset-password', body),
  deleteAccount: () => client.delete('/auth/account'),
  toggleSave: (listingId) => client.post('/auth/save', { listingId }),
  getSaved: () => client.get('/auth/saved'),
};

// ─── Listings (authenticated) ────────────────────────────────────────────────
export const listingAPI = {
  create: (formData) => client.post('/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => client.get('/listings/my'),
  update: (id, body) => client.put(`/listings/${id}`, body),
  remove: (id) => client.delete(`/listings/${id}`),
  toggleStatus: (id) => client.patch(`/listings/${id}/status`),
};

// ─── Public ──────────────────────────────────────────────────────────────────
export const publicAPI = {
  getListings: (params) => client.get('/listings', { params }),
  getFeatured: () => client.get('/listings/featured'),
  search: (params) => client.get('/listings/search', { params }),
  getById: (id) => client.get(`/listings/${id}`),
  getLoans: (params) => client.get('/loans', { params }),
  sendEnquiry: (body) => client.post('/enquiries', body),
  submitReview: (body) => client.post('/reviews', body),
  getUserReviews: (userId) => client.get(`/users/${userId}/reviews`),
};

export default client;
