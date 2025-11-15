import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import SignupPage from '../views/SignupPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import BulletinPage from '../views/BulletinPage.vue'
import NewPostPage from '../views/NewPostPage.vue'
import ConnectPage from '../views/ConnectPage.vue'
import MessagesPage from '../views/MessagesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/bulletin',
      name: 'bulletin',
      component: BulletinPage
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesPage
    },
    {
      path: '/new-post',
      name: 'new-post',
      component: NewPostPage
    },
    {
      path: '/connect/:postId',
      name: 'connect',
      component: ConnectPage
    }
  ],
})

export default router
