# ShieldWeb3 API Reference

Base URL: `https://shieldweb3-api.railway.app`

## Authentication Flow Sequence
```text
Client (Wallet)               ShieldWeb3 API                 Stellar 
      |                             |                           |
      |-- 1. POST /auth/challenge ->|                           |
      |<- 2. Returns Challenge -----|                           |
      |                             |                           |
      |-- 3. User signs Challenge   |                           |
      |                             |                           |
      |-- 4. POST /auth/verify ---->|                           |
      |      (Contains Signature)   |-- 5. Verify Signature --->|
      |                             |<--------------------------|
      |<- 6. Returns JWT & User ----|                           |
```

## Endpoints

### 1. Check a URL
Determines if a URL is a known threat or performs a real-time ML score calculation.

- **URL:** `/api/threats/check`
- **Method:** `GET`
- **Auth required:** No
- **Query Params:** `url` (string, required)

**Example Request:**
```http
GET /api/threats/check?url=https://stellar.org HTTP/1.1
```

**Example Response:**
```json
{
  "safe": true,
  "threat": null,
  "mlScore": 12,
  "source": "AI_SCAN"
}
```

### 2. Get Auth Challenge
Retrieves a randomly generated server challenge for the wallet to sign.

- **URL:** `/api/auth/challenge`
- **Method:** `POST`
- **Auth required:** No
- **Body:**
```json
{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
}
```

**Example Response:**
```json
{
  "challenge": "shw3-auth-9f8e7d...1a2b3c",
  "expiresAt": 1678886400000
}
```

### 3. Verify Auth Signature
Verifies a signed challenge payload and returns a session JWT.

- **URL:** `/api/auth/verify`
- **Method:** `POST`
- **Auth required:** No
- **Body:**
```json
{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
  "signature": "base64_encoded_signature_string",
  "challenge": "shw3-auth-9f8e7d...1a2b3c"
}
```

**Example Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "walletAddress": "GABC...",
    "shw3Balance": "45.00",
    "reputation": 85
  }
}
```

### 4. Submit Threat Report
Allows a registered user to submit a URL as a verified threat. 

- **URL:** `/api/reports/submit`
- **Method:** `POST`
- **Auth required:** Yes (Bearer JWT)
- **Body:**
```json
{
  "url": "http://scam-site.xyz",
  "threatType": "Phishing",
  "severity": 4,
  "description": "Fake wallet drainer",
  "evidence": "http://imgur.com/screenshot.jpg"
}
```

**Example Response:**
```json
{
  "reportId": "rep_5f8a9b...",
  "mlScore": 92,
  "txHash": null
}
```

## Error Codes
| Status Code | Code String | Description |
|-------------|------------|-------------|
| 400 | `BAD_REQUEST` | Invalid input payload or missing URL |
| 401 | `UNAUTHORIZED` | Missing, invalid, or expired JWT |
| 403 | `FORBIDDEN` | Valid token but unauthorized action |
| 429 | `RATE_LIMITED` | Too many requests (Limit: 100/min) |
| 500 | `INTERNAL_SERVER_ERROR` | Unknown system failure |

## Rate Limiting
- **Global:** 100 requests per IP per minute.
- **Reporting:** 10 reports per user per hour to prevent spam.
