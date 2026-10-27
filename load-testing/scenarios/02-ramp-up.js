import { simulateHomeVisit, simulateBrowsePasses, simulateBrowseDepartments, simulateEventDetail } from '../lib/user-flows.js';
import { CONFIG } from '../config.js';
import http from 'k6/http';

export const options = {
    scenarios: {
        ramp_up_traffic: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 50 },   // Step 1: 50 VUs
                { duration: '30s', target: 100 },  // Step 2: 100 VUs
                { duration: '45s', target: 250 },  // Step 3: 250 VUs
                { duration: '1m', target: 500 },   // Step 4: 500 VUs
                { duration: '1m', target: 500 },   // Hold 500 VUs
                { duration: '30s', target: 0 },    // Ramp down to 0
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.05'], // < 5% failure rate threshold
        http_req_duration: ['p(95)<1500', 'p(99)<3000'],
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
    // Realistic traffic distribution:
    // 100% load Home Page (HTML + Config + Events Catalog + ImageKit)
    simulateHomeVisit();

    // 60% of visitors browse passes
    if (Math.random() < 0.6) {
        simulateBrowsePasses();
    }

    // 50% of visitors browse departments
    if (Math.random() < 0.5) {
        simulateBrowseDepartments();
    }

    // 40% of visitors view event details
    if (data.sampleEventId && Math.random() < 0.4) {
        simulateEventDetail(data.sampleEventId);
    }
}
