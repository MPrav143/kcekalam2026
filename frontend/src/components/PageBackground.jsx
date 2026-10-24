import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { getImageUrl } from '../utils/imageUtils';
import OptimizedImage from './OptimizedImage';
import { DEFAULT_PAGE_BACKGROUNDS } from '../utils/constants';

export const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl) || url.startsWith('data:video/');
};

export const getPageBackgroundKey = (pathname, search = '') => {
    if (!pathname) return 'global_bg';
    // Admin portal & login have NO background image per user request
    if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
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
 * Resolves the active background media source for the given route from site configuration.
 */
export const getResolvedBackgroundUrl = (config, pathname = '', search = '', fallbackKey = '') => {
    // Admin portal & login have NO background image
    if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
        return '';
    }
    if (!config && !DEFAULT_PAGE_BACKGROUNDS) return '';
    // Home screen has distinct section-by-section backgrounds, avoid full-screen fixed image
    if (pathname === '/' && !search) {
        return '';
    }
    const resolvedKey = getPageBackgroundKey(pathname, search);
    if (!resolvedKey) return '';

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
 * Used by pages to cleanly disable background colors, glow orbs, and color grids.
 */
export const useHasPageBackground = () => {
    const { config } = useGlobalConfig();
    const location = useLocation();
    const rawMediaUrl = getResolvedBackgroundUrl(config, location.pathname, location.search);
    return Boolean(rawMediaUrl && rawMediaUrl.trim().length > 0);
};

const PageBackground = ({ pageKey, fallbackKey, className = '' }) => {
    const { config } = useGlobalConfig();
    const location = useLocation();
    const [failedUrls, setFailedUrls] = useState({});

    const isAdminOrLogin = Boolean(location.pathname.startsWith('/login') || location.pathname.startsWith('/admin'));
    const isHomeWithoutExplicitBg = Boolean(location.pathname === '/' && !pageKey && !location.search);

    // Determine the active config key safely without early returns
    const resolvedKey = (!isAdminOrLogin && !isHomeWithoutExplicitBg)
        ? (pageKey || getPageBackgroundKey(location.pathname, location.search))
        : null;

    // 1. Configured custom URL
    const configuredUrl =
        (config && resolvedKey && config[resolvedKey] && String(config[resolvedKey]).trim()) ||
        (fallbackKey && config && config[fallbackKey] && String(config[fallbackKey]).trim()) ||
        '';

    // 2. Default verified URL
    const defaultUrl =
        (resolvedKey && DEFAULT_PAGE_BACKGROUNDS[resolvedKey]) ||
        (fallbackKey && DEFAULT_PAGE_BACKGROUNDS[fallbackKey]) ||
        (!isAdminOrLogin && config && config.global_bg && String(config.global_bg).trim()) ||
        (!isAdminOrLogin && DEFAULT_PAGE_BACKGROUNDS.global_bg) ||
        '';

    const rawMediaUrl = (!failedUrls[configuredUrl] && configuredUrl)
        ? configuredUrl
        : (!failedUrls[defaultUrl] && defaultUrl)
            ? defaultUrl
            : '';

    const hasMedia = Boolean(!isAdminOrLogin && !isHomeWithoutExplicitBg && rawMediaUrl && rawMediaUrl.trim().length > 0);

    // Keep body class in sync so global CSS removes any background colors - Hook called unconditionally on every render
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
        <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}>
            {isVideo ? (
                <video
                    key={resolvedUrl}
                    src={resolvedUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => handleError(rawMediaUrl)}
                    className="w-full h-full object-cover transition-opacity duration-700"
                />
            ) : (
                <OptimizedImage
                    key={resolvedUrl}
                    src={rawMediaUrl}
                    alt="Page Background"
                    preset="PAGE_BG"
                    priority={true}
                    onError={() => handleError(rawMediaUrl)}
                    className="w-full h-full object-cover transition-opacity duration-700"
                />
            )}
        </div>
    );
};



export default PageBackground;
