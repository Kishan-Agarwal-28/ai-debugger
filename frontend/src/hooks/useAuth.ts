
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import authService, { LoginCredentials, RegisterData } from '@/services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  isVerified: boolean;
  has2FA: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setAuth({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      
      try {
        const { data } = await authService.getUserDetails();
        
        setAuth({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        setAuth({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };
    
    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { data } = await authService.login(credentials);
      
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // If 2FA is required
      if (data.requires2FA) {
        return { requires2FA: true };
      }
      
      // Get user details
      const userResponse = await authService.getUserDetails();
      
      setAuth({
        user: userResponse.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${userResponse.data.user.username}.`,
      });
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  }, [toast]);

  const register = useCallback(async (userData: RegisterData) => {
    try {
      await authService.register(userData);
      
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
      
      navigate('/verify-email');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    }
  }, [toast, navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      setAuth({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      
      navigate('/login');
    }
  }, [toast, navigate]);

  return {
    ...auth,
    login,
    register,
    logout,
  };
};
