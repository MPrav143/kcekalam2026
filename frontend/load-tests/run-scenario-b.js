import autocannon from 'autocannon';

/**
 * KALAM 2026 — Scenario B Runner (500 Requests / Second Arrival Rate)
 * Evaluates constant arrival rate of 500 visits/sec.
 */

const targetUrl = process.env.TARGET_URL || 'http://localhost:5173';

console.log(`====================================================`);
console.log(`KALAM 2026: Scenario B — 500 Arrivals / Second Rate`);
console.log(`Target: ${targetUrl}`);
console.log(`Paced Arrival Rate: 500 requests/sec`);
console.log(`Duration: 15 seconds`);
console.log(`====================================================\n`);

const instance = autocannon({
    url: targetUrl,
    connections: 100,
    overallRate: 500,     // Exact arrival rate pacing: 500 req/sec
    duration: 15,
    pipelining: 1,
    requests: [
        { path: '/' },
        { path: '/data/metadata/manifest.json' },
        { path: '/data/events/events-list.json' }
    ]
}, (err, result) => {
    if (err) {
        console.error('Test error:', err);
        process.exit(1);
    }

    console.log('\n--- SCENARIO B EXECUTION RESULTS ---');
    console.log(`Target Arrival Rate : 500 req/sec`);
    console.log(`Achieved Req Rate   : ${result.requests.average.toFixed(2)} req/sec`);
    console.log(`Total Requests Sent : ${result.requests.total}`);
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
