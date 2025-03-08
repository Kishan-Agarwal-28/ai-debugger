
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Terminal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <header className={cn(
      "w-full border-b border-white/10 backdrop-blur-sm", 
      isLandingPage ? "bg-transparent" : "bg-editor-lighter bg-opacity-20"
    )}>
      <div className="container flex items-center justify-between h-14 px-4 md:px-6 animate-fadeIn">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-code-blue" />
          <Link to="/" className="font-semibold text-lg tracking-tight">CodeClarity</Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link 
            to="/app" 
            className={cn(
              "text-sm font-medium transition-colors",
              "hover:text-primary opacity-70 hover:opacity-100"
            )}
          >
            {isLandingPage ? "Launch App" : "Dashboard"}
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "text-sm font-medium transition-colors",
              "hover:text-primary opacity-70 hover:opacity-100"
            )}
          >
            GitHub
          </a>
          <a 
            href="#" 
            className={cn(
              "text-sm font-medium transition-colors",
              "hover:text-primary opacity-70 hover:opacity-100"
            )}
          >
            Documentation
          </a>
          {isLandingPage ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" size="sm">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
