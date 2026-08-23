export async function apiFetch(endpoint, options = {}) {

  // NOUVELLE URL (masquée derrière Cloudflare)
 const baseUrl = import.meta.env.VITE_API_URL || "https://api.www-yonnamerlini.com";
  
  const url = `${baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
 

  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

 

  //  envoie automatiquement les cookies
  const response = await fetch(url, { 
    ...options, 
    headers,
    credentials: 'include', // ← C'EST ÇA QUI ENVOIE LE COOKIE
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
    throw new Error(data?.message || data || 'Une erreur est survenue');
  }

  return data;
}