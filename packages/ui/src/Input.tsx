import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-medium text-[#111111] select-none">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={twMerge(
            clsx(
              'h-[38px] px-3.5 bg-[#FFFFFF] hover:bg-[#FAFAF9] focus:bg-[#FFFFFF] text-[#111111] placeholder:text-[#6B6E68] text-sm rounded border border-[#DCDDD8] focus:border-[#1B6FC9] focus:outline-none transition-colors duration-150',
              error && 'border-red-500 focus:border-red-600',
              className
            )
          )}
          {...props}
        />
        {hint && !error ? <span className="text-[11px] text-[#6B6E68]">{hint}</span> : null}
        {error ? <span className="text-[11px] text-red-600 font-medium">{error}</span> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
