import React, { useState } from 'react';
import nexoviraLogoImg from '../assets/nexovira.jpeg';

interface NexoviraLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  showTagline?: boolean;
  taglineClassName?: string;
  imgClassName?: string;
}

export const NexoviraLogo: React.FC<NexoviraLogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  textClassName = 'text-xl font-bold tracking-tight',
  showTagline = false,
  taglineClassName = 'text-[10px] sm:text-xs font-semibold text-cyan-500 dark:text-cyan-400',
  imgClassName = '',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Nexovira Logo Image from /assets/nexovira.jpeg */}
      <div 
        className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-slate-950/40 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition-transform duration-300 hover:scale-105"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img
          src={imgError ? '/nexovira.jpeg' : (nexoviraLogoImg || '/nexovira.jpeg')}
          alt="NEXOVIRA Logo"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover rounded-xl ${imgClassName}`}
        />
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
