<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// Use reactive reference to user from store
const user = computed(() => userStore.currentUser)

const isEditing = ref(false)
const editForm = ref({ 
  name: user.value?.name || '',
  email: user.value?.email || '',
  bio: user.value?.bio || '',
  skills: user.value?.skills || [],
  joinDate: user.value?.joinDate || '',
  timeBalance: user.value?.timeBalance || 0,
  completedTrades: user.value?.completedTrades || 0,
  rating: user.value?.rating || 0
})

const recentActivity = ref([
  { id: 1, type: 'offered' as 'offered' | 'received', title: 'Guitar lesson for beginners', hours: 2, date: 'Nov 10, 2025' },
  { id: 2, type: 'received' as 'offered' | 'received', title: 'Help with plumbing repair', hours: 1.5, date: 'Nov 8, 2025' },
  { id: 3, type: 'offered' as 'offered' | 'received', title: 'Web design consultation', hours: 3, date: 'Nov 5, 2025' },
  { id: 4, type: 'received' as 'offered' | 'received', title: 'Spanish tutoring session', hours: 1, date: 'Nov 2, 2025' }
])

const toggleEdit = () => {
  if (isEditing.value) {
    // Cancel editing - restore from user
    if (user.value) {
      editForm.value = {
        name: user.value.name,
        email: user.value.email,
        bio: user.value.bio || '',
        skills: [...user.value.skills],
        joinDate: user.value.joinDate,
        timeBalance: user.value.timeBalance,
        completedTrades: user.value.completedTrades,
        rating: user.value.rating
      }
    }
  } else {
    // Start editing - copy current user data
    if (user.value) {
      editForm.value = {
        name: user.value.name,
        email: user.value.email,
        bio: user.value.bio || '',
        skills: [...user.value.skills],
        joinDate: user.value.joinDate,
        timeBalance: user.value.timeBalance,
        completedTrades: user.value.completedTrades,
        rating: user.value.rating
      }
    }
  }
  isEditing.value = !isEditing.value
}

const saveProfile = async () => {
  try {
    await userStore.updateUser(editForm.value)
    isEditing.value = false
  } catch (error) {
    console.error('Failed to save profile:', error)
  }
}

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    userStore.signout()
    router.push('/')
  }
}

const addSkill = () => {
  const skill = prompt('Enter a new skill:')
  if (skill && skill.trim() && editForm.value.skills) {
    editForm.value.skills.push(skill.trim())
  }
}

const removeSkill = (index: number) => {
  if (editForm.value.skills) {
    editForm.value.skills.splice(index, 1)
  }
}
</script>

<template>
  <div class="profile-page" v-if="user">
    <div class="container">
      <!-- Profile Header -->
      <div class="profile-header card">
        <div class="profile-avatar">
          {{ user.name.split(' ').map(n => n[0]).join('') }}
        </div>
        
        <div class="profile-info">
          <h1 v-if="!isEditing">{{ user.name }}</h1>
          <input v-else v-model="editForm.name" class="edit-input-large" />
          
          <p class="profile-email">{{ user.email }}</p>
          <p class="profile-join-date">Member since {{ user.joinDate }}</p>
          
          <div class="profile-stats">
            <div class="stat">
              <div class="stat-value">{{ user.timeBalance }}</div>
              <div class="stat-label">Hours Balance</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ user.completedTrades }}</div>
              <div class="stat-label">Completed Trades</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ user.rating }}/5</div>
              <div class="stat-label">Rating</div>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button v-if="!isEditing" @click="toggleEdit" class="btn btn-secondary">
            Edit Profile
          </button>
          <template v-else>
            <button @click="saveProfile" class="btn btn-primary">Save Changes</button>
            <button @click="toggleEdit" class="btn btn-secondary">Cancel</button>
          </template>
          <button @click="handleLogout" class="btn btn-logout">
            Logout
          </button>
        </div>
      </div>
      
      <div class="profile-content">
        <!-- Bio Section -->
        <div class="profile-section card">
          <h2>About Me</h2>
          <p v-if="!isEditing" class="bio-text">{{ user.bio }}</p>
          <textarea v-else v-model="editForm.bio" rows="4" class="edit-textarea"></textarea>
        </div>
        
        <!-- Skills Section -->
        <div class="profile-section card">
          <div class="section-header">
            <h2>Skills & Services</h2>
            <button v-if="isEditing" @click="addSkill" class="btn-icon">+ Add Skill</button>
          </div>
          
          <div class="skills-list">
            <div v-for="(skill, index) in (isEditing ? editForm.skills : user.skills)" :key="index" class="skill-tag">
              {{ skill }}
              <button v-if="isEditing" @click="removeSkill(index)" class="skill-remove">×</button>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity Section -->
        <div class="profile-section card">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                {{ activity.type === 'offered' ? '📤' : '📥' }}
              </div>
              <div class="activity-details">
                <h4>{{ activity.title }}</h4>
                <p class="activity-meta">
                  {{ activity.hours }} hours • {{ activity.date }}
                </p>
              </div>
              <div class="activity-badge" :class="activity.type">
                {{ activity.type === 'offered' ? 'Offered' : 'Received' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
  background-color: var(--newsprint);
}

/* Profile Header */
.profile-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-lg);
  align-items: start;
  margin-bottom: var(--spacing-xl);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 0;
  background: var(--black);
  color: var(--newsprint);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  font-family: 'Libre Baskerville', serif;
  border: 2px solid var(--black);
}

.profile-info h1 {
  font-family: 'Libre Baskerville', serif;
  margin-bottom: var(--spacing-xs);
  font-weight: 700;
  text-transform: uppercase;
  border: none;
  padding: 0;
}

.profile-email {
  color: var(--dark-gray);
  margin-bottom: var(--spacing-xs);
  font-family: 'Libre Franklin', sans-serif;
}

.profile-join-date {
  color: var(--medium-gray);
  font-size: 0.95rem;
  margin-bottom: var(--spacing-md);
  font-family: 'Libre Franklin', sans-serif;
}

.profile-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 2px solid var(--newspaper-line);
}

.stat {
  text-align: center;
}

.stat-value {
  font-family: 'Libre Baskerville', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  line-height: 1;
}

.stat-label {
  font-family: 'Libre Franklin', sans-serif;
  font-size: 0.85rem;
  color: var(--dark-gray);
  margin-top: var(--spacing-xs);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Edit Inputs */
.edit-input-large {
  font-family: 'Libre Baskerville', serif;
  font-size: 2rem;
  font-weight: 700;
  padding: var(--spacing-xs);
  width: 100%;
  border: 2px solid var(--black);
  border-radius: 0;
  background-color: var(--newsprint);
}

.edit-textarea {
  width: 100%;
  font-family: 'Libre Baskerville', serif;
  border: 2px solid var(--black);
  border-radius: 0;
  padding: var(--spacing-sm);
  background-color: var(--newsprint);
}

/* Profile Content */
.profile-content {
  display: grid;
  gap: var(--spacing-lg);
}

.profile-section {
  padding: var(--spacing-lg);
  background: var(--newsprint);
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.profile-section h2 {
  font-family: 'Libre Baskerville', serif;
  margin-bottom: var(--spacing-md);
  color: var(--black);
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 2px solid var(--newspaper-line);
  padding-bottom: var(--spacing-xs);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.btn-icon {
  background: var(--black);
  color: var(--newsprint);
  border: 2px solid var(--black);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 0;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Libre Franklin', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.btn-icon:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
}

.bio-text {
  font-family: 'Libre Baskerville', serif;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--black);
}

/* Skills */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-tag {
  background: var(--newsprint);
  color: var(--black);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 0;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  border: 2px solid var(--black);
  font-family: 'Libre Franklin', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: var(--black);
  color: var(--newsprint);
}

.skill-remove {
  background: none;
  border: none;
  color: var(--black);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: var(--spacing-xs);
  transition: color 0.3s ease;
}

.skill-tag:hover .skill-remove {
  color: var(--newsprint);
}

/* Activity */
.activity-list {
  display: grid;
  gap: var(--spacing-md);
}

.activity-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--newsprint);
  border-radius: 0;
  border: 2px solid var(--black);
  border-left: 4px solid var(--black);
  transition: all 0.3s ease;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.activity-item:hover {
  transform: translateX(2px);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
}

.activity-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  background-color: var(--newsprint);
  border: 2px solid var(--black);
  filter: grayscale(100%);
}

.activity-icon.offered {
  background: var(--newsprint);
}

.activity-icon.received {
  background: var(--black);
}

.activity-details h4 {
  font-family: 'Libre Baskerville', serif;
  margin-bottom: var(--spacing-xs);
  color: var(--black);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.activity-meta {
  font-family: 'Libre Franklin', sans-serif;
  color: var(--dark-gray);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.activity-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 0;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Libre Franklin', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid var(--black);
}

.activity-badge.offered {
  background-color: var(--newsprint);
  color: var(--black);
}

.activity-badge.received {
  background-color: var(--black);
  color: var(--newsprint);
}

.btn-logout {
  background-color: transparent;
  color: var(--accent-red);
  border: 2px solid var(--accent-red);
}

.btn-logout:hover {
  background-color: var(--accent-red);
  color: var(--newsprint);
  transform: translateY(-2px);
  box-shadow: 3px 3px 0 rgba(255, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .profile-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .profile-avatar {
    margin: 0 auto;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .profile-actions {
    flex-direction: row;
    width: 100%;
  }
  
  .profile-actions button {
    flex: 1;
  }
  
  .activity-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .activity-icon {
    margin: 0 auto;
  }
}
</style>
