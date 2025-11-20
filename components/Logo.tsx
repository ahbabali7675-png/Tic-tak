import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center group cursor-default shrink-0">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      {/* Main Shape */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10 drop-shadow-lg"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background glass */}
        <rect x="10" y="10" width="80" height="80" rx="16" className="fill-slate-900/90 stroke-slate-700/50" strokeWidth="2" />
        
        {/* Grid Lines */}
        <g className="filter drop-shadow-[0_0_3px_rgba(139,92,246,0.5)]">
          <path d="M38 22V78" stroke="url(#grad_logo)" strokeWidth="5" strokeLinecap="round" />
          <path d="M62 22V78" stroke="url(#grad_logo)" strokeWidth="5" strokeLinecap="round" />
          <path d="M22 38H78" stroke="url(#grad_logo)" strokeWidth="5" strokeLinecap="round" />
          <path d="M22 62H78" stroke="url(#grad_logo)" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* AI Node Center */}
        <circle cx="50" cy="50" r="5" className="fill-neon-blue animate-pulse-slow drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        
        <defs>
          <linearGradient id="grad_logo" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};