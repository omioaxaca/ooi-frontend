import axios from "axios";
import * as localStorageUtils from "../utils/localStorage.ts";
import { dashboardReturnPath } from "../lib/study-assets.ts";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const next = dashboardReturnPath(
    window.location.pathname + window.location.search + window.location.hash,
  );
  window.location.href = `/login?next=${encodeURIComponent(next)}`;
}

interface DecodedToken {
  exp: number;
  id: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local/refresh`, {
      refreshToken: localStorageUtils.getItem<string>("refreshToken"),
    });

    const { jwt } = response.data;
    localStorageUtils.setItem("token", jwt);
    return jwt;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Create an axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;
    const token = localStorageUtils.getItem<string>("token");

    if (token) {
      if (isTokenExpired(token)) {
        try {
          const newToken = await refreshToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          // If refresh fails, redirect to login
          redirectToLogin();
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === "undefined") return Promise.reject(error);
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
