# Regulator Portal Specification
## Guardian Shield — Crypto Hound LLC

---

## 1. Overview

The Regulator Portal provides authorized regulatory bodies with secure, read-only access to fraud detection evidence, compliance reports, and real-time monitoring dashboards.

---

## 2. User Experience

### 2.1 Access Flow

```
1. Regulator receives invite email
2. Completes MFA enrollment (TOTP or WebAuthn)
3. Accepts terms of access
4. Gains read-only dashboard access
5. Session expires after 8 hours of inactivity
```

### 2.2 Portal Navigation

```
┌─────────────────────────────────────────────────────────────┐
│  Guardian Shield — Regulator Portal          [User] [Logout]│
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│  Dashboard  │   Content Area                                │
│  Evidence   │                                               │
│  Reports    │                                               │
│  Drills     │                                               │
│  Audit Log  │                                               │
│  Settings   │                                               │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

---

## 3. Features

### 3.1 Dashboard

**Purpose**: Real-time overview of system health and fraud metrics

**Components**:
| Component | Description |
|-----------|-------------|
| Fraud Event Counter | Total events by severity (24h, 7d, 30d) |
| SLA Compliance Gauge | Current response time percentiles |
| Evidence Ledger Stats | Entry count, last anchor, integrity status |
| Alert Timeline | Recent critical/high severity alerts |
| Agent Status | Health indicators for all agents |

### 3.2 Evidence Browser

**Purpose**: Search and verify evidence ledger entries

**Features**:
- Full-text search across evidence payloads
- Filter by type, severity, date range
- Hash verification on demand
- Signature validation display
- Anchor transaction links

**Table Columns**:
| Column | Sortable | Filterable |
|--------|----------|------------|
| Sequence | Yes | Yes |
| Timestamp | Yes | Yes |
| Type | Yes | Yes |
| Severity | Yes | Yes |
| Hash | No | Yes |
| Anchor Status | No | Yes |

### 3.3 Reports

**Purpose**: Access generated compliance reports

**Report Types**:
| Report | Frequency | Format |
|--------|-----------|--------|
| Weekly Summary | Every Monday | PDF/A |
| Monthly Analysis | First of month | PDF/A + CSV |
| Ad-hoc Export | On demand | JSON, CSV |
| Audit Package | Quarterly | ZIP archive |

**Actions**:
- Download report
- Verify report signature
- Request new export

### 3.4 Drill History

**Purpose**: Review synthetic drill execution history

**Displayed Information**:
- Drill type and scenario
- Execution timestamp
- Pass/fail status
- Response time metrics
- Agent participation

### 3.5 Audit Log

**Purpose**: Track all regulator portal activity

**Logged Events**:
- Login/logout
- Evidence queries
- Report downloads
- Export requests
- Settings changes

---

## 4. Access Control

### 4.1 Roles

| Role | Permissions |
|------|-------------|
| `regulator_viewer` | View dashboards, evidence, reports |
| `regulator_exporter` | Above + request exports |
| `regulator_admin` | Above + manage regulator users |

### 4.2 IP Restrictions

- Configurable IP allowlist per organization
- Automatic lockout after 5 failed attempts
- Geo-restriction options (US, EU, APAC)

### 4.3 Session Management

- Maximum session duration: 8 hours
- Idle timeout: 30 minutes
- Concurrent session limit: 1

---

## 5. Branding & Design

### 5.1 Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Deep Navy | #1a237e |
| Secondary | Gold | #ffd700 |
| Background | Light Gray | #f5f5f5 |
| Text | Dark Gray | #212121 |
| Success | Green | #4caf50 |
| Warning | Amber | #ff9800 |
| Error | Red | #f44336 |

### 5.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Inter | 24-32px | 600 |
| Body | Inter | 14-16px | 400 |
| Monospace | JetBrains Mono | 13px | 400 |
| Labels | Inter | 12px | 500 |

### 5.3 Logo Usage

- Guardian Shield logo in header
- Crypto Hound badge in footer
- Regulator organization logo (configurable)

---

## 6. Security Features

### 6.1 Content Security

- All data read-only (no mutations)
- Content Security Policy enforced
- No file uploads permitted
- Clipboard access for hashes only

### 6.2 Data Masking

| Data Type | Masking |
|-----------|---------|
| Wallet addresses | First 6 + last 4 characters |
| Transaction hashes | First 10 + last 10 characters |
| User emails | Partial domain masking |
| Private keys | Never displayed |

### 6.3 Export Watermarking

All exported documents include:
- Regulator user ID
- Export timestamp
- IP address hash
- Digital signature

---

## 7. Integration Points

### 7.1 API Access

Regulators may optionally access the read-only API:

```
GET /api/v1/regulator/evidence
GET /api/v1/regulator/reports
GET /api/v1/regulator/drills
GET /api/v1/regulator/verify/{hash}
POST /api/v1/regulator/export
```

### 7.2 Webhooks

Optional webhook notifications for:
- Critical fraud events
- Weekly report availability
- System health changes

---

## 8. Compliance

### 8.1 Regulatory Alignment

- SEC guidance on digital asset custody
- FATF travel rule requirements
- State money transmitter regulations
- GDPR data protection (EU regulators)

### 8.2 Evidence Integrity

All evidence displayed includes:
- SHA-256 hash
- Ed25519 signature
- Blockchain anchor reference
- Tamper-detection indicator

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| Page load time | < 2 seconds |
| Search response | < 500ms |
| Report download start | < 3 seconds |
| Dashboard refresh | 5 seconds |
| API response time | < 200ms |

---

## 10. Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
*Classification: Internal*
