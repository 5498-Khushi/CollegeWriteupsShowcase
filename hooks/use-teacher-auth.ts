"use client"

import { useState, useEffect } from "react"

const TEACHER_CODE = "EduKey@2025#Secure"
const AUTH_STORAGE_KEY = "teacher_auth_token"

export function useTeacherAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    if (token === TEACHER_CODE) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const authenticate = (code: string): boolean => {
    if (code === TEACHER_CODE) {
      localStorage.setItem(AUTH_STORAGE_KEY, TEACHER_CODE)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, isLoading, authenticate, logout }
}
