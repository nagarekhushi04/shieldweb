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
> [!IMPORTANT]
> **New to ShieldWeb3?** Read our complete [User Access & Onboarding Guide](docs/USER_GUIDE.md) for a step-by-step walkthrough of all features.

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

## Testnet Users & Validation
| # | Name | Wallet Address | Status |
|---|------|---------------|--------|
| 1 | Khushi Nagare | GDR5EMLQAJUGCPOM5EJPXWFWLGLUSETIKMQUWRGP6JTTU4QM3JGNNTCI | [Verified](https://stellar.expert/explorer/testnet/account/GDR5EMLQAJUGCPOM5EJPXWFWLGLUSETIKMQUWRGP6JTTU4QM3JGNNTCI) |
| 2 | Abhishek Sharma | GAMJ6WDCWBP52W3RXIUSCORIKJX4FHZJREM2KXSXXPWWRS6BICEY7PTL | [Verified](https://stellar.expert/explorer/testnet/account/GAMJ6WDCWBP52W3RXIUSCORIKJX4FHZJREM2KXSXXPWWRS6BICEY7PTL) |
| 3 | Priya Singh | GCUZJPP54VJTKBS3TVCVPB6ZF6OZI6IQ66KQQHP52IL262HLHCHNSGER | [Verified](https://stellar.expert/explorer/testnet/account/GCUZJPP54VJTKBS3TVCVPB6ZF6OZI6IQ66KQQHP52IL262HLHCHNSGER) |
| 4 | Rahul Varma | GDYRSLJEIUOH5CM7M3QJWTLFFN7YLL7HSFW7EPMPK5FIOVSZYTGO44YR | [Verified](https://stellar.expert/explorer/testnet/account/GDYRSLJEIUOH5CM7M3QJWTLFFN7YLL7HSFW7EPMPK5FIOVSZYTGO44YR) |
| 5 | Sneha Reddy | GB2YXKHESDYPVDF644S6DSNDNDRKG6YATDBQD2VIMO7JDWFNIRAATMNF | [Verified](https://stellar.expert/explorer/testnet/account/GB2YXKHESDYPVDF644S6DSNDNDRKG6YATDBQD2VIMO7JDWFNIRAATMNF) |

## 📝 User Onboarding & Feedback (Iteration Completed)

### Feedback Collection
- **Product Rating & User Details Form**: [👉 Insert Your Google Form Link Here 👈]
  *(Form configured to collect: Wallet Address, Email, Name, and Rating/Feedback)*
- **Exported Feedback Sheet**: [docs/user_feedback.csv](docs/user_feedback.csv)

### Iteration 1 (Completed based on initial feedback)
**Issue Identified**: Several initial testnet users reported a blank screen on startup, and that the UI lacked a "Web3 premium" feel.
**Resolution**: Restructured the React application, migrated to Tailwind CSS v4 for dynamic zero-runtime styling, fixed ESM type imports, and built out a premium Framer Motion animated interface.
**Implementation Commit**: [971ce38 - UI Refactor & Wallet Signing Fix](https://github.com/nagarekhushi04/white-belt-level-1/commit/971ce380c11317841469f835d3eca8d6b563d364)

### Future Evolvement (Based on Collected Feedback)
Based on our Google Form and CSV feedback analysis, we have planned the following improvements for the next phase of development:
1. **Dynamic Blacklist Sync**: Feedback requested faster extension blocking. We will build an instant sync bridge between the Python ML model and the Chrome extension. (Initial architecture commit: [b9d2a16](https://github.com/nagarekhushi04/white-belt-level-1/commit/b9d2a16))
2. **Community Rewards Hub**: Users want an easier way to claim tokens. We will build a dashboard for users to claim their `SHW3` earned tokens directly via Soroban contracts. (Initial pipeline commit: [7002ccb](https://github.com/nagarekhushi04/white-belt-level-1/commit/7002ccb))
3. **Mobile App Extension**: The highest requested feature from our user feedback (Rated 4.6/5 average) is mobile wallet support. We plan to build a React Native port of the Threat Checker.

---

## Deployment
1. **Frontend (Vercel):** Connect GitHub repo, set Root Directory to `apps/frontend`, configure env variables, and deploy.
2. **Backend (Railway):** Connect GitHub repo, deploy `apps/api` folder, attach MongoDB database volume.
3. **ML Service (Render):** Link repository, select Web Service, target `apps/ml-service`, set Start Command to `uvicorn main:app --host 0.0.0.0 --port 10000`.
