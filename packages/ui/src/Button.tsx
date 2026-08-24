import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'outline', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1B6FC9] focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';
    
    // Thin UI sizes: sm (32px), md (38px), lg (42px)
    const sizeStyles = {
      sm: 'h-8 px-3 text-xs tracking-tight gap-1.5',
      md: 'h-[38px] px-4 text-sm tracking-tight gap-2',
      lg: 'h-10 px-5 text-sm tracking-tight gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-[#0D3B85] hover:bg-[#1B6FC9] text-white border border-transparent shadow-none',
      secondary: 'bg-[#1B6FC9] hover:bg-[#0D3B85] text-white border border-transparent',
      outline: 'bg-white hover:bg-[#FAFAF9] text-[#111111] border border-[#DCDDD8] hover:border-[#6B6E68]',
      ghost: 'bg-transparent hover:bg-[#F3F4F1] text-[#111111] border border-transparent',
      danger: 'bg-white hover:bg-red-50 text-red-700 border border-red-200 hover:border-red-400',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
