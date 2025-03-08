
import React from 'react';
import { cn } from '@/lib/utils';

interface PatternBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dots' | 'grid';
  dotSize?: number;
  dotColor?: string;
  className?: string;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  variant = 'grid',
  dotSize = 1,
  dotColor = 'currentColor',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'absolute inset-0 opacity-10',
        variant === 'dots' ? 'bg-grid-dots' : 'bg-grid-pattern',
        className
      )}
      style={{
        backgroundSize: variant === 'dots' ? `${dotSize * 20}px ${dotSize * 20}px` : '100px 100px',
        backgroundImage: 
          variant === 'dots' 
            ? `radial-gradient(${dotColor} 1px, transparent 1px)` 
            : `linear-gradient(to right, ${dotColor} 1px, transparent 1px), 
               linear-gradient(to bottom, ${dotColor} 1px, transparent 1px)`,
      }}
      {...props}
    />
  );
};
