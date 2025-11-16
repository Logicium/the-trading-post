import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postApi } from '../services/api'

export interface Post {
  id: string
  author: string
  authorId: string
  title: string
  description: string
  hours: number
  type: 'offer' | 'request'
  category: string
  date: string
  tags: string[]
  active?: boolean
}

export const usePostsStore = defineStore('posts', () => {
  // State
  const posts = ref<Post[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Initialize posts from API
  const initializePosts = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await postApi.getAllPosts()
      posts.value = data
    } catch (e: any) {
      console.error('Failed to load posts', e)
      error.value = e.message
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Getters
  const allPosts = computed(() => posts.value)
  const offerPosts = computed(() => posts.value.filter(p => p.type === 'offer'))
  const requestPosts = computed(() => posts.value.filter(p => p.type === 'request'))
  
  const getPostById = computed(() => {
    return (id: string) => posts.value.find(p => p.id === id)
  })

  const recentPosts = computed(() => {
    return [...posts.value].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    }).slice(0, 5)
  })

  // Actions
  const addPost = async (post: Omit<Post, 'id' | 'author' | 'authorId' | 'date' | 'active'>) => {
    try {
      isLoading.value = true
      error.value = null
      const newPost = await postApi.createPost(post)
      posts.value.unshift(newPost)
      return newPost
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      isLoading.value = true
      error.value = null
      const updated = await postApi.updatePost(id, updates)
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const deletePost = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      await postApi.deletePost(id)
      posts.value = posts.value.filter(p => p.id !== id)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const fetchPostById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      const post = await postApi.getPostById(id)
      // Update or add post in local state
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = post
      } else {
        posts.value.push(post)
      }
      return post
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    isLoading,
    error,
    allPosts,
    offerPosts,
    requestPosts,
    getPostById,
    recentPosts,
    addPost,
    updatePost,
    deletePost,
    fetchPostById,
    initializePosts,
  }
})
