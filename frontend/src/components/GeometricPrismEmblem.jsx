import React from 'react';

/**
 * GeometricPrismEmblem
 * A sophisticated, abstract geometric crystalline prism emblem for the KALAM 2026 digital pass.
 * Inspired by crystalline refraction, advanced technology, and high-end collectible editorial design.
 */
const GeometricPrismEmblem = ({
    primary = 'var(--pass-artwork, #8B5CF6)',
    secondary = 'var(--pass-secondary, #C4B5FD)',
    className = '',
    size = 140,
}) => {
    return (
        <div
            className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            {/* Subtle controlled ambient luminescence */}
            <div
                className="absolute inset-2 rounded-full opacity-35 blur-xl pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`
                }}
            />

            <svg
                viewBox="0 0 160 160"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Linear gradient for faceted crystalline faces */}
                    <linearGradient id="prismFaceA" x1="80" y1="20" x2="135" y2="85" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={secondary} stopOpacity="0.45" />
                        <stop offset="100%" stopColor={primary} stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="prismFaceB" x1="80" y1="20" x2="25" y2="85" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={secondary} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={primary} stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="prismFaceC" x1="80" y1="140" x2="135" y2="85" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={primary} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={secondary} stopOpacity="0.12" />
                    </linearGradient>
                    <linearGradient id="prismFaceD" x1="80" y1="140" x2="25" y2="85" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={secondary} stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="prismCore" x1="50" y1="50" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={secondary} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={primary} stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {/* Outer delicate coordinate circle */}
                <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke={secondary}
                    strokeWidth="0.75"
                    strokeDasharray="2 4"
                    opacity="0.35"
                />

                {/* Subtle orbital diamond */}
                <polygon
                    points="80,14 146,80 80,146 14,80"
                    stroke={primary}
                    strokeWidth="0.85"
                    opacity="0.4"
                />

                {/* Faceted Prism Polygons */}
                {/* Top-Right Facet */}
                <polygon
                    points="80,24 130,80 80,80"
                    fill="url(#prismFaceA)"
                    stroke={secondary}
                    strokeWidth="0.75"
                    opacity="0.8"
                />

                {/* Top-Left Facet */}
                <polygon
                    points="80,24 30,80 80,80"
                    fill="url(#prismFaceB)"
                    stroke={secondary}
                    strokeWidth="0.75"
                    opacity="0.7"
                />

                {/* Bottom-Right Facet */}
                <polygon
                    points="80,136 130,80 80,80"
                    fill="url(#prismFaceC)"
                    stroke={primary}
                    strokeWidth="0.75"
                    opacity="0.85"
                />

                {/* Bottom-Left Facet */}
                <polygon
                    points="80,136 30,80 80,80"
                    fill="url(#prismFaceD)"
                    stroke={primary}
                    strokeWidth="0.75"
                    opacity="0.75"
                />

                {/* Inner Central Geometric Rhombus */}
                <polygon
                    points="80,50 102,80 80,110 58,80"
                    fill="url(#prismCore)"
                    stroke={secondary}
                    strokeWidth="1.25"
                    opacity="0.9"
                />

                {/* Central Horizontal & Vertical Structural Lines */}
                <line x1="22" y1="80" x2="138" y2="80" stroke={secondary} strokeWidth="0.75" opacity="0.5" />
                <line x1="80" y1="20" x2="80" y2="140" stroke={primary} strokeWidth="0.75" opacity="0.5" />

                {/* 4 Precision Corner Tick Accents */}
                <circle cx="80" cy="24" r="1.75" fill={secondary} />
                <circle cx="130" cy="80" r="1.75" fill={secondary} />
                <circle cx="80" cy="136" r="1.75" fill={secondary} />
                <circle cx="30" cy="80" r="1.75" fill={secondary} />
                <circle cx="80" cy="80" r="2.5" fill="#FFFFFF" opacity="0.95" />
            </svg>
        </div>
    );
};

export default GeometricPrismEmblem;
