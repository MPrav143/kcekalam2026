import React, { useId } from 'react';

/**
 * FuturisticPassFrame
 * Recreates the exact multi-layered angular outer frame from the
 * "Neon KALAM 2026 VIP Pass" reference image.
 *
 * Features:
 * - Asymmetrical 2:3 silhouette with clipped corners & stepped edges
 * - Multi-layered dual outline: thin white/lavender structural outline + vivid neon violet/magenta outer border
 * - Concentrated neon hotspots near corners and border junctions
 * - Bottom-right 3D metallic bevel wedge bracket with specular highlight
 * - Upper-right rail notch for vertical "✦ 2026"
 * - Diagonal hatch mark decorations on the top-left outer bevel
 * - Header framing separator line with glowing accent node
 */
const FuturisticPassFrame = ({
    primary = 'var(--pass-primary, #A100FF)',
    secondary = 'var(--pass-secondary, #E02BFF)',
    accent = 'var(--pass-accent, #7C2BFF)',
    border = 'var(--pass-border, #F2E9FF)',
    glow = 'var(--pass-glow, rgba(161, 0, 255, 0.7))',
}) => {
    const rawId = useId();
    const id = rawId.replace(/[^a-zA-Z0-9]/g, '');

    const frameGlowId = `frameGlow_${id}`;
    const hotspotGlowId = `hotspotGlow_${id}`;
    const cardSurfaceGradId = `cardSurfaceGrad_${id}`;
    const metallicBevelGradId = `metallicBevelGrad_${id}`;
    const gridPatternId = `gridPattern_${id}`;

    return (
        <svg
            viewBox="0 0 1024 1536"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible"
            preserveAspectRatio="none"
        >
            <defs>
                {/* Primary Neon Bloom Filter */}
                <filter id={frameGlowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                    <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Hotspot / Specular Flare Filter */}
                <filter id={hotspotGlowId} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Cyber Card Dark Surface Gradient */}
                <linearGradient id={cardSurfaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
                    <stop offset="30%" stopColor="#080822" stopOpacity="0.98" />
                    <stop offset="70%" stopColor="#05051B" stopOpacity="0.99" />
                    <stop offset="100%" stopColor="#030310" stopOpacity="0.98" />
                </linearGradient>

                {/* 3D Metallic Corner Bevel Gradient */}
                <linearGradient id={metallicBevelGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="25%" stopColor={border} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={secondary} stopOpacity="0.85" />
                    <stop offset="75%" stopColor={accent} stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#080822" stopOpacity="1" />
                </linearGradient>

                {/* Micro tech pattern */}
                <pattern id={gridPatternId} width="40" height="40" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="40" x2="40" y2="0" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
                    <circle cx="20" cy="20" r="0.8" fill="rgba(255,255,255,0.03)" />
                </pattern>
            </defs>

            {/* 1. Main Outer Ticket Surface (filled dark card body) */}
            <path
                d="M 68 140 
                   L 125 78 
                   L 490 78 
                   L 535 48 
                   L 865 48 
                   L 920 102 
                   L 920 440 
                   L 970 488 
                   L 970 1060 
                   L 928 1102 
                   L 928 1295 
                   L 860 1455 
                   L 155 1455 
                   L 68 1368 
                   L 68 640 
                   L 52 624 
                   L 52 576 
                   L 68 560 
                   Z"
                fill={`url(#${cardSurfaceGradId})`}
            />

            {/* Micro grid texture overlay */}
            <path
                d="M 68 140 
                   L 125 78 
                   L 490 78 
                   L 535 48 
                   L 865 48 
                   L 920 102 
                   L 920 440 
                   L 970 488 
                   L 970 1060 
                   L 928 1102 
                   L 928 1295 
                   L 860 1455 
                   L 155 1455 
                   L 68 1368 
                   L 68 640 
                   L 52 624 
                   L 52 576 
                   L 68 560 
                   Z"
                fill={`url(#${gridPatternId})`}
                opacity="0.8"
            />

            {/* 2. Top-Left Stepped Outer Bracket Detail with Diagonal Hatch Marks (//) */}
            <path
                d="M 52 230 L 52 130 L 115 68 L 220 68"
                stroke={secondary}
                strokeWidth="2.5"
                fill="none"
                opacity="0.75"
            />
            {/* Top-left decorative diagonal hatch marks */}
            <line x1="74" y1="116" x2="86" y2="104" stroke={border} strokeWidth="2" strokeOpacity="0.8" />
            <line x1="84" y1="106" x2="96" y2="94" stroke={border} strokeWidth="2" strokeOpacity="0.8" />

            {/* 3. Outer Illuminated Neon Border (stepped silhouette with neon bloom) */}
            <path
                d="M 68 140 
                   L 125 78 
                   L 490 78 
                   L 535 48 
                   L 865 48 
                   L 920 102 
                   L 920 440 
                   L 970 488 
                   L 970 1060 
                   L 928 1102 
                   L 928 1295 
                   L 860 1455 
                   L 155 1455 
                   L 68 1368 
                   L 68 640 
                   L 52 624 
                   L 52 576 
                   L 68 560 
                   Z"
                stroke={primary}
                strokeWidth="3.4"
                fill="none"
                filter={`url(#${frameGlowId})`}
                opacity="0.95"
            />

            {/* Crisp outer hairline for sharp edge resolution */}
            <path
                d="M 68 140 
                   L 125 78 
                   L 490 78 
                   L 535 48 
                   L 865 48 
                   L 920 102 
                   L 920 440 
                   L 970 488 
                   L 970 1060 
                   L 928 1102 
                   L 928 1295 
                   L 860 1455 
                   L 155 1455 
                   L 68 1368 
                   L 68 640 
                   L 52 624 
                   L 52 576 
                   L 68 560 
                   Z"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeOpacity="0.45"
                fill="none"
            />

            {/* 4. Second Inset White/Lavender Structural Outline (following ticket shape) */}
            <path
                d="M 88 152 
                   L 138 98 
                   L 480 98 
                   L 522 68 
                   L 852 68 
                   L 902 118 
                   L 902 430 
                   L 950 478 
                   L 950 1050 
                   L 910 1090 
                   L 910 1285 
                   L 848 1435 
                   L 168 1435 
                   L 88 1355 
                   L 88 630 
                   L 78 620 
                   L 78 580 
                   L 88 570 
                   Z"
                stroke={border}
                strokeWidth="1.8"
                strokeOpacity="0.8"
                fill="none"
            />

            {/* 5. Bottom-Right 3D Metallic Wedge Bracket (Major Reference Feature) */}
            <g id="bottomRightBracket">
                <path
                    d="M 910 1090 
                       L 950 1050 
                       L 980 1080 
                       L 980 1260 
                       L 890 1440 
                       L 840 1440 
                       L 848 1390 
                       L 910 1260 
                       Z"
                    fill={`url(#${metallicBevelGradId})`}
                    filter={`url(#${hotspotGlowId})`}
                />
                <path
                    d="M 910 1260 L 980 1260 L 890 1440 L 848 1390 Z"
                    fill={accent}
                    opacity="0.65"
                />
                <line
                    x1="980"
                    y1="1260"
                    x2="890"
                    y2="1440"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter={`url(#${hotspotGlowId})`}
                />
            </g>

            {/* 6. Top Header Angular Separator Line (Framing under VIP ACCESS badge) */}
            <path
                d="M 88 175 
                   L 480 175 
                   L 535 230 
                   L 870 230"
                stroke={secondary}
                strokeWidth="2.2"
                strokeOpacity="0.85"
                fill="none"
                filter={`url(#${hotspotGlowId})`}
            />
            {/* Glowing Accent Node at the angle */}
            <circle cx="535" cy="230" r="3.5" fill="#FFFFFF" filter={`url(#${hotspotGlowId})`} />

            {/* 7. Neon Hotspots at Strategic Junctions & Corners */}
            <g filter={`url(#${hotspotGlowId})`}>
                <circle cx="125" cy="78" r="3" fill="#FFFFFF" />
                <circle cx="535" cy="48" r="3" fill="#FFFFFF" />
                <circle cx="920" cy="102" r="3" fill="#FFFFFF" />
                <circle cx="970" cy="488" r="3" fill="#FFFFFF" />
                <circle cx="928" cy="1102" r="3" fill="#FFFFFF" />
                <circle cx="155" cy="1455" r="3" fill="#FFFFFF" />
                <circle cx="68" cy="1368" r="3" fill="#FFFFFF" />
            </g>

            {/* Specular Highlights on key bevels */}
            <line x1="125" y1="78" x2="320" y2="78" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.85" strokeLinecap="round" />
            <line x1="535" y1="48" x2="720" y2="48" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.85" strokeLinecap="round" />
            <line x1="155" y1="1455" x2="380" y2="1455" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />

            {/* Left rail notch lines */}
            <line x1="52" y1="585" x2="68" y2="585" stroke={secondary} strokeWidth="2" strokeOpacity="0.85" />
            <line x1="52" y1="615" x2="68" y2="615" stroke={secondary} strokeWidth="2" strokeOpacity="0.85" />
        </svg>
    );
};

export default FuturisticPassFrame;
