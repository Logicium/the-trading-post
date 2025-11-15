<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import { usePostsStore } from '../stores/posts'

const router = useRouter()
const activityStore = useActivityStore()
const postsStore = usePostsStore()

const recentActivities = computed(() => activityStore.recentActivities)
const recentPosts = computed(() => postsStore.recentPosts.slice(0, 3))

// Auto-refresh activity feed
const refreshInterval = ref<number | null>(null)

onMounted(() => {
  // Refresh every 5 seconds to show "real-time" updates
  refreshInterval.value = window.setInterval(() => {
    // Force reactivity update
    activityStore.initializeActivities()
  }, 5000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

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

const features = [
  {
    icon: '⏰',
    title: 'Trade Time, Not Money',
    description: 'Exchange skills and services based on time, creating a fair and equitable community.'
  },
  {
    icon: '🤝',
    title: 'Build Community',
    description: 'Connect with neighbors and local experts to share knowledge and grow together.'
  },
  {
    icon: '📋',
    title: 'Easy Posting',
    description: 'Post what you need or offer on our bulletin board and find matches instantly.'
  },
  {
    icon: '✨',
    title: 'Skill Sharing',
    description: 'From gardening to guitar lessons, everyone has something valuable to contribute.'
  }
]

const goToSignup = () => {
  router.push('/signup')
}

const goToBulletin = () => {
  router.push('/bulletin')
}
</script>

<template>
  <div class="home-page">
      <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in">
          <div class="hero-edition">Vol. 1 • Community Edition • Est. 2025</div>
          <h1 class="hero-title">
            <span class="masthead">The Trading Post</span>
          </h1>
          <div class="hero-tagline">A Time-Banking Chronicle</div>
          <p class="hero-subtitle">Where hours are currency and everyone's time is valued equally</p>
          <div class="hero-buttons">
            <button @click="goToSignup" class="btn btn-primary btn-large">Join The Network</button>
            <button @click="goToBulletin" class="btn btn-secondary btn-large">View Classifieds</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title text-center">How It Works</h2>
        
        <div class="features-presentation">
          <!-- Large Feature - Left -->
          <div class="feature-large">
            <div class="feature-number">01</div>
            <img src="/icons/noun-clock-937062.svg" alt="Time" class="feature-icon-large">
            <h3 class="feature-title-large">Trade Time, Not Money</h3>
            <p class="feature-description-large">Exchange skills and services based on time, creating a fair and equitable community where everyone's hour is valued equally.</p>
          </div>
          
          <!-- Right Column - 3 Smaller Features -->
          <div class="features-column">
            <div class="feature-small">
              <div class="feature-small-header">
                <span class="feature-number-small">02</span>
                <img src="/icons/noun-globe-1237620.svg" alt="Community" class="feature-icon-small">
              </div>
              <h4 class="feature-title-small">Build Community</h4>
              <p class="feature-description-small">Connect with neighbors and local experts.</p>
            </div>
            
            <div class="feature-small">
              <div class="feature-small-header">
                <span class="feature-number-small">03</span>
                <img src="/icons/noun-document-921940.svg" alt="Posting" class="feature-icon-small">
              </div>
              <h4 class="feature-title-small">Easy Posting</h4>
              <p class="feature-description-small">Post needs or offers on our bulletin board.</p>
            </div>
            
            <div class="feature-small">
              <div class="feature-small-header">
                <span class="feature-number-small">04</span>
                <img src="/icons/noun-light-bulb-921079.svg" alt="Skills" class="feature-icon-small">
              </div>
              <h4 class="feature-title-small">Skill Sharing</h4>
              <p class="feature-description-small">Everyone has something valuable to contribute.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Activity Feed Section -->
    <section class="activity-section">
      <div class="container">
        <h2 class="section-title text-center">Community Activity</h2>
        <p class="section-subtitle">See what's happening in the trading post</p>
        
        <div class="activity-grid">
          <!-- Recent Activities -->
          <div class="activity-card card">
            <h3 class="activity-card-title">Latest Activity</h3>
            <div class="activity-list" v-if="recentActivities.length > 0">
              <div 
                v-for="activity in recentActivities.slice(0, 5)" 
                :key="activity.id"
                class="activity-item"
              >
                <div class="activity-icon">
                  <span v-if="activity.type === 'post_created'">📝</span>
                  <span v-else>🤝</span>
                </div>
                <div class="activity-details">
                  <p v-if="activity.type === 'post_created'">
                    <strong>{{ activity.userName }}</strong> posted 
                    <em>"{{ activity.postTitle }}"</em>
                  </p>
                  <p v-else>
                    <strong>{{ activity.userName }}</strong> connected with 
                    <strong>{{ activity.targetUser }}</strong>
                  </p>
                  <span class="activity-time">{{ getTimeAgo(activity.timestamp) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="activity-empty">
              <p>No recent activity yet. Be the first to post!</p>
            </div>
          </div>

          <!-- Recent Posts -->
          <div class="activity-card card">
            <h3 class="activity-card-title">Newest Listings</h3>
            <div class="recent-posts-list" v-if="recentPosts.length > 0">
              <div 
                v-for="post in recentPosts" 
                :key="post.id"
                class="recent-post-item"
                @click="router.push(`/connect/${post.id}`)"
              >
                <div class="post-badge" :class="post.type">
                  {{ post.type === 'offer' ? 'Offer' : 'Request' }}
                </div>
                <div class="recent-post-content">
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.description.substring(0, 80) }}...</p>
                  <div class="recent-post-meta">
                    <span>{{ post.author }}</span>
                    <span>{{ post.hours }}h</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="activity-empty">
              <p>No posts yet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Trading?</h2>
          <p>Join our growing community and discover the power of time-banking</p>
          <button @click="goToSignup" class="btn btn-accent btn-large">Create Your Account</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--newsprint);
}

/* Hero Section */
.hero {
  background: var(--newsprint);
  padding: var(--spacing-2xl) 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 4px double var(--black);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hero-edition {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--dark-gray);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.hero-title {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0.5rem;
}

.masthead {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 700;
  color: var(--black);
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 0.9;
  text-shadow: 
    4px 4px 0 var(--cork-medium),
    5px 5px 0 var(--cork-dark);
}

.hero-tagline {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--black);
  margin-bottom: 2rem;
  font-weight: 600;
  border-top: 2px solid var(--black);
  border-bottom: 2px solid var(--black);
  padding: 0.5rem 0;
  display: inline-block;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--black);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  line-height: 1.6;
  font-style: italic;
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
}

/* Features Section */
.features {
  padding: var(--spacing-2xl) 0;
  background-color: var(--newsprint);
}

.section-title {
  margin-bottom: var(--spacing-xl);
  color: var(--black);
  font-weight: 700;
  text-align: center;
  border-bottom: 3px solid var(--black);
  padding-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Presentation Layout */
.features-presentation {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-xl);
}

/* Large Feature Card */
.feature-large {
  background: var(--newsprint);
  border: 3px solid var(--black);
  border-radius: 0;
  padding: var(--spacing-2xl);
  position: relative;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: box-shadow 0.3s ease;
}

.feature-large:hover {
  box-shadow: 6px 6px 0 var(--black);
}

.feature-number {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  font-family: 'Libre Baskerville', serif;
  font-size: 6rem;
  font-weight: 700;
  color: var(--black);
  opacity: 0.08;
  line-height: 1;
}

.feature-icon-large {
  width: 120px;
  height: 120px;
  margin-bottom: var(--spacing-lg);
  filter: grayscale(100%) contrast(1.2);
  opacity: 0.9;
}

.feature-title-large {
  font-family: 'Libre Baskerville', serif;
  font-size: 2.5rem;
  color: var(--black);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  border-bottom: 2px solid var(--black);
  padding-bottom: var(--spacing-sm);
}

.feature-description-large {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 1.15rem;
  color: var(--black);
  line-height: 1.7;
  max-width: 500px;
  text-align: justify;
}

/* Small Feature Column */
.features-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.feature-small {
  background: var(--newsprint);
  border: 2px solid var(--black);
  border-radius: 0;
  padding: var(--spacing-lg);
  transition: box-shadow 0.3s ease;
  flex: 1;
}

.feature-small:hover {
  box-shadow: 4px 4px 0 var(--black);
}

.feature-small-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--newspaper-line);
}

.feature-number-small {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--black);
  opacity: 0.3;
  line-height: 1;
}

.feature-icon-small {
  width: 48px;
  height: 48px;
  filter: grayscale(100%) contrast(1.2);
  opacity: 0.9;
}

.feature-title-small {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.25rem;
  color: var(--black);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

.feature-description-small {
  color: var(--black);
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Activity Section */
.activity-section {
  background: var(--newsprint);
  padding: var(--spacing-2xl) 0;
  border-top: 4px double var(--black);
}

.section-subtitle {
  text-align: center;
  font-family: 'Libre Baskerville', serif;
  font-size: 1.1rem;
  color: var(--dark-gray);
  margin-bottom: var(--spacing-xl);
}

.activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.activity-card {
  background: var(--newsprint);
  border: 2px solid var(--black);
  border-radius: 0;
  padding: var(--spacing-lg);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.activity-card-title {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  border-bottom: 2px solid var(--newspaper-line);
  padding-bottom: var(--spacing-sm);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.activity-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-left: 3px solid var(--black);
  padding-left: var(--spacing-md);
}

.activity-icon {
  font-size: 1.5rem;
  line-height: 1;
  filter: grayscale(100%);
}

.activity-details {
  flex: 1;
}

.activity-details p {
  font-family: 'Libre Baskerville', serif;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-xs);
}

.activity-details strong {
  font-weight: 700;
}

.activity-details em {
  font-style: italic;
}

.activity-time {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.8rem;
  color: var(--dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.activity-empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--dark-gray);
  font-family: 'Libre Franklin', sans-serif;
  text-transform: uppercase;
  font-size: 0.9rem;
}

/* Recent Posts */
.recent-posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.recent-post-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 2px solid var(--newspaper-line);
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-post-item:hover {
  border-color: var(--black);
  background: var(--cork-light);
  transform: translateX(2px);
}

.post-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid var(--black);
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  height: fit-content;
  white-space: nowrap;
}

.post-badge.offer {
  background: var(--newsprint);
  color: var(--black);
}

.post-badge.request {
  background: var(--black);
  color: var(--newsprint);
}

.recent-post-content {
  flex: 1;
}

.recent-post-content h4 {
  font-family: 'Libre Baskerville', serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
}

.recent-post-content p {
  font-family: 'Libre Baskerville', serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--black);
  margin-bottom: var(--spacing-xs);
}

.recent-post-meta {
  display: flex;
  justify-content: space-between;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.8rem;
  color: var(--dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* CTA Section */
.cta-section {
  background: var(--black);
  padding: var(--spacing-2xl) 0;
  text-align: center;
  border-top: 4px double var(--black);
  border-bottom: 4px double var(--black);
}

.cta-content h2 {
  color: var(--newsprint);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
  border-bottom: 2px solid var(--newsprint);
  padding-bottom: var(--spacing-sm);
  display: inline-block;
}

.cta-content p {
  color: var(--newsprint);
  font-size: 1.15rem;
  margin-bottom: var(--spacing-lg);
  font-style: italic;
}

.cta-section .btn {
  background-color: var(--newsprint);
  color: var(--black);
  font-weight: 600;
  border-color: var(--newsprint);
}

.cta-section .btn:hover {
  background-color: var(--cork-light);
  border-color: var(--cork-light);
}

@media (max-width: 768px) {
  .hero {
    min-height: 70vh;
    padding: var(--spacing-xl) 0;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-large {
    width: 100%;
    max-width: 300px;
  }
  
  .features-presentation {
    grid-template-columns: 1fr;
  }
  
  .feature-large {
    min-height: 400px;
    padding: var(--spacing-xl);
  }
  
  .feature-title-large {
    font-size: 2rem;
  }
  
  .feature-description-large {
    font-size: 1.1rem;
  }
  
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
