import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    this.setAuthToken(response.data.token);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    this.setAuthToken(response.data.token);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  setAuthToken(token) {
    localStorage.setItem('token', token);
  },

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Decode JWT token to get user info
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const payload = JSON.parse(window.atob(base64));
      
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};