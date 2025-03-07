
import React from 'react';
import { cn } from '@/lib/utils';
import { Code, Wand2, Info, Settings } from 'lucide-react';

interface SidebarProps {
  activeOption: string;
  onOptionChange: (option: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeOption, onOptionChange }) => {
  const options = [
    { id: 'explain', label: 'Explain Code', icon: <Info className="w-4 h-4 mr-2" /> },
    { id: 'refactor', label: 'Refactor', icon: <Wand2 className="w-4 h-4 mr-2" /> },
    { id: 'analyze', label: 'Analyze', icon: <Code className="w-4 h-4 mr-2" /> },
  ];

  return (
    <aside className="h-full w-48 md:w-64 bg-editor-sidebar border-r border-white/10 py-4 animate-fadeIn">
      <div className="px-4 pb-4 mb-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-muted-foreground">Actions</h2>
      </div>
      
      <nav className="space-y-1 px-2">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "sidebar-item",
              activeOption === option.id && "active"
            )}
            onClick={() => onOptionChange(option.id)}
            style={{ '--index': options.indexOf(option) } as React.CSSProperties}
          >
            {option.icon}
            <span>{option.label}</span>
          </div>
        ))}
      </nav>
      
      <div className="absolute bottom-4 px-6 w-full">
        <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
