<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const userStore = useUserStore()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="container-wide">
      <div class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand" @click="closeMobileMenu">
          <img src="/icons/noun-sign-post-921951.svg" alt="The Trading Post" class="brand-icon">
          <span class="brand-text">The Trading Post</span>
        </router-link>
        
        <!-- Desktop Navigation -->
        <div class="navbar-links">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ active: route.path === '/' }"
          >
            Home
          </router-link>
          <router-link 
            to="/bulletin" 
            class="nav-link"
            :class="{ active: route.path === '/bulletin' }"
          >
            Bulletin Board
          </router-link>
          <router-link 
            v-if="userStore.isAuthenticated"
            to="/messages" 
            class="nav-link"
            :class="{ active: route.path === '/messages' }"
          >
            Messages
          </router-link>
          <router-link 
            v-if="userStore.isAuthenticated"
            to="/profile" 
            class="nav-link"
            :class="{ active: route.path === '/profile' }"
          >
            Profile
          </router-link>
        </div>
        
        <!-- Auth Buttons -->
        <div class="navbar-actions">
          <router-link 
            v-if="!userStore.isAuthenticated"
            to="/login" 
            class="btn btn-secondary btn-nav"
          >
            Login
          </router-link>
          <router-link 
            v-if="!userStore.isAuthenticated"
            to="/signup" 
            class="btn btn-primary btn-nav"
          >
            Sign Up
          </router-link>
          <router-link 
            v-if="userStore.isAuthenticated"
            to="/new-post" 
            class="btn btn-primary btn-nav"
          >
            New Post
          </router-link>
        </div>
        
        <!-- Mobile Menu Button -->
        <button 
          class="mobile-menu-btn" 
          @click="toggleMobileMenu"
          :class="{ active: mobileMenuOpen }"
        >
          <span class="menu-icon"></span>
          <span class="menu-icon"></span>
          <span class="menu-icon"></span>
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <div class="mobile-menu-content">
        <router-link 
          to="/" 
          class="mobile-nav-link"
          :class="{ active: route.path === '/' }"
          @click="closeMobileMenu"
        >
          Home
        </router-link>
        <router-link 
          to="/bulletin" 
          class="mobile-nav-link"
          :class="{ active: route.path === '/bulletin' }"
          @click="closeMobileMenu"
        >
          Bulletin Board
        </router-link>
        <router-link 
          v-if="userStore.isAuthenticated"
          to="/messages" 
          class="mobile-nav-link"
          :class="{ active: route.path === '/messages' }"
          @click="closeMobileMenu"
        >
          Messages
        </router-link>
        <router-link 
          v-if="userStore.isAuthenticated"
          to="/profile" 
          class="mobile-nav-link"
          :class="{ active: route.path === '/profile' }"
          @click="closeMobileMenu"
        >
          Profile
        </router-link>
        <router-link 
          v-if="userStore.isAuthenticated"
          to="/new-post" 
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          New Post
        </router-link>
        <router-link 
          v-if="!userStore.isAuthenticated"
          to="/login" 
          class="mobile-nav-link"
          @click="closeMobileMenu"
        >
          Login
        </router-link>
        <router-link 
          v-if="!userStore.isAuthenticated"
          to="/signup" 
          class="mobile-nav-link signup-link"
          @click="closeMobileMenu"
        >
          Sign Up
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--newsprint);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 3px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  gap: var(--spacing-lg);
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.brand-icon {
  width: 40px;
  height: 40px;
  filter: grayscale(100%) contrast(1.2);
  opacity: 0.9;
}

.brand-text {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.brand-text:hover {
  color: var(--cork-darker);
}

/* Desktop Navigation */
.navbar-links {
  display: flex;
  gap: var(--spacing-lg);
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-family: 'Libre Franklin', sans-serif;
  color: var(--black);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: var(--spacing-xs) var(--spacing-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-link::after {
  display: none;
}

.nav-link:hover {
  color: var(--black);
  border-bottom: 2px solid var(--black);
}

.nav-link.active {
  color: var(--black);
  border-bottom: 2px solid var(--black);
}

/* Actions */
.navbar-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-nav {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 1rem;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: 2px solid var(--black);
  cursor: pointer;
  padding: var(--spacing-xs);
  z-index: 1001;
  border-radius: 0;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background-color: var(--black);
}

.mobile-menu-btn:hover .menu-icon {
  background-color: var(--newsprint);
}

.menu-icon {
  width: 28px;
  height: 3px;
  background-color: var(--black);
  border-radius: 0;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active .menu-icon:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.mobile-menu-btn.active .menu-icon:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .menu-icon:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: fixed;
  top: 75px;
  left: 0;
  right: 0;
  background-color: var(--newsprint);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  border-bottom: 3px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.mobile-menu.open {
  max-height: 400px;
}

.mobile-menu-content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.mobile-nav-link {
  font-family: 'Libre Franklin', sans-serif;
  color: var(--black);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: var(--spacing-md);
  transition: all 0.3s ease;
  text-align: center;
  border: 2px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background-color: var(--black);
  color: var(--newsprint);
  border-color: var(--black);
}

.mobile-nav-link.signup-link {
  background-color: var(--black);
  color: var(--newsprint);
  margin-top: var(--spacing-sm);
  border: 2px solid var(--black);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
}

.mobile-nav-link.signup-link:hover {
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links,
  .navbar-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
  
  .brand-icon {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    padding: var(--spacing-sm) 0;
  }
  
  .brand-text {
    font-size: 1rem;
  }
}
</style>
