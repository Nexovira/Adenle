import React from 'react';

interface NexoviraLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  showTagline?: boolean;
  taglineClassName?: string;
}

export const NexoviraLogo: React.FC<NexoviraLogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  textClassName = 'text-xl font-bold tracking-tight',
  showTagline = false,
  taglineClassName = 'text-[10px] sm:text-xs font-semibold text-cyan-500 dark:text-cyan-400',
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Emblem mirroring the official angular "N" shield mark */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="nexovira-cyan-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A5F3FC" />
              <stop offset="35%" stopColor="#00F0FF" />
              <stop offset="70%" stopColor="#00B4D8" />
              <stop offset="100%" stopColor="#0077B6" />
            </linearGradient>
            <linearGradient id="nexovira-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0077B6" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Shield Trace */}
          <path
            d="M 25 35 L 100 15 L 175 35 L 175 125 L 100 180 L 25 125 Z"
            fill="#050C1A"
            stroke="url(#nexovira-cyan-main)"
            strokeWidth="3"
            strokeOpacity="0.6"
          />

          {/* Stylized Geometric N Shield Struts */}
          {/* Left Wing Pillar */}
          <path
            d="M 40 45 L 75 45 L 75 130 L 40 110 Z"
            fill="url(#nexovira-cyan-main)"
          />

          {/* Diagonal Bridge */}
          <path
            d="M 65 45 L 160 120 L 160 145 L 125 145 L 40 70 Z"
            fill="url(#nexovira-cyan-main)"
          />

          {/* Right Wing Pillar */}
          <path
            d="M 125 45 L 160 45 L 160 115 L 125 140 Z"
            fill="url(#nexovira-cyan-main)"
          />

          {/* Top Inverted Specular Notch */}
          <path
            d="M 85 28 L 115 28 L 100 48 Z"
            fill="#38BDF8"
          />

          {/* Bottom Accent Bar */}
          <path
            d="M 75 138 L 100 155 L 125 138 L 100 122 Z"
            fill="url(#nexovira-cyan-main)"
          />

          {/* Ambient Flare Trace Line */}
          <line x1="20" y1="185" x2="180" y2="185" stroke="url(#nexovira-glow)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-extrabold tracking-wider bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 dark:from-white dark:via-cyan-300 dark:to-cyan-400 bg-clip-text text-transparent uppercase ${textClassName}`}>
            NEXOVIRA
          </span>
          {showTagline && (
            <span className={`tracking-normal leading-tight max-w-[280px] sm:max-w-xs ${taglineClassName}`}>
              Innovation begins with vision. Smart living, better every day.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
