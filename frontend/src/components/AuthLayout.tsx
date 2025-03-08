
import React from 'react';
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  image?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  image = "/placeholder.svg"
}) => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side: Image */}
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-editor-sidebar bg-opacity-60 z-10"></div>
        <div className="absolute -inset-40 bg-editor-sidebar z-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
          <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern [mask-image:radial-gradient(black,transparent_70%)]" />
        </div>
        <div className="relative z-20 flex flex-col items-center justify-center space-y-6 p-12">
          <div className="bg-gradient-to-r from-code-blue via-code-purple to-code-green bg-clip-text">
            <h1 className="text-6xl font-bold text-transparent">CodeClarity</h1>
          </div>
          <p className="text-center text-muted-foreground max-w-md">
            Your AI-powered assistant that analyzes code snippets, explains them in plain language, and suggests optimized fixes.
          </p>
        </div>
      </div>
      
      {/* Right side: Auth Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-background">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
