import { simulateHomeVisit, simulateBrowsePasses, simulateBrowseDepartments, simulateEventDetail } from '../lib/user-flows.js';
import { CONFIG } from '../config.js';
import http from 'k6/http';

const HOLD_DURATION = __ENV.SUSTAINED_DURATION || '5m';

export const options = {
    scenarios: {
        sustained_500vu: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 500 },           // Ramp up to 500 VUs
                { duration: HOLD_DURATION, target: 500 },   // Sustained 500 VUs
                { duration: '30s', target: 0 },            // Ramp down
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.05'], // Max 5% errors
        http_req_duration: ['p(95)<2000', 'p(99)<3500'],
    },
};

export function setup() {
    const res = http.get(`${CONFIG.API_URL}/events`);
    let sampleEventId = null;
    try {
        const events = JSON.parse(res.body);
        if (Array.isArray(events) && events.length > 0) {
            sampleEventId = events[0].slug || events[0]._id;
        }
    } catch {}
    return { sampleEventId };
}

export default function (data) {
    simulateHomeVisit();

    if (Math.random() < 0.6) {
        simulateBrowsePasses();
    }
    if (Math.random() < 0.5) {
        simulateBrowseDepartments();
    }
    if (data.sampleEventId && Math.random() < 0.4) {
        simulateEventDetail(data.sampleEventId);
    }
}
