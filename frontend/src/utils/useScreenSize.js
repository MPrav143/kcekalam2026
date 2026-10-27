import { useState, useEffect } from 'react';

/**
 * Screen breakpoints (matches Tailwind CSS standards)
 * - Mobile: < 768px (Smartphones)
 * - Tablet: 768px - 1023px (iPads / Tablets)
 * - Desktop: >= 1024px (Laptops / Desktops)
 */
export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280
};

/**
 * Fast synchronous check for mobile screen size
 */
export const getIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < BREAKPOINTS.MOBILE;
};

/**
 * Fast synchronous device view type detection
 * @returns {'mobile' | 'tablet' | 'desktop'}
 */
export const getDeviceType = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < BREAKPOINTS.MOBILE) return 'mobile';
    if (w < BREAKPOINTS.TABLET) return 'tablet';
    return 'desktop';
};

/**
 * React Hook for detecting screen size and active view (desktop view vs mobile view)
 * Automatically updates on resize, orientation changes, and media query triggers.
 */
export const useScreenSize = () => {
    const [screenState, setScreenState] = useState(() => {
        if (typeof window === 'undefined') {
            return {
                width: 1280,
                height: 800,
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                deviceType: 'desktop',
                orientation: 'landscape',
                aspectRatio: 16 / 9
            };
        }
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isMobile = w < BREAKPOINTS.MOBILE;
        const isTablet = w >= BREAKPOINTS.MOBILE && w < BREAKPOINTS.TABLET;
        const isDesktop = w >= BREAKPOINTS.TABLET;

        return {
            width: w,
            height: h,
            isMobile,
            isTablet,
            isDesktop,
            deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            orientation: w < h ? 'portrait' : 'landscape',
            aspectRatio: h > 0 ? w / h : 16 / 9
        };
    });

    useEffect(() => {
        let rafId = null;

        const updateScreen = () => {
            if (typeof window === 'undefined') return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const isMobile = w < BREAKPOINTS.MOBILE;
            const isTablet = w >= BREAKPOINTS.MOBILE && w < BREAKPOINTS.TABLET;
            const isDesktop = w >= BREAKPOINTS.TABLET;

            setScreenState({
                width: w,
                height: h,
                isMobile,
                isTablet,
                isDesktop,
                deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
                orientation: w < h ? 'portrait' : 'landscape',
                aspectRatio: h > 0 ? w / h : 16 / 9
            });
        };

        const handleResize = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateScreen);
        };

        // Listen to window resize and screen orientation changes
        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('orientationchange', handleResize, { passive: true });

        // Also listen with matchMedia for mobile breakpoint
        const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`);
        const handleMqlChange = () => handleResize();
        if (mql.addEventListener) {
            mql.addEventListener('change', handleMqlChange);
        } else if (mql.addListener) {
            mql.addListener(handleMqlChange);
        }

        // Run once on mount to synchronize with active browser viewport
        updateScreen();

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handleMqlChange);
            } else if (mql.removeListener) {
                mql.removeListener(handleMqlChange);
            }
        };
    }, []);

    return screenState;
};

export default useScreenSize;
