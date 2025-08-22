import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token for admin routes
api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.includes('/api/posts') && (config.method !== 'get') ||
                       config.url?.includes('/api/upload') ||
                       config.url?.includes('/api/newsletter/send') ||
                       config.url?.includes('/api/newsletter/subscribers') ||
                       config.url?.includes('/api/newsletter/unsubscribe');
  
  if (isAdminRoute) {
    const adminToken = ADMIN_TOKEN || (window as any).__ADMIN_TOKEN__;
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types
export interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Post API functions
export const postsAPI = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get('/api/posts');
    return response.data;
  },

  // Get single post
  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
  },

  // Create post (admin only)
  createPost: async (postData: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
    const response = await api.post('/api/posts', postData);
    return response.data;
  },

  // Update post (admin only)
  updatePost: async (id: number, postData: Partial<Omit<Post, 'id' | 'created_at'>>): Promise<Post> => {
    const response = await api.put(`/api/posts/${id}`, postData);
    return response.data;
  },

  // Delete post (admin only)
  deletePost: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/posts/${id}`);
    return response.data;
  },
};

// Upload API functions
export const uploadAPI = {
  // Upload image (admin only)
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Newsletter API functions
export const newsletterAPI = {
  // Subscribe to newsletter
  signup: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/api/newsletter/signup', { email });
    return response.data;
  },

  // Send newsletter (admin only)
  sendNewsletter: async (subject: string, content: string): Promise<{
    message: string;
    success_count: number;
    failed_count: number;
    total_subscribers: number;
  }> => {
    const response = await api.post('/api/newsletter/send', { subject, content });
    return response.data;
  },

  // Get subscribers (admin only)
  getSubscribers: async (): Promise<NewsletterSubscriber[]> => {
    const response = await api.get('/api/newsletter/subscribers');
    return response.data;
  },

  // Unsubscribe (admin only)
  unsubscribe: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/newsletter/unsubscribe/${id}`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export default api;
