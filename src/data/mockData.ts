// Mock data for The Trading Post application

export interface Post {
  id: number
  author: string
  title: string
  description: string
  hours: number
  type: 'offer' | 'request'
  category: string
  date: string
  tags: string[]
}

export interface User {
  name: string
  email: string
  joinDate: string
  timeBalance: number
  skills: string[]
  bio: string
  completedTrades: number
  rating: number
}

export interface Activity {
  id: number
  type: 'offered' | 'received'
  title: string
  hours: number
  date: string
}

export const mockPosts: Post[] = [
  {
    id: 1,
    author: 'Sarah Chen',
    title: 'Offering: Organic Vegetable Gardening Tips',
    description: 'I have 20 years of experience in organic gardening. Happy to help you start your own veggie garden or troubleshoot existing problems!',
    hours: 2,
    type: 'offer',
    category: 'Gardening',
    date: 'Nov 14, 2025',
    tags: ['gardening', 'organic', 'vegetables']
  },
  {
    id: 2,
    author: 'Marcus Johnson',
    title: 'Request: Help Moving Furniture',
    description: 'Need help moving some heavy furniture within my apartment this weekend. Should only take about an hour with two people.',
    hours: 1,
    type: 'request',
    category: 'Moving',
    date: 'Nov 13, 2025',
    tags: ['moving', 'furniture', 'help']
  },
  {
    id: 3,
    author: 'Emily Rodriguez',
    title: 'Offering: Spanish Language Tutoring',
    description: 'Native Spanish speaker offering conversational practice and grammar help. All levels welcome!',
    hours: 1.5,
    type: 'offer',
    category: 'Education',
    date: 'Nov 13, 2025',
    tags: ['language', 'tutoring', 'spanish']
  },
  {
    id: 4,
    author: 'David Kim',
    title: 'Offering: Basic Home Repairs',
    description: 'Handyman services for small repairs - fixing leaky faucets, hanging shelves, basic electrical work.',
    hours: 2,
    type: 'offer',
    category: 'Home Repair',
    date: 'Nov 12, 2025',
    tags: ['repair', 'handyman', 'home']
  },
  {
    id: 5,
    author: 'Jessica Taylor',
    title: 'Request: Dog Walking Services',
    description: 'Looking for someone to walk my friendly golden retriever twice a week while I\'m at work. He loves long walks!',
    hours: 1,
    type: 'request',
    category: 'Pet Care',
    date: 'Nov 12, 2025',
    tags: ['pets', 'dogs', 'walking']
  },
  {
    id: 6,
    author: 'Alex Thompson',
    title: 'Offering: Web Design Consultation',
    description: 'Professional web designer offering free consultations and basic website setup help for small businesses or personal projects.',
    hours: 3,
    type: 'offer',
    category: 'Technology',
    date: 'Nov 11, 2025',
    tags: ['web design', 'technology', 'consultation']
  },
  {
    id: 7,
    author: 'Rachel Green',
    title: 'Request: Baking Lessons',
    description: 'Would love to learn how to bake bread from scratch. Complete beginner looking for patient teacher!',
    hours: 2,
    type: 'request',
    category: 'Cooking',
    date: 'Nov 11, 2025',
    tags: ['baking', 'cooking', 'lessons']
  },
  {
    id: 8,
    author: 'Michael Brown',
    title: 'Offering: Guitar Lessons',
    description: 'Teaching guitar for 10+ years. Acoustic or electric, all skill levels. Can teach music theory or just songs you want to learn.',
    hours: 1.5,
    type: 'offer',
    category: 'Music',
    date: 'Nov 10, 2025',
    tags: ['music', 'guitar', 'lessons']
  },
  {
    id: 9,
    author: 'Lisa Anderson',
    title: 'Request: Photography Session',
    description: 'Need professional headshots for my resume. Looking for someone with portrait photography experience.',
    hours: 2,
    type: 'request',
    category: 'Photography',
    date: 'Nov 10, 2025',
    tags: ['photography', 'portraits', 'headshots']
  },
  {
    id: 10,
    author: 'James Wilson',
    title: 'Offering: Math Tutoring',
    description: 'Former high school math teacher available for tutoring. Algebra through Calculus. Patient and experienced with all learning styles.',
    hours: 1,
    type: 'offer',
    category: 'Education',
    date: 'Nov 9, 2025',
    tags: ['math', 'tutoring', 'education']
  },
  {
    id: 11,
    author: 'Nina Patel',
    title: 'Request: Yoga Instruction',
    description: 'Beginner looking for one-on-one yoga sessions to learn proper form and build a home practice.',
    hours: 1.5,
    type: 'request',
    category: 'Fitness',
    date: 'Nov 9, 2025',
    tags: ['yoga', 'fitness', 'wellness']
  },
  {
    id: 12,
    author: 'Tom Martinez',
    title: 'Offering: Car Maintenance Help',
    description: 'Can help with basic car maintenance: oil changes, tire rotation, brake pad replacement. Bring your own parts.',
    hours: 2,
    type: 'offer',
    category: 'Automotive',
    date: 'Nov 8, 2025',
    tags: ['cars', 'maintenance', 'automotive']
  }
]

export const mockUser: User = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  joinDate: 'January 2025',
  timeBalance: 24.5,
  skills: ['Gardening', 'Web Development', 'Guitar Lessons', 'Dog Walking'],
  bio: 'Long-time community member who loves sharing skills and helping neighbors. I believe in the power of time-banking to build stronger, more connected communities.',
  completedTrades: 47,
  rating: 4.9
}

export const mockActivity: Activity[] = [
  { id: 1, type: 'offered', title: 'Guitar lesson for beginners', hours: 2, date: 'Nov 10, 2025' },
  { id: 2, type: 'received', title: 'Help with plumbing repair', hours: 1.5, date: 'Nov 8, 2025' },
  { id: 3, type: 'offered', title: 'Web design consultation', hours: 3, date: 'Nov 5, 2025' },
  { id: 4, type: 'received', title: 'Spanish tutoring session', hours: 1, date: 'Nov 2, 2025' }
]
