'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, AuthContextType } from '@/app/types/auth';
import { mockUsers } from '@/app/lib/mock-data';
import { simulateApiDelay } from '@/app/lib/mock-data';

// Auth Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      await simulateApiDelay(1000);
      
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed. Please try again.' });
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  // Register function
  const register = async (data: RegisterData): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      await simulateApiDelay(1000);
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'User with this email already exists' });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        ...data,
        role: data.role || 'customer',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to mock data (in real app, this would be an API call)
      mockUsers.push(newUser);
      
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithoutPassword });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Registration failed. Please try again.' });
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!authState.user) return;
    
    try {
      await simulateApiDelay(1000);
      
      const updatedUser = { ...authState.user, ...data, updatedAt: new Date().toISOString() };
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === authState.user!.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data, updatedAt: new Date().toISOString() };
      }
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw new Error('Profile update failed. Please try again.');
    }
  };

  const value: AuthContextType = {
    authState,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
