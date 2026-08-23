import { apiFetch } from '../api/apiFetch';

export const aboutApi = {
  get: () => apiFetch('/about'),
  update: (data) => apiFetch('/about', { method: 'PUT', body: JSON.stringify(data) }),
  uploadPhoto: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiFetch('/about/photo', { method: 'POST', body: fd });
  },
  uploadVideo: (file) => {
    const fd = new FormData();
    fd.append('video', file);
    return apiFetch('/about/video', { method: 'POST', body: fd });
  }
};