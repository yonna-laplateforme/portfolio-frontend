export async function apiFetch(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}${endpoint}`;
  const token = localStorage.getItem('token'); 

  // 1. Ne pas définir Content-Type si le body est un FormData
  // Le navigateur définit automatiquement le bon boundary pour le multipart
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // 2. Gestion propre : ne pas parser si le status est 204 (No Content)
  if (response.status === 204) return null;

  // 3. Lire le texte d'abord pour vérifier si c'est du JSON
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text; // Si ce n'est pas du JSON, on garde le texte brut
  }

  if (!response.ok) {
    throw new Error(data?.message || data || 'Une erreur est survenue');
  }

  return data;
}