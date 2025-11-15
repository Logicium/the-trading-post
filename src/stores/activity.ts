import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ActivityItem {
  id: number
  type: 'post_created' | 'connection_made'
  userId: string
  userName: string
  postId?: number
  postTitle?: string
  targetUser?: string
  timestamp: string
}

export const useActivityStore = defineStore('activity', () => {
  // State
  const activities = ref<ActivityItem[]>([])

  // Initialize from localStorage
  const initializeActivities = () => {
    const stored = localStorage.getItem('trading-post-activities')
    if (stored) {
      try {
        activities.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse activities', e)
        activities.value = []
      }
    }
  }

  // Save to localStorage
  const saveActivities = () => {
    localStorage.setItem('trading-post-activities', JSON.stringify(activities.value))
  }

  // Getters
  const recentActivities = computed(() => {
    return [...activities.value]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  })

  // Actions
  const addPostActivity = (userId: string, userName: string, postId: number, postTitle: string) => {
    const activity: ActivityItem = {
      id: Math.max(0, ...activities.value.map(a => a.id)) + 1,
      type: 'post_created',
      userId,
      userName,
      postId,
      postTitle,
      timestamp: new Date().toISOString()
    }
    
    activities.value.unshift(activity)
    
    // Keep only last 100 activities
    if (activities.value.length > 100) {
      activities.value = activities.value.slice(0, 100)
    }
    
    saveActivities()
    return activity
  }

  const addConnectionActivity = (userId: string, userName: string, targetUser: string, postId: number, postTitle: string) => {
    const activity: ActivityItem = {
      id: Math.max(0, ...activities.value.map(a => a.id)) + 1,
      type: 'connection_made',
      userId,
      userName,
      targetUser,
      postId,
      postTitle,
      timestamp: new Date().toISOString()
    }
    
    activities.value.unshift(activity)
    
    // Keep only last 100 activities
    if (activities.value.length > 100) {
      activities.value = activities.value.slice(0, 100)
    }
    
    saveActivities()
    return activity
  }

  // Initialize on store creation
  initializeActivities()

  return {
    activities,
    recentActivities,
    addPostActivity,
    addConnectionActivity,
    initializeActivities
  }
})
