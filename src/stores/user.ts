import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, userApi, setAuthToken, getAuthToken } from '../services/api'

export interface User {
  id: string
  name: string
  email: string
  joinDate: string
  timeBalance: number
  skills: string[]
  bio?: string
  completedTrades: number
  rating: number
}

export const useUserStore = defineStore('user', () => {
  // State - current logged in user
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Initialize from token
  const initializeUser = async () => {
    const token = getAuthToken()
    if (token) {
      try {
        isLoading.value = true
        const userData = await userApi.getMe()
        currentUser.value = userData
        isAuthenticated.value = true
      } catch (e) {
        console.error('Failed to initialize user', e)
        setAuthToken(null)
        currentUser.value = null
        isAuthenticated.value = false
      } finally {
        isLoading.value = false
      }
    }
  }

  // Actions
  const signup = async (email: string, password: string, name: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await authApi.signup(email, password, name)
      setAuthToken(response.token)
      currentUser.value = response.user
      isAuthenticated.value = true
      return response
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const signin = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await authApi.signin(email, password)
      setAuthToken(response.token)
      currentUser.value = response.user
      isAuthenticated.value = true
      return response
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const signout = () => {
    setAuthToken(null)
    currentUser.value = null
    isAuthenticated.value = false
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      isLoading.value = true
      error.value = null
      const updated = await userApi.updateMe(updates)
      currentUser.value = updated
      return updated
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await userApi.getMe()
      currentUser.value = userData
    } catch (e) {
      console.error('Failed to refresh user', e)
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    signup,
    signin,
    signout,
    updateUser,
    refreshUser,
    initializeUser,
  }
})
