import { useState } from 'react';
import { getImageUrl } from '../utils/imageUtils';
import { isVideoUrl } from '../utils/imageKitUtils';
import { DEFAULT_PAGE_BACKGROUNDS } from '../utils/constants';
import { useScreenSize } from '../utils/useScreenSize';

/**
 * SectionBackground Component
 * Renders an independently configurable background image or video for a specific section.
 * Automatically detects screen size (mobile view vs desktop view), resolves device-specific media,
 * handles video loops, ensures text readability, and gracefully falls back between mobile and desktop assets.
 */
const SectionBackground = ({
    bgKey,
    fallbackKey,
    mobileBgKey,
    config,
    fallbackGradient = 'bg-[#14050E]',
    overlayOpacity = '',
    className = ''
}) => {
    const { isMobile } = useScreenSize();
    const [failedUrls, setFailedUrls] = useState({});

    // Mobile keys
    const activeMobileKey = mobileBgKey || (bgKey ? `${bgKey}_mobile` : null);
    const activeMobileFallback = fallbackKey ? `${fallbackKey}_mobile` : null;

    let primaryUrl = '';
    let secondaryUrl = '';

    if (isMobile) {
        // 1. Mobile-specific URL
        const mobilePrimary =
            (config && activeMobileKey && config[activeMobileKey] && String(config[activeMobileKey]).trim()) ||
            (activeMobileKey && DEFAULT_PAGE_BACKGROUNDS[activeMobileKey]) ||
            '';

        const mobileSecondary =
            (config && activeMobileFallback && config[activeMobileFallback] && String(config[activeMobileFallback]).trim()) ||
            (activeMobileFallback && DEFAULT_PAGE_BACKGROUNDS[activeMobileFallback]) ||
            '';

        // 2. Desktop fallback if mobile is not uploaded
        const desktopPrimary =
            (config && bgKey && config[bgKey] && String(config[bgKey]).trim()) ||
            (bgKey && DEFAULT_PAGE_BACKGROUNDS[bgKey]) ||
            '';

        const desktopSecondary =
            (config && fallbackKey && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
            (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
            '';

        primaryUrl = mobilePrimary || desktopPrimary;
        secondaryUrl = mobileSecondary || desktopSecondary;
    } else {
        // Desktop URL from bgKey
        primaryUrl =
            (config && bgKey && config[bgKey] && String(config[bgKey]).trim()) ||
            (bgKey && DEFAULT_PAGE_BACKGROUNDS[bgKey]) ||
            '';

        // Fallback URL from fallbackKey
        secondaryUrl =
            (config && fallbackKey && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
            (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
            '';
    }

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
                    key={`${resolvedUrl}-${isMobile ? 'm' : 'd'}`}
                    src={resolvedUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => handleError(rawUrl)}
                    className="w-full h-full object-cover object-center transition-opacity duration-700"
                />
            ) : (
                <img
                    key={`${resolvedUrl}-${isMobile ? 'm' : 'd'}`}
                    src={resolvedUrl}
                    alt="Section Background"
                    loading="lazy"
                    onError={() => handleError(rawUrl)}
                    className="w-full h-full object-cover object-center transition-opacity duration-700"
                />
            )}
            {/* Overlay if explicitly configured; otherwise background image shines in original color */}
            {overlayOpacity ? <div className={`absolute inset-0 ${overlayOpacity}`} /> : null}
        </div>
    );
};

export default SectionBackground;
