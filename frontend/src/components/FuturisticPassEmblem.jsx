import React, { useId } from 'react';

/**
 * Futuristic Luminous Concentric Emblem
 * Recreates the glowing sci-fi energy reactor ring from the reference VIP pass.
 * Uses unique SVG IDs via useId() to guarantee zero cross-card color pollution.
 */
const FuturisticPassEmblem = ({
    accent = '#9333EA',
    bright = '#D8B4FE',
    brightest = '#FFFFFF',
    glow = 'rgba(147, 51, 234, 0.65)',
    className = '',
    size = 175,
}) => {
    const rawId = useId();
    const id = rawId.replace(/[^a-zA-Z0-9]/g, '');

    const glowId = `emblemGlow_${id}`;
    const subtleGlowId = `subtleGlow_${id}`;
    const outerGradId = `outerGrad_${id}`;
    const innerGradId = `innerGrad_${id}`;
    const auraGradId = `auraGrad_${id}`;

    return (
        <div
            className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Ambient Radial Bloom */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-85 transition-all duration-300"
                style={{
                    background: `radial-gradient(circle, ${glow} 0%, rgba(0,0,0,0) 72%)`,
                }}
            />

            <svg
                viewBox="0 0 220 220"
                className="w-full h-full relative z-10 overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Multi-stage Glow Filter */}
                    <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                        <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id={subtleGlowId} x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Gradient for outer thick luminous ring */}
                    <linearGradient id={outerGradId} x1="15%" y1="10%" x2="85%" y2="90%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                        <stop offset="25%" stopColor={brightest} stopOpacity="1" />
                        <stop offset="55%" stopColor={bright} stopOpacity="1" />
                        <stop offset="85%" stopColor={accent} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={bright} stopOpacity="0.8" />
                    </linearGradient>

                    {/* Gradient for inner core ring */}
                    <linearGradient id={innerGradId} x1="10%" y1="90%" x2="90%" y2="10%">
                        <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="100%" stopColor={bright} stopOpacity="0.95" />
                    </linearGradient>

                    {/* Radial Aura */}
                    <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={bright} stopOpacity="0.6" />
                        <stop offset="60%" stopColor={accent} stopOpacity="0.2" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Soft Radial Backing Aura */}
                <circle cx="110" cy="110" r="95" fill={`url(#${auraGradId})`} />

                {/* Radiant 45° Light Streaks & Cosmic Particles matching Reference Image */}
                <g filter={`url(#${subtleGlowId})`}>
                    {/* Top right intense ray */}
                    <line x1="165" y1="55" x2="195" y2="25" stroke={bright} strokeWidth="3.5" strokeLinecap="round" opacity="0.95" />
                    <line x1="180" y1="78" x2="202" y2="56" stroke={bright} strokeWidth="2" strokeLinecap="round" opacity="0.8" />

                    {/* Bottom left intense ray */}
                    <line x1="55" y1="165" x2="25" y2="195" stroke={bright} strokeWidth="3.5" strokeLinecap="round" opacity="0.95" />
                    <line x1="40" y1="142" x2="18" y2="164" stroke={bright} strokeWidth="2" strokeLinecap="round" opacity="0.8" />

                    {/* Top left accent spark */}
                    <line x1="50" y1="62" x2="35" y2="47" stroke={bright} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />

                    {/* Bottom right accent spark */}
                    <line x1="172" y1="160" x2="188" y2="176" stroke={bright} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />

                    {/* Orbiting geometric sparks */}
                    <circle cx="178" cy="100" r="2.2" fill="#FFFFFF" opacity="0.95" />
                    <circle cx="42" cy="120" r="2.2" fill="#FFFFFF" opacity="0.95" />
                    <circle cx="128" cy="192" r="1.8" fill={bright} opacity="0.85" />
                    <circle cx="92" cy="28" r="1.8" fill={bright} opacity="0.85" />
                </g>

                {/* 1. Outermost Fine Dotted Tech Halo */}
                <circle
                    cx="110"
                    cy="110"
                    r="88"
                    fill="none"
                    stroke={accent}
                    strokeWidth="1.2"
                    strokeDasharray="3 7"
                    strokeOpacity="0.45"
                    className="animate-spin-slow origin-center"
                />

                {/* 2. Main Luminous Thick Concentric Ring */}
                {/* Slightly vertical oval rx=68, ry=76 for that imposing, royal futuristic reactor look */}
                <ellipse
                    cx="110"
                    cy="110"
                    rx="68"
                    ry="76"
                    fill="none"
                    stroke={`url(#${outerGradId})`}
                    strokeWidth="24"
                    filter={`url(#${glowId})`}
                />

                {/* Specular Pure White Arc on the upper curve */}
                <path
                    d="M 68 80 A 68 76 0 0 1 152 80"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    opacity="0.9"
                    filter={`url(#${subtleGlowId})`}
                />

                {/* 3. Dark Concentric Spacer Gap */}
                <ellipse
                    cx="110"
                    cy="110"
                    rx="50"
                    ry="58"
                    fill="#070611"
                    stroke={accent}
                    strokeWidth="1.8"
                    strokeOpacity="0.7"
                />

                {/* 4. Inner Glowing Ring */}
                <ellipse
                    cx="110"
                    cy="110"
                    rx="37"
                    ry="44"
                    fill="none"
                    stroke={`url(#${innerGradId})`}
                    strokeWidth="14"
                    filter={`url(#${glowId})`}
                />

                {/* 5. Innermost Dark Core Aperture */}
                <ellipse
                    cx="110"
                    cy="110"
                    rx="24"
                    ry="30"
                    fill="#030208"
                    stroke={bright}
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                />

                {/* Central Specular Energy Core Dot */}
                <circle
                    cx="110"
                    cy="110"
                    r="4"
                    fill="#FFFFFF"
                    opacity="0.95"
                    filter={`url(#${subtleGlowId})`}
                />
            </svg>
        </div>
    );
};

export default FuturisticPassEmblem;
