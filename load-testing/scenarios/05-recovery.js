import { simulateHomeVisit, simulateBrowsePasses, simulateBrowseDepartments, simulateEventDetail } from '../lib/user-flows.js';
import { CONFIG } from '../config.js';
import http from 'k6/http';

export const options = {
    scenarios: {
        recovery_observation: {
            executor: 'ramping-vus',
            startVUs: 25,
            stages: [
                { duration: '25s', target: 25 },   // Phase 1: Baseline steady-state
                { duration: '15s', target: 500 },  // Phase 2: Overload step
                { duration: '45s', target: 500 },  // Phase 3: Hold overload
                { duration: '10s', target: 25 },   // Phase 4: Immediate release
                { duration: '45s', target: 25 },   // Phase 5: Recovery observation window
                { duration: '10s', target: 0 },    // Final ramp-down
            ],
            gracefulRampDown: '15s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.05'],
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
