/**
 * ImageKit CDN URL Optimization & Transformation Utility
 * KALAM 2026 — High Performance Image Delivery
 * 
 * Features:
 * - Centralized ImageKit URL transformation generator
 * - Automatic format selection (WebP / AVIF via f-auto)
 * - Dimension-aware resizing & quality compression
 * - Responsive srcSet generation for desktop/tablet/mobile
 * - Unsplash & backend relative URL fallback support
 * - Zero private key exposure (client-safe transformation parameters only)
 */

const IMAGEKIT_HOST_PATTERN = /(?:ik\.imagekit\.io|imagekit\.io)/i;

/**
 * Standard optimization presets for common UI surfaces
 */
export const IMAGE_PRESETS = {
    // Critical above-the-fold hero background
    HERO_BG: { width: 1920, quality: 75, format: 'auto' },
    // General ambient page background
    PAGE_BG: { width: 1920, quality: 70, format: 'auto' },
    // Event cards in grid (displays at ~320-400px, 2x DPR = ~640-800px)
    EVENT_CARD: { width: 640, quality: 80, format: 'auto', cropMode: 'at_max' },
    // Full-screen / modal / detail page poster
    EVENT_DETAIL: { width: 1000, quality: 85, format: 'auto' },
    // Navigation and header logos
    NAVBAR_LOGO: { width: 320, quality: 85, format: 'auto' },
    // Footer / Sponsor / Club logos
    SPONSOR_LOGO: { width: 240, quality: 85, format: 'auto' },
    // Category banners
    CATEGORY_BANNER: { width: 600, quality: 78, format: 'auto' },
    // Low Quality Image Placeholder (LQIP) for instant blur-up
    LQIP: { width: 40, quality: 20, blur: 15, format: 'auto' }
};

/**
 * Check if the URL points to ImageKit
 */
export const isImageKitUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return IMAGEKIT_HOST_PATTERN.test(url);
};

/**
 * Check if the URL is a video asset
 */
export const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl);
};

/**
 * Build the ImageKit transformation string based on options
 * Example: 'w-640,q-80,f-auto'
 */
export const buildTransformParam = (options = {}) => {
    const parts = [];

    const width = options.width || options.w;
    if (width) parts.push(`w-${Math.round(width)}`);

    const height = options.height || options.h;
    if (height) parts.push(`h-${Math.round(height)}`);

    const quality = options.quality || options.q;
    if (quality) {
        parts.push(`q-${Math.round(quality)}`);
    } else {
        parts.push('q-80'); // sensible default for rich balance between quality and bandwidth
    }

    const format = options.format || options.f || 'auto';
    parts.push(`f-${format}`);

    if (options.cropMode || options.cm) {
        parts.push(`cm-${options.cropMode || options.cm}`);
    }

    if (options.blur || options.bl) {
        parts.push(`bl-${options.blur || options.bl}`);
    }

    if (options.dpr) {
        parts.push(`dpr-${options.dpr}`);
    }

    return parts.join(',');
};

/**
 * Transform an ImageKit URL with the specified options.
 * Preserves existing path, existing query parameters (like ?updatedAt=...), and avoids duplication.
 * 
 * @param {string} url - Original ImageKit URL
 * @param {object} options - Transformation options (width, height, quality, format, etc.)
 * @returns {string} Optimized URL
 */
export const transformImageKitUrl = (url, options = {}) => {
    if (!url) return '';
    if (!isImageKitUrl(url) || isVideoUrl(url)) return url;

    try {
        const transformStr = buildTransformParam(options);
        if (!transformStr) return url;

        // Split URL into base URL and query string
        const [baseUrl, queryString] = url.split('?');
        const searchParams = new URLSearchParams(queryString || '');

        // Set or update the 'tr' parameter
        searchParams.set('tr', transformStr);

        const newQuery = searchParams.toString();
        return newQuery ? `${baseUrl}?${newQuery}` : baseUrl;
    } catch {
        return url;
    }
};

/**
 * Optimize any image URL (ImageKit, Unsplash, or backend upload)
 * 
 * @param {string} rawUrl - Source image URL
 * @param {object|string} optionsOrPreset - Preset name (e.g. 'EVENT_CARD') or options object
 * @returns {string} Fully qualified and optimized image URL
 */
export const getOptimizedImageUrl = (rawUrl, optionsOrPreset = {}) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    let url = rawUrl.trim();

    if (url.startsWith('data:') || isVideoUrl(url)) {
        return url;
    }

    // Resolve preset if string is passed
    const options = typeof optionsOrPreset === 'string'
        ? (IMAGE_PRESETS[optionsOrPreset] || {})
        : (optionsOrPreset || {});

    // If it's an ImageKit URL, apply ImageKit transformations
    if (isImageKitUrl(url)) {
        return transformImageKitUrl(url, options);
    }

    // If it's an Unsplash URL, apply Unsplash dynamic parameters
    if (url.includes('images.unsplash.com')) {
        const width = options.width || 800;
        const quality = options.quality || 80;
        const separator = url.includes('?') ? '&' : '?';
        // Avoid duplicating if already present
        if (!url.includes('auto=format')) {
            return `${url}${separator}auto=format&fit=crop&w=${width}&q=${quality}`;
        }
        return url;
    }

    // Google Drive direct image handling
    if (url.includes('drive.google.com')) {
        if (url.includes('/view') || url.includes('/edit')) {
            const match = url.match(/\/d\/(.+?)\/(view|edit)/);
            if (match && match[1]) {
                return `https://docs.google.com/uc?export=view&id=${match[1]}`;
            }
        }
        return url;
    }

    // Handle relative backend uploaded paths (uploads/) vs frontend public assets
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        let cleanUrl = url.replace(/\\/g, '/');
        if (cleanUrl.startsWith('/')) {
            cleanUrl = cleanUrl.substring(1);
        }
        if (cleanUrl.startsWith('uploads/')) {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            return `${baseUrl}/${cleanUrl}`;
        }
        // Frontend public asset (served by Vite / static host)
        return `/${cleanUrl}`;
    }

    return url;
};

/**
 * Generate responsive srcSet for an ImageKit or Unsplash image
 * 
 * @param {string} url - Source image URL
 * @param {number[]} widths - List of widths in pixels (e.g., [320, 640, 960, 1200])
 * @param {object} baseOptions - Base options like quality or format
 * @returns {string} Value suitable for the HTML srcSet attribute
 */
export const generateSrcSet = (url, widths = [320, 640, 960, 1200], baseOptions = {}) => {
    if (!url || typeof url !== 'string' || !isImageKitUrl(url)) {
        return '';
    }

    return widths
        .map(w => {
            const optUrl = transformImageKitUrl(url, { ...baseOptions, width: w });
            return `${optUrl} ${w}w`;
        })
        .join(', ');
};
