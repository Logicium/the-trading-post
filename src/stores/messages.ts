import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { messageApi } from '../services/api'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  postId: string
  postTitle: string
  postAuthor: string
  participants: string[]
  otherParticipant?: {
    id: string
    name: string
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export const useMessagesStore = defineStore('messages', () => {
  // State
  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Initialize messages from API
  const initializeMessages = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await messageApi.getConversations()
      conversations.value = data
    } catch (e: any) {
      console.error('Failed to load conversations', e)
      error.value = e.message
      conversations.value = []
    } finally {
      isLoading.value = false
    }
  }

  // Getters
  const allConversations = computed(() => {
    return [...conversations.value].sort((a, b) => {
      const timeA = new Date(a.lastMessageTime).getTime()
      const timeB = new Date(b.lastMessageTime).getTime()
      return timeB - timeA
    })
  })

  const getConversationById = computed(() => {
    return (id: string) => conversations.value.find(c => c.id === id)
  })

  const getConversationByPostId = computed(() => {
    return (postId: string) => conversations.value.find(c => c.postId === postId)
  })

  const getMessagesByConversation = (conversationId: string) => {
    return messages.value.filter(m => m.conversationId === conversationId)
  }

  const unreadCount = computed(() => {
    return conversations.value.reduce((sum, conv) => sum + conv.unreadCount, 0)
  })

  // Actions
  const createConversation = async (postId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const newConv = await messageApi.createConversation(postId)
      
      // Check if conversation already exists in local state
      const existing = conversations.value.find(c => c.id === newConv.id)
      if (!existing) {
        conversations.value.push(newConv)
      }
      
      return newConv
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const data = await messageApi.getMessages(conversationId)
      
      // Replace messages for this conversation
      messages.value = messages.value.filter(m => m.conversationId !== conversationId)
      messages.value.push(...data)
      
      return data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const addMessage = async (conversationId: string, text: string) => {
    try {
      isLoading.value = true
      error.value = null
      const newMessage = await messageApi.sendMessage(conversationId, text)
      
      // Add message to local state
      messages.value.push(newMessage)
      
      // Update conversation in local state
      const conv = conversations.value.find(c => c.id === conversationId)
      if (conv) {
        conv.lastMessage = text.substring(0, 50) + (text.length > 50 ? '...' : '')
        conv.lastMessageTime = newMessage.timestamp
      }
      
      // Reload conversations to get updated state from backend
      await initializeMessages()
      
      return newMessage
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await messageApi.markAsRead(conversationId)
      
      const conv = conversations.value.find(c => c.id === conversationId)
      if (conv) {
        conv.unreadCount = 0
      }
      
      messages.value
        .filter(m => m.conversationId === conversationId)
        .forEach(m => m.read = true)
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return {
    messages,
    conversations,
    isLoading,
    error,
    allConversations,
    getConversationById,
    getConversationByPostId,
    getMessagesByConversation,
    unreadCount,
    createConversation,
    loadMessages,
    addMessage,
    markConversationAsRead,
    initializeMessages,
  }
})
