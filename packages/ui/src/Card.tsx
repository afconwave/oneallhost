import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'surface-1' | 'surface-2';
  featured?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  elevation = 'surface-1',
  featured = false,
  children,
  ...props
}) => {
  const baseStyles = 'rounded border transition-colors';
  const elevationStyles = {
    flat: 'bg-white',
    'surface-1': 'bg-[#FAFAF9]',
    'surface-2': 'bg-[#F3F4F1]',
  };
  const borderStyles = featured
    ? 'border-2 border-[#1B6FC9]'
    : 'border border-[#EBEBE7]';

  return (
    <div
      className={twMerge(clsx(baseStyles, elevationStyles[elevation], borderStyles, 'p-5', className))}
      {...props}
    >
      {children}
    </div>
  );
};
