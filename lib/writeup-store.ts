export interface Writeup {
  id: string
  title: string
  subject: string
  date: string
  description?: string
  fileName?: string
  fileData?: string
}

const STORAGE_KEY = "writeups"

export function getWriteups(): Writeup[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    console.error("Failed to load writeups from storage")
    return []
  }
}

export function saveWriteup(writeup: Writeup): void {
  if (typeof window === "undefined") return

  try {
    const writeups = getWriteups()
    const existingIndex = writeups.findIndex((w) => w.id === writeup.id)

    if (existingIndex >= 0) {
      writeups[existingIndex] = writeup
    } else {
      writeups.push(writeup)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(writeups))
  } catch {
    console.error("Failed to save writeup to storage")
  }
}

export function deleteWriteup(id: string): void {
  if (typeof window === "undefined") return

  try {
    const writeups = getWriteups()
    const filtered = writeups.filter((w) => w.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    console.error("Failed to delete writeup from storage")
  }
}

export function getSubjects(): string[] {
  const writeups = getWriteups()
  return Array.from(new Set(writeups.map((w) => w.subject))).sort()
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
