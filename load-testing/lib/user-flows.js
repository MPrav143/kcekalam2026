import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { CONFIG } from '../config.js';

/**
 * Realistic Visitor Journey Simulations
 */

// Helper to simulate random human think time
export function think(min = CONFIG.PACING.MIN_THINK_TIME, max = CONFIG.PACING.MAX_THINK_TIME) {
    const duration = min + Math.random() * (max - min);
    sleep(duration);
}

/**
 * Flow 1: Home Page Visit & Context Hydration
 * Replicates exact browser behavior: fetching HTML + 5 config APIs + events + ImageKit asset
 */
export function simulateHomeVisit(cachedEventIds = []) {
    group('01_Home_Page_Visit', function () {
        // Step A: Load Frontend Landing Page HTML
        if (CONFIG.FRONTEND_URL) {
            const htmlRes = http.get(`${CONFIG.FRONTEND_URL}/`, {
                tags: { name: 'FE_Home_HTML' }
            });
            check(htmlRes, {
                'Home HTML status is 200': (r) => r.status === 200,
            });
        }

        // Step B: React App GlobalConfigProvider Hydration (Consolidated Bootstrap API)
        const bootstrapRes = http.get(`${CONFIG.API_URL}/content/bootstrap`, {
            tags: { name: 'API_Content_Bootstrap' }
        });
        check(bootstrapRes, {
            'bootstrap status is 200': (r) => r.status === 200,
            'bootstrap has config': (r) => {
                try {
                    const b = JSON.parse(r.body);
                    return b && b.config !== undefined;
                } catch {
                    return false;
                }
            }
        });

        // Step C: Fetch Events Catalog (triggered on mount by Home.jsx)
        const eventsRes = http.get(`${CONFIG.API_URL}/events`, {
            tags: { name: 'API_Events_Catalog' }
        });
        check(eventsRes, {
            'events catalog is 200': (r) => r.status === 200,
        });

        // Step D: ImageKit CDN Asset Request
        if (CONFIG.IMAGEKIT_SAMPLE_URL) {
            const imgRes = http.get(CONFIG.IMAGEKIT_SAMPLE_URL, {
                headers: { 'Accept': 'image/webp,image/avif,image/*,*/*' },
                tags: { name: 'CDN_ImageKit_Asset' }
            });
            check(imgRes, {
                'ImageKit asset is 200': (r) => r.status === 200,
            });
        }

        think(CONFIG.PACING.HOME_THINK_TIME, CONFIG.PACING.HOME_THINK_TIME + 1.5);
    });
}

/**
 * Flow 2: Browse Passes Page
 */
export function simulateBrowsePasses() {
    group('02_Browse_Passes', function () {
        const res = http.get(`${CONFIG.API_URL}/passes`, {
            tags: { name: 'API_Passes_List' }
        });
        check(res, {
            'passes list is 200': (r) => r.status === 200,
            'passes response has array': (r) => {
                try {
                    const data = JSON.parse(r.body);
                    return Array.isArray(data);
                } catch {
                    return false;
                }
            }
        });

        think(1.5, 3.0);
    });
}

/**
 * Flow 3: Event Detail Inspection
 */
export function simulateEventDetail(eventIdOrSlug) {
    group('03_Event_Detail', function () {
        if (!eventIdOrSlug) return;
        const res = http.get(`${CONFIG.API_URL}/events/${eventIdOrSlug}`, {
            tags: { name: 'API_Event_Detail' }
        });
        check(res, {
            'event detail is 200': (r) => r.status === 200,
        });

        think(CONFIG.PACING.EVENT_THINK_TIME, CONFIG.PACING.EVENT_THINK_TIME + 2.0);
    });
}

/**
 * Flow 4: Department / Category Browsing
 */
export function simulateBrowseDepartments() {
    group('04_Browse_Departments', function () {
        const res = http.get(`${CONFIG.API_URL}/content/departments`, {
            tags: { name: 'API_Departments_List' }
        });
        check(res, {
            'departments is 200': (r) => r.status === 200,
        });

        think(1.0, 2.5);
    });
}
