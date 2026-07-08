import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const PASSCODE_KEY = 'lab_passcode'

export function getLabPasscode(): string {
  return sessionStorage.getItem(PASSCODE_KEY) ?? ''
}

export function setLabPasscode(passcode: string): void {
  sessionStorage.setItem(PASSCODE_KEY, passcode)
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send httpOnly session cookie on every request
})

api.interceptors.request.use((config) => {
  const passcode = getLabPasscode()
  if (passcode) config.headers['X-Lab-Passcode'] = passcode
  return config
})

// axios can't stream; SSE endpoints use fetch with credentials instead:
export async function authFetch(
  url: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const passcode = getLabPasscode()
  if (passcode) headers.set('X-Lab-Passcode', passcode)
  return fetch(url, { ...init, headers, credentials: 'include' })
}

export default api
