"use client"
import { useState, useEffect, useCallback } from "react"
import type { Writeup } from "@/lib/writeup-store"
import { getWriteups, saveWriteup, deleteWriteup, generateId } from "@/lib/writeup-store"

export function useWriteups() {
  const [writeups, setWriteups] = useState<Writeup[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load writeups on mount
  useEffect(() => {
    const loaded = getWriteups()
    setWriteups(loaded)
    setIsLoading(false)
  }, [])

  const addWriteup = useCallback((data: Omit<Writeup, "id" | "date">) => {
    const newWriteup: Writeup = {
      ...data,
      id: generateId(),
      date: new Date().toISOString().split("T")[0],
    }
    saveWriteup(newWriteup)
    setWriteups((prev) => [...prev, newWriteup])
    return newWriteup
  }, [])

  const removeWriteup = useCallback((id: string) => {
    deleteWriteup(id)
    setWriteups((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const updateWriteup = useCallback((writeup: Writeup) => {
    saveWriteup(writeup)
    setWriteups((prev) => prev.map((w) => (w.id === writeup.id ? writeup : w)))
  }, [])

  return {
    writeups,
    isLoading,
    addWriteup,
    removeWriteup,
    updateWriteup,
  }
}
