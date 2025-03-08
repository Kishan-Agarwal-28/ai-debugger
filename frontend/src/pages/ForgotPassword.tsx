
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from '@/components/AuthLayout';
import authService from '@/services/authService';

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email or username",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.forgotPassword({ identifier });
      
      // Navigate to the reset-email-sent page with the email as a parameter
      navigate(`/reset-email-sent?email=${encodeURIComponent(identifier)}`);
      
      toast({
        title: "Reset email sent",
        description: "Please check your inbox for the password reset link.",
      });
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Forgot Password"
      subtitle="Enter your email or username to receive a password reset link"
    >
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  placeholder="name@example.com"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button disabled={isLoading} type="submit" className="mt-2">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Send Reset Link
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

export default ForgotPassword;
