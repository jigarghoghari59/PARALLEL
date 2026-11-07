// src/services/apiClient.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  getHealth: () => apiRequest('/api/health'),
  generateUniverse: (data) => apiRequest('/api/universe/generate', { method: 'POST', body: JSON.stringify(data) }),
  branchUniverse: (data) => apiRequest('/api/universe/branch', { method: 'POST', body: JSON.stringify(data) }),
  simulateDay: (data) => apiRequest('/api/universe/simulate-day', { method: 'POST', body: JSON.stringify(data) }),
  compareRealities: (data) => apiRequest('/api/universe/compare', { method: 'POST', body: JSON.stringify(data) }),
};
