// src/services/apiClient.js

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

function getFriendlyErrorMessage(errorPayload, status) {
  const code = errorPayload?.code || errorPayload?.error?.code;
  const rawMessage = errorPayload?.message || errorPayload?.error?.message;

  if (code === 'VALIDATION') {
    return rawMessage || 'Please check your inputs and try again.';
  }
  if (code === 'RATE_LIMIT') {
    return 'You have reached the request limit. Please wait a moment before trying again.';
  }
  if (code === 'AI_INVALID_JSON') {
    return 'The AI returned an invalid structure. Please try generating again.';
  }
  if (code === 'AI_UNAVAILABLE') {
    return rawMessage || 'The multiverse engine is temporarily unavailable. Please try again.';
  }
  if (rawMessage) {
    return rawMessage;
  }
  if (status === 404) return 'Service endpoint not found.';
  if (status >= 500) return 'Multiverse server encountered an error. Please try again.';

  return 'Unable to complete request. Please verify your connection.';
}

export async function apiRequest(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const code = data?.error?.code || 'HTTP_ERROR';
      const friendlyMessage = getFriendlyErrorMessage(data, response.status);
      throw new ApiError(friendlyMessage, code, response.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or offline errors
    throw new ApiError(
      'Unable to connect to the PARALLEL server. Make sure the backend is running.',
      'NETWORK_ERROR',
      0
    );
  }
}

export const api = {
  getHealth: () => apiRequest('/api/health'),
  generateUniverse: (data) =>
    apiRequest('/api/universe/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  branchUniverse: (data) =>
    apiRequest('/api/universe/branch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  simulateDay: (data) =>
    apiRequest('/api/universe/simulate-day', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  compareRealities: (data) =>
    apiRequest('/api/universe/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
