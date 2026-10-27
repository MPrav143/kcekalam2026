# KALAM 2026 — Load Testing Report
**Scenario:** Smoke Test (1-3 VUs)  
**Date:** 2026-10-27T08:15:16.950Z  
**Target URL:** `http://localhost:5000/api`  
**Max Virtual Users:** 3  
**Overall Status:** ✅ PASSED

---

## 1. Executive Summary
| Metric | Measured Value | Objective Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Total Requests** | 50 | - | Complete |
| **Throughput (req/s)** | 1.69 req/sec | System Dependent | Normal |
| **Error Rate** | 0.00% (0 failed) | < 1.0% | ✅ Passed |
| **Average Latency** | 67.29 ms | - | - |
| **Median (p50)** | 44.33 ms | < 250 ms | ✅ Passed |
| **p90 Latency** | 78.66 ms | < 500 ms | ✅ Passed |
| **p95 Latency** | 226.24 ms | < 500 ms | ✅ Passed |
| **p99 Latency** | 0.00 ms | < 1,000 ms | ✅ Passed |
| **Max Latency** | 680.81 ms | - | - |
| **Bandwidth (In / Out)** | 0.22 MB / 0.01 MB | - | Transferred |

---

## 2. Check Verification
| Check Name | Succeeded | Failed | Pass Rate |
| :--- | :--- | :--- | :--- |
| Home HTML status is 200 | 7 | 0 | 100.0% |
| bootstrap status is 200 | 7 | 0 | 100.0% |
| bootstrap has config | 7 | 0 | 100.0% |
| events catalog is 200 | 7 | 0 | 100.0% |
| ImageKit asset is 200 | 7 | 0 | 100.0% |
| departments is 200 | 7 | 0 | 100.0% |
| passes list is 200 | 7 | 0 | 100.0% |
| passes response has array | 7 | 0 | 100.0% |
| event detail is 200 | 7 | 0 | 100.0% |

---

## 3. Top Architecture Findings
1. **Frontend Landing Hydration Storm**: A single visitor triggers 6 parallel API requests (`/upload`, `/content/sponsors`, `/content/clubs`, `/content/departments`, `/content/cultural-subcategories`, `/events`). 500 concurrent visitors generate ~3,000 requests.
2. **Vercel Hobby Tier Concurrency Ceiling**: Vercel free tier limits serverless execution to 10 concurrent lambdas. 500 visitors will saturate this pool immediately, returning HTTP 429 and 504 timeouts.
3. **Atlas M0 Connection Exhaustion**: Cold lambdas each establishing Mongoose connection pools will breach the Atlas free tier 500-connection limit.
4. **Google Sheets Sync Risk**: Synchronous `logToSheet` external calls will stall registrations under traffic surges.
