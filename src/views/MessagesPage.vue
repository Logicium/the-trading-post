<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMessagesStore } from '../stores/messages'
import { usePostsStore } from '../stores/posts'
import { useUserStore } from '../stores/user'

const router = useRouter()
const messagesStore = useMessagesStore()
const postsStore = usePostsStore()
const userStore = useUserStore()

const conversations = computed(() => messagesStore.allConversations)

const getTimeAgo = (timestamp: string) => {
  const now = new Date().getTime()
  const time = new Date(timestamp).getTime()
  const diff = now - time
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const openConversation = (postId: number) => {
  router.push(`/connect/${postId}`)
}

const goToBulletin = () => {
  router.push('/bulletin')
}
</script>

<template>
  <div class="messages-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Messages</h1>
        <p class="page-subtitle">Your conversations with community members</p>
      </div>

      <!-- Empty State -->
      <div v-if="conversations.length === 0" class="empty-state card">
        <h3>No Conversations Yet</h3>
        <p>When you connect with someone on a post, your conversation will appear here.</p>
        <button @click="goToBulletin" class="btn btn-primary">Browse Bulletin Board</button>
      </div>

      <!-- Conversations List -->
      <div v-else class="conversations-list">
        <div 
          v-for="conv in conversations" 
          :key="conv.id" 
          class="conversation-card card"
          @click="openConversation(conv.postId)"
        >
          <div class="conversation-header">
            <div class="conv-title-section">
              <h3 class="conv-post-title">{{ conv.postTitle }}</h3>
              <div class="conv-participants">
                <span class="participant">{{ conv.postAuthor }}</span>
              </div>
            </div>
            <div class="conv-meta">
              <span class="conv-time">{{ getTimeAgo(conv.lastMessageTime) }}</span>
              <span v-if="conv.unreadCount > 0" class="unread-badge">
                {{ conv.unreadCount }}
              </span>
            </div>
          </div>
          
          <div class="conversation-preview">
            <p v-if="conv.lastMessage">{{ conv.lastMessage }}</p>
            <p v-else class="no-messages">No messages yet</p>
          </div>
          
          <div class="conversation-footer">
            <button class="btn-view">View Conversation →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background-color: var(--newsprint);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 4px double var(--black);
}

.page-title {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.page-subtitle {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.1rem;
  color: var(--black);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.empty-state h3 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.5rem;
}

.empty-state p {
  font-family: 'Libre Baskerville', serif;
  margin-bottom: var(--spacing-lg);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
}

/* Conversations List */
.conversations-list {
  display: grid;
  gap: var(--spacing-md);
}

.conversation-card {
  padding: var(--spacing-lg);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.conversation-card:hover {
  transform: translateX(2px) translateY(-2px);
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--newspaper-line);
}

.conv-title-section {
  flex: 1;
}

.conv-post-title {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.conv-participants {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.participant {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.9rem;
  color: var(--dark-gray);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.conv-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.conv-time {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  color: var(--dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.unread-badge {
  background: var(--black);
  color: var(--newsprint);
  padding: 0.25rem 0.5rem;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
  border: 2px solid var(--black);
}

.conversation-preview {
  margin-bottom: var(--spacing-md);
}

.conversation-preview p {
  font-family: 'Libre Baskerville', serif;
  line-height: 1.7;
  color: var(--black);
}

.no-messages {
  color: var(--dark-gray);
  font-style: italic;
}

.conversation-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-view {
  font-family: 'Libre Franklin', sans-serif;
  background: none;
  border: 2px solid var(--black);
  padding: var(--spacing-xs) var(--spacing-md);
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-view:hover {
  background: var(--black);
  color: var(--newsprint);
}

@media (max-width: 768px) {
  .conversation-header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .conv-meta {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
