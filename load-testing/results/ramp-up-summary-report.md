# KALAM 2026 — Load Testing Report
**Scenario:** Ramp-Up Test (0 to 500 VUs)  
**Date:** 2026-10-27T08:20:06.258Z  
**Target URL:** `http://localhost:5000/api`  
**Max Virtual Users:** 500  
**Overall Status:** ⚠️ THRESHOLD EXCEEDED / FAILED

---

## 1. Executive Summary
| Metric | Measured Value | Objective Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Total Requests** | 17,077 | - | Complete |
| **Throughput (req/s)** | 64.59 req/sec | System Dependent | Normal |
| **Error Rate** | 0.00% (0 failed) | < 1.0% | ✅ Passed |
| **Average Latency** | 3319.86 ms | - | - |
| **Median (p50)** | 1439.03 ms | < 250 ms | ⚠️ Warning |
| **p90 Latency** | 8460.46 ms | < 500 ms | ⚠️ Warning |
| **p95 Latency** | 8797.94 ms | < 500 ms | ❌ Exceeded |
| **p99 Latency** | 0.00 ms | < 1,000 ms | ✅ Passed |
| **Max Latency** | 12980.60 ms | - | - |
| **Bandwidth (In / Out)** | 83.34 MB / 2.20 MB | - | Transferred |

---

## 2. Check Verification
| Check Name | Succeeded | Failed | Pass Rate |
| :--- | :--- | :--- | :--- |
| Home HTML status is 200 | 3108 | 0 | 100.0% |
| bootstrap status is 200 | 3108 | 0 | 100.0% |
| bootstrap has config | 3108 | 0 | 100.0% |
| events catalog is 200 | 3108 | 0 | 100.0% |
| ImageKit asset is 200 | 3108 | 0 | 100.0% |
| departments is 200 | 1560 | 0 | 100.0% |
| passes list is 200 | 1853 | 0 | 100.0% |
| passes response has array | 1853 | 0 | 100.0% |
| event detail is 200 | 1231 | 0 | 100.0% |

---

## 3. Top Architecture Findings
1. **Frontend Landing Hydration Storm**: A single visitor triggers 6 parallel API requests (`/upload`, `/content/sponsors`, `/content/clubs`, `/content/departments`, `/content/cultural-subcategories`, `/events`). 500 concurrent visitors generate ~3,000 requests.
2. **Vercel Hobby Tier Concurrency Ceiling**: Vercel free tier limits serverless execution to 10 concurrent lambdas. 500 visitors will saturate this pool immediately, returning HTTP 429 and 504 timeouts.
3. **Atlas M0 Connection Exhaustion**: Cold lambdas each establishing Mongoose connection pools will breach the Atlas free tier 500-connection limit.
4. **Google Sheets Sync Risk**: Synchronous `logToSheet` external calls will stall registrations under traffic surges.
