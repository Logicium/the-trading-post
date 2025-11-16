const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Token management
let authToken: string | null = localStorage.getItem('auth-token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth-token', token);
  } else {
    localStorage.removeItem('auth-token');
  }
};

export const getAuthToken = () => authToken;

// Base fetch wrapper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: (email: string, password: string, name: string) =>
    apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  signin: (email: string, password: string) =>
    apiFetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  validate: () => apiFetch('/auth/validate'),
};

// User API
export const userApi = {
  getMe: () => apiFetch('/users/me'),

  updateMe: (updates: { name?: string; bio?: string; skills?: string[] }) =>
    apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  getUserById: (id: string) => apiFetch(`/users/${id}`),

  getAllUsers: () => apiFetch('/users'),
};

// Post API
export const postApi = {
  createPost: (data: {
    title: string;
    description: string;
    hours: number;
    type: 'offer' | 'request';
    category: string;
    tags: string[];
  }) =>
    apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAllPosts: (type?: 'offer' | 'request') => {
    const query = type ? `?type=${type}` : '';
    return apiFetch(`/posts${query}`);
  },

  getMyPosts: () => apiFetch('/posts/my-posts'),

  getPostById: (id: string) => apiFetch(`/posts/${id}`),

  updatePost: (
    id: string,
    updates: {
      title?: string;
      description?: string;
      hours?: number;
      category?: string;
      tags?: string[];
      active?: boolean;
    }
  ) =>
    apiFetch(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deletePost: (id: string) =>
    apiFetch(`/posts/${id}`, {
      method: 'DELETE',
    }),
};

// Message API
export const messageApi = {
  createConversation: (postId: string) =>
    apiFetch('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    }),

  getConversations: () => apiFetch('/messages/conversations'),

  getConversationById: (id: string) => apiFetch(`/messages/conversations/${id}`),

  getMessages: (conversationId: string) =>
    apiFetch(`/messages/conversations/${conversationId}/messages`),

  sendMessage: (conversationId: string, text: string) =>
    apiFetch(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  markAsRead: (conversationId: string) =>
    apiFetch(`/messages/conversations/${conversationId}/read`, {
      method: 'POST',
    }),
};

// Activity API
export const activityApi = {
  getRecentActivities: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : '';
    return apiFetch(`/activities${query}`);
  },
};

// Transaction API
export const transactionApi = {
  createTransaction: (data: {
    postId: string;
    providerId: string;
    receiverId: string;
    hours: number;
  }) =>
    apiFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUserTransactions: () => apiFetch('/transactions'),

  getTransactionById: (id: string) => apiFetch(`/transactions/${id}`),

  confirmTransaction: (id: string) =>
    apiFetch(`/transactions/${id}/confirm`, {
      method: 'POST',
    }),
};
