
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import AuthLayout from '@/components/AuthLayout';

const ResetEmailSent: React.FC = () => {
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email and token from URL query parameters
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';
  const token = params.get('token') || '';
  
  // Log params for demonstration
  console.log('Email:', email);
  console.log('Reset token:', token);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleResendEmail = () => {
    setIsResending(true);
    
    // Simulate request delay
    setTimeout(() => {
      setIsResending(false);
      setCanResend(false);
      setCountdown(60);
      
      toast({
        title: "Email resent",
        description: "We've sent another password reset link to your email.",
      });
    }, 1500);
  };

  const handleVerifyNow = () => {
    navigate(`/verify-reset?token=${token}&email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthLayout 
      title="Check your email"
      subtitle="We've sent you a password reset link"
    >
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Reset email sent</h2>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to <span className="font-medium">{email}</span>
          </p>
        </div>
        
        {/* For demo purposes, add button to verify immediately */}
        <Button 
          onClick={handleVerifyNow} 
          className="w-full"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Verify Now (Demo)
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Didn't receive the email?{" "}
          {canResend ? (
            <button 
              onClick={handleResendEmail}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {isResending ? (
                <>
                  <RefreshCw className="inline mr-1 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                "Click to resend"
              )}
            </button>
          ) : (
            <span>Resend in {countdown}s</span>
          )}
        </div>
        
        <div className="text-sm">
          <Button 
            variant="link" 
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetEmailSent;
