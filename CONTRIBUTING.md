# Contributing to ShieldWeb3 🛡️

First of all, thank you for helping us protect the Stellar ecosystem! ShieldWeb3 is a community-driven project, and every contribution—whether code, data, or feedback—helps make Web3 safer for everyone.

## 🌟 Ways to Contribute

### 1. Report Phishing Sites (Most Impactful)
The simplest way to contribute is by reporting malicious URLs you encounter.
- **Where**: [shieldweb3.app/report](https://shieldweb3.vercel.app/report)
- **Reward**: Earn **10 SHW3 tokens** for every report that is verified on-chain.
- **Tip**: Provide a clear description and set the correct severity level (1-4).

### 2. Community Auditing & Voting
Help verify the accuracy of reports submitted by others.
- **Where**: [shieldweb3.app/community](https://shieldweb3.vercel.app/community)
- **Action**: Upvote confirmed threats or downvote false positives.
- **Reward**: Earn **1 SHW3 point** per vote that aligns with the final verification outcome.

### 3. Code Contributions
We welcome developers to help improve our infrastructure, AI models, and user experience.

#### Prerequisites
- **Node.js**: v20+
- **Rust**: Latest stable (for Soroban contracts)
- **Python**: 3.11+ (for ML Service)
- **Stellar CLI**: For contract interaction

#### Local Setup
1. **Clone & Install**:
   ```bash
   git clone https://github.com/nagarekhushi04/shieldweb3.git
   cd shieldweb3
   npm install
   ```
2. **Environment**:
   Copy `.env.example` to `.env` in the root and fill in your local development keys.
3. **ML Service**:
   ```bash
   cd apps/ml-service
   pip install -r requirements.txt
   python model/train.py  # Train the initial model
   ```
4. **Run Dev Environment**:
   ```bash
   # Terminal 1: Backend API
   npm run dev:api
   
   # Terminal 2: Frontend App
   npm run dev:frontend
   ```

#### Branching Policy
- `feat/feature-name` for new additions.
- `fix/bug-description` for patches.
- `docs/doc-update` for documentation changes.

### 4. Machine Learning Improvements
The heart of our detection is in `apps/ml-service/model/`.
- Add new training data to `model/train.py`.
- Optimize the classification layers.
- **Requirement**: PRs for ML changes must include a summary of accuracy/precision/recall metrics before and after the change.

## 📜 Code of Conduct
- **Integrity**: Intentional false reporting will result in a permanent wallet ban and loss of SHW3 rewards.
- **Respect**: We maintain a professional and inclusive environment for all security researchers.

## 🏆 Recognition
Top researchers are featured on our [Community Leaderboard](https://shieldweb3.vercel.app/community). Verified "Guardians" receive early access to future security tools and monthly SHW3 bonuses.

---
*Built with ❤️ for the Stellar Community.*
