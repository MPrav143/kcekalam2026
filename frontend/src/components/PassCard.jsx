import React from 'react';
import { Crown, ArrowRight, Check, Edit, Trash2, Gem, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { buildDynamicPassTheme } from '../utils/passColorUtils';

// Mandatory Shared Emblem Image URL
export const SHARED_EMBLEM_URL = 'https://ik.imagekit.io/kalam/Pass%20Card/Neon_Faceted_Abstract_Emblem-removebg-preview.png';

/**
 * DIAMOND PASS — Reference Color Palette
 */
export const TECHNICAL_PASS_THEME = {
    id: 'midnight-ice',
    title: 'TECHNICAL PASS',
    mainBg: '#06152B',
    bgGradient: 'linear-gradient(180deg, #06152B 0%, #020914 100%)',
    outerBorder: '#31DFFF',
    borderGlow: '#59BFFF',
    cardShadow: 'rgba(0, 0, 0, 0.45)',
    glowRgba: 'rgba(49, 223, 255, 0.35)',
    crownIcon: '#31DFFF',
    kalamText: '#FFFFFF',
    yearHighlight: '#FFE6A0',
    badgeBg: '#06152B',
    badgeBorder: '#31DFFF',
    badgeText: '#FFFFFF',
    divider: '#31DFFF',
    tagline: '#E5E7EB',
    titleColor: '#FFFFFF',
    titleGradientAccent: '#FFFFFF',
    pricePanelBg: '#041326',
    pricePanelBorder: '#43CFFF',
    priceText: '#FFFFFF',
    priceHighlight: '#FFE6A0',
    perPersonText: '#E5E7EB',
    privilegesHeading: '#FFE6A0',
    diamondIcon: '#FFE6A0',
    checkmarkCircle: '#31DFFF',
    checkmarkIcon: '#041326',
    privilegeText: '#F3F4F6',
    ctaGradient: 'linear-gradient(135deg, #8BE7FF 0%, #168BFF 100%)',
    ctaText: '#041326',
    ribbonColor: '#087BCE',
    emblemGlow: 'rgba(49, 223, 255, 0.35)',
    glitterColor: '#79CFFF',
    doodleColor: '#31DFFF',
    showGlitter: true,
    showDoodles: true,
    doodleOpacity: 0.28
};

/**
 * GOLD PASS — Reference Emerald Green + Gold Theme
 */
export const CULTURAL_PASS_THEME = {
    id: 'emerald-gold',
    title: 'CULTURAL PASS',
    mainBg: '#03251A',
    bgGradient: 'linear-gradient(180deg, #06402B 0%, #01140E 100%)',
    outerBorder: '#D4AF37',
    borderGlow: '#FFD76A',
    cardShadow: 'rgba(0, 0, 0, 0.45)',
    glowRgba: 'rgba(255, 215, 106, 0.35)',
    crownIcon: '#F4C95D',
    kalamText: '#F5F1E5',
    yearHighlight: '#FFE6A0',
    badgeBg: '#03251A',
    badgeBorder: '#D4AF37',
    badgeText: '#FFE6A0',
    divider: '#B89636',
    tagline: '#D6DDD7',
    titleColor: '#FFE6A0',
    titleGradientAccent: '#FFE6A0',
    pricePanelBg: '#04281C',
    pricePanelBorder: '#D4AF37',
    priceText: '#FFE6A0',
    priceHighlight: '#FFE6A0',
    perPersonText: '#F5F1E5',
    privilegesHeading: '#F4C95D',
    diamondIcon: '#F4C95D',
    checkmarkCircle: '#E9BC4B',
    checkmarkIcon: '#012016',
    privilegeText: '#F5F1E5',
    ctaGradient: 'linear-gradient(135deg, #FFE6A0 0%, #D4AF37 100%)',
    ctaText: '#012016',
    ribbonColor: '#08734B',
    emblemGlow: 'rgba(255, 215, 106, 0.35)',
    glitterColor: '#FFE6A0',
    doodleColor: '#D4AF37',
    showGlitter: true,
    showDoodles: true,
    doodleOpacity: 0.28
};

/**
 * Resolve theme for a pass dynamically with support for all admin color customizations
 */
export const getPassTheme = (pass, variantIndex = 0) => {
    return buildDynamicPassTheme(pass, variantIndex);
};

/**
 * Backwards compatibility helper for existing color lookups
 */
export const getColorStyles = (colorInput) => {
    const c = String(colorInput || '').toLowerCase().trim();
    if (c.includes('gold') || c.includes('green') || c.includes('yellow') || c === '#d4af37') {
        return {
            border: 'border-[#D4AF37]',
            bg: 'bg-[#03251A]',
            primaryAccent: '#D4AF37'
        };
    }
    return {
        border: 'border-[#31DFFF]',
        bg: 'bg-[#06152B]',
        primaryAccent: '#31DFFF'
    };
};

/**
 * Premium Glitter & Twinkling Sparkle Particles
 * Non-intrusive, artistic metallic glitter responsive to configured glitterColor.
 */
const PassGlitter = ({ color = '#FFE6A0' }) => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Subtle glitter particle cluster 1 - Top Left */}
        <svg className="absolute top-5 left-5 w-16 h-16 animate-pulse" viewBox="0 0 50 50" fill="none">
            <circle cx="25" cy="25" r="1.5" fill={color} opacity="0.85" />
            <path d="M25 18 L25 32 M18 25 L32 25" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.65" />
            <circle cx="10" cy="15" r="1" fill={color} opacity="0.6" />
            <circle cx="38" cy="35" r="1.2" fill={color} opacity="0.75" />
        </svg>

        {/* Subtle glitter particle cluster 2 - Top Right Sparkle */}
        <svg className="absolute top-24 right-7 w-12 h-12 animate-pulse" style={{ animationDelay: '1s' }} viewBox="0 0 50 50" fill="none">
            <path d="M25 16 L27 23 L34 25 L27 27 L25 34 L23 27 L16 25 L23 23 Z" fill={color} opacity="0.8" />
            <circle cx="12" cy="38" r="1" fill={color} opacity="0.5" />
        </svg>

        {/* Subtle glitter particle cluster 3 - Mid Left */}
        <svg className="absolute bottom-28 left-6 w-14 h-14 animate-pulse" style={{ animationDelay: '1.8s' }} viewBox="0 0 50 50" fill="none">
            <circle cx="20" cy="20" r="1.5" fill={color} opacity="0.75" />
            <path d="M20 13 L20 27 M13 20 L27 20" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            <circle cx="35" cy="38" r="1" fill={color} opacity="0.55" />
            <circle cx="8" cy="35" r="0.8" fill={color} opacity="0.45" />
        </svg>

        {/* Subtle glitter particle cluster 4 - Bottom Right Diamond Star */}
        <svg className="absolute bottom-12 right-10 w-10 h-10 animate-pulse" style={{ animationDelay: '0.8s' }} viewBox="0 0 40 40" fill="none">
            <path d="M20 14 L21.5 18.5 L26 20 L21.5 21.5 L20 26 L18.5 21.5 L14 20 L18.5 18.5 Z" fill={color} opacity="0.75" />
        </svg>
    </div>
);

/**
 * Elegant Doodles for Pass Cards
 * Constellations, fine orbital rings, geometric scientific outlines, and decorative festival patterns.
 * Stays cleanly behind card content and adapts dynamically to theme.doodleColor and theme.doodleOpacity.
 */
const PassDoodles = ({ color = '#D4AF37', opacity = 0.28 }) => (
    <div
        className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem] z-0 select-none transition-opacity duration-300"
        style={{ opacity }}
        aria-hidden="true"
    >
        {/* Constellations & Orbit Rings (Top Right) */}
        <svg className="absolute -top-6 -right-6 w-52 h-52" viewBox="0 0 200 200" fill="none">
            <circle cx="160" cy="40" r="60" stroke={color} strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
            <circle cx="160" cy="40" r="90" stroke={color} strokeWidth="0.8" opacity="0.35" />
            <circle cx="160" cy="40" r="120" stroke={color} strokeWidth="0.5" strokeDasharray="2 6" opacity="0.25" />
            <circle cx="100" cy="40" r="2.5" fill={color} opacity="0.8" />
            <circle cx="160" cy="130" r="2" fill={color} opacity="0.7" />
            <circle cx="205" cy="95" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.7" />
            {/* 4-point decorative sparkle star */}
            <path d="M70 20 L73 28 L81 30 L73 32 L70 40 L67 32 L59 30 L67 28 Z" fill={color} opacity="0.55" />
        </svg>

        {/* Elegant Dynamic Swirls & Technical Arcs (Bottom Left) */}
        <svg className="absolute -bottom-8 -left-8 w-60 h-60" viewBox="0 0 240 240" fill="none">
            <path
                d="M10 230 C 50 170, 110 130, 200 80"
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
            />
            <path
                d="M20 240 C 70 190, 140 160, 230 130"
                stroke={color}
                strokeWidth="1"
                opacity="0.4"
            />
            {/* Swirl spiral accent */}
            <path
                d="M60 160 C 75 145, 95 155, 90 175 C 85 190, 65 185, 70 170"
                stroke={color}
                strokeWidth="1"
                fill="none"
                opacity="0.5"
            />
            {/* Constellation node line */}
            <line x1="120" y1="190" x2="160" y2="170" stroke={color} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
            <circle cx="120" cy="190" r="2" fill={color} opacity="0.8" />
            <circle cx="160" cy="170" r="2" fill={color} opacity="0.8" />
            <line x1="160" y1="170" x2="190" y2="200" stroke={color} strokeWidth="0.8" opacity="0.4" />
            <circle cx="190" cy="200" r="2.5" fill={color} opacity="0.8" />
            <circle cx="190" cy="200" r="5" stroke={color} strokeWidth="0.75" fill="none" opacity="0.5" />
        </svg>

        {/* Abstract Geometry & Scientific Coordinates (Center Right) */}
        <svg className="absolute top-1/2 -right-4 -translate-y-1/2 w-32 h-32" viewBox="0 0 120 120" fill="none">
            <path d="M60 30 L63 50 L83 53 L63 56 L60 76 L57 56 L37 53 L57 50 Z" fill={color} opacity="0.38" />
            <circle cx="30" cy="80" r="1.5" fill={color} opacity="0.6" />
            <circle cx="90" cy="25" r="1.5" fill={color} opacity="0.6" />
        </svg>
    </div>
);

/**
 * Premium Pass Card Component
 * Fully dynamic theme engine supporting 9 distinct color controls, glitter, shine, and doodles.
 */
const PassCard = ({
    pass,
    onAction,
    actionLabel = 'GET MY PASS',
    isPreview = false,
    onEdit,
    onDelete,
    variantIndex = 0,
    className = '',
}) => {
    if (!pass) return null;

    const theme = getPassTheme(pass, variantIndex);

    const eventName = pass.eventName || 'KALAM';
    const eventYear = pass.eventYear || '2026';
    const currency = pass.currency || '₹';
    const buttonLabel = pass.buttonText || actionLabel;
    const badgeType = pass.type || 'INDIVIDUAL';

    // Determine pass title: preserve custom name cleanly
    const rawName = String(pass.name || '').trim();
    const isGenericName = !rawName || ['pass', 'entry pass'].includes(rawName.toLowerCase());
    const displayTitle = isGenericName
        ? (variantIndex % 2 === 0 ? 'TECHNICAL PASS' : 'CULTURAL PASS')
        : rawName.toUpperCase();

    const perks = Array.isArray(pass.perks)
        ? pass.perks.filter((p) => typeof p === 'string' && p.trim())
        : [];

    const handleActionClick = (e) => {
        if (isPreview) {
            e.preventDefault();
            return;
        }

        if (onAction) {
            onAction(pass);
            return;
        }

        const targetUrl = pass.registrationUrl || 'https://rzp.io/rzp/pFFSOtNd';
        if (/^https?:\/\//i.test(targetUrl)) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
            window.location.assign(targetUrl);
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={!isPreview ? { y: -6, transition: { duration: 0.25 } } : {}}
            className={`group relative mx-auto w-full max-w-[360px] h-full flex flex-col justify-between rounded-2xl sm:rounded-[2rem] select-none transition-all duration-300 p-3.5 sm:p-7 backdrop-blur-xl isolate overflow-hidden ${className}`}
            style={{
                background: theme.bgGradient,
                border: `1px solid ${theme.outerBorder}`,
                boxShadow: `0 20px 40px ${theme.cardShadow}, 0 0 25px ${theme.borderGlow}33`
            }}
        >
            {/* 1. Atmospheric Ambient Lighting Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-35 transition-opacity duration-500 group-hover:opacity-55"
                style={{
                    background: theme.glowRgba
                }}
            />

            {/* 2. Fine Metallic Shimmer Line on Top Edge */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px"
                style={{
                    background: `linear-gradient(90deg, transparent, ${theme.borderGlow}, transparent)`
                }}
            />

            {/* 3. Subtle Animated Glossy Sweep Reflection */}
            <div
                aria-hidden="true"
                className="pass-card-shimmer pointer-events-none absolute -inset-[100%] z-10 opacity-30 select-none"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.02) 60%, transparent 100%)'
                }}
            />

            {/* 4. Metallic Glitter & Sparkling Stars */}
            {theme.showGlitter && <PassGlitter color={theme.glitterColor} />}

            {/* 5. Elegant Card Doodles */}
            {theme.showDoodles && <PassDoodles color={theme.doodleColor} opacity={theme.doodleOpacity} />}

            {/* 6. Mandatory Shared Emblem Image */}
            <div
                aria-hidden="true"
                className="absolute top-8 right-2 sm:top-12 sm:right-5 w-14 h-14 sm:w-28 sm:h-28 pointer-events-none z-0 opacity-35 sm:opacity-40 select-none transition-transform duration-500 group-hover:scale-105"
            >
                <img
                    src={SHARED_EMBLEM_URL}
                    alt=""
                    className="w-full h-full object-contain"
                    style={{
                        filter: `drop-shadow(0 0 16px ${theme.emblemGlow})`
                    }}
                />
            </div>

            {/* 7. Card Functional Content Wrapper */}
            <div className="relative z-10 flex flex-col flex-1">
                {/* Header: Crown Icon, KALAM 2026, and Individual Badge */}
                <header
                    className="flex items-center justify-between gap-1 sm:gap-2 pb-2.5 sm:pb-4"
                    style={{
                        borderBottom: `1px solid ${theme.divider}40`
                    }}
                >
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <Crown className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" style={{ color: theme.crownIcon }} />
                        <span
                            className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[.18em] sm:tracking-[.24em] font-heading"
                            style={{ color: theme.kalamText }}
                        >
                            {eventName}{' '}
                            <span style={{ color: theme.yearHighlight }}>
                                {eventYear}
                            </span>
                        </span>
                    </div>

                    <span
                        className="rounded-full px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider"
                        style={{
                            backgroundColor: theme.badgeBg,
                            border: `1px solid ${theme.badgeBorder}`,
                            color: theme.badgeText
                        }}
                    >
                        {badgeType}
                    </span>
                </header>

                {/* Pass Name & Tagline */}
                <div className="pt-2 sm:pt-4 pb-1">
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                        <span
                            className="h-px w-2 sm:w-5"
                            style={{ background: theme.divider }}
                        />
                        <span
                            className="text-[7px] sm:text-[9px] font-semibold uppercase tracking-[.14em] sm:tracking-[.26em] truncate"
                            style={{ color: theme.tagline }}
                        >
                            YOUR ACCESS · YOUR MOMENT
                        </span>
                    </div>

                    <h3
                        className="text-xs sm:text-2xl lg:text-3xl font-black uppercase font-heading tracking-tight leading-tight line-clamp-2"
                        style={{
                            color: theme.titleColor
                        }}
                    >
                        {displayTitle}
                    </h3>
                </div>

                {/* Dedicated Price Panel */}
                <div
                    className="mt-2 sm:mt-3.5 mb-1 rounded-lg sm:rounded-xl p-1.5 sm:p-3.5 flex items-baseline justify-between transition-colors duration-300 gap-1"
                    style={{
                        backgroundColor: theme.pricePanelBg,
                        border: `1px solid ${theme.pricePanelBorder}`,
                        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.05)`
                    }}
                >
                    <div className="flex items-baseline gap-0.5 sm:gap-1.5 min-w-0">
                        <span
                            className="text-xs sm:text-xl md:text-2xl font-light"
                            style={{ color: theme.priceHighlight }}
                        >
                            {currency}
                        </span>
                        <span
                            className="text-sm sm:text-3xl md:text-4xl font-extrabold tracking-tight font-heading truncate"
                            style={{ color: theme.priceText }}
                        >
                            {pass.price}/-
                        </span>
                    </div>
                    <span
                        className="text-[7px] sm:text-xs uppercase tracking-wider font-body font-medium shrink-0"
                        style={{ color: theme.perPersonText }}
                    >
                        PER PERSON
                    </span>
                </div>

                {/* Elegant Separator */}
                <div className="relative my-2 sm:my-4 flex items-center justify-center">
                    <div
                        className="h-1.5 w-1.5 rotate-45"
                        style={{ backgroundColor: theme.divider }}
                    />
                    <div
                        className="absolute inset-x-2 sm:inset-x-6 h-px"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${theme.divider}, transparent)`
                        }}
                    />
                </div>

                {/* Privileges Section */}
                <div className="flex-1 flex flex-col justify-start">
                    <p
                        className="text-[8px] sm:text-[11px] font-bold uppercase tracking-[.12em] sm:tracking-[.22em] mb-1.5 sm:mb-3 flex items-center gap-1 sm:gap-1.5"
                        style={{ color: theme.privilegesHeading }}
                    >
                        <Gem size={10} className="sm:w-[13px] sm:h-[13px] shrink-0" style={{ color: theme.diamondIcon }} />
                        <span className="truncate">INCLUDED PRIVILEGES</span>
                    </p>

                    <ul className="space-y-1.5 sm:space-y-2.5 mb-2.5 sm:mb-5 flex-1">
                        {(perks.length > 0 ? perks : [
                            'All Technical Sessions & Keynotes',
                            'Workshop Admission & Labs',
                            'Official Festival Delegate Kit'
                        ]).map((perk, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-1 sm:gap-2.5 text-[9px] sm:text-[13px] leading-tight sm:leading-snug font-body"
                                style={{ color: theme.privilegeText }}
                            >
                                <div
                                    className="mt-0.5 w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                                    style={{
                                        backgroundColor: theme.checkmarkCircle,
                                        color: theme.checkmarkIcon
                                    }}
                                >
                                    <Check size={8} className="sm:w-[11px] sm:h-[11px]" strokeWidth={3.5} />
                                </div>
                                <span className="line-clamp-2">{perk}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom Action: CTA Button with Right-Arrow */}
                <div className="mt-auto pt-1 sm:pt-2">
                    <button
                        type="button"
                        onClick={handleActionClick}
                        disabled={isPreview}
                        className="w-full py-2 sm:py-3 px-2 sm:px-5 rounded-lg sm:rounded-xl font-heading font-bold text-[9px] sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 cursor-pointer shadow-lg active:scale-98 hover:brightness-110 hover:-translate-y-0.5"
                        style={{
                            background: theme.ctaGradient,
                            color: theme.ctaText,
                            boxShadow: `0 4px 20px ${theme.borderGlow}40`
                        }}
                    >
                        <span className="truncate">{buttonLabel}</span>
                        <ArrowRight size={12} className="sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>

                    <div
                        className="mt-1.5 sm:mt-2.5 flex items-center justify-between text-[7px] sm:text-[9px] uppercase tracking-widest font-body"
                        style={{ color: theme.tagline, opacity: 0.7 }}
                    >
                        <span>KALAM FESTIVAL</span>
                        <span>OFFICIAL INVITATION</span>
                    </div>
                </div>
            </div>

            {/* Admin-only controls */}
            {(onEdit || onDelete) && (
                <div
                    className="relative z-30 mt-3 pt-3 flex w-full gap-2"
                    style={{ borderTop: `1px solid ${theme.divider}40` }}
                >
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(pass)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20 cursor-pointer"
                        >
                            <Edit size={13} />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(pass._id || pass.id)}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 cursor-pointer"
                        >
                            <Trash2 size={13} />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </motion.article>
    );
};

export default PassCard;
