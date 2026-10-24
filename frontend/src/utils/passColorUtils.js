/**
 * Dynamic Pass Color & Theme Utility
 * Centralized theme and palette configuration for the KALAM 2026 Digital Pass Card.
 * Implements a modern editorial luxury aesthetic with CSS variables and presets.
 */

export const LUXURY_PRESETS = [
    {
        id: 'emerald-gold',
        name: 'Emerald Green + Gold',
        subtitle: 'Royal deep emerald & metallic champagne gold (Reference)',
        backgroundColor: '#064E3B',
        secondaryBgColor: '#022C22',
        primaryColor: '#D4AF37',
        secondaryColor: '#F7E7A9',
        accentColor: '#D4AF37',
        borderColor: '#D4AF37',
        dividerColor: 'rgba(212, 175, 55, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#F5F1E5',
        priceColor: '#F7E7A9',
        iconColor: '#D4AF37',
        artworkColor: '#D4AF37',
        buttonBgColor: '#D4AF37',
        buttonTextColor: '#022C22',
        glitterColor: '#F7E7A9',
        doodleColor: '#D4AF37',
        glowColor: '#FFD76A',
        qrFgColor: '#D4AF37',
        qrBgColor: '#022C22',
    },
    {
        id: 'obsidian-amethyst',
        name: 'Obsidian Black + Royal Amethyst',
        subtitle: 'Deep obsidian void & luminous electric violet',
        backgroundColor: '#0B0813',
        secondaryBgColor: '#050308',
        primaryColor: '#A855F7',
        secondaryColor: '#C084FC',
        accentColor: '#9333EA',
        borderColor: '#A855F7',
        dividerColor: 'rgba(168, 85, 247, 0.45)',
        titleColor: '#FAF5FF',
        textColor: '#F3F4F6',
        priceColor: '#FAF5FF',
        iconColor: '#C084FC',
        artworkColor: '#A855F7',
        buttonBgColor: '#9333EA',
        buttonTextColor: '#FFFFFF',
        glitterColor: '#C084FC',
        doodleColor: '#A855F7',
        glowColor: '#C084FC',
        qrFgColor: '#C084FC',
        qrBgColor: '#0B0813',
    },
    {
        id: 'midnight-ice',
        name: 'Midnight Navy + Ice Blue',
        subtitle: 'Futuristic cosmic navy & laser neon cyan',
        backgroundColor: '#06152B',
        secondaryBgColor: '#020914',
        primaryColor: '#31DFFF',
        secondaryColor: '#79CFFF',
        accentColor: '#087BCE',
        borderColor: '#31DFFF',
        dividerColor: 'rgba(49, 223, 255, 0.45)',
        titleColor: '#FFFFFF',
        textColor: '#F3F4F6',
        priceColor: '#FFFFFF',
        iconColor: '#31DFFF',
        artworkColor: '#31DFFF',
        buttonBgColor: '#31DFFF',
        buttonTextColor: '#041326',
        glitterColor: '#79CFFF',
        doodleColor: '#31DFFF',
        glowColor: '#59BFFF',
        qrFgColor: '#31DFFF',
        qrBgColor: '#06152B',
    },
    {
        id: 'burgundy-gold',
        name: 'Burgundy + Champagne Gold',
        subtitle: 'Imperial crimson velvet & warm bullion gold',
        backgroundColor: '#2A0813',
        secondaryBgColor: '#130207',
        primaryColor: '#F59E0B',
        secondaryColor: '#FDE68A',
        accentColor: '#D97706',
        borderColor: '#F59E0B',
        dividerColor: 'rgba(245, 158, 11, 0.45)',
        titleColor: '#FFFBEB',
        textColor: '#FEF3C7',
        priceColor: '#FFFBEB',
        iconColor: '#F59E0B',
        artworkColor: '#F59E0B',
        buttonBgColor: '#F59E0B',
        buttonTextColor: '#130207',
        glitterColor: '#FDE68A',
        doodleColor: '#F59E0B',
        glowColor: '#FBBF24',
        qrFgColor: '#F59E0B',
        qrBgColor: '#2A0813',
    },
    {
        id: 'royal-violet',
        name: 'Royal Violet',
        subtitle: 'Midnight navy and rich violet',
        backgroundColor: '#070817',
        secondaryBgColor: '#03040C',
        primaryColor: '#8B5CF6',
        secondaryColor: '#C4B5FD',
        accentColor: '#6D28D9',
        borderColor: '#8B5CF6',
        dividerColor: 'rgba(196, 181, 253, 0.35)',
        titleColor: '#FFFFFF',
        textColor: '#F3F4F6',
        priceColor: '#FFFFFF',
        iconColor: '#C4B5FD',
        artworkColor: '#8B5CF6',
        buttonBgColor: '#8B5CF6',
        buttonTextColor: '#FFFFFF',
        glitterColor: '#C4B5FD',
        doodleColor: '#8B5CF6',
        glowColor: '#A78BFA',
        qrFgColor: '#FFFFFF',
        qrBgColor: '#070817',
    },
    {
        id: 'platinum',
        name: 'Platinum Silver',
        subtitle: 'Charcoal void and polished sterling silver',
        backgroundColor: '#0C0E12',
        secondaryBgColor: '#060709',
        primaryColor: '#E2E8F0',
        secondaryColor: '#94A3B8',
        accentColor: '#475569',
        borderColor: '#94A3B8',
        dividerColor: 'rgba(226, 232, 240, 0.3)',
        titleColor: '#FFFFFF',
        textColor: '#CBD5E1',
        priceColor: '#FFFFFF',
        iconColor: '#E2E8F0',
        artworkColor: '#CBD5E1',
        buttonBgColor: '#E2E8F0',
        buttonTextColor: '#0C0E12',
        glitterColor: '#E2E8F0',
        doodleColor: '#94A3B8',
        glowColor: '#CBD5E1',
        qrFgColor: '#FFFFFF',
        qrBgColor: '#0C0E12',
    },
];

export const PRESET_PASS_COLORS = LUXURY_PRESETS;
export const DEFAULT_PASS_THEME = LUXURY_PRESETS[0];

export const LEGACY_COLOR_MAP = {
    blue: '#31DFFF',
    violet: '#8B5CF6',
    purple: '#A855F7',
    green: '#10B981',
    emerald: '#064E3B',
    orange: '#F97316',
    yellow: '#D4AF37',
    gold: '#D4AF37',
    red: '#E11D48',
    pink: '#EC4899',
    cyan: '#31DFFF',
    teal: '#0D9488',
    indigo: '#6366F1',
    magenta: '#D946EF',
    burgundy: '#2A0813',
    amethyst: '#9333EA',
};

/**
 * Parses any color input (hex or legacy name) to { r, g, b, hex }
 */
export function parseColor(input) {
    if (!input || typeof input !== 'string') {
        return { r: 212, g: 175, b: 55, hex: '#D4AF37' };
    }

    const trimmed = input.trim();

    // Check if preset id
    const matchedPreset = LUXURY_PRESETS.find(p => p.id === trimmed || p.name.toLowerCase() === trimmed.toLowerCase());
    if (matchedPreset) {
        return hexToRgb(matchedPreset.primaryColor);
    }

    // Check if legacy name
    const lower = trimmed.toLowerCase();
    if (LEGACY_COLOR_MAP[lower]) {
        return hexToRgb(LEGACY_COLOR_MAP[lower]);
    }

    // Check if valid hex
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
        return hexToRgb(trimmed);
    }

    // Fallback to gold
    return { r: 212, g: 175, b: 55, hex: '#D4AF37' };
}

export function hexToRgb(hexStr) {
    let hex = hexStr.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return { r, g, b, hex: `#${hex.toUpperCase()}` };
}

export function adjustBrightness({ r, g, b }, percent) {
    const factor = 1 + percent / 100;
    const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
    const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
    const nb = Math.min(255, Math.max(0, Math.round(b * factor)));
    return { r: nr, g: ng, b: nb, hex: rgbToHex(nr, ng, nb) };
}

export function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Ensures font colors never use blue, cyan, or icy-blue tints.
 * Replaces them with clean white, warm ivory, champagne neutrals, or deep charcoal.
 */
export function sanitizeFontColor(colorStr, fallback = '#FFFFFF') {
    if (!colorStr || typeof colorStr !== 'string') return fallback;
    const trimmed = colorStr.trim();
    if (!trimmed) return fallback;

    const lower = trimmed.toLowerCase();
    // Check known blue/cyan keywords
    if (['blue', 'cyan', 'teal', 'navy', 'sky', 'ice', 'azure', 'sapphire', 'cobalt'].some(w => lower.includes(w))) {
        return fallback;
    }

    // Check RGB channels
    const { r, g, b } = parseColor(trimmed);
    
    // Check if it's very dark (like button text on bright backgrounds)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const delta = maxVal - minVal;
    const isDark = maxVal < 50;

    // Calculate Hue in degrees [0, 360]
    let h = 0;
    if (delta > 0) {
        if (maxVal === r) {
            h = ((g - b) / delta) % 6;
        } else if (maxVal === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    // Blue/Cyan/Sky range is 165° to 260°
    const isBlueHue = h >= 165 && h <= 265;
    // Saturation threshold: even 3% blue tint makes white look icy-blue
    const sat = maxVal > 0 ? delta / maxVal : 0;
    const isBlueTinted = isBlueHue && sat > 0.03;

    // Explicit check for dominant blue channel over red and green
    const isBlueDominant = (b > r + 5 && b > g + 4);
    const isCyanOrIce = (b > 120 && g > 120 && r < Math.min(b, g));

    if (isBlueTinted || isBlueDominant || isCyanOrIce) {
        // If it's a dark color (e.g. button label on neon button), use clean deep black/charcoal
        if (isDark) {
            return '#0A0A0A';
        }
        return fallback;
    }

    return trimmed;
}

/**
 * Builds the complete dynamic theme object from pass data and themeConfig.
 * Strictly guarantees font colors are clean whites, creams, golds, or silver neutrals.
 */
export function buildDynamicPassTheme(pass, variantIndex = 0) {
    // Determine default preset base
    const isGoldDefault = variantIndex % 2 === 1;
    const defaultPreset = isGoldDefault ? LUXURY_PRESETS[0] : LUXURY_PRESETS[2]; // Emerald Gold or Midnight Ice

    const tc = (pass && typeof pass.themeConfig === 'object' && pass.themeConfig !== null) ? pass.themeConfig : {};
    
    // 1. Resolve preset if selected
    const matchedPreset = LUXURY_PRESETS.find(p => p.id === tc.presetId) || defaultPreset;

    // 1. Main card background color
    const mainBg = tc.backgroundColor || (pass && pass.color && isHexColor(pass.color) && pass.color.length === 7 ? adjustBrightness(parseColor(pass.color), -75).hex : null) || matchedPreset.backgroundColor;

    // 2. Secondary background / gradient bottom
    const secondaryBg = tc.secondaryBgColor || (mainBg ? adjustBrightness(parseColor(mainBg), -35).hex : null) || matchedPreset.secondaryBgColor;
    const bgGradient = `linear-gradient(180deg, ${mainBg} 0%, ${secondaryBg} 100%)`;

    // 3. Border color
    const outerBorder = tc.borderColor || tc.primaryColor || pass?.color || matchedPreset.borderColor;

    // 4. Title and heading color (STRICTLY NON-BLUE)
    const titleColor = sanitizeFontColor(tc.titleColor || matchedPreset.titleColor, '#FFFFFF');

    // 5. Body text color (STRICTLY NON-BLUE)
    const textColor = sanitizeFontColor(tc.textColor || matchedPreset.textColor, '#F3F4F6');

    // 6. Accent and decorative element color
    const accentColor = tc.accentColor || tc.primaryColor || pass?.color || matchedPreset.accentColor;
    const divider = tc.dividerColor || accentColor;

    // 7. Glitter and sparkle color
    const glitterColor = tc.glitterColor || tc.accentColor || matchedPreset.glitterColor || '#FFE6A0';

    // 8. Doodle color
    const doodleColor = tc.doodleColor || tc.accentColor || matchedPreset.doodleColor || accentColor;

    // 9. Glow and highlight color
    const glowColor = tc.glowColor || tc.borderColor || matchedPreset.glowColor || outerBorder;
    const glowRgb = parseColor(glowColor);

    // Derived UI details
    const primaryColor = tc.primaryColor || pass?.color || matchedPreset.primaryColor;
    const primaryRgb = parseColor(primaryColor);

    // Price panel styling (STRICTLY NON-BLUE FOR TEXTS)
    const pricePanelBg = tc.pricePanelBg || adjustBrightness(parseColor(mainBg), -12).hex;
    const pricePanelBorder = tc.pricePanelBorder || adjustBrightness(parseColor(outerBorder), -15).hex;
    const priceText = sanitizeFontColor(tc.priceColor, titleColor);
    const priceHighlight = sanitizeFontColor(tc.priceHighlight, '#FFE6A0');
    const perPersonText = sanitizeFontColor(tc.perPersonText, '#E5E7EB');
    const tagline = sanitizeFontColor(tc.tagline, '#E5E7EB');
    const privilegesHeading = sanitizeFontColor(tc.privilegesHeading, '#FFE6A0');
    const yearHighlight = sanitizeFontColor(tc.yearHighlight, '#FFE6A0');
    const badgeText = sanitizeFontColor(tc.badgeText, '#FFFFFF');

    // CTA Button
    const buttonBg = tc.buttonBgColor || primaryColor;
    const buttonText = sanitizeFontColor(tc.buttonTextColor, matchedPreset.buttonTextColor || '#041326');
    const buttonRgb = parseColor(buttonBg);
    const ctaGradient = `linear-gradient(135deg, ${adjustBrightness(buttonRgb, 25).hex} 0%, ${buttonBg} 100%)`;

    // Visual options
    const showGlitter = tc.showGlitter !== false;
    const showDoodles = tc.showDoodles !== false;
    const doodleOpacity = typeof tc.doodleOpacity === 'number' ? tc.doodleOpacity : 0.28;

    return {
        id: tc.presetId || matchedPreset.id,
        mainBg,
        secondaryBg,
        bgGradient,
        outerBorder,
        borderGlow: glowColor,
        cardShadow: 'rgba(0, 0, 0, 0.45)',
        glowColor,
        glowRgba: `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.35)`,
        crownIcon: primaryColor,
        kalamText: titleColor,
        yearHighlight,
        badgeBg: adjustBrightness(parseColor(mainBg), 12).hex,
        badgeBorder: outerBorder,
        badgeText,
        divider,
        tagline,
        titleColor,
        titleGradientAccent: titleColor,
        pricePanelBg,
        pricePanelBorder,
        priceText,
        priceHighlight,
        perPersonText,
        privilegesHeading,
        diamondIcon: '#FFE6A0',
        checkmarkCircle: primaryColor,
        checkmarkIcon: mainBg,
        privilegeText: textColor,
        ctaGradient,
        ctaText: buttonText,
        ribbonColor: accentColor,
        emblemGlow: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.35)`,
        glitterColor,
        doodleColor,
        showGlitter,
        showDoodles,
        doodleOpacity,
    };
}

function isHexColor(str) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str);
}
