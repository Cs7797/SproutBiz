import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const apiFetch = (path, options = {}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${apiBaseUrl}${normalizedPath}`, {
    ...options,
    credentials: options.credentials ?? "include",
  });
};

export const api = axios.create({
  baseURL: apiBaseUrl || undefined,
  withCredentials: true,
});
