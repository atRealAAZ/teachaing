// Everything participants type survives a refresh or a trip to another tab:
// state lives in localStorage, one key per field, namespaced per lab.

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

const PREFIX = 'lab:v1:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function usePersistentState<T>(
  key: string,
  initial: T | (() => T),
  // optional clean-up of a stored value on load (e.g. drop a half-streamed reply)
  sanitize?: (stored: T) => T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initial === 'function' ? (initial as () => T)() : initial
    const stored = read(key, fallback)
    return sanitize ? sanitize(stored) : stored
  })

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      // storage full or blocked — the lab keeps working, it just won't persist
    }
  }, [key, value])

  return [value, setValue]
}

// Wipe every stored field of one lab ("mlusecase", "pythonlab", …).
export function clearPersisted(namespace: string) {
  const prefix = `${PREFIX}${namespace}.`
  Object.keys(localStorage)
    .filter((k) => k.startsWith(prefix))
    .forEach((k) => localStorage.removeItem(k))
}

// "Start over": clear the stored fields and ask the app to remount the lab
// with fresh state (App listens for this event).
export const LAB_RESET_EVENT = 'lab-reset'

export function resetLab(namespace: string) {
  clearPersisted(namespace)
  window.dispatchEvent(new Event(LAB_RESET_EVENT))
}
