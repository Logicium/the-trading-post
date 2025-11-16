import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'
import { useUserStore } from './stores/user'
import { usePostsStore } from './stores/posts'
import { useActivityStore } from './stores/activity'
import { useMessagesStore } from './stores/messages'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize stores after Pinia is installed
const userStore = useUserStore()
const postsStore = usePostsStore()
const activityStore = useActivityStore()
const messagesStore = useMessagesStore()

// Initialize user from token
userStore.initializeUser().then(() => {
  // Only load posts and activities if user is authenticated
  if (userStore.isAuthenticated) {
    postsStore.initializePosts()
    activityStore.initializeActivities()
    messagesStore.initializeMessages()
  } else {
    // Still load posts for public viewing
    postsStore.initializePosts()
    activityStore.initializeActivities()
  }
})

app.mount('#app')
