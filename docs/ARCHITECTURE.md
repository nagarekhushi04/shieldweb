# ShieldWeb3 Architecture

## Overview
ShieldWeb3 is a decentralized anti-phishing system that detects, reports, and blocks phishing URLs/domains in real-time. It leverages the Stellar Testnet for on-chain threat storage, enables community reporting with token rewards, and provides real-time protection via a browser extension.

## System Architecture Diagram

```ascii
+--------------------+       +--------------------+
|                    |       |                    |
| User Browser /     |<----->| Backend API        |
| Chrome Extension   |       | (Node + Express)   |
|                    |       |                    |
+---------+----------+       +---------+----------+
          |                            |
          |                            v
          |                  +--------------------+
          |                  |                    |
          +----------------->| ML Service         |
          |                  | (Python FastAPI)   |
          v                  +--------------------+
+--------------------+                 |
|                    |                 |
| Frontend Web App   |                 v
| (React + Vite)     |       +--------------------+
+--------------------+       |                    |
                             | Database / Redis   |
                             +--------------------+
                                       |
                                       v
                             +--------------------+
                             |                    |
                             | Stellar Blockchain |
                             | (Soroban Contracts)|
                             +--------------------+
```

## Component Breakdown

### Frontend (React + Vite + TypeScript)
The web-based user interface for managing community reports, viewing threat statistics, and accessing user dashboards.

### Extension (Chrome Extension MV3)
A real-time protection tool installed in the user's browser that intercepts URLs and checks them against the threat registry in real time.

### Backend API (Node.js + Express + TypeScript)
The core bridge coordinating interactions between the extension, frontend, ML services, and on-chain intelligence. It provides endpoints for URL lookups, report submission, and reward distribution.

### ML Service (Python FastAPI)
A low-latency service responsible for scoring URLs dynamically using heuristic and machine learning models to detect unknown zero-day phishing attempts.

### Database
A combination of MongoDB (for off-chain metadata, user info) and Redis (for fast caching of known safe/malicious URLs to achieve low latency).

### Stellar Blockchain (Soroban Contracts)
The decentralized ledger where verified threat telemetry is persistently stored. The Soroban contracts govern the threat registry and manage the custom reward token mechanics for community contributors.

## Data Flow

**User visits URL → Extension detects → API checks cache → ML scores → Stellar on-chain check → result returned**

1. **User visits URL:** The Chrome Extension intercepts the navigation event.
2. **Extension detects:** The extension sends the URL to the Backend API for scanning.
3. **API checks cache:** API queries Redis for immediate matches (safe/malicious).
4. **ML scores:** If not in cache, the API queries the ML Service to score the URL. 
5. **Stellar on-chain check:** Threats confirmed by ML and historical context are cross-referenced with the Soroban threat registry. 
6. **Result returned:** The aggregated verdict is returned to the extension, which blocks the navigation if malicious, or allows it otherwise.

## Tech Stack Table

| Component      | Technology                 |
|----------------|----------------------------|
| Frontend       | React, Vite, TypeScript    |
| Extension      | Chrome MV3, TypeScript     |
| Backend API    | Node.js, Express, TS       |
| ML Service     | Python, FastAPI            |
| Blockchain     | Stellar Testnet, Soroban   |
| Smart Contracts| Rust                       |
| Database       | MongoDB, Redis             |
| CI/CD          | GitHub Actions, Turborepo  |

## Deployment Architecture

- **Frontend & App:** Deployed via edge platforms (e.g., Vercel / Cloudflare).
- **Backend API:** Containerized and deployed on managed services (e.g., AWS ECS or Render).
- **ML Service:** Deployed on GPU-optimized or fast CPU cloud instances.
- **Data Layer:** Managed DBaaS (MongoDB Atlas, Redis Enterprise or Elasticache).
- **On-chain:** Soroban Rust contracts deployed strictly to the Stellar Testnet.

## Security Considerations

- **API Protection:** Endpoints must be strictly rate-limited and require valid API keys or JWTs.
- **Extension Integrity:** The MV3 extension operates under strict Content Security Policies (CSP) to mitigate cross-site scripting (XSS) risks.
- **Contract Security:** Smart contracts will implement access control, bounding parameters, and strict execution error handling to prevent re-entrancy or abuse of the reward system.
- **Data Privacy:** Only domain hashes or aggregated data are stored on-chain. PII stringently separated from telemetry.

## API Rate Limiting Strategy

To prevent DDoS and cost explosions:
1. **Tiered Limits:** Unauthenticated users have strict limits, authenticated users have moderate limits, and verified premium nodes have relaxed limits.
2. **Token Bucket Algorithm:** Implemented via Redis to drop excessive requests quickly.
3. **Caching:** Heavily cache results to reduce redundant workload on the API and ML Service.
