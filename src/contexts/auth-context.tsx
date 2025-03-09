"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import * as localStorage from "@/utils/localStorage"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  profileImage: string
  roleType: string
  phoneNumber: string
  birthDate: string
  schoolGrade: string
  schoolLevel: string
  schoolName: string
  aboutYou: string
  hobbies: string[]
  pastExperience: string
}

export interface NewUser {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  birthDate: string
  schoolName: string
  schoolLevel: string
  schoolGrade: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (newUser: NewUser) => Promise<User | null>
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: () => boolean
  token: string | null
  isAdmin: () => boolean
  isStudent: () => boolean
  isTeacher: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = localStorage.getItem<User>("user")
        if (user) {
          setUser(user)
        }
      } catch (error) {
        console.error("Failed to load user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // SignUp Function 
  const signup = async (newUser: NewUser) => {
    setIsLoading(true)
    try {
      const serverUrl = process.env.NEXT_PUBLIC_STRAPI_URL
      const response = await fetch(`${serverUrl}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      })

      if (!response.ok) { 
        throw new Error("Failed to sign up")
      }

      const data = await response.json()
      const user = data.user  
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", data.jwt)
      
      // Update state
      setUser(user)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally { 
      setIsLoading(false)
      return user
    }
  }

  // isAuthenticated Function 
  const isAuthenticated = () => {
    const token = localStorage.getItem<string>("token")
    return token !== null
  }

  // token function 
  const token = localStorage.getItem<string>("token") || null

  // isAdmin function 
  const isAdmin = () => {
    const user = localStorage.getItem<User>("user")
    return user?.roleType === "ADMIN"
  }

  // isStudent function 
  const isStudent = () => {
    const user = localStorage.getItem<User>("user")
    return user?.roleType === "STUDENT"
  }

  // is Teacher function
  const isTeacher = () => {
    const user = localStorage.getItem<User>("user")
    return user?.roleType === "PROFESSOR"
  } 

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      
      // Call Strapi API to authenticate user
      const serverUrl = process.env.NEXT_PUBLIC_STRAPI_URL
      const response = await fetch(`${serverUrl}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: email,
          password: password
        })
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }
      
      const data = await response.json()
      const user = data.user
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", data.jwt)
      
      // Update state
      setUser(user)
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")
  }

  // Add this function to update user information
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, isAuthenticated, token, isAdmin, isStudent, isTeacher, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 