export async function apiFetch(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://api.yonnamerlini.com';

  const url = `${baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) return null;

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
      data?.error ||
      (Array.isArray(data) && data[0]?.msg) ||
      (typeof data === 'string' ? data : 'Une erreur est survenue')
    );
    error.status = response.status;
    error.errors = Array.isArray(data) ? data : data?.errors;
    throw error;
  }

  return data;  
}