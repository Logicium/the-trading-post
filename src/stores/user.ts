import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUser, type User } from '../data/mockData'

export const useUserStore = defineStore('user', () => {
  // State - current logged in user
  const currentUser = ref<User>(mockUser)

  // Initialize from localStorage
  const initializeUser = () => {
    const stored = localStorage.getItem('trading-post-user')
    if (stored) {
      try {
        currentUser.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse user', e)
        currentUser.value = mockUser
        saveUser()
      }
    } else {
      currentUser.value = mockUser
      saveUser()
    }
  }

  // Save to localStorage
  const saveUser = () => {
    localStorage.setItem('trading-post-user', JSON.stringify(currentUser.value))
  }

  // Actions
  const updateUser = (updates: Partial<User>) => {
    currentUser.value = { ...currentUser.value, ...updates }
    saveUser()
  }

  const updateTimeBalance = (hours: number) => {
    currentUser.value.timeBalance += hours
    saveUser()
  }

  const incrementTrades = () => {
    currentUser.value.completedTrades += 1
    saveUser()
  }

  // Initialize on store creation
  initializeUser()

  return {
    currentUser,
    updateUser,
    updateTimeBalance,
    incrementTrades,
    initializeUser
  }
})
