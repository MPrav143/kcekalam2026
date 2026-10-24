import http from 'k6/http';
import { check, sleep, group } from 'k6';

/**
 * KALAM 2026 — Scenario A: 500 Concurrent Visitors
 * 
 * Target: Real-world browsing mix simulating ~500 virtual users
 * Actions:
 * - Load Home HTML
 * - Load publication manifest & static JSONs
 * - Browse events list
 * - Open event details
 * - Inspect passes
 * - Request optimized ImageKit assets
 * 
 * Execution:
 * k6 run load-tests/k6-scenario-a.js
 * Or with custom target:
 * k6 run -e TARGET_URL=https://mprav143.github.io/kalam2026 load-tests/k6-scenario-a.js
 */

export const options = {
    scenarios: {
        concurrent_browsers: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 100 },  // Ramp-up to 100 VUs
                { duration: '1m', target: 300 },   // Step to 300 VUs
                { duration: '2m', target: 500 },   // Peak at 500 concurrent VUs
                { duration: '2m', target: 500 },   // Sustained 500 concurrent VUs
                { duration: '30s', target: 0 },    // Graceful ramp-down
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],            // <1% failure rate
        http_req_duration: ['p(95)<1500', 'p(99)<2500'], // 95% of requests under 1.5s
    },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:5173';
const IMAGEKIT_SAMPLE = 'https://ik.imagekit.io/kalam/About%20Page/Logo.png?tr=w-320,q-85,f-auto';

export default function () {
    // 1. Visit Home Page
    group('01_Home_Page', function () {
        const res = http.get(`${BASE_URL}/`);
        check(res, {
            'home status 200': (r) => r.status === 200,
        });
        sleep(1);
    });

    // 2. Fetch Static JSON Datasets (simulating React app hydration)
    group('02_Static_Datasets', function () {
        const responses = http.batch([
            ['GET', `${BASE_URL}/data/metadata/manifest.json`],
            ['GET', `${BASE_URL}/data/global/site-config.json`],
            ['GET', `${BASE_URL}/data/events/events-list.json`],
            ['GET', `${BASE_URL}/data/passes/passes-list.json`],
        ]);

        check(responses[0], { 'manifest 200': (r) => r.status === 200 });
        check(responses[1], { 'site-config 200': (r) => r.status === 200 });
        check(responses[2], { 'events 200': (r) => r.status === 200 });
        check(responses[3], { 'passes 200': (r) => r.status === 200 });

        sleep(2);
    });

    // 3. User browses to Event Details
    group('03_Event_Detail', function () {
        const res = http.get(`${BASE_URL}/data/events/departments.json`);
        check(res, {
            'departments 200': (r) => r.status === 200,
        });
        sleep(1.5);
    });

    // 4. Sample ImageKit Delivery
    group('04_Optimized_Images', function () {
        const res = http.get(IMAGEKIT_SAMPLE, {
            headers: { 'Accept': 'image/webp,image/avif,image/*,*/*' }
        });
        check(res, {
            'imagekit status 200': (r) => r.status === 200,
        });
        sleep(2);
    });
}
