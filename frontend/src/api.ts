import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send httpOnly session cookie on every request
})

// axios can't stream; SSE endpoints use fetch with credentials instead:
export async function authFetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  return fetch(url, { ...init, headers, credentials: 'include' })
}

export default api
