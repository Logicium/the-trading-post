<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import { useUserStore } from '../stores/user'
import { useMessagesStore } from '../stores/messages'
import { useActivityStore } from '../stores/activity'
import type { Post } from '../data/mockData'

const router = useRouter()
const route = useRoute()
const postsStore = usePostsStore()
const userStore = useUserStore()
const messagesStore = useMessagesStore()
const activityStore = useActivityStore()

const post = ref<Post | null>(null)
const message = ref('')
const conversation = ref<any>(null)

onMounted(async () => {
  const postId = route.params.postId as string
  const foundPost = postsStore.getPostById(postId)
  
  if (foundPost && userStore.currentUser) {
    post.value = foundPost
    
    // Check if conversation already exists in local store
    const existingConv = messagesStore.getConversationByPostId(postId)
    
    try {
      if (existingConv) {
        // Use existing conversation without calling API
        conversation.value = existingConv
      } else {
        // Create new conversation via API
        const conv = await messagesStore.createConversation(postId)
        conversation.value = conv
      }
      
      // Load existing messages from backend
      await messagesStore.loadMessages(conversation.value.id)
      
      // Pre-generate the initial connection message if no messages yet
      const existingMessages = messagesStore.getMessagesByConversation(conversation.value.id)
      if (existingMessages.length === 0) {
        message.value = `${userStore.currentUser.name} wants to connect on "${foundPost.title}"`
      }
      
      // Mark as read
      await messagesStore.markConversationAsRead(conversation.value.id)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  } else {
    // Post not found or no user, redirect to bulletin
    router.push('/bulletin')
  }
})

const messageHistory = computed(() => {
  if (!conversation.value) return []
  return messagesStore.getMessagesByConversation(conversation.value.id)
})

const otherParticipantName = computed(() => {
  if (!conversation.value || !userStore.currentUser) return ''
  return conversation.value.otherParticipant?.name || ''
})

const getFormattedTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  })
}

const characterCount = computed(() => message.value.length)
const canSend = computed(() => message.value.trim().length > 0)

const sendMessage = async () => {
  if (!canSend.value || !post.value || !conversation.value || !userStore.currentUser) return

  try {
    // Add message via API
    await messagesStore.addMessage(
      conversation.value.id,
      message.value
    )

    // Reload messages to get the full updated list
    await messagesStore.loadMessages(conversation.value.id)

    // Clear the input
    message.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const goBack = () => {
  router.push('/bulletin')
}
</script>

<template>
  <div class="connect-page" v-if="post">
    <div class="container">
      <div class="page-header">
        <button @click="goBack" class="btn-back">← Back to Bulletin</button>
        <h1 class="page-title">Connect with {{ otherParticipantName || post.author }}</h1>
      </div>

      <div class="connect-content">
        <!-- Post Summary -->
        <div class="post-summary card">
          <div class="summary-header">
            <h2>Regarding</h2>
            <div class="post-type-badge" :class="post.type">
              {{ post.type === 'offer' ? 'Offer' : 'Request' }}
            </div>
          </div>
          
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-description">{{ post.description }}</p>
          
          <div class="post-meta">
            <span class="meta-item">
              <strong>Category:</strong> {{ post.category }}
            </span>
            <span class="meta-item">
              <strong>Time:</strong> {{ post.hours }} hours
            </span>
            <span class="meta-item">
              <strong>Posted:</strong> {{ post.date }}
            </span>
          </div>
        </div>

        <!-- Message Interface -->
        <div class="message-section card">
          <h2>Send a Message</h2>
          
          <!-- Message History -->
          <div class="message-history" v-if="messageHistory.length > 0">
            <div 
              v-for="msg in messageHistory" 
              :key="msg.id" 
              class="message-item"
            >
              <div class="message-header">
                <span class="message-sender">{{ msg.senderName }}</span>
                <span class="message-time">{{ getFormattedTime(msg.timestamp) }}</span>
              </div>
              <div class="message-text">{{ msg.text }}</div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="message-empty" v-else>
            <p>Start the conversation by sending a message to {{ otherParticipantName || post.author }}</p>
          </div>

          <!-- Message Input -->
          <div class="message-compose">
            <div class="compose-header">
              <label for="message-input">Your Message</label>
              <span class="character-count">{{ characterCount }} characters</span>
            </div>
            
            <textarea
              id="message-input"
              v-model="message"
              rows="6"
              placeholder="Introduce yourself and share details about availability, location, or any questions..."
              class="message-textarea"
              @keydown.ctrl.enter="sendMessage"
              @keydown.meta.enter="sendMessage"
            ></textarea>
            
            <div class="compose-actions">
              <p class="compose-hint">Press Ctrl+Enter to send</p>
              <button 
                @click="sendMessage" 
                class="btn btn-primary"
                :disabled="!canSend"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>

        <!-- Connection Tips -->
        <div class="tips-section card">
          <h3>Connection Tips</h3>
          <ul class="tips-list">
            <li>Introduce yourself and explain why you're interested</li>
            <li>Be specific about your availability and time constraints</li>
            <li>Discuss location and any travel considerations</li>
            <li>Ask questions to clarify expectations</li>
            <li>Be respectful of the time-banking community values</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connect-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background-color: var(--newsprint);
}

.page-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 4px double var(--black);
}

.btn-back {
  font-family: 'Libre Franklin', sans-serif;
  background: none;
  border: 2px solid var(--black);
  padding: var(--spacing-xs) var(--spacing-md);
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: var(--black);
  color: var(--newsprint);
}

.page-title {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin: 0;
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3rem);
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.connect-content {
  display: grid;
  gap: var(--spacing-lg);
}

/* Post Summary */
.post-summary {
  padding: var(--spacing-lg);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--newspaper-line);
}

.summary-header h2 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin: 0;
  font-weight: 700;
  font-size: 1.3rem;
  text-transform: uppercase;
}

.post-type-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid var(--black);
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-type-badge.offer {
  background: var(--newsprint);
  color: var(--black);
}

.post-type-badge.request {
  background: var(--black);
  color: var(--newsprint);
}

.post-summary .post-title {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.post-description {
  font-family: 'Libre Baskerville', serif;
  margin-bottom: var(--spacing-md);
  line-height: 1.8;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 2px solid var(--newspaper-line);
}

.meta-item {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.meta-item strong {
  font-weight: 600;
}

/* Message Section */
.message-section {
  padding: var(--spacing-lg);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.message-section h2 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  font-size: 1.3rem;
  text-transform: uppercase;
  border-bottom: 2px solid var(--newspaper-line);
  padding-bottom: var(--spacing-sm);
}

.message-history {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  border: 2px solid var(--newspaper-line);
  max-height: 300px;
  overflow-y: auto;
}

.message-item {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--newspaper-line);
}

.message-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.message-sender {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.message-time {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  color: var(--dark-gray);
  text-transform: uppercase;
}

.message-text {
  font-family: 'Libre Baskerville', serif;
  line-height: 1.7;
}

.message-empty {
  padding: var(--spacing-xl);
  text-align: center;
  border: 2px dashed var(--newspaper-line);
  margin-bottom: var(--spacing-lg);
}

.message-empty p {
  font-family: 'Libre Franklin', sans-serif;
  color: var(--dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 0.9rem;
}

.message-compose {
  border: 2px solid var(--black);
  padding: var(--spacing-md);
}

.compose-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.compose-header label {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
}

.character-count {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  color: var(--dark-gray);
  text-transform: uppercase;
}

.message-textarea {
  width: 100%;
  font-family: 'Libre Baskerville', serif;
  padding: var(--spacing-sm);
  border: 2px solid var(--black);
  border-radius: 0;
  background-color: var(--newsprint);
  font-size: 1rem;
  line-height: 1.7;
  resize: vertical;
  transition: all 0.3s ease;
}

.message-textarea:focus {
  outline: none;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.compose-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
}

.compose-hint {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.8rem;
  color: var(--dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Tips Section */
.tips-section {
  padding: var(--spacing-lg);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.tips-section h3 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: uppercase;
  border-bottom: 2px solid var(--newspaper-line);
  padding-bottom: var(--spacing-sm);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-family: 'Libre Baskerville', serif;
  padding-left: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  position: relative;
  line-height: 1.7;
}

.tips-list li::before {
  content: '■';
  position: absolute;
  left: 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .post-meta {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .compose-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }

  .compose-hint {
    text-align: center;
  }
}
</style>
