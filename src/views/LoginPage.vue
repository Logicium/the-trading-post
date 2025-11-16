<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = ref({
  email: '',
  password: ''
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    await userStore.signin(formData.value.email, formData.value.password)
    router.push('/')
  } catch (error: any) {
    errors.value.general = error.message || 'Failed to sign in. Please check your credentials.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="container">
      <div class="login-wrapper">
        <div class="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to The Trading Post</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="login-form card">
          <div v-if="errors.general" class="error-banner">
            {{ errors.general }}
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
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
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              :class="{ 'error': errors.password }"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing In...' : 'Sign In' }}
          </button>
          
          <p class="form-footer">
            Don't have an account? <router-link to="/signup">Sign up</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background: var(--newsprint);
  display: flex;
  align-items: center;
}

.login-wrapper {
  max-width: 500px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-header h1 {
  font-family: 'Libre Baskerville', serif;
  color: var(--black);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.login-header p {
  font-family: 'Libre Baskerville', serif;
  font-size: 1.1rem;
  color: var(--black);
}

.login-form {
  padding: var(--spacing-xl);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.error-banner {
  padding: var(--spacing-md);
  background-color: #ffe5e5;
  border: 2px solid var(--accent-red);
  margin-bottom: var(--spacing-md);
  border-radius: 4px;
  color: var(--accent-red);
  font-weight: 500;
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

.form-group input {
  width: 100%;
  font-family: 'Libre Baskerville', serif;
  border: 2px solid var(--black);
  border-radius: 0;
}

.form-group input.error {
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

.btn-block {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.25rem;
  margin-top: var(--spacing-md);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  .login-page {
    padding: var(--spacing-md) 0;
  }
  
  .login-form {
    padding: var(--spacing-md);
  }
}
</style>
