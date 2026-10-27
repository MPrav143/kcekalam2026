import { simulateHomeVisit, simulateBrowsePasses, simulateBrowseDepartments, simulateEventDetail } from '../lib/user-flows.js';
import { CONFIG } from '../config.js';
import http from 'k6/http';

export const options = {
    scenarios: {
        smoke_check: {
            executor: 'constant-vus',
            vus: 3,
            duration: '20s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'], // Less than 1% failures
        http_req_duration: [`p(95)<${CONFIG.THRESHOLDS.READ_P95_MS}`, `p(99)<${CONFIG.THRESHOLDS.READ_P99_MS}`],
    },
};

export function setup() {
    // Probe events endpoint to obtain sample event ID or slug
    const res = http.get(`${CONFIG.API_URL}/events`);
    let sampleEventId = null;
    try {
        const events = JSON.parse(res.body);
        if (Array.isArray(events) && events.length > 0) {
            sampleEventId = events[0].slug || events[0]._id;
        }
    } catch {
        // Fallback
    }
    return { sampleEventId };
}

export default function (data) {
    // 1. Visit Home (HTML + Config batch + Events + ImageKit)
    simulateHomeVisit();

    // 2. Browse Departments
    simulateBrowseDepartments();

    // 3. Browse Passes
    simulateBrowsePasses();

    // 4. View Sample Event Detail
    if (data.sampleEventId) {
        simulateEventDetail(data.sampleEventId);
    }
}
