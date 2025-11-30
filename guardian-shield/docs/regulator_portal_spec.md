# Regulator Portal Specification

## Overview

The Regulator Portal provides read-only access to Guardian Shield's compliance evidence and reporting capabilities for authorized regulatory bodies.

---

## 1. Access Control

### 1.1 Authentication

| Method | Description |
|--------|-------------|
| SAML 2.0 | Primary SSO integration with regulator IdPs |
| X.509 Client Certificates | mTLS for API access |
| Hardware Token | Required for sensitive data access |

### 1.2 Authorization Levels

| Level | Description | Capabilities |
|-------|-------------|--------------|
| L1 - Basic | Standard regulatory access | View dashboards, basic queries |
| L2 - Detailed | Enhanced access | Full evidence queries, exports |
| L3 - Forensic | Investigation access | Raw data access, audit trails |

### 1.3 Session Management

```yaml
session:
  maxDuration: 8h
  idleTimeout: 30m
  concurrentSessions: 1
  geoRestriction: enabled
  ipWhitelist: required
```

---

## 2. Dashboard Features

### 2.1 Overview Dashboard

**Components:**
- Real-time compliance status indicator
- SLA compliance gauge
- Active alerts summary
- Recent evidence entries

**Metrics Displayed:**
- Fraud events (24h/7d/30d)
- Alert response times
- Evidence integrity status
- Blockchain anchor status

### 2.2 Fraud Monitoring Dashboard

**Components:**
- Fraud risk trend chart
- Events by severity pie chart
- Events by type breakdown
- Geographic distribution map

**Filters:**
- Date range
- Severity level
- Event type
- Address search

### 2.3 Evidence Dashboard

**Components:**
- Evidence entry timeline
- Hash chain verification status
- Anchor verification status
- Entry type distribution

**Features:**
- Click-through to entry details
- Verification button
- Export selection

---

## 3. Query Capabilities

### 3.1 Supported Query Types

#### Basic Queries
```sql
-- Example: Fraud events in date range
SELECT * FROM evidence
WHERE type = 'fraud_event'
AND timestamp BETWEEN '2025-01-01' AND '2025-01-31'
ORDER BY timestamp DESC
```

#### Advanced Queries
```sql
-- Example: High severity events with specific address
SELECT * FROM evidence
WHERE type = 'fraud_event'
AND content->>'severity' IN ('critical', 'high')
AND content->'addresses_involved' ? '0x1234...'
```

### 3.2 Query Interface

**Visual Query Builder:**
- Field selection dropdown
- Condition builder
- Date range picker
- Result preview

**Raw Query Mode:**
- SQL-like syntax (read-only subset)
- Query validation
- Execution time limits
- Result size limits

### 3.3 Query Limits

| Parameter | Limit |
|-----------|-------|
| Max results | 10,000 |
| Query timeout | 60s |
| Concurrent queries | 5 |
| Query history | 90 days |

---

## 4. Verification Tools

### 4.1 Hash Chain Verifier

**Purpose:** Verify integrity of evidence hash chain

**Interface:**
```
[Entry Range: ___ to ___]
[Verify Button]

Results:
- Entries verified: XXX
- Chain valid: ✓
- Verification time: X.Xs
```

**Output:**
- Verification certificate (downloadable)
- Any detected anomalies

### 4.2 Signature Verifier

**Purpose:** Verify cryptographic signatures on evidence

**Interface:**
```
[Entry ID: _______________]
[Verify Button]

Results:
- Signature valid: ✓
- Signer: shield-signer-001
- Algorithm: ECDSA-P256
- Timestamp: 2025-01-15T10:30:00Z
```

### 4.3 Blockchain Anchor Verifier

**Purpose:** Verify on-chain anchor proofs

**Interface:**
```
[Transaction Hash: _______________]
[Chain: BSC / ETH / BTC]
[Verify Button]

Results:
- Anchor valid: ✓
- Block: #12345678
- Confirmations: 250
- Merkle root matches: ✓
- Entries included: 150
```

### 4.4 Merkle Proof Verifier

**Purpose:** Verify individual entry inclusion in anchor

**Interface:**
```
[Entry ID: _______________]
[Anchor TX: _______________]
[Verify Inclusion]

Results:
- Entry included: ✓
- Merkle proof valid: ✓
- Path length: 8 hashes
```

---

## 5. Export Capabilities

### 5.1 Report Types

| Report | Format | Schedule |
|--------|--------|----------|
| Weekly Compliance | PDF/A | Auto |
| Monthly Summary | PDF/A | Auto |
| Custom Query Export | CSV/JSON | On-demand |
| Evidence Bundle | ZIP | On-demand |
| Audit Trail | PDF/A | On-demand |

### 5.2 Bundle Contents

**Standard Bundle (ZIP):**
```
evidence_bundle_20250115/
├── manifest.json           # Bundle metadata
├── entries/               # Evidence entries
│   ├── entry_001.json
│   └── ...
├── signatures/            # Entry signatures
│   └── sig_001.p7s
├── anchors/              # Anchor proofs
│   └── anchor_001.json
├── verification/         # Verification certificates
│   └── chain_verification.json
└── README.txt            # Bundle documentation
```

### 5.3 Export Security

- All exports logged in audit trail
- Exports encrypted with regulator's public key
- Download links expire after 24 hours
- Maximum 10 exports per day

---

## 6. Audit Trail

### 6.1 Logged Actions

| Action | Details Logged |
|--------|----------------|
| Login | User, IP, method, success/fail |
| Query | Query text, results count, duration |
| Export | Type, entries included, file size |
| Verification | Type, target, result |
| Logout | Duration, actions count |

### 6.2 Audit Export

Regulators can export their own audit trail:

```json
{
  "period": {
    "from": "2025-01-01T00:00:00Z",
    "to": "2025-01-31T23:59:59Z"
  },
  "user": "regulator@example.gov",
  "actions": [
    {
      "timestamp": "2025-01-15T10:30:00Z",
      "action": "query",
      "details": {
        "query": "...",
        "results": 150,
        "duration_ms": 250
      }
    }
  ]
}
```

---

## 7. Notifications

### 7.1 Alert Subscriptions

Regulators can subscribe to:
- Critical fraud events
- SLA violations
- Evidence integrity issues
- System health alerts

### 7.2 Notification Channels

| Channel | Configuration |
|---------|---------------|
| Email | Verified regulator email |
| Webhook | Regulator-provided endpoint |
| Portal | In-app notifications |

### 7.3 Digest Reports

- Daily summary email (optional)
- Weekly compliance digest
- Monthly executive summary

---

## 8. API Access

### 8.1 Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /evidence` | Query evidence entries |
| `GET /evidence/{id}` | Get specific entry |
| `GET /verification/chain` | Verify hash chain |
| `GET /verification/anchor/{tx}` | Verify anchor |
| `GET /export` | List exports |
| `POST /export` | Create export |

### 8.2 Rate Limits

| Tier | Requests/min | Burst |
|------|--------------|-------|
| L1 | 30 | 50 |
| L2 | 60 | 100 |
| L3 | 120 | 200 |

### 8.3 API Authentication

```bash
# mTLS with JWT
curl -X GET \
  --cert client.crt \
  --key client.key \
  -H "Authorization: Bearer <JWT>" \
  https://api.shield.cryptohound.io/v1/evidence
```

---

## 9. Technical Requirements

### 9.1 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

### 9.2 Network Requirements

- TLS 1.3 required
- IP whitelist configuration
- Stable connection for exports

### 9.3 Client Certificates

- X.509 certificates required for API
- Certificate chain validation
- CRL/OCSP checking enabled

---

## 10. Support

### 10.1 Contact

| Type | Contact |
|------|---------|
| Technical | support@cryptohound.io |
| Security | security@cryptohound.io |
| Emergency | +1-xxx-xxx-xxxx |

### 10.2 Documentation

- API documentation: `/docs/api`
- User guide: `/docs/guide`
- FAQ: `/docs/faq`

---

**Specification Version:** 1.0  
**Last Updated:** {{DATE}}  
**Classification:** Confidential
