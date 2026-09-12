// src/api/homeApi.js
import { apiFetch } from './apiFetch';

export const homeApi = {
  get: () => apiFetch('/api/home'),
  update: (data) =>
    apiFetch('/api/home', { method: 'PUT', body: JSON.stringify(data) }),
  uploadVideo: (file) => {
    const fd = new FormData();
    fd.append('video', file);
    return apiFetch('/api/home/video', { method: 'POST', body: fd });
  },
  uploadPoster: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiFetch('/api/home/poster', { method: 'POST', body: fd });
  },
};