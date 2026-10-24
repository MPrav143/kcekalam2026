import React, { useId } from 'react';

export default function KalamPassSymbol({
    accent = 'var(--pass-primary, #A100FF)',
    bright = 'var(--pass-secondary, #E02BFF)',
    glow = 'var(--pass-glow, rgba(161, 0, 255, 0.7))',
    className = '',
    size = 180,
    customLogo = '',
}) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, '');

    return (
        <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
            style={{ width: size, height: size }}>
            <div className="absolute inset-0 rounded-full blur-2xl opacity-80"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 72%)` }} />
            <div className="absolute inset-5 rounded-full blur-xl opacity-60"
                style={{ background: `radial-gradient(circle, ${bright} 0%, transparent 68%)` }} />
            <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
                <defs>
                    <filter id={`rayGlow${id}`} x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                <g filter={`url(#rayGlow${id})`} stroke={bright} strokeLinecap="round">
                    <path d="M160 58 198 20 M176 80 206 50 M60 162 22 200 M44 140 16 168"
                        strokeWidth="3" opacity=".9" />
                    <path d="M52 64 34 46 M168 158 190 180" strokeWidth="2" opacity=".7" />
                    <circle cx="180" cy="98" r="2" fill="#fff" stroke="none" />
                    <circle cx="40" cy="122" r="2" fill="#fff" stroke="none" />
                </g>
            </svg>
            {customLogo ? (
                <img src={customLogo} alt="Pass emblem" className="relative z-10 w-[78%] h-[78%] object-contain"
                    style={{ filter: `drop-shadow(0 0 12px ${bright}) drop-shadow(0 0 26px ${glow})` }} />
            ) : (
                <div className="relative z-10 flex items-center justify-center font-heading font-black text-2xl"
                    style={{ color: bright, textShadow: `0 0 16px ${glow}` }}>
                    K
                </div>
            )}
        </div>
    );
}
