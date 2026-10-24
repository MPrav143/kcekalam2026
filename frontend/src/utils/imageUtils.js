import { getOptimizedImageUrl, transformImageKitUrl, isImageKitUrl, generateSrcSet, IMAGE_PRESETS } from './imageKitUtils';

/**
 * Universal Image URL resolver.
 * Backward compatible with existing codebase:
 * - getImageUrl(url) => resolves URL and automatically applies safe default optimization if it's ImageKit/Unsplash
 * - getImageUrl(url, optionsOrPreset) => applies specific width/height/quality/format transforms
 */
export const getImageUrl = (url, optionsOrPreset = {}) => {
    return getOptimizedImageUrl(url, optionsOrPreset);
};

// Re-export ImageKit utility helpers for direct usage across components
export {
    getOptimizedImageUrl,
    transformImageKitUrl,
    isImageKitUrl,
    generateSrcSet,
    IMAGE_PRESETS
};
