import { API_BASE_URL } from '../constants';

/**
 * Generic API client wrapper for HTTP requests with error parsing.
 */
export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Backend returned an invalid JSON response.');
  }

  if (!response.ok) {
    const errorDetail = data?.detail || `Request failed with status ${response.status}`;
    throw new Error(errorDetail);
  }

  return data;
}
