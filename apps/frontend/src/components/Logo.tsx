import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ShieldLogo: React.FC<LogoProps> = ({ size = 36, showText = true, className = '', style }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} style={style}>
      <div
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background: '#ef233c',
          borderRadius: 3,
          transform: 'rotate(45deg)',
          flexShrink: 0,
        }}
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
