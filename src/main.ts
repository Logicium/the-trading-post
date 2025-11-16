import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'
import { useUserStore } from './stores/user'
import { usePostsStore } from './stores/posts'
import { useActivityStore } from './stores/activity'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize stores after Pinia is installed
const userStore = useUserStore()
const postsStore = usePostsStore()
const activityStore = useActivityStore()

// Initialize user from token
userStore.initializeUser().then(() => {
  // Only load posts and activities if user is authenticated
  if (userStore.isAuthenticated) {
    postsStore.initializePosts()
    activityStore.initializeActivities()
  } else {
    // Still load posts for public viewing
    postsStore.initializePosts()
    activityStore.initializeActivities()
  }
})

app.mount('#app')
