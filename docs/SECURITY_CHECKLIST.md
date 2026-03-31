# ShieldWeb3 Security Checklist

## Authentication & Authorization
- [x] **Stellar Wallet Auth**: Signature verification (Ed25519) on all login attempts.
- [x] **JWT Hardening**: HS256 algorithm, 24h expiry, and issuer validation (`shieldweb3`).
- [x] **Secret Enforcement**: Minimum 32-character `JWT_SECRET` required for production startup.
- [x] **Role-Based Access**: Dedicated `requireAdmin` middleware for sensitive operations.
- [x] **Challenge Logic**: 5-minute TTL on Redis-based auth challenges with replay prevention.

## Input Validation & Sanitization
- [x] **Schema Validation**: Global Zod schemas for all POST/PUT payloads.
- [x] **Stellar Address Check**: Regex-based validation for 56-character base32 public keys.
- [x] **URL Sanitization**: Strict length limits (2048 chars) and format verification.
- [x] **NoSQL Injection**: `express-mongo-sanitize` to block unauthorized query operators.
- [x] **XSS Protection**: `xss-clean` to filter malicious scripts from user input.
- [x] **Payload Limits**: Request body size restricted to 10kb to prevent memory exhaustion.

## Rate Limiting & Protection
- [x] **Global Limiter**: 300 requests per 15 mins per IP.
- [x] **Auth Limiter**: 10 login attempts per 15 mins per IP.
- [x] **URL Check Limiter**: 60 scans per minute per IP.
- [x] **Report Limiter**: 20 submissions per hour per IP.
- [x] **Progressive Slow-down**: `express-slow-down` used to increase latency before blocking IPs.

## Transport & Header Security
- [x] **Strict CSP**: `helmet` configured with specific allowed sources for scripts, styles, and Web3 RPCs.
- [x] **HSTS**: 1-year HSTS header enforced for secure HTTPS subdomains.
- [x] **CORS Pinning**: Restricted to Vercel production domains, specific localhost ports, and the Chrome Extension.
- [x] **Referrer Policy**: `strict-origin-when-cross-origin` for privacy preservation.

## Data & Infrastructure
- [x] **Secret Management**: All sensitive keys stored in environment variables (never committed).
- [x] **Database Security**: Atlas IP whitelisting and strictly managed access clusters.
- [x] **Privacy**: URLs hashed (SHA-256) before storage on-chain.
- [x] **Monitoring**: Real-time telemetry for API response times and error rates.

## Blockchain Security
- [x] **Signature Verification**: Server-side verification before any smart contract interaction.
- [x] **Contract Initialization**: Re-initialization blocked at the contract level.
- [x] **Auditability**: All critical threat reporting logic mirrored on-chain for public audit.
