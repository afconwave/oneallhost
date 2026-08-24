import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'info' | 'neutral' | 'warning' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-tight border select-none';

  const variantStyles = {
    // Green rationed strictly for active/success
    success: 'bg-[#F3F8EC] text-[#4E7525] border-[#D6E8C2]',
    info: 'bg-[#EDF5FD] text-[#135194] border-[#CCE2FA]',
    neutral: 'bg-[#FAFAF9] text-[#6B6E68] border-[#EBEBE7]',
    warning: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variantStyles[variant], className))} {...props}>
      {children}
    </span>
  );
};
