import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Axios request interceptor to automatically attach the latest access token
// from localStorage to every request. This ensures that even if the user logs in
// or refreshes the page, the Authorization header always has the correct Bearer token.
// It runs **before every request**, so we don't have to manually set headers each time.

// Automatically attach token from localStorage for every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});