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
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none max-w-full text-center leading-tight active:scale-[0.98]';

    // Touch-friendly responsive sizes
    const sizeStyles = {
      sm: 'min-h-[32px] sm:min-h-[34px] px-3 py-1.5 text-xs tracking-tight gap-1.5',
      md: 'min-h-[38px] sm:min-h-[42px] px-4 py-2 text-xs sm:text-sm tracking-tight gap-2',
      lg: 'min-h-[44px] sm:min-h-[48px] px-5 sm:px-6 py-2.5 text-sm sm:text-base tracking-tight gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-[#0D3B85] hover:bg-[#1B6FC9] text-white border border-transparent shadow-xs hover:shadow-md',
      secondary: 'bg-[#7CB342] hover:bg-[#4E7525] text-white border border-transparent shadow-xs',
      outline: 'bg-white hover:bg-surface-1 text-ink border border-strong hover:border-[#0D3B85]',
      ghost: 'bg-transparent hover:bg-surface-2 text-ink border border-transparent',
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
