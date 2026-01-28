import { api } from '../lib/api';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterData {
  phone: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);

      // Store JWT token
      if (response.token) {
        api.setToken(response.token);
      }

      return {
        user: response.user,
        token: response.token
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await api.post('/auth/register', data);

      // Store JWT token
      if (response.token) {
        api.setToken(response.token);
      }

      return {
        user: response.user,
        token: response.token
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout', {});
      // Remove JWT token
      api.removeToken();
    } catch (error) {
      // Always remove token even if API call fails
      api.removeToken();
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = api.getToken();
      if (!token) {
        return null;
      }

      const user = await api.get('/auth/me');
      return user;
    } catch (error) {
      // If token is invalid, remove it
      api.removeToken();
      return null;
    }
  },
};
