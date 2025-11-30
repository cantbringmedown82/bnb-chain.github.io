# Security Hardening Specification
## Guardian Shield — Crypto Hound LLC

---

## 1. Overview

This document specifies the security hardening requirements for the Guardian Shield fraud defense orchestration suite. All implementations must adhere to these specifications to maintain regulator-grade security posture.

---

## 2. Authentication & Authorization

### 2.1 Identity Provider Integration

```yaml
authentication:
  provider: oidc
  issuers:
    - https://auth.cryptohound.io
  algorithms:
    - RS256
    - ES256
  token_lifetime: 3600
  refresh_enabled: true
```

### 2.2 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| `admin` | Full system access, configuration changes |
| `regulator` | Read-only access to evidence, reports, and dashboards |
| `investor` | Read-only access to compliance reports |
| `operator` | Manage agents, view alerts, run drills |
| `auditor` | Read-only access to full audit trail |

### 2.3 Multi-Factor Authentication

- Required for all administrative actions
- Supported methods:
  - TOTP (RFC 6238)
  - WebAuthn/FIDO2
  - Hardware security keys (YubiKey)

---

## 3. Key Management

### 3.1 Key Hierarchy

```
Master Key (HSM-protected)
├── Signing Key (Ed25519)
│   └── Evidence signatures
├── Encryption Key (AES-256-GCM)
│   └── Data at rest
└── Anchoring Key (secp256k1)
    └── Blockchain transactions
```

### 3.2 Key Rotation Schedule

| Key Type | Rotation Period | Grace Period |
|----------|----------------|--------------|
| Signing Keys | 90 days | 7 days |
| Encryption Keys | 180 days | 14 days |
| API Keys | 30 days | 3 days |
| Session Keys | 24 hours | 1 hour |

### 3.3 HSM Requirements

- FIPS 140-2 Level 3 minimum
- Recommended: AWS CloudHSM, Azure Dedicated HSM, or Thales Luna
- Key material must never leave HSM boundary

---

## 4. Network Security

### 4.1 TLS Configuration

```yaml
tls:
  min_version: "1.3"
  cipher_suites:
    - TLS_AES_256_GCM_SHA384
    - TLS_CHACHA20_POLY1305_SHA256
  certificate:
    type: ecdsa
    curve: P-384
```

### 4.2 Network Segmentation

| Zone | Components | Access |
|------|------------|--------|
| DMZ | Load balancers, WAF | Public |
| Application | Orchestrator, Agents | Internal only |
| Data | Evidence ledger, Databases | Application zone only |
| Management | Admin consoles, Monitoring | VPN only |

### 4.3 Firewall Rules

- Default deny all ingress
- Allow only required ports (443 for HTTPS, 9090 for Prometheus)
- Rate limiting: 100 requests/second per IP
- DDoS protection enabled

---

## 5. Data Protection

### 5.1 Encryption at Rest

| Data Type | Encryption | Key Size |
|-----------|------------|----------|
| Evidence Ledger | AES-256-GCM | 256-bit |
| Configuration | AES-256-GCM | 256-bit |
| Backups | AES-256-GCM | 256-bit |
| Logs | AES-256-GCM | 256-bit |

### 5.2 Encryption in Transit

- TLS 1.3 required for all communications
- mTLS for inter-service communication
- Certificate pinning for external APIs

### 5.3 Data Classification

| Classification | Handling Requirements |
|----------------|----------------------|
| Critical | HSM-encrypted, audit logged, MFA required |
| Confidential | Encrypted, access logged |
| Internal | Encrypted, standard access controls |
| Public | Integrity verification only |

---

## 6. Infrastructure Security

### 6.1 Container Security

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10000
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
```

### 6.2 Image Security

- Base images: distroless or Alpine
- Vulnerability scanning: Trivy, Grype
- Image signing: Cosign with Sigstore
- No secrets in images

### 6.3 Kubernetes Hardening

- Pod Security Standards: restricted
- Network Policies: default deny
- RBAC: least privilege
- Secrets: external secrets operator

---

## 7. Audit & Logging

### 7.1 Audit Events

| Event Type | Retention | Alert |
|------------|-----------|-------|
| Authentication | 2 years | Failed attempts |
| Authorization | 2 years | Denied access |
| Configuration changes | 7 years | All |
| Evidence operations | 7 years | Failures |
| Key operations | 7 years | All |

### 7.2 Log Format

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "event_type": "authentication",
  "user_id": "user-123",
  "action": "login",
  "result": "success",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "correlation_id": "req-abc-123"
}
```

### 7.3 Log Integrity

- Append-only storage
- Hash chain verification
- External archival to immutable storage

---

## 8. Incident Response

### 8.1 Severity Levels

| Level | Response Time | Escalation |
|-------|--------------|------------|
| P1 - Critical | 15 minutes | Immediate |
| P2 - High | 1 hour | 30 minutes |
| P3 - Medium | 4 hours | 2 hours |
| P4 - Low | 24 hours | 8 hours |

### 8.2 Response Procedures

1. Detection and triage
2. Containment
3. Evidence preservation
4. Eradication
5. Recovery
6. Post-incident review

---

## 9. Compliance

### 9.1 Standards Alignment

- SOC 2 Type II
- ISO 27001
- NIST Cybersecurity Framework
- PCI DSS (where applicable)

### 9.2 Regular Assessments

| Assessment Type | Frequency |
|-----------------|-----------|
| Vulnerability scan | Weekly |
| Penetration test | Quarterly |
| Security audit | Annually |
| Compliance review | Semi-annually |

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
*Classification: Internal*
