import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'full' | 'icon';
}

export const ShieldLogo: React.FC<LogoProps> = ({ size = 36, showText = true, className = '', style, variant = 'full' }) => {
  const logoSrc = variant === 'icon' ? '/assets/logo-icon.svg' : '/assets/logo.svg';
  
  if (variant === 'icon') {
    return (
      <img
        src={logoSrc}
        alt="ShieldWeb3"
        width={size}
        height={size}
        className={className}
        style={{ ...style, flexShrink: 0 }}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} style={style}>
      <img
        src="/assets/logo-icon.svg"
        alt="ShieldWeb3"
        width={size * 0.7}
        height={size * 0.7}
        style={{ flexShrink: 0 }}
      />
      {showText && (
        <span
          style={{
            fontFamily: '"Manrope", "Inter", sans-serif',
            letterSpacing: '-0.03em',
            fontSize: size * 0.5,
            fontWeight: 700,
            color: '#f5f5f5',
            lineHeight: 1,
          }}
        >
          Shield<span style={{ color: '#ef233c' }}>Web3</span>
        </span>
      )}
    </div>
  );
};
