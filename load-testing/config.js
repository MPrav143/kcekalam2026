/**
 * KALAM 2026 Load Testing Configuration
 * Environment-driven, safe, configurable thresholds and pacing
 */

export const CONFIG = {
    // Target base URLs
    API_URL: __ENV.API_URL || 'http://localhost:5000/api',
    FRONTEND_URL: __ENV.FRONTEND_URL || 'http://localhost:5173',
    IMAGEKIT_SAMPLE_URL: __ENV.IMAGEKIT_URL || 'https://ik.imagekit.io/kalam/About%20Page/Logo.png?tr=w-320,q-85,f-auto',

    // Safety Switches
    // DO NOT enable UNSAFE_WRITE_TESTS on production without staging isolation!
    ALLOW_UNSAFE_WRITES: __ENV.ALLOW_UNSAFE_WRITES === 'true',
    ADMIN_USERNAME: __ENV.ADMIN_USERNAME || '',
    ADMIN_PASSWORD: __ENV.ADMIN_PASSWORD || '',

    // Standard SLO Thresholds
    THRESHOLDS: {
        READ_P95_MS: Number(__ENV.THRESHOLD_P95 || 500),   // Under 500ms
        READ_P99_MS: Number(__ENV.THRESHOLD_P99 || 1000),  // Under 1000ms
        MAX_ERROR_RATE: Number(__ENV.THRESHOLD_ERRORS || 0.01), // < 1% error rate
    },

    // Think Times & Pacing (seconds)
    PACING: {
        MIN_THINK_TIME: 1.0,
        MAX_THINK_TIME: 3.5,
        HOME_THINK_TIME: 2.0,
        EVENT_THINK_TIME: 2.5,
    }
};
