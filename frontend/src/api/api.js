function isAbsoluteHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || '').trim());
}

export function normalizeApiBase(rawBase) {
  const trimmed = String(rawBase || '/api').trim().replace(/\/+$/, '');

  if (!trimmed) {
    return '/api';
  }

  if (trimmed === '/api') {
    return trimmed;
  }

  if (isAbsoluteHttpUrl(trimmed)) {
    return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
  }

  return trimmed;
}

const BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL || '/api');

async function request(method, path, body = null) {
  const options = { method, credentials: 'include' };
  if (body !== null) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, options);
  const data = res.status === 204 ? {} : await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
};
