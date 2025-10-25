// src/utils/apiClient.js
import axios from "axios";

// Base URL from environment or fallback to localhost
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Create Axios instance
export const apiClient = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // optional
});

// ✅ Automatically attach token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore errors (SSR or localStorage unavailable)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global response interceptor to catch auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Optional: handle 401 / token expired globally
      if (error.response.status === 401) {
        console.warn("⚠️ Token expired or unauthorized. Clearing local storage.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        // Optional: redirect to login page
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Helper for GET requests
export async function getJson(path) {
  const res = await apiClient.get(path);
  return res.data;
}

// ✅ Helper for POST requests (optional)
export async function postJson(path, payload) {
  const res = await apiClient.post(path, payload);
  return res.data;
}

export default apiClient;
