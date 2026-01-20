import { create } from 'zustand';
import { authAPI } from '../api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true });
    return response.data;
  },
  
  register: async (data) => {
    const response = await authAPI.register(data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    try {
      const response = await authAPI.getMe();
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
    }
  }
}));
