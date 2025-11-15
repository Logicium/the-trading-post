<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'
import { useUserStore } from '../stores/user'
import { useActivityStore } from '../stores/activity'

const router = useRouter()
const postsStore = usePostsStore()
const userStore = useUserStore()
const activityStore = useActivityStore()

const form = ref({
  type: 'offer' as 'offer' | 'request',
  title: '',
  description: '',
  category: '',
  hours: 1,
  tags: ''
})

const errors = ref({
  title: '',
  description: '',
  category: '',
  hours: ''
})

const categories = [
  'Gardening',
  'Education',
  'Technology',
  'Home Repair',
  'Pet Care',
  'Cooking',
  'Music',
  'Photography',
  'Fitness',
  'Automotive',
  'Art & Crafts',
  'Moving',
  'Other'
]

const validateForm = () => {
  let isValid = true
  errors.value = { title: '', description: '', category: '', hours: '' }

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
    isValid = false
  } else if (form.value.description.length < 20) {
    errors.value.description = 'Description must be at least 20 characters'
    isValid = false
  }

  if (!form.value.category) {
    errors.value.category = 'Please select a category'
    isValid = false
  }

  if (form.value.hours < 0.5 || form.value.hours > 10) {
    errors.value.hours = 'Hours must be between 0.5 and 10'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    const currentUser = userStore.currentUser
    
    // Parse tags
    const tags = form.value.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    
    // Create new post
    const newPost = postsStore.addPost({
      author: currentUser.name,
      title: form.value.title,
      description: form.value.description,
      hours: form.value.hours,
      type: form.value.type,
      category: form.value.category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tags
    })
    
    // Add activity
    activityStore.addPostActivity(
      currentUser.email,
      currentUser.name,
      newPost.id,
      newPost.title
    )
    
    // Navigate back to bulletin board
    router.push('/bulletin')
  }
}

const cancel = () => {
  router.push('/bulletin')
}
</script>

<template>
  <div class="new-post-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">New Classified Listing</h1>
        <p class="page-subtitle">Post an offer or request to the community bulletin board</p>
      </div>

      <form @submit.prevent="handleSubmit" class="post-form card">
        <!-- Post Type Selection -->
        <div class="form-section">
          <h3>Listing Type</h3>
          <div class="type-selection">
            <label class="type-option">
              <input type="radio" v-model="form.type" value="offer" />
              <span class="type-label">
                <span class="type-title">Offer</span>
                <span class="type-description">I'm offering a skill or service</span>
              </span>
            </label>
            <label class="type-option">
              <input type="radio" v-model="form.type" value="request" />
              <span class="type-label">
                <span class="type-title">Request</span>
                <span class="type-description">I'm looking for help or a service</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Title -->
        <div class="form-section">
          <h3>Listing Title</h3>
          <div class="form-group">
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g., 'Offering: Guitar Lessons' or 'Request: Help Moving Furniture'"
              class="form-input"
              :class="{ error: errors.title }"
            />
            <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
          </div>
        </div>

        <!-- Category -->
        <div class="form-section">
          <h3>Category</h3>
          <div class="form-group">
            <select
              v-model="form.category"
              class="form-select"
              :class="{ error: errors.category }"
            >
              <option value="">Select a category...</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
          </div>
        </div>

        <!-- Hours -->
        <div class="form-section">
          <h3>Estimated Time</h3>
          <div class="form-group">
            <div class="hours-input-group">
              <input
                v-model.number="form.hours"
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                class="form-input hours-input"
                :class="{ error: errors.hours }"
              />
              <span class="hours-label">hours</span>
            </div>
            <span v-if="errors.hours" class="error-message">{{ errors.hours }}</span>
            <p class="form-help">How many hours will this take? (0.5 to 10 hours)</p>
          </div>
        </div>

        <!-- Description -->
        <div class="form-section">
          <h3>Description</h3>
          <div class="form-group">
            <textarea
              v-model="form.description"
              rows="6"
              placeholder="Provide details about your offer or request. What skills are involved? What should people expect?"
              class="form-textarea"
              :class="{ error: errors.description }"
            ></textarea>
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            <p class="form-help">{{ form.description.length }} characters (minimum 20)</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-section">
          <h3>Tags (Optional)</h3>
          <div class="form-group">
            <input
              v-model="form.tags"
              type="text"
              placeholder="e.g., beginner, weekend, outdoor (comma-separated)"
              class="form-input"
            />
            <p class="form-help">Add keywords to help others find your listing</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="button" @click="cancel" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">Publish Listing</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.new-post-page {
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
  max-width: 600px;
  margin: 0 auto;
}

.post-form {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.form-section {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--newspaper-line);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section h3 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-md);
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.form-group {
  margin-bottom: var(--spacing-sm);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  font-family: 'Libre Baskerville', serif;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--black);
  border-radius: 0;
  background-color: var(--newsprint);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--black);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--black);
  background-color: #ffe5e5;
}

.error-message {
  display: block;
  color: var(--black);
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  margin-top: var(--spacing-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.form-help {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  color: var(--dark-gray);
  margin-top: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Type Selection */
.type-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.type-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 2px solid var(--black);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--newsprint);
}

.type-option:hover {
  background: var(--black);
  color: var(--newsprint);
}

.type-option input[type="radio"] {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.type-label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.type-title {
  font-family: 'Libre Baskerville', serif;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
}

.type-description {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Hours Input */
.hours-input-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.hours-input {
  width: 120px;
}

.hours-label {
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 2px solid var(--newspaper-line);
}

@media (max-width: 768px) {
  .type-selection {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
