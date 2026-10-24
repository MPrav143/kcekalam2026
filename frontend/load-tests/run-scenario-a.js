import autocannon from 'autocannon';

/**
 * KALAM 2026 — Scenario A Runner (500 Concurrent Connections)
 * Measures:
 * - Successful & failed HTTP requests
 * - Request throughput (req/sec)
 * - Average, p50, p90, p95, p99 latencies
 * - Status code distribution
 * - Total data transferred
 */

const targetUrl = process.env.TARGET_URL || 'http://localhost:5173';

console.log(`====================================================`);
console.log(`KALAM 2026: Scenario A — 500 Concurrent Connections`);
console.log(`Target: ${targetUrl}`);
console.log(`Concurrency: 500 Virtual Connections`);
console.log(`Duration: 15 seconds (ramping & measurement)`);
console.log(`====================================================\n`);

const instance = autocannon({
    url: targetUrl,
    connections: 500,
    duration: 15,
    pipelining: 1,
    requests: [
        { path: '/' },
        { path: '/data/metadata/manifest.json' },
        { path: '/data/global/site-config.json' },
        { path: '/data/events/events-list.json' },
        { path: '/data/passes/passes-list.json' }
    ]
}, (err, result) => {
    if (err) {
        console.error('Test error:', err);
        process.exit(1);
    }

    console.log('\n--- SCENARIO A EXECUTION RESULTS ---');
    console.log(`Total Requests Sent : ${result.requests.total}`);
    console.log(`Requests / Second   : ${result.requests.average.toFixed(2)} req/sec`);
    console.log(`Bytes Transferred   : ${(result.throughput.total / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Throughput          : ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/sec`);
    console.log(`2xx Responses       : ${result['2xx']}`);
    console.log(`Non-2xx Responses   : ${result.non2xx}`);
    console.log(`Errors / Timeouts   : ${result.errors} / ${result.timeouts}`);
    console.log(`\nLatency Percentiles:`);
    console.log(`  Avg Latency       : ${result.latency.average.toFixed(2)} ms`);
    console.log(`  p50 (Median)      : ${result.latency.p50} ms`);
    console.log(`  p90               : ${result.latency.p90} ms`);
    console.log(`  p95               : ${result.latency.p95} ms`);
    console.log(`  p99               : ${result.latency.p99} ms`);
    console.log(`  Max Latency       : ${result.latency.max} ms`);
    console.log('------------------------------------');
});

autocannon.track(instance, { renderProgressBar: true });
