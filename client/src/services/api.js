const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  nearby: (params) => request(`/places/nearby?${new URLSearchParams(params)}`),
  route: (params) => request(`/routes?${new URLSearchParams(params)}`),
  recommend: (body) => request('/recommendations', { method: 'POST', body: JSON.stringify(body) }),
  share: (place) => request('/share', { method: 'POST', body: JSON.stringify({ place }) }),
  getShared: (slug) => request(`/share/${slug}`)
};
