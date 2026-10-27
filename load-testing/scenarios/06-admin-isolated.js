import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { CONFIG } from '../config.js';

export const options = {
    scenarios: {
        admin_traffic: {
            executor: 'constant-vus',
            vus: 2, // Admin portal traffic is inherently low concurrency (1-5 admins)
            duration: '20s',
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.02'],
        http_req_duration: ['p(95)<1000'],
    },
};

export function setup() {
    // If test admin credentials provided via ENV, authenticate
    if (CONFIG.ADMIN_USERNAME && CONFIG.ADMIN_PASSWORD) {
        const loginRes = http.post(`${CONFIG.API_URL}/auth/login`, JSON.stringify({
            username: CONFIG.ADMIN_USERNAME,
            password: CONFIG.ADMIN_PASSWORD,
        }), {
            headers: { 'Content-Type': 'application/json' },
        });

        if (loginRes.status === 200) {
            try {
                const body = JSON.parse(loginRes.body);
                return { token: body.token };
            } catch {}
        }
    }
    return { token: null };
}

export default function (data) {
    if (!data.token) {
        // Without admin credentials, perform a unauthenticated health & rejected auth probe
        group('Admin_Unauthorized_Probe', function () {
            const res = http.get(`${CONFIG.API_URL}/auth/stats`);
            check(res, {
                'unauthenticated request is rejected (401)': (r) => r.status === 401,
            });
            sleep(2);
        });
        return;
    }

    group('Admin_Authenticated_Operations', function () {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
        };

        // 1. Fetch Dashboard Aggregation Stats (heavy aggregation query)
        const statsRes = http.get(`${CONFIG.API_URL}/auth/stats`, { headers, tags: { name: 'Admin_Stats_Aggregation' } });
        check(statsRes, {
            'admin stats status is 200': (r) => r.status === 200,
        });

        // 2. Fetch Events for Admin Management
        const eventsRes = http.get(`${CONFIG.API_URL}/events`, { headers, tags: { name: 'Admin_Events_List' } });
        check(eventsRes, {
            'admin events status is 200': (r) => r.status === 200,
        });

        sleep(3);
    });
}
