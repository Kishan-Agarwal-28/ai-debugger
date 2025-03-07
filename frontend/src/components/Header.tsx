
import React from 'react';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-white/10 bg-editor-lighter bg-opacity-20 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-14 px-4 md:px-6 animate-fadeIn">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-code-blue" />
          <span className="font-semibold text-lg tracking-tight">CodeClarity</span>
        </div>
        
        <nav className="flex items-center gap-4">
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
