import axios from 'axios';
import { message } from 'antd';

// Configure base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds for menu preview operations
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for authentication
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Clear any stored data and redirect to login
      window.location.href = '/login';
    }
    
    if (error.response?.status >= 500) {
      message.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (phoneNumber, password) =>
    api.post('/auth/restaurant-login', { phoneNumber, password }),
  
  register: (userData) =>
    api.post('/auth/restaurant-register', userData),
  
  logout: () =>
    api.post('/auth/logout'),
  
  // Restore missing methods for backward compatibility
  verifyToken: () =>
    api.get('/auth/verify-token'),
  
  getMe: () =>
    api.get('/auth/me'),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
};

// Restaurant APIs
export const restaurantAPI = {
  // Onboarding APIs - Simplified
  getOnboardingState: () =>
    api.get('/restaurants/onboarding/state'),
  
  // Restaurant CRUD
  createRestaurant: (restaurantData) =>
    api.post('/restaurants/onboard', restaurantData),
  
  updateRestaurant: (restaurantId, restaurantData) =>
    api.put(`/restaurants/${restaurantId}`, restaurantData),
  
  getRestaurant: (restaurantId) =>
    api.get(`/restaurants/${restaurantId}`),
  
  // POS Integration
  createPosIntegration: (restaurantId, posData) =>
    api.post(`/restaurants/${restaurantId}/pos-integration`, posData),
  
  updatePosIntegration: (restaurantId, posData) =>
    api.put(`/restaurants/${restaurantId}/pos-integration`, posData),
  
  // Menu Management
  getMenuPreview: (restaurantId) =>
    api.get(`/restaurants/${restaurantId}/menu-preview`),
  
  saveMenu: (restaurantId) =>
    api.post(`/restaurants/${restaurantId}/save-menu`),
  
  // Legacy APIs for backward compatibility
  updateOnboardingStatus: (restaurantId, status) =>
    api.put(`/restaurants/${restaurantId}/onboarding-status`, { status }),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: (restaurantId) =>
    api.get(`/dashboard/stats?restaurantId=${restaurantId}`),
  
  getOnboardingStatus: (restaurantId) =>
    api.get(`/restaurants/${restaurantId}/onboarding-status`),
  
  updateOnboardingStep: (restaurantId, stepName, completed) =>
    api.put(`/restaurants/${restaurantId}/onboarding-step`, { stepName, completed }),
  
  getOrderHistory: (restaurantId) =>
    api.get(`/dashboard/orders?restaurantId=${restaurantId}`),
  
  getMenuItems: (restaurantId) =>
    api.get(`/restaurants/${restaurantId}/items`),
  
  updateMenuItem: (restaurantId, itemId, itemData) =>
    api.put(`/restaurants/${restaurantId}/items/${itemId}`, itemData),
};

export default api; 