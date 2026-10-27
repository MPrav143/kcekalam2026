# KALAM 2026 — Performance Engineering & Load Testing Suite

High-concurrency load testing, safety auditing, and capacity analysis for the **KALAM 2026** Inter-College Science Fest Web Application.

---

## Architecture Context & Testing Strategy

| Tier | Technology | Hosting Provider | Documented Hard Limits |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS | GitHub Pages (Fastly CDN) | 100 GB/month soft bandwidth; unlimited edge concurrency |
| **Backend API** | Node.js + Express 5 | Vercel Serverless (Hobby Tier) | **Max 10-12 concurrent serverless lambdas**; 10s default execution timeout; 100k invocations/day |
| **Database** | MongoDB Atlas (M0 Free Tier) | AWS us-east-1 / Mumbai | **Max 500 concurrent connections**; shared burstable CPU; in-memory sort limits (32 MB) |
| **CDN** | ImageKit | ImageKit Free Tier | 20 GB/month bandwidth; automatic WebP/AVIF compression |

---

## Test Scenarios

The suite provides 6 dedicated test profiles:

1. **Smoke Test (`01-smoke.js`)**:
   - Concurrency: 1–3 VUs for 20 seconds.
   - Purpose: Verifies all endpoints, checks HTTP 200, checks array schema formatting, verifies latency < 500ms.
   - Run: `npm run test:smoke` or `node run.js smoke`

2. **Ramp-Up Test (`02-ramp-up.js`)**:
   - Concurrency: 0 → 50 → 100 → 250 → 500 VUs.
   - Purpose: Discovers the saturation knee point where latency degrades and connection queuing starts.
   - Run: `npm run test:ramp-up` or `node run.js ramp-up`

3. **Sustained 500-VU Test (`03-sustained-500vu.js`)**:
   - Concurrency: Sustains 500 VUs for 5 to 10 minutes.
   - Purpose: Measures connection pool exhaustion, memory leakage, and event loop starvation.
   - Run: `npm run test:sustained` or `node run.js sustained`

4. **Spike Test (`04-spike.js`)**:
   - Concurrency: 20 VUs baseline → surges to 500 VUs in 10s → holds for 40s → drops to 20 VUs.
   - Purpose: Simulates flash crowds (e.g., fest inaugurations, WhatsApp group registration broadcasts).
   - Run: `npm run test:spike` or `node run.js spike`

5. **Recovery Test (`05-recovery.js`)**:
   - Concurrency: 25 VUs → 500 VUs surge → drops back to 25 VUs.
   - Purpose: Observes whether latency, thread pool, and socket connections recover to baseline after an overload wave.
   - Run: `npm run test:recovery` or `node run.js recovery`

6. **Isolated Admin Test (`06-admin-isolated.js`)**:
   - Concurrency: 1–5 VUs with JWT Bearer authentication.
   - Purpose: Evaluates database aggregation bottlenecks on `/api/auth/stats` separately from public traffic.
   - Run: `npm run test:admin` or `node run.js admin`

---

## Quick Start & Execution

### 1. Run Against Localhost
Ensure backend (`npm start`) and frontend (`npm run dev`) are running:
```bash
cd "load-testing"
npm run test:smoke
npm run test:ramp-up
```

### 2. Run Against Staging or Production (Safe Mode)
Override endpoints via environment variables:
```bash
# PowerShell
$env:API_URL="https://your-backend.vercel.app/api"
$env:FRONTEND_URL="https://your-domain.github.io"
node run.js smoke
```

---

## Safety Guardrails & Rules
1. **Unsafe Mutation Prevention**: Mutation routes (`POST /api/registrations`, `POST /api/payment/*`) are excluded from public traffic loops to prevent database pollution, ticket ID collisions, and Google Sheets rate-limiting.
2. **Auto-Abort Circuit Breaker**: Thresholds fail and tests abort if error rate exceeds 5% or p95 latency exceeds 2,500 ms.
3. **Never Test Without Provider Awareness**: Never blast 500 VUs directly at Vercel Hobby tier without Pro tier concurrency allocation, as Vercel will trigger HTTP 429 and risk domain throttling.

---

## Automated Output Artifacts
Every run generates two synchronized reports in `load-testing/results/`:
- `<scenario>-summary-report.md`: Structured Markdown tables for PR documentation.
- `<scenario>-summary-report.html`: Interactive, styled executive dashboard with latency percentiles, check rates, and bottleneck analysis.
