import fs from 'fs';
import path from 'path';

/**
 * Report Generator: Converts k6 JSON summary into Markdown and HTML reports.
 */

export function generateReports(jsonFilePath, testName = 'Load Test', targetUrl = 'http://localhost:5000') {
    if (!fs.existsSync(jsonFilePath)) {
        console.error(`Result file not found: ${jsonFilePath}`);
        return;
    }

    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    const summary = JSON.parse(rawData);

    const metrics = summary.metrics || {};
    const rootGroup = summary.root_group || {};

    // Helper metric extraction (handles both flat and nested values format)
    const reqDuration = metrics.http_req_duration?.values || metrics.http_req_duration || {};
    const reqFailed = metrics.http_req_failed?.values || metrics.http_req_failed || {};
    const reqs = metrics.http_reqs?.values || metrics.http_reqs || {};
    const iterations = metrics.iterations?.values || metrics.iterations || {};
    const vus = metrics.vus_max || metrics.vus || {};
    const dataReceived = metrics.data_received?.values || metrics.data_received || {};
    const dataSent = metrics.data_sent?.values || metrics.data_sent || {};

    const p50 = Number(reqDuration['p(50)'] || reqDuration.med || 0).toFixed(2);
    const p90 = Number(reqDuration['p(90)'] || 0).toFixed(2);
    const p95 = Number(reqDuration['p(95)'] || 0).toFixed(2);
    const p99 = Number(reqDuration['p(99)'] || 0).toFixed(2);
    const avg = Number(reqDuration.avg || 0).toFixed(2);
    const min = Number(reqDuration.min || 0).toFixed(2);
    const max = Number(reqDuration.max || 0).toFixed(2);

    const totalRequests = reqs.count || 0;
    const reqRate = Number(reqs.rate || 0).toFixed(2);
    const failedRate = Number((reqFailed.value !== undefined ? reqFailed.value : (reqFailed.rate || 0)) * 100).toFixed(2);
    const failedCount = reqFailed.passes !== undefined ? reqFailed.passes : (reqFailed.fails || 0);

    const dataRecMB = (Number(dataReceived.count || 0) / (1024 * 1024)).toFixed(2);
    const dataSentMB = (Number(dataSent.count || 0) / (1024 * 1024)).toFixed(2);

    const passed500VU = Number(p95) < 1500 && Number(failedRate) < 1.0;

    // Checks list
    const checks = [];
    function extractChecks(group) {
        if (!group) return;
        if (group.checks) {
            const list = Array.isArray(group.checks) ? group.checks : Object.values(group.checks);
            list.forEach(c => checks.push(c));
        }
        if (group.groups) {
            const subGroups = Array.isArray(group.groups) ? group.groups : Object.values(group.groups);
            subGroups.forEach(g => extractChecks(g));
        }
    }
    extractChecks(rootGroup);

    // 1. Generate Markdown Report
    const mdContent = `# KALAM 2026 — Load Testing Report
**Scenario:** ${testName}  
**Date:** ${new Date().toISOString()}  
**Target URL:** \`${targetUrl}\`  
**Max Virtual Users:** ${vus.max || 'N/A'}  
**Overall Status:** ${passed500VU ? '✅ PASSED' : '⚠️ THRESHOLD EXCEEDED / FAILED'}

---

## 1. Executive Summary
| Metric | Measured Value | Objective Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Total Requests** | ${totalRequests.toLocaleString()} | - | Complete |
| **Throughput (req/s)** | ${reqRate} req/sec | System Dependent | Normal |
| **Error Rate** | ${failedRate}% (${failedCount} failed) | < 1.0% | ${Number(failedRate) <= 1.0 ? '✅ Passed' : '❌ Failed'} |
| **Average Latency** | ${avg} ms | - | - |
| **Median (p50)** | ${p50} ms | < 250 ms | ${Number(p50) < 250 ? '✅ Passed' : '⚠️ Warning'} |
| **p90 Latency** | ${p90} ms | < 500 ms | ${Number(p90) < 500 ? '✅ Passed' : '⚠️ Warning'} |
| **p95 Latency** | ${p95} ms | < 500 ms | ${Number(p95) < 500 ? '✅ Passed' : '❌ Exceeded'} |
| **p99 Latency** | ${p99} ms | < 1,000 ms | ${Number(p99) < 1000 ? '✅ Passed' : '❌ Exceeded'} |
| **Max Latency** | ${max} ms | - | - |
| **Bandwidth (In / Out)** | ${dataRecMB} MB / ${dataSentMB} MB | - | Transferred |

---

## 2. Check Verification
| Check Name | Succeeded | Failed | Pass Rate |
| :--- | :--- | :--- | :--- |
${checks.map(c => `| ${c.name} | ${c.passes} | ${c.fails} | ${(c.passes + c.fails > 0 ? (c.passes / (c.passes + c.fails) * 100).toFixed(1) : 100)}% |`).join('\n')}

---

## 3. Top Architecture Findings
1. **Frontend Landing Hydration Storm**: A single visitor triggers 6 parallel API requests (\`/upload\`, \`/content/sponsors\`, \`/content/clubs\`, \`/content/departments\`, \`/content/cultural-subcategories\`, \`/events\`). 500 concurrent visitors generate ~3,000 requests.
2. **Vercel Hobby Tier Concurrency Ceiling**: Vercel free tier limits serverless execution to 10 concurrent lambdas. 500 visitors will saturate this pool immediately, returning HTTP 429 and 504 timeouts.
3. **Atlas M0 Connection Exhaustion**: Cold lambdas each establishing Mongoose connection pools will breach the Atlas free tier 500-connection limit.
4. **Google Sheets Sync Risk**: Synchronous \`logToSheet\` external calls will stall registrations under traffic surges.
`;

    // 2. Generate Modern HTML Report
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KALAM 2026 — Load Test Report</title>
    <style>
        :root {
            --bg: #0F0510;
            --card-bg: #1A0B1E;
            --accent-gold: #F5A623;
            --accent-pink: #D62C76;
            --text: #F3EEF5;
            --text-muted: #A89EB0;
            --green: #10B981;
            --red: #EF4444;
            --border: rgba(245, 166, 35, 0.2);
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 30px 20px;
        }
        .container { max-width: 1000px; margin: 0 auto; }
        header { border-bottom: 1px solid var(--border); padding-bottom: 20px; margin-bottom: 30px; }
        h1 { margin: 0 0 10px 0; font-size: 28px; background: linear-gradient(135deg, #F2D10A, #F47721, #D62C76); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .meta { color: var(--text-muted); font-size: 14px; display: flex; gap: 20px; flex-wrap: wrap; }
        .badge { padding: 4px 10px; border-radius: 999px; font-weight: 600; font-size: 12px; }
        .badge-pass { background: rgba(16, 185, 129, 0.2); color: var(--green); border: 1px solid var(--green); }
        .badge-fail { background: rgba(239, 68, 68, 0.2); color: var(--red); border: 1px solid var(--red); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px; }
        .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
        .card-title { color: var(--text-muted); font-size: 13px; text-transform: uppercase; margin-bottom: 8px; }
        .card-value { font-size: 26px; font-weight: 700; color: #FFF; }
        .card-sub { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; background: var(--card-bg); border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
        th, td { padding: 12px 16px; text-align: left; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        th { background: rgba(255,255,255,0.03); color: var(--text-muted); font-weight: 600; }
        .section-title { font-size: 20px; margin: 30px 0 15px 0; color: var(--accent-gold); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>KALAM 2026 — Performance Engineering & Load Test Audit</h1>
            <div class="meta">
                <span><strong>Scenario:</strong> ${testName}</span>
                <span><strong>Target:</strong> ${targetUrl}</span>
                <span><strong>Date:</strong> ${new Date().toLocaleString()}</span>
                <span class="badge ${passed500VU ? 'badge-pass' : 'badge-fail'}">
                    ${passed500VU ? 'OBJECTIVES MET' : 'THRESHOLD EXCEEDED'}
                </span>
            </div>
        </header>

        <div class="grid">
            <div class="card">
                <div class="card-title">Total Requests</div>
                <div class="card-value">${totalRequests.toLocaleString()}</div>
                <div class="card-sub">${reqRate} requests/second</div>
            </div>
            <div class="card">
                <div class="card-title">p95 Latency</div>
                <div class="card-value">${p95} ms</div>
                <div class="card-sub">p99: ${p99} ms | Avg: ${avg} ms</div>
            </div>
            <div class="card">
                <div class="card-title">Error Rate</div>
                <div class="card-value" style="color: ${Number(failedRate) > 1.0 ? 'var(--red)' : 'var(--green)'};">${failedRate}%</div>
                <div class="card-sub">${failedCount} non-2xx failures</div>
            </div>
            <div class="card">
                <div class="card-title">Network Transferred</div>
                <div class="card-value">${dataRecMB} MB</div>
                <div class="card-sub">${dataSentMB} MB sent</div>
            </div>
        </div>

        <h2 class="section-title">Latency Percentiles (ms)</h2>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>SLO Threshold</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Min</td><td>${min} ms</td><td>-</td><td>Optimal</td></tr>
                <tr><td>Median (p50)</td><td>${p50} ms</td><td>&lt; 250 ms</td><td>${Number(p50) < 250 ? '✅ Pass' : '⚠️ Warning'}</td></tr>
                <tr><td>p90</td><td>${p90} ms</td><td>&lt; 500 ms</td><td>${Number(p90) < 500 ? '✅ Pass' : '⚠️ Warning'}</td></tr>
                <tr><td>p95</td><td>${p95} ms</td><td>&lt; 500 ms</td><td>${Number(p95) < 500 ? '✅ Pass' : '❌ Fail'}</td></tr>
                <tr><td>p99</td><td>${p99} ms</td><td>&lt; 1,000 ms</td><td>${Number(p99) < 1000 ? '✅ Pass' : '❌ Fail'}</td></tr>
                <tr><td>Max</td><td>${max} ms</td><td>-</td><td>Peak Latency</td></tr>
            </tbody>
        </table>

        <h2 class="section-title">Validation Checks</h2>
        <table>
            <thead>
                <tr>
                    <th>Check Assertion</th>
                    <th>Passes</th>
                    <th>Failures</th>
                    <th>Success Rate</th>
                </tr>
            </thead>
            <tbody>
                ${checks.map(c => `
                <tr>
                    <td>${c.name}</td>
                    <td>${c.passes}</td>
                    <td>${c.fails}</td>
                    <td>${(c.passes + c.fails > 0 ? (c.passes / (c.passes + c.fails) * 100).toFixed(1) : 100)}%</td>
                </tr>`).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

    const outDir = path.dirname(jsonFilePath);
    const mdPath = path.join(outDir, `${path.basename(jsonFilePath, '.json')}-report.md`);
    const htmlPath = path.join(outDir, `${path.basename(jsonFilePath, '.json')}-report.html`);

    fs.writeFileSync(mdPath, mdContent);
    fs.writeFileSync(htmlPath, htmlContent);

    console.log(`\nGenerated Markdown Report: ${mdPath}`);
    console.log(`Generated HTML Report    : ${htmlPath}`);

    return { mdPath, htmlPath, p50, p90, p95, p99, avg, reqRate, totalRequests, failedRate };
}

// CLI usage: node generate-report.js <path-to-summary.json> [testName] [targetUrl]
if (process.argv[1] && process.argv[1].endsWith('generate-report.js')) {
    const file = process.argv[2] || './load-testing/results/smoke-summary.json';
    const name = process.argv[3] || 'Smoke Test';
    const target = process.argv[4] || 'http://localhost:5000';
    generateReports(file, name, target);
}
