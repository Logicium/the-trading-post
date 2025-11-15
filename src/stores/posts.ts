import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockPosts, type Post } from '../data/mockData'

export const usePostsStore = defineStore('posts', () => {
  // State
  const posts = ref<Post[]>([])

  // Initialize from localStorage or use mock data
  const initializePosts = () => {
    const stored = localStorage.getItem('trading-post-posts')
    if (stored) {
      try {
        posts.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse posts from localStorage', e)
        posts.value = [...mockPosts]
        savePosts()
      }
    } else {
      posts.value = [...mockPosts]
      savePosts()
    }
  }

  // Save to localStorage
  const savePosts = () => {
    localStorage.setItem('trading-post-posts', JSON.stringify(posts.value))
  }

  // Getters
  const allPosts = computed(() => posts.value)
  const offerPosts = computed(() => posts.value.filter(p => p.type === 'offer'))
  const requestPosts = computed(() => posts.value.filter(p => p.type === 'request'))
  
  const getPostById = computed(() => {
    return (id: number) => posts.value.find(p => p.id === id)
  })

  const recentPosts = computed(() => {
    return [...posts.value].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    }).slice(0, 5)
  })

  // Actions
  const addPost = (post: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...post,
      id: Math.max(0, ...posts.value.map(p => p.id)) + 1
    }
    posts.value.unshift(newPost)
    savePosts()
    return newPost
  }

  const updatePost = (id: number, updates: Partial<Post>) => {
    const index = posts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      posts.value[index] = { ...posts.value[index], ...updates }
      savePosts()
    }
  }

  const deletePost = (id: number) => {
    posts.value = posts.value.filter(p => p.id !== id)
    savePosts()
  }

  // Initialize on store creation
  initializePosts()

  return {
    posts,
    allPosts,
    offerPosts,
    requestPosts,
    getPostById,
    recentPosts,
    addPost,
    updatePost,
    deletePost,
    initializePosts
  }
})
