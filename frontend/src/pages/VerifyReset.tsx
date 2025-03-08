
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Loader2, Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from '@/components/AuthLayout';
import authService from '@/services/authService';

const VerifyReset: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get token and email from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token') || '';
    const emailParam = params.get('email') || '';
    
    setToken(tokenParam);
    
    // Log params for demonstration
    console.log('Verifying token:', tokenParam);
    console.log('For email:', emailParam);
    
    // Simulate token verification delay
    const timer = setTimeout(() => {
      setIsVerifying(false);
      
      // In a real application, you would verify the token with your backend
      if (tokenParam) {
        setIsValid(true);
      } else {
        setIsValid(false);
        toast({
          variant: "destructive",
          title: "Invalid reset link",
          description: "This password reset link is invalid or has expired.",
        });
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [location, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.verifyUser(token);
      
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: "Please try again or request a new reset link.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isVerifying) {
    return (
      <AuthLayout
        title="Verifying your reset link"
        subtitle="Please wait while we verify your password reset link"
      >
        <div className="flex flex-col items-center justify-center space-y-6 text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">This won't take long...</p>
        </div>
      </AuthLayout>
    );
  }
  
  if (!isValid) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="This password reset link is invalid or has expired"
      >
        <div className="flex flex-col items-center justify-center space-y-6 text-center py-8">
          <div className="rounded-full bg-destructive/10 p-4">
            <Key className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Link expired or invalid</h2>
            <p className="text-sm text-muted-foreground">
              Please request a new password reset link.
            </p>
          </div>
          <Button onClick={() => navigate('/forgot-password')}>
            Request new reset link
          </Button>
        </div>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Create a new password for your account"
    >
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button disabled={isLoading} type="submit" className="mt-2">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <Button 
            variant="link" 
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-primary"
          >
            Back to login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyReset;
