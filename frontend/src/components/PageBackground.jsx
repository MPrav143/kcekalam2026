import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { getImageUrl } from '../utils/imageUtils';
import OptimizedImage from './OptimizedImage';
import { DEFAULT_PAGE_BACKGROUNDS } from '../utils/constants';
import { useScreenSize, getIsMobile } from '../utils/useScreenSize';

export const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl) || url.startsWith('data:video/');
};

/**
 * Returns the logical background key for any visitor page or admin page route.
 */
export const getPageBackgroundKey = (pathname, search = '') => {
    if (!pathname) return 'global_bg';
    // Admin portal & login routes do NOT have background images
    if (pathname.startsWith('/login') || pathname.startsWith('/admin') || pathname.startsWith('/signup')) {
        return null;
    }
    if (pathname === '/') {
        if (search) {
            const params = new URLSearchParams(search);
            if (params.get('cat') || params.get('dept') || params.get('type')) {
                return 'events_bg';
            }
        }
        return 'home_bg';
    }
    if (pathname.startsWith('/about')) return 'about_bg';
    if (pathname.startsWith('/passes')) return 'passes_bg';
    if (pathname.startsWith('/select-events')) return 'register_bg';
    if (pathname.startsWith('/register/')) return 'register_bg';
    if (pathname.startsWith('/events')) return 'events_bg';
    if (pathname.startsWith('/event/')) return 'event_detail_bg';
    return 'global_bg';
};

/**
 * Resolves the active background media source for the given route from site configuration,
 * automatically switching between Desktop and Mobile background assets based on screen size.
 */
export const getResolvedBackgroundUrl = (config, pathname = '', search = '', fallbackKey = '', isMobile = false) => {
    if (!config && !DEFAULT_PAGE_BACKGROUNDS) return '';

    const resolvedKey = getPageBackgroundKey(pathname, search);
    if (!resolvedKey) return '';

    // Home screen has distinct section-by-section backgrounds; only show page-level background
    // if specifically configured for home (home_bg / home_bg_mobile)
    if (pathname === '/' && !search && !fallbackKey) {
        const homeExplicit = isMobile
            ? (config && config.home_bg_mobile && String(config.home_bg_mobile).trim()) ||
              (config && config.home_bg && String(config.home_bg).trim()) ||
              DEFAULT_PAGE_BACKGROUNDS.home_bg_mobile ||
              DEFAULT_PAGE_BACKGROUNDS.home_bg || ''
            : (config && config.home_bg && String(config.home_bg).trim()) ||
              DEFAULT_PAGE_BACKGROUNDS.home_bg || '';

        return homeExplicit;
    }

    if (isMobile) {
        // 1. Mobile-specific configured keys
        const mobileResolved =
            (resolvedKey && config && config[`${resolvedKey}_mobile`] && String(config[`${resolvedKey}_mobile`]).trim()) ||
            (fallbackKey && config && config[`${fallbackKey}_mobile`] && String(config[`${fallbackKey}_mobile`]).trim()) ||
            (config && config.global_bg_mobile && String(config.global_bg_mobile).trim()) ||
            (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[`${resolvedKey}_mobile`]) ||
            (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[`${fallbackKey}_mobile`]) ||
            DEFAULT_PAGE_BACKGROUNDS.global_bg_mobile ||
            '';

        if (mobileResolved) return mobileResolved;

        // 2. Seamless Desktop fallback if mobile asset is not explicitly uploaded
        return (
            (resolvedKey && config && config[resolvedKey] && String(config[resolvedKey]).trim()) ||
            (fallbackKey && config && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
            (config && config.global_bg && String(config.global_bg).trim()) ||
            (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[resolvedKey]) ||
            (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
            DEFAULT_PAGE_BACKGROUNDS.global_bg ||
            ''
        );
    }

    // Desktop view resolution
    return (
        (resolvedKey && config && config[resolvedKey] && String(config[resolvedKey]).trim()) ||
        (fallbackKey && config && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
        (config && config.global_bg && String(config.global_bg).trim()) ||
        (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[resolvedKey]) ||
        (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
        DEFAULT_PAGE_BACKGROUNDS.global_bg ||
        ''
    );
};

/**
 * Hook to determine if the active route or global site has a custom background image/video.
 * Used by visitor pages and admin pages to cleanly adapt background colors and surface glassmorphism.
 */
export const useHasPageBackground = (explicitPageKey = null) => {
    const location = useLocation();
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/signup')) {
        return false;
    }
    const { config } = useGlobalConfig();
    const { isMobile } = useScreenSize();
    const rawMediaUrl = getResolvedBackgroundUrl(
        config,
        location.pathname,
        location.search,
        explicitPageKey,
        isMobile
    );
    return Boolean(rawMediaUrl && rawMediaUrl.trim().length > 0);
};

const PageBackground = ({ pageKey, fallbackKey, className = '' }) => {
    const location = useLocation();
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/signup')) {
        return null;
    }
    const { config } = useGlobalConfig();
    const { isMobile } = useScreenSize();
    const [failedUrls, setFailedUrls] = useState({});

    const isHomeWithoutExplicitBg = Boolean(
        location.pathname === '/' &&
        !pageKey &&
        !location.search &&
        !(config && (config.home_bg || config.home_bg_mobile))
    );

    // Determine the active config key safely
    const resolvedKey = !isHomeWithoutExplicitBg
        ? (pageKey || getPageBackgroundKey(location.pathname, location.search))
        : null;

    // Resolve URL with Screen-Size Detection (Desktop vs Mobile)
    let configuredUrl = '';
    let defaultUrl = '';

    if (isMobile) {
        // Check mobile keys first
        configuredUrl =
            (config && resolvedKey && config[`${resolvedKey}_mobile`] && String(config[`${resolvedKey}_mobile`]).trim()) ||
            (fallbackKey && config && config[`${fallbackKey}_mobile`] && String(config[`${fallbackKey}_mobile`]).trim()) ||
            (config && config.global_bg_mobile && String(config.global_bg_mobile).trim()) ||
            '';

        defaultUrl =
            (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[`${resolvedKey}_mobile`]) ||
            (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[`${fallbackKey}_mobile`]) ||
            DEFAULT_PAGE_BACKGROUNDS.global_bg_mobile ||
            '';

        // Fallback to desktop if mobile not provided
        if (!configuredUrl) {
            configuredUrl =
                (config && resolvedKey && config[resolvedKey] && String(config[resolvedKey]).trim()) ||
                (fallbackKey && config && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
                (config && config.global_bg && String(config.global_bg).trim()) ||
                '';
        }
        if (!defaultUrl) {
            defaultUrl =
                (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[resolvedKey]) ||
                (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
                DEFAULT_PAGE_BACKGROUNDS.global_bg ||
                '';
        }
    } else {
        // Desktop view
        configuredUrl =
            (config && resolvedKey && config[resolvedKey] && String(config[resolvedKey]).trim()) ||
            (fallbackKey && config && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
            (config && config.global_bg && String(config.global_bg).trim()) ||
            '';

        defaultUrl =
            (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[resolvedKey]) ||
            (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
            DEFAULT_PAGE_BACKGROUNDS.global_bg ||
            '';
    }

    const rawMediaUrl = (!failedUrls[configuredUrl] && configuredUrl)
        ? configuredUrl
        : (!failedUrls[defaultUrl] && defaultUrl)
            ? defaultUrl
            : '';

    const hasMedia = Boolean(!isHomeWithoutExplicitBg && rawMediaUrl && rawMediaUrl.trim().length > 0);

    // Keep body class in sync so global CSS removes any conflicting background colors
    useEffect(() => {
        if (hasMedia) {
            document.body.classList.add('has-page-bg');
        } else {
            document.body.classList.remove('has-page-bg');
        }
        return () => {
            document.body.classList.remove('has-page-bg');
        };
    }, [hasMedia]);

    const handleError = (url) => {
        setFailedUrls(prev => ({ ...prev, [url]: true }));
    };

    if (!hasMedia) {
        return null;
    }

    const resolvedUrl = getImageUrl(rawMediaUrl);
    const isVideo = isVideoUrl(rawMediaUrl);

    return (
        <div
            className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
            style={{ height: '100dvh' }}
        >
            {isVideo ? (
                <video
                    key={`${resolvedUrl}-${isMobile ? 'm' : 'd'}`}
                    src={resolvedUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => handleError(rawMediaUrl)}
                    className="w-full h-full object-cover object-center transition-opacity duration-700"
                />
            ) : (
                <OptimizedImage
                    key={`${resolvedUrl}-${isMobile ? 'm' : 'd'}`}
                    src={rawMediaUrl}
                    alt="Page Background"
                    preset="PAGE_BG"
                    priority={true}
                    onError={() => handleError(rawMediaUrl)}
                    className="w-full h-full object-cover object-center transition-opacity duration-700"
                />
            )}
        </div>
    );
};

export default PageBackground;
