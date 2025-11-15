<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  skills: '',
  bio: ''
})

const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    // In a real app, this would call an API
    console.log('Form submitted:', formData.value)
    // Navigate to profile page
    router.push('/profile')
  }
}
</script>

<template>
  <div class="signup-page">
    <div class="container">
      <div class="signup-wrapper">
        <div class="signup-header">
          <h1>Join The Trading Post</h1>
          <p>Start your time-banking journey today</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="signup-form card">
          <div class="form-section">
            <h3>Basic Information</h3>
            
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Enter your full name"
                :class="{ 'error': errors.name }"
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="you@example.com"
                :class="{ 'error': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>
            
            <div class="form-group">
              <label for="password">Password *</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="At least 6 characters"
                :class="{ 'error': errors.password }"
              />
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                :class="{ 'error': errors.confirmPassword }"
              />
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Tell Us About Yourself</h3>
            
            <div class="form-group">
              <label for="skills">Your Skills</label>
              <input
                id="skills"
                v-model="formData.skills"
                type="text"
                placeholder="e.g., Gardening, Cooking, Tutoring"
              />
              <span class="form-hint">Separate skills with commas</span>
            </div>
            
            <div class="form-group">
              <label for="bio">Short Bio</label>
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="4"
                placeholder="Tell the community a bit about yourself..."
              ></textarea>
              <span class="form-hint">Optional, but helps others get to know you</span>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block">
            Create Account
          </button>
          
          <p class="form-footer">
            Already have an account? <router-link to="/login">Sign in</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background: var(--newsprint);
}

.signup-wrapper {
  max-width: 700px;
  margin: 0 auto;
}

.signup-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.signup-header h1 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.signup-header p {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.1rem;
  color: var(--black);
}

.signup-form {
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
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  font-family: 'Libre Franklin', sans-serif;
  color: var(--black);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group input,
.form-group textarea {
  width: 100%;
  font-family: 'Libre Baskerville', serif;
  border: 2px solid var(--black);
  border-radius: 0;
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--black);
  background-color: #ffe5e5;
}

.error-message {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--accent-red);
  font-size: 0.9rem;
  font-weight: 500;
}

.form-hint {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--medium-gray);
  font-size: 0.9rem;
  font-style: italic;
}

.btn-block {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.25rem;
  margin-top: var(--spacing-md);
}

.form-footer {
  text-align: center;
  margin-top: var(--spacing-md);
  color: var(--dark-gray);
}

.form-footer a {
  color: var(--cork-dark);
  font-weight: 500;
}

.form-footer a:hover {
  color: var(--cork-darker);
}

@media (max-width: 768px) {
  .signup-page {
    padding: var(--spacing-md) 0;
  }
  
  .signup-form {
    padding: var(--spacing-md);
  }
  
  .form-section {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
  }
}
</style>
