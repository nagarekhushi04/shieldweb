# ShieldWeb3 Production Deployment Guide 🛡️

Follow these steps to deploy the complete ShieldWeb3 security stack.

## 📋 Prerequisites
- **Node.js**: v20+ (Production: v21.x recommended)
- **Rust**: stable-x86_64-pc-windows-msvc (for Soroban contracts)
- **Python**: 3.11+
- **Stellar CLI**: Latest stable
- **Accounts**: MongoDB Atlas, Upstash (Redis), Railway/Render, Vercel

## 1. Database & Cache Setup

### MongoDB Atlas
1. Create a new cluster (M0 Free tier or dedicated).
2. Create a database user with read/write access.
3. Network Access: Whitelist `0.0.0.0/0` (or Railway IPs).
4. **Connection String**: `mongodb+srv://[user]:[pass]@[cluster].mongodb.net/shieldweb3`

### Upstash Redis
1. Create a Global Redis database.
2. **Environment Variables**: `REDIS_URL=redis://[user]:[pass]@[endpoint]:[port]`

## 2. Stellar Blockchain Layer

### Account Creation
1. Use [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=testnet) to create a **Deployer** account.
2. Fund it with Testnet XLM.

### Contract Deployment
```bash
# Export secret key locally
$env:STELLAR_ACCOUNT_SECRET="S..."

# Deploy Registry
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/threat_registry.wasm --source ACCOUNT_ALIAS --network testnet

# Copy Contract ID
# Registry: C...
# Token: T...
```

## 3. Backend API Deployment (Railway)

1. Connect your GitHub repository to Railway.
2. Set Root Directory: `packages/api`
3. **Environment Variables**:
   - `MONGO_URI`: (Atlas URI)
   - `REDIS_URL`: (Upstash URI)
   - `JWT_SECRET`: (Min 32 characters)
   - `STELLAR_NETWORK`: `testnet`
   - `STELLAR_RPC_URL`: `https://soroban-testnet.stellar.org`
   - `FRONTEND_URL`: `https://shieldweb3.vercel.app`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (for Email Digest)
   - `ML_SERVICE_URL`: `https://shieldweb3-ml.onrender.com`

## 4. Machine Learning Service (Render)

1. Deployment Type: Web Service (Python/Flask).
2. Build Command: `pip install -r requirements.txt && python model/train.py`
3. Start Command: `python app.py`

## 5. Frontend Deployment (Vercel)

1. Connect GitHub repo.
2. **Root Directory**: `apps/frontend`
3. Framework Preset: `Vite`
4. **Environment Variables**:
   - `VITE_API_URL`: (Railway API URL)
   - `VITE_STELLAR_NETWORK`: `testnet`
   - `VITE_REWARD_TOKEN_ID`: (Your deployed token ID)

## 6. Chrome Extension

1. Build locally: `cd apps/extension && npm run build`
2. Zip the `dist` folder.
3. Upload to GitHub Releases for community use.
4. Developers: Load unpacked in `chrome://extensions`.

## 🛡️ Post-Deployment Checklist
- [ ] `GET /api/health` returns `{"status":"ok"}`.
- [ ] `GET /api/stats/ml-performance` returns valid accuracy metrics.
- [ ] Live WebSocket connects on Homepage.
- [ ] First report submission mints SHW3 reward.
- [ ] Daily cron job runs at 08:00 UTC.
