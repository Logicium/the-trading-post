import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { activityApi } from '../services/api'

export interface ActivityItem {
  id: string
  type: 'post_created' | 'connection_made'
  userId: string
  userName: string
  postId?: string
  postTitle?: string
  targetUser?: string
  timestamp: string
}

export const useActivityStore = defineStore('activity', () => {
  // State
  const activities = ref<ActivityItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Initialize activities from API
  const initializeActivities = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await activityApi.getRecentActivities(20)
      activities.value = data
    } catch (e: any) {
      console.error('Failed to load activities', e)
      error.value = e.message
      activities.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Getters
  const recentActivities = computed(() => {
    return [...activities.value]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
  })

  return {
    activities,
    isLoading,
    error,
    recentActivities,
    initializeActivities,
  }
})
