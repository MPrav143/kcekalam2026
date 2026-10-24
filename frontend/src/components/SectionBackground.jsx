import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import { isVideoUrl } from '../utils/imageKitUtils';
import { DEFAULT_PAGE_BACKGROUNDS } from '../utils/constants';

/**
 * SectionBackground Component
 * Renders an independently configurable background image or video for a specific section.
 * Automatically resolves image URLs, handles video loops, ensures text readability with a subtle dark overlay,
 * and gracefully falls back to that section's intentional dark surface if no image is configured or on error.
 */
const SectionBackground = ({
    bgKey,
    fallbackKey,
    config,
    fallbackGradient = 'bg-[#14050E]',
    overlayOpacity = '',
    className = ''
}) => {
    const [failedUrls, setFailedUrls] = useState({});

    // Primary URL from bgKey
    const primaryUrl =
        (config && bgKey && config[bgKey] && String(config[bgKey]).trim()) ||
        (bgKey && DEFAULT_PAGE_BACKGROUNDS[bgKey]) ||
        '';

    // Fallback URL from fallbackKey
    const secondaryUrl =
        (config && fallbackKey && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
        (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
        '';

    // Active URL: use primary unless it failed; otherwise use secondary
    const rawUrl = (!failedUrls[primaryUrl] && primaryUrl)
        ? primaryUrl
        : (!failedUrls[secondaryUrl] && secondaryUrl)
            ? secondaryUrl
            : '';

    const hasMedia = Boolean(rawUrl && rawUrl.trim().length > 0);

    const handleError = (url) => {
        setFailedUrls(prev => ({ ...prev, [url]: true }));
    };

    if (!hasMedia) {
        return (
            <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}>
                <div className={`w-full h-full ${fallbackGradient}`} />
            </div>
        );
    }

    const resolvedUrl = getImageUrl(rawUrl);
    const isVideo = isVideoUrl(rawUrl);

    return (
        <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}>
            {isVideo ? (
                <video
                    key={resolvedUrl}
                    src={resolvedUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => handleError(rawUrl)}
                    className="w-full h-full object-cover transition-opacity duration-700"
                />
            ) : (
                <img
                    key={resolvedUrl}
                    src={resolvedUrl}
                    alt="Section Background"
                    loading="lazy"
                    onError={() => handleError(rawUrl)}
                    className="w-full h-full object-cover transition-opacity duration-700"
                />
            )}
            {/* Overlay if explicitly configured; otherwise background image shines in original color */}
            {overlayOpacity ? <div className={`absolute inset-0 ${overlayOpacity}`} /> : null}
        </div>
    );
};


export default SectionBackground;
