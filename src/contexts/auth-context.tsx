"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import * as localStorage from "@/utils/localStorage"
import { User, NewUser, LoggedUser, UpdateUser } from "@/types/user"
import { 
  login as loginService,
  signup as signupService,
  updateUser as updateUserService,
  updateAvatar as updateAvatarService
} from "@/services/userService"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (newUser: NewUser) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
  token: string | null
  isAdmin: () => boolean
  isStudent: () => boolean
  isTeacher: () => boolean
  updateUser: (user: UpdateUser) => Promise<void>
  updateAvatar: (avatar: File) => Promise<void>
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
      const loggedUser = await signupService(newUser)
      saveLoggedUserLocally(loggedUser)
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally { 
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call Strapi API to authenticate user
      const loggedUser = await loginService(email, password)
      saveLoggedUserLocally(loggedUser)
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

  // Update user function
  const updateUser = async (newUserData: UpdateUser) => {
    setIsLoading(true)
    if (!user) {
      throw new Error("User not found")
    } else {
      const userId = user.id.toString()
      try {
        const updatedUser = await updateUserService(userId, newUserData)
        saveUserLocally(updatedUser)
      } catch (error) {
        console.error("Error updating user:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateAvatar = async (avatar: File) => {
    setIsLoading(true)
    if (!user) {
      throw new Error("User not found")
      setIsLoading(false)
    } else {
      const userId = user.id.toString()
      try {
        const updatedUser = await updateAvatarService(userId, avatar)
        saveUserLocally(updatedUser)
      } catch (error) {
        console.error("Error updating avatar:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }
  }

  const saveLoggedUserLocally = (loggedUser: LoggedUser) => {
    localStorage.setItem("token", loggedUser.jwt)
    saveUserLocally(loggedUser.user)
  }

  const saveUserLocally = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated, token, isAdmin, isStudent, isTeacher, signup, updateUser, updateAvatar }}>
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