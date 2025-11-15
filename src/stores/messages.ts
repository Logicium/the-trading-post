import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Message {
  id: number
  conversationId: number
  senderId: string
  senderName: string
  text: string
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: number
  postId: number
  postTitle: string
  postAuthor: string
  participants: string[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export const useMessagesStore = defineStore('messages', () => {
  // State
  const messages = ref<Message[]>([])
  const conversations = ref<Conversation[]>([])

  // Initialize from localStorage
  const initializeMessages = () => {
    const storedMessages = localStorage.getItem('trading-post-messages')
    const storedConversations = localStorage.getItem('trading-post-conversations')
    
    if (storedMessages) {
      try {
        messages.value = JSON.parse(storedMessages)
      } catch (e) {
        console.error('Failed to parse messages', e)
        messages.value = []
      }
    }
    
    if (storedConversations) {
      try {
        conversations.value = JSON.parse(storedConversations)
      } catch (e) {
        console.error('Failed to parse conversations', e)
        conversations.value = []
      }
    }
  }

  // Save to localStorage
  const saveMessages = () => {
    localStorage.setItem('trading-post-messages', JSON.stringify(messages.value))
    localStorage.setItem('trading-post-conversations', JSON.stringify(conversations.value))
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
    return (id: number) => conversations.value.find(c => c.id === id)
  })

  const getConversationByPostId = computed(() => {
    return (postId: number) => conversations.value.find(c => c.postId === postId)
  })

  const getMessagesByConversation = computed(() => {
    return (conversationId: number) => 
      messages.value.filter(m => m.conversationId === conversationId)
  })

  const unreadCount = computed(() => {
    return conversations.value.reduce((sum, conv) => sum + conv.unreadCount, 0)
  })

  // Actions
  const createConversation = (postId: number, postTitle: string, postAuthor: string, currentUser: string) => {
    const existing = conversations.value.find(c => c.postId === postId)
    if (existing) return existing

    const newConv: Conversation = {
      id: Math.max(0, ...conversations.value.map(c => c.id)) + 1,
      postId,
      postTitle,
      postAuthor,
      participants: [currentUser, postAuthor],
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    }
    
    conversations.value.push(newConv)
    saveMessages()
    return newConv
  }

  const addMessage = (conversationId: number, senderId: string, senderName: string, text: string) => {
    const newMessage: Message = {
      id: Math.max(0, ...messages.value.map(m => m.id)) + 1,
      conversationId,
      senderId,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    messages.value.push(newMessage)
    
    // Update conversation
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.lastMessage = text.substring(0, 50) + (text.length > 50 ? '...' : '')
      conv.lastMessageTime = newMessage.timestamp
      conv.unreadCount += 1
    }
    
    saveMessages()
    return newMessage
  }

  const markConversationAsRead = (conversationId: number) => {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.unreadCount = 0
    }
    
    messages.value
      .filter(m => m.conversationId === conversationId)
      .forEach(m => m.read = true)
    
    saveMessages()
  }

  // Initialize on store creation
  initializeMessages()

  return {
    messages,
    conversations,
    allConversations,
    getConversationById,
    getConversationByPostId,
    getMessagesByConversation,
    unreadCount,
    createConversation,
    addMessage,
    markConversationAsRead,
    initializeMessages
  }
})
