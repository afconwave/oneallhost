import React from 'react';

export interface BrandLogoProps {
  variant?: 'horizontal' | 'stacked' | 'mark-only';
  height?: number;
  className?: string;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  height = 42,
  className = '',
  alt = 'Oneallhost',
}) => {
  const getLogoSrc = () => {
    switch (variant) {
      case 'mark-only':
        return '/brand/logo-mark.png';
      case 'stacked':
        return '/brand/logo-stacked.png';
      case 'horizontal':
      default:
        return '/brand/logo-horizontal.png';
    }
  };

  return (
    <img
      src={getLogoSrc()}
      alt={alt}
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'inline-block',
      }}
      className={`select-none ${className}`}
      loading="eager"
    />
  );
};
