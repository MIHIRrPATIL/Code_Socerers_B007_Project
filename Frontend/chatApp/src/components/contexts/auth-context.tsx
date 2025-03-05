"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../../types/user"
import { loginUser, registerUser, getCurrentUser } from "../../services/auth-service"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, userType: "dealer" | "client") => Promise<void>
  logout: () => void
  error: string | null
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      getCurrentUser(token)
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const { user: userData, token } = await loginUser(email, password)
      localStorage.setItem("token", token)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login")
      throw err
    }
  }

  const register = async (name: string, email: string, password: string, userType: "dealer" | "client") => {
    try {
      setError(null)
      const { user: userData, token } = await registerUser(name, email, password, userType)
      localStorage.setItem("token", token)
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

