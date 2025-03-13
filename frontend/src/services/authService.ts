
import axiosInstance from '../lib/axios';

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface ForgotPasswordData {
  identifier: string; // email or username
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface TwoFactorAuthData {
  usernameOrEmail: string;
  password: string;
  twoFactorToken: string;
}

export interface ChangeEmailData {
  newEmail: string;
}

export interface ChangeUsernameData {
  newUsername: string;
}

/**
 * Authentication service functions
 */
const authService = {
  // Register a new user
  register: (userData: RegisterData) => {
    return axiosInstance.post('/register', userData);
  },

  // Login a user
  login: (credentials: LoginCredentials) => {
    return axiosInstance.post('/login', credentials);
  },

  // Logout the user
  logout: () => {
    return axiosInstance.post('/logout');
  },

  // Verify email
  verifyUser: (token: string) => {
    console.log("verify token ",token)
    return axiosInstance.post('/verify', { verificationToken: token });
  },

  // Request password reset
  forgotPassword: (data: ForgotPasswordData) => {
    return axiosInstance.post('/forgotPassword', data);
  },

  // Change password (when logged in)
  changePassword: (data: ChangePasswordData) => {
    return axiosInstance.post('/changePassword', data);
  },

  // Resend verification email
  resendVerificationToken: () => {
    return axiosInstance.post('/resendVerificationToken');
  },

  // Request email change
  changeEmail: (data: ChangeEmailData) => {
    return axiosInstance.post('/changeEmail', data);
  },

  // Update email with token
  updateEmail: (token: string) => {
    return axiosInstance.post('/updateEmail', { token });
  },

  // Forgot username
  forgotUsername: (email: string) => {
    return axiosInstance.post('/forgotUserName', { email });
  },

  // Forgot email
  forgotEmail: (username: string) => {
    return axiosInstance.post('/forgotEmail', { username });
  },

  // Change username
  changeUsername: (data: ChangeUsernameData) => {
    return axiosInstance.post('/changeUserName', data);
  },

  // Initialize 2FA
  initialize2FA: () => {
    return axiosInstance.post('/initialize2FA');
  },

  // Verify 2FA setup
  verify2FA: (token: string) => {
    return axiosInstance.post('/verify2FA', { token });
  },

  // Verify login with 2FA
  verify2FALogin: (data: TwoFactorAuthData) => {
    return axiosInstance.post('/verify2FALogin', data);
  },

  // Get user details
  getUserDetails: () => {
    return axiosInstance.get('/getUserDetails');
  },

  // Update user avatar
  updateAvatar: (avatarFile: File) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return axiosInstance.patch('/updateAvatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // OAuth URL generators
  getGoogleOAuthUrl: () => {
    return `${axiosInstance.defaults.baseURL}/oauth?provider=google`;
  },
  
  getGithubOAuthUrl: () => {
    return `${axiosInstance.defaults.baseURL}/oauth?provider=github`;
  },
  
  getSpotifyOAuthUrl: () => {
    return `${axiosInstance.defaults.baseURL}/oauth?provider=spotify`;
  },
};

export default authService;