
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import AuthLayout from '@/components/AuthLayout';
import authService from '@/services/authService';

const VerifyEmail: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Get email and token from URL params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('token');
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    // Log params
    console.log('Email from params:', emailParam);
    console.log('Token from params:', tokenParam);
  }, [location]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleVerify = async () => {
    if (!token) {
      toast({
        variant: "destructive",
        title: "No verification token",
        description: "No token was provided in the URL. Please check your email for the correct link.",
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      await authService.verifyUser(token);
      
      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Email verification failed:', error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "The verification token is invalid or has expired.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setCanResend(false);
    setCountdown(60);
    
    try {
      await authService.resendVerificationToken();
      
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for a new verification link.",
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      toast({
        variant: "destructive",
        title: "Failed to resend email",
        description: "Please try again later.",
      });
      
      // Reset countdown if failed
      setCanResend(true);
      setCountdown(0);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent a verification link to your email"
    >
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to <span className="font-medium">{email || 'your email'}</span>
          </p>
        </div>
        
        {/* For demo purposes, we'll add a button to simulate clicking the email link */}
        <Button 
          onClick={handleVerify} 
          className="w-full"
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              {token ? 'Verify Email' : 'Simulate Email Verification'}
            </>
          )}
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Didn't receive the email?{" "}
          {canResend ? (
            <button 
              onClick={handleResendEmail}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Click to resend
            </button>
          ) : (
            <span>Resend in {countdown}s</span>
          )}
        </div>
        
        <div className="text-sm">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Back to login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
