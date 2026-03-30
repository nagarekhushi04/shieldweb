# 🚀 ShieldWeb3 User Access & Onboarding Guide

Welcome to ShieldWeb3! This guide will walk you through the complete setup to access all features, from real-time AI phishing detection to decentralized reporting on the Stellar blockchain.

---

## 📋 Prerequisites
Before you start, ensure you have the following installed:
1. **[Freighter Wallet](https://www.freighter.app/)**: The official Stellar browser extension.
2. **Node.js (v18+)**: To run the frontend and API.
3. **Python (3.9+)**: To run the AI Phishing detection service.

---

## 🏃 Quick Start: Launching the Ecosystem

ShieldWeb3 uses a **Turbo monorepo** to manage its services. Follow these steps to get everything running locally:

### 1. Launch Frontend & API
Open your terminal in the root directory and run:
```bash
npm install
npm run dev
```
*   **Frontend**: [http://localhost:5173](http://localhost:5173) (User Dashboard)
*   **API Service**: [http://localhost:4000](http://localhost:4000)

### 2. Launch AI Detection Service
Open a second terminal and navigate to the ML service directory:
```bash
cd apps/ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```
*   **ML Service**: [http://localhost:8000](http://localhost:8000)

---

## 🦊 Setting Up Your Wallet (Freighter)

To report threats and earn rewards, you must connect your Stellar wallet:
1. Open **Freighter** and create/import an account.
2. **Switch to Testnet**: Settings > Network > Toggle "Testnet".
3. **Fund Your Wallet**: Use the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet) to get free Testnet XLM.
4. On the [ShieldWeb3 Dashboard](http://localhost:5173), click **"Connect Wallet"**.
5. **Sign the Handshake**: Freighter will ask you to sign a "Bump Sequence" transaction. This is a **0-fee** transaction used purely for secure authentication.

---

## 🛡️ Installing the Chrome Extension
The extension provides proactive protection by blocking malicious sites before you visit them.
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **"Developer mode"** (top right).
3. Click **"Load unpacked"**.
4. Select the folder: `c:\Users\khush\Shieldweb\shieldweb3\apps\extension\dist`.
5. Pin the ShieldWeb3 icon to your browser for real-time status updates!

---

## 🧪 Functional Walkthrough

### 🔍 Real-Time Scanning
1. Go to the [Home Page](http://localhost:5173).
2. Paste a URL to verify. 
   - **Try a Safe URL**: `https://metamask.io` or `https://uniswap.org`
   - **Try a Phishing URL**: `http://metamask-airdrop-claim.xyz` or `http://phantom-wallet-update.pw`
3. Click **"Scan Link"**.
4. Our AI will analyze the site and check the Stellar Ledger registry simultaneously.

### 🚩 reporting a Threat
1. Navigate to the **"Report"** tab.
2. Paste the malicious URL and a brief description.
3. Submit the report. It will be analyzed by the ML service and, if verified, logged immutably on the Stellar blockchain.

### 🏆 Leaderboard & Rewards
View the top contributors on the **Leaderboard** page. Active defenders who contribute to the network's safety earn **SHW3 tokens**!

---

## 🆘 Troubleshooting
- **Blank Screen?** Ensure you are running the latest version of Chrome.
- **Connection Error?** Check that both the API (4000) and ML service (8000) are running.
- **Signing Failed?** Ensure your Freighter wallet is unlocked and set to "Testnet".

---
*Built for the Stellar ecosystem. Secure your Web3 journey with ShieldWeb3.*
