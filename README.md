# 🛡️ ShieldWeb3 — Web3 Anti-Phishing Security Layer

## Live Links
- Frontend: https://shieldweb3.vercel.app (update after deploy)
- API: https://shieldweb3-api.railway.app (update after deploy)
- Demo Video: [to be added]
- Chrome Extension: Download from /releases

## Overview
Web3 users face an unprecedented wave of sophisticated phishing attacks, fake wallet connections, and malicious smart contracts. Traditional security tools are localized and slow to respond, leaving users vulnerable to draining their entire crypto portfolios with a single errant click. 

ShieldWeb3 is a decentralized, real-time anti-phishing platform built on the Stellar blockchain. By combining crowdsourced threat reporting, machine learning verification, and immediate browser-level blocking, ShieldWeb3 creates an impenetrable security layer for users. verified threats are logged immutably on Stellar, and reporters are incentivized with SHW3 tokens for their crucial contributions to network security.

## Architecture
```text
[ Browser ] <--- Extension intercepts URL ---> [ ShieldWeb3 Extension ]
                                                       |
                                                       v
[ ShieldWeb3 React App ] <---------------------> [ Node.js REST API ]
     (User Dashboard)                                  |    ^
                                                       |    |
                                                       v    |
    [ MySQL/MongoDB ] <--- Store Reports --- [ Python ML Service ] 
     (Raw Threat Data)                       (Phishing Classifier)
                                                       |
                                                       v
                                            [ Stellar Blockchain ]
                                            (Soroban Smart Contracts)
                                              - Threat Registry
                                              - SHW3 Token Rewards
```

Full architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite + TailwindCSS (Stitch-generated) | User interface |
| Extension | Chrome MV3 + TypeScript | Browser protection |
| Backend | Node.js + Express + TypeScript | REST API |
| ML Service | Python + FastAPI + scikit-learn | Phishing detection |
| Blockchain | Stellar Testnet + Soroban (Rust) | Threat registry |
| Database | MongoDB Atlas + Redis | Storage + caching |
| Auth | Stellar Freighter + JWT | Wallet sign-in |
| Deploy | Vercel + Railway + Render | Hosting |

## Quick Start
### Prerequisites
- Node.js v18+ and Python 3.9+
- Stellar Freighter Wallet extension
- MongoDB instance running natively or via Docker

### Setup Instructions
1. Clone the repository: `git clone https://github.com/user/shieldweb3.git && cd shieldweb3`
2. Install Root Dependencies: `npm install`
3. Configure Env Variables for `apps/frontend`, `apps/api`, `apps/ml-service`.
4. Deploy Smart Contracts to Stellar Testnet (see `contract/README.md`).
5. Run ML Service: `cd apps/ml-service && pip install -r requirements.txt && uvicorn main:app --reload`
6. Run API Backend: `cd apps/api && npm run dev`
7. Run Frontend: `cd apps/frontend && npm run dev`
8. Load Extension: Open Chrome `chrome://extensions`, enable Developer Mode, and "Load Unpacked" pointing to `apps/extension/dist`.

## Smart Contracts
- Threat Registry: [CONTRACT_ID] — View on Stellar Explorer
- Reward Token (SHW3): [CONTRACT_ID] — View on Stellar Explorer

## API Reference
Base URL: https://shieldweb3-api.railway.app
GET /api/threats/check?url= — Check URL for phishing
POST /api/reports/submit — Submit a threat report (auth required)
POST /api/auth/challenge — Get auth challenge
POST /api/auth/verify — Verify wallet signature + get JWT
Full docs: [docs/API.md](docs/API.md)

## Testnet Users
| # | Name | Wallet Address | Stellar Explorer |
|---|------|---------------|-----------------|
| 1 | [fill after onboarding] | G... | link |
| 2 | [fill] | G... | link |
| 3 | [fill] | G... | link |
| 4 | [fill] | G... | link |
| 5 | [fill] | G... | link |

## User Feedback
Google Form: https://forms.gle/[ID]
Exported data: [docs/user_feedback.xlsx](docs/user_feedback.xlsx)

### Feedback Summary (after collection)
Average rating: /5 | Top request: [X] | Common bugs: [Y]

## Iteration Plan
### Changes completed based on user feedback:
Issue: [from form]
Fix: [what was changed]
Commit: https://github.com/[user]/shieldweb3/commit/[hash]

### Phase 2 Roadmap:
- MetaMask Snap integration
- Cross-chain support (Ethereum, Solana)
- DAO governance voting on threats
- Mobile app
- Twitter/Discord phishing link monitoring

## Deployment
1. **Frontend (Vercel):** Connect GitHub repo, set Root Directory to `apps/frontend`, configure env variables, and deploy.
2. **Backend (Railway):** Connect GitHub repo, deploy `apps/api` folder, attach MongoDB database volume.
3. **ML Service (Render):** Link repository, select Web Service, target `apps/ml-service`, set Start Command to `uvicorn main:app --host 0.0.0.0 --port 10000`.
