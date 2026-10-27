import { simulateHomeVisit, simulateBrowsePasses, simulateBrowseDepartments, simulateEventDetail } from '../lib/user-flows.js';
import { CONFIG } from '../config.js';
import http from 'k6/http';

export const options = {
    scenarios: {
        traffic_spike: {
            executor: 'ramping-vus',
            startVUs: 20,
            stages: [
                { duration: '20s', target: 20 },   // Baseline normal traffic (20 VUs)
                { duration: '10s', target: 500 },  // Violent surge to 500 VUs in 10s!
                { duration: '40s', target: 500 },  // Peak surge hold
                { duration: '10s', target: 20 },   // Immediate drop back to normal
                { duration: '20s', target: 20 },   // Normal post-spike traffic
                { duration: '10s', target: 0 },    // Wind-down
            ],
            gracefulRampDown: '15s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.10'], // Max 10% errors allowed during extreme spike
        http_req_duration: ['p(95)<2500', 'p(99)<4000'],
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
