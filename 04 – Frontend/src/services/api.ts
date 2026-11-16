import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[ASTRA-CARE API] Request failed:', error.message);
    return Promise.reject(error);
  }
);

export default api;

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (detail && typeof detail === 'object' && 'message' in detail) {
      return String(detail.message);
    }
    if (error.response) {
      return `Request failed with status ${error.response.status}.`;
    }
    return error.message || 'The backend could not be reached.';
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}
