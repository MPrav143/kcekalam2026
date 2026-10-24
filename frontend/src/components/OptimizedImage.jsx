import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, generateSrcSet, isImageKitUrl, IMAGE_PRESETS } from '../utils/imageKitUtils';

/**
 * OptimizedImage Component
 * High-performance image renderer optimized for KALAM 2026.
 * 
 * Features:
 * - ImageKit CDN automated transformations (WebP/AVIF, responsive widths, quality compression)
 * - Explicit loading strategy: 'eager' + fetchPriority='high' for critical hero images, 'lazy' for below-the-fold
 * - Layout shift prevention with explicit aspect ratio or dimension preservation
 * - Graceful fallback handling preventing infinite reload loops
 * - Responsive srcSet and sizes support
 */
const OptimizedImage = ({
    src,
    alt = '',
    className = '',
    preset = null,
    transformOptions = null,
    responsiveWidths = null,
    sizes = null,
    priority = false,
    fallbackSrc = 'https://via.placeholder.com/600x400?text=KALAM+2026',
    width,
    height,
    aspectRatio,
    style = {},
    onLoad,
    onError,
    ...rest
}) => {
    const [imgSrc, setImgSrc] = useState('');
    const [srcSet, setSrcSet] = useState('');
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!src) {
            setImgSrc(fallbackSrc);
            return;
        }

        const options = transformOptions || (preset ? IMAGE_PRESETS[preset] : {});
        const optimized = getOptimizedImageUrl(src, options);
        setImgSrc(optimized);
        setHasError(false);

        // Generate responsive srcSet if widths are specified or if it's an ImageKit URL and not a micro-image
        if (responsiveWidths && isImageKitUrl(src)) {
            setSrcSet(generateSrcSet(src, responsiveWidths, options));
        } else if (isImageKitUrl(src) && (preset === 'EVENT_CARD' || preset === 'EVENT_DETAIL' || preset === 'HERO_BG')) {
            const defaultWidths = preset === 'HERO_BG'
                ? [640, 1024, 1440, 1920]
                : [320, 480, 640, 960];
            setSrcSet(generateSrcSet(src, defaultWidths, options));
        } else {
            setSrcSet('');
        }
    }, [src, preset, transformOptions, responsiveWidths, fallbackSrc]);

    const handleError = (e) => {
        if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
            setHasError(true);
            setImgSrc(fallbackSrc);
            setSrcSet('');
        }
        if (onError) onError(e);
    };

    const handleLoad = (e) => {
        setIsLoaded(true);
        if (onLoad) onLoad(e);
    };

    const combinedStyle = {
        ...style,
        ...(aspectRatio ? { aspectRatio } : {})
    };

    return (
        <img
            src={imgSrc || fallbackSrc}
            srcSet={srcSet || undefined}
            sizes={sizes || (srcSet ? '100vw' : undefined)}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            onError={handleError}
            onLoad={handleLoad}
            style={combinedStyle}
            className={`${className} ${!isLoaded && !priority ? 'transition-opacity duration-300 opacity-90' : 'transition-opacity duration-300 opacity-100'}`}
            {...rest}
        />
    );
};

export default OptimizedImage;
