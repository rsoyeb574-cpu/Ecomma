import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2 group ${className}`} aria-label="Ecomma Home">
      {/* Animated SVG Icon with shopping-bag notch on the 'E' */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Rounded base badge */}
          <rect width="100" height="100" rx="24" fill="#0F1B2D" />
          
          {/* Saffron bag handle arch */}
          <path
            d="M38 34C38 24.5 43.5 18 50 18C56.5 18 62 24.5 62 34"
            stroke="#F59E0B"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Letter E with shopping bag cutout notch */}
          <path
            d="M30 32H70V44H44V50H64V60H44V68H70V78H30V32Z"
            fill="#FBF7F0"
          />

          {/* Saffron notch accent dot inside the bag cutout */}
          <circle cx="56" cy="55" r="4" fill="#FF6B4A" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-tight text-[#0F1B2D] ${sizeClasses[size]}`}>
          Ecomma
        </span>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-widest text-[#FF6B4A] font-semibold mt-0.5">
            List · Sell · Deliver
          </span>
        )}
      </div>
    </Link>
  );
};
