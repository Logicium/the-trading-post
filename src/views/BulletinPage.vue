<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import type { Post } from '../data/mockData'

const router = useRouter()
const postsStore = usePostsStore()

const posts = computed(() => postsStore.allPosts)
const filterType = ref<'all' | 'offer' | 'request'>('all')
const searchQuery = ref('')

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesType = filterType.value === 'all' || post.type === filterType.value
    const matchesSearch = searchQuery.value === '' || 
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesType && matchesSearch
  })
})

const setFilter = (type: 'all' | 'offer' | 'request') => {
  filterType.value = type
}

const goToNewPost = () => {
  router.push('/new-post')
}

const connectWithPost = (postId: number) => {
  router.push(`/connect/${postId}`)
}
</script>

<template>
  <div class="bulletin-page">
    <div class="container-wide">
      <!-- Header -->
      <div class="bulletin-header">
        <div class="page-title">Community Bulletin Board</div>
        <p>Discover what your neighbors are offering and requesting</p>
      </div>
      
      <!-- Filters and Search -->
      <div class="bulletin-controls card">
        <div class="filter-buttons">
          <button 
            @click="setFilter('all')" 
            :class="['filter-btn', { active: filterType === 'all' }]"
          >
            All Posts
          </button>
          <button 
            @click="setFilter('offer')" 
            :class="['filter-btn', { active: filterType === 'offer' }]"
          >
            Offers
          </button>
          <button 
            @click="setFilter('request')" 
            :class="['filter-btn', { active: filterType === 'request' }]"
          >
            Requests
          </button>
        </div>
        
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search posts, skills, or tags..."
            class="search-input"
          />
        </div>
        
        <button @click="goToNewPost" class="btn btn-primary">+ New Post</button>
      </div>
      
      <!-- Masonry Grid -->
      <div class="masonry-grid">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id" 
          class="post-card card fade-in"
        >
          <div class="post-header">
            <div class="post-type-badge" :class="post.type">
              {{ post.type === 'offer' ? 'Offer' : 'Request' }}
            </div>
            <div class="post-hours">{{ post.hours }}h</div>
          </div>
          
          <div class="post-title">{{ post.title }}</div>
          
          <p class="post-description">{{ post.description }}</p>
          
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="post-tag">
              #{{ tag }}
            </span>
          </div>
          
          <div class="post-footer">
            <div class="post-author">
              <div class="author-avatar">
                {{ post.author.split(' ').map(n => n[0]).join('') }}
              </div>
              <div class="author-info">
                <div class="author-name">{{ post.author }}</div>
                <div class="post-date">{{ post.date }}</div>
              </div>
            </div>
            
            <button @click="connectWithPost(post.id)" class="btn btn-accent btn-sm">Connect</button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredPosts.length === 0" class="no-results">
        <div class="no-results-title">No posts found</div>
        <p>Try adjusting your filters or search query</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bulletin-page {
  min-height: 100vh;
  padding: 3rem 0 4rem;
  background-color: var(--newsprint);
}

/* Header */
.bulletin-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 4px double var(--black);
}

.page-title {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

.bulletin-header p {
  font-size: 1rem;
  color: var(--dark-gray);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  margin-top: 1rem;
}

/* Controls */
.bulletin-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  background-color: var(--newsprint);
  border: 2px solid var(--black);
  border-radius: 0;
}

.filter-buttons {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--black);
  background: var(--newsprint);
  color: var(--black);
  border-radius: 0;
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-btn:hover {
  background: var(--black);
  color: var(--newsprint);
}

.filter-btn.active {
  background: var(--black);
  color: var(--newsprint);
  box-shadow: 3px 3px 0 var(--cork-medium);
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 1rem;
  border: 2px solid var(--black);
  border-radius: 0;
  background: var(--newsprint);
  transition: box-shadow 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: inset 3px 3px 0 var(--cork-light);
}

.btn-sm {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  white-space: nowrap;
}

/* Masonry Grid - TRUE MASONRY LAYOUT */
.masonry-grid {
  column-count: 3;
  column-gap: 2rem;
}

.post-card {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 2rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 2px solid var(--black);
  background: var(--newsprint);
  transition: box-shadow 0.3s ease;
  border-radius: 0;
}

.post-card:hover {
  box-shadow: 4px 4px 0 var(--cork-medium);
}

/* Post Header */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.post-type-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  flex-shrink: 0;
  border: 1px solid var(--black);
}

.post-type-badge.offer {
  background: var(--newsprint);
  color: var(--black);
}

.post-type-badge.request {
  background: var(--black);
  color: var(--newsprint);
}

.post-hours {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  background: var(--newsprint);
  padding: 0.5rem 1rem;
  border-radius: 0;
  border: 2px solid var(--black);
  flex-shrink: 0;
}

/* Post Content */
.post-title {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  font-size: 1.25rem;
  line-height: 1.25;
  margin: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  border-bottom: 1px solid var(--newspaper-line);
  padding-bottom: 0.75rem;
}

.post-description {
  color: var(--black);
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
  font-weight: 400;
  text-align: justify;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.post-tag {
  background-color: var(--newsprint);
  color: var(--black);
  padding: 0.25rem 0.625rem;
  border-radius: 0;
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Post Footer */
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 2px solid var(--newspaper-line);
  margin-top: auto;
  gap: 1rem;
}

.post-author {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  min-width: 0;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 0;
  background: var(--black);
  color: var(--newsprint);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Libre Baskerville', serif;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
  border: 2px solid var(--black);
}

.author-info {
  min-width: 0;
}

.author-name {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  color: var(--black);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-date {
  color: var(--dark-gray);
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  font-style: italic;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--medium-gray);
}

.no-results-title {
  color: var(--cork-dark);
  margin-bottom: 0.75rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
}

.no-results p {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 992px) {
  .masonry-grid {
    column-count: 2;
    column-gap: 1.5rem;
  }

  .post-card {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 768px) {
  .bulletin-page {
    padding: 2rem 0 3rem;
  }

  .bulletin-header {
    margin-bottom: 2rem;
  }

  .bulletin-controls {
    flex-direction: column;
    align-items: stretch;
    padding: 1.25rem;
    gap: 1rem;
  }
  
  .filter-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
  
  .search-box {
    width: 100%;
  }

  .bulletin-controls .btn {
    width: 100%;
  }
  
  .masonry-grid {
    column-count: 1;
    column-gap: 0;
  }
  
  .post-card {
    padding: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .post-title {
    font-size: 1.2rem;
  }

  .post-description {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .post-header {
    flex-wrap: wrap;
  }

  .filter-btn {
    font-size: 0.8rem;
    padding: 0.625rem 0.875rem;
  }
}
</style>
