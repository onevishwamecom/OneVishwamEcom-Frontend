import axios from "axios";
import { auth } from "../firebase/config";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "https://asia-south1-onevishwam.cloudfunctions.net/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach fresh Firebase ID Token dynamically
API.interceptors.request.use(
  async (config) => {
    try {
      if (auth && typeof auth.authStateReady === 'function') {
        await auth.authStateReady();
      }
      const currentUser = auth?.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      } else {
        const legacyToken = localStorage.getItem("accessToken");
        if (legacyToken) {
          config.headers.Authorization = `Bearer ${legacyToken}`;
        }
      }
    } catch (err) {
      console.warn("Failed to get Firebase ID token:", err);
    }

    // Prevent double /api prefix if baseURL already ends with /api
    if (config.baseURL?.endsWith("/api") && config.url?.startsWith("/api/")) {
      config.url = config.url.replace(/^\/api/, "");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
