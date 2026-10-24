import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * KALAM 2026 — Scenario B: 500 New Visitors Per Second (Arrival Rate)
 * 
 * Target: 500 new visitor iterations starting every second.
 * Note: Each visitor initiates multiple HTTP requests (HTML + static data).
 * 
 * Execution:
 * k6 run load-tests/k6-scenario-b.js
 * Or with custom target:
 * k6 run -e TARGET_URL=https://mprav143.github.io/kalam2026 load-tests/k6-scenario-b.js
 */

export const options = {
    scenarios: {
        constant_arrival_sessions: {
            executor: 'constant-arrival-rate',
            rate: 500,               // 500 new visitors per second
            timeUnit: '1s',          // per 1 second
            duration: '1m',          // 1 minute test duration
            preAllocatedVUs: 250,    // Initial VU pool
            maxVUs: 2000,            // Max VUs if response time stretches
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.05'],            // Under 5% dropped iterations
        http_req_duration: ['p(95)<2000', 'p(99)<3500'],
    },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:5173';

export default function () {
    // Each arriving visitor fetches the landing page and core manifest
    const res = http.get(`${BASE_URL}/`);
    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    const manifestRes = http.get(`${BASE_URL}/data/metadata/manifest.json`);
    check(manifestRes, {
        'manifest status is 200': (r) => r.status === 200,
    });

    // Pacing
    sleep(0.5);
}
