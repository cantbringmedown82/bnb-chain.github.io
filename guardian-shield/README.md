# Guardian Shield

**Enterprise-grade fraud detection, evidence management, and compliance infrastructure for blockchain applications.**

[![CI/CD](https://github.com/cryptohound/guardian-shield/actions/workflows/ci.yml/badge.svg)](https://github.com/cryptohound/guardian-shield/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/cryptohound/guardian-shield/branch/main/graph/badge.svg)](https://codecov.io/gh/cryptohound/guardian-shield)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)

---

## Overview

Guardian Shield is a comprehensive security and compliance platform designed for blockchain applications. It provides:

- **Real-time Fraud Detection** - Monitor transactions for suspicious patterns including mixer usage, exchange anomalies, and pool attacks
- **Append-Only Evidence Ledger** - Tamper-proof record keeping with cryptographic hash chains and blockchain anchoring
- **Compliance Reporting** - Automated report generation for regulators with PDF/A export
- **Synthetic Drills** - Continuous validation of detection capabilities through scheduled test scenarios
- **Multi-Stakeholder Access** - Dedicated portals for operators, regulators, and investors

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Guardian Shield Platform                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Frontend   │  │  Regulator   │  │   Investor Portal    │   │
│  │  Dashboard   │  │   Portal     │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│         └─────────────────┼──────────────────────┘               │
│                           │                                      │
│                   ┌───────▼───────┐                              │
│                   │   API Layer   │                              │
│                   └───────┬───────┘                              │
│                           │                                      │
│    ┌──────────────────────┼──────────────────────────┐          │
│    │                      │                          │          │
│    ▼                      ▼                          ▼          │
│  ┌─────────────┐  ┌───────────────┐  ┌────────────────────┐     │
│  │   Shield    │  │   Evidence    │  │   Report Exporter  │     │
│  │Orchestrator │  │    Ledger     │  │                    │     │
│  └──────┬──────┘  └───────┬───────┘  └────────────────────┘     │
│         │                 │                                      │
│    ┌────┴────┐            │                                      │
│    │         │            │                                      │
│    ▼         ▼            ▼                                      │
│  ┌─────┐  ┌─────┐  ┌─────────────┐  ┌──────────────────────┐    │
│  │Fraud│  │Drill│  │  PostgreSQL │  │   BSC (Anchoring)    │    │
│  │Agent│  │Agent│  │             │  │                      │    │
│  └─────┘  └─────┘  └─────────────┘  └──────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker 24.x+
- Node.js 20.x
- Python 3.12+
- Make

### Installation

```bash
# Clone the repository
git clone https://github.com/cryptohound/guardian-shield.git
cd guardian-shield

# Install dependencies
make install

# Start development environment
make dev
```

### Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Dashboard | http://localhost:5173 | dev@local / dev123 |
| API Docs | http://localhost:8000/docs | - |
| Grafana | http://localhost:3000 | admin / admin |
| Prometheus | http://localhost:9090 | - |

---

## Features

### Fraud Detection

Guardian Shield monitors blockchain transactions in real-time for:

| Pattern | Description | Severity |
|---------|-------------|----------|
| Mixer/Tumbler | Multi-hop transaction patterns designed to obscure origin | High |
| Exchange Anomaly | Unusual volume spikes or trading patterns | Medium |
| Pool Attacks | Flash loans, sandwich attacks, rug pulls | Critical |
| Dust Attacks | Small transactions for address tracking | Low |
| Watchlist Match | Transactions involving sanctioned addresses | Critical |

### Evidence Ledger

The append-only evidence ledger provides:

- **Hash Chaining** - Each entry linked to previous via SHA-256
- **Digital Signatures** - All entries signed with ECDSA-P256
- **Blockchain Anchoring** - Periodic merkle root anchoring to BSC
- **Verification API** - Endpoints to verify integrity and inclusion

### Compliance

Automated compliance features include:

- **Weekly Reports** - PDF/A format incident summaries
- **Regulator Portal** - Read-only access for authorized regulators
- **Audit Trail** - Complete history of all system actions
- **Export Bundles** - Signed evidence packages with proofs

### Synthetic Drills

Continuous validation through:

- **Scheduled Drills** - Every 4 hours for frequent scenarios
- **Weekly Full Suite** - Comprehensive testing of all detectors
- **SLA Validation** - Detection time and accuracy measurement
- **Results Recording** - All drill outcomes recorded to evidence ledger

---

## Project Structure

```
guardian-shield/
├── config/                  # Configuration files
│   └── values.yaml         # Orchestrator + agent defaults
├── grafana/                # Monitoring dashboards
│   └── dashboards.json     # Fraud + drill dashboards
├── alerts/                 # Alert definitions
│   └── alert_rules.yaml    # Prometheus/Alertmanager rules
├── docs/                   # Documentation
│   ├── incident_report_template.pdfa.md
│   ├── security_hardening_spec.md
│   ├── penetration_testing_spec.md
│   ├── ledger_schema.yaml
│   ├── ledger_api_spec.yaml
│   ├── regulator_portal_spec.md
│   ├── ui_wireframe_spec.md
│   ├── frontend_component_spec.md
│   ├── state_management_spec.md
│   ├── data_api_integration_spec.md
│   └── developer_handoff_spec.md
├── ci/                     # CI/CD configurations
│   ├── github-actions.yml
│   └── gitlab-ci.yml
├── drills/                 # Drill configurations
│   ├── fraud_event_generator.yaml
│   └── drill_schedule.yaml
├── Makefile               # Task automation
└── README.md              # This file
```

---

## Configuration

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://user:pass@localhost:5432/shield
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
CHAIN_RPC_URL=https://bsc-dataseed1.binance.org

# Optional
LOG_LEVEL=info
ANCHOR_INTERVAL=1h
DRILL_SCHEDULE=enabled
```

### Helm Values

See `config/values.yaml` for full configuration options:

```yaml
orchestrator:
  replicas: 2
  
agents:
  fraudMonitor:
    alertThresholds:
      critical: 0.95
      high: 0.8
      
evidence:
  ledger:
    anchorChain: BSC
    anchorInterval: 1h
```

---

## Development

### Running Tests

```bash
# All tests
make test

# Backend only
make test-backend

# Frontend only
make test-frontend

# With coverage
make coverage
```

### Linting

```bash
# All linters
make lint

# Format code
make format
```

### Building

```bash
# Build all
make build

# Docker images
make build-images
```

---

## Deployment

### Staging

```bash
make deploy-staging
```

### Production

```bash
make deploy-prod
```

Requires manual approval and runs smoke tests post-deployment.

---

## Monitoring

### Grafana Dashboards

- **Fraud Monitor** - Real-time fraud score, events by type/severity
- **Evidence Ledger** - Entry counts, anchor status, integrity checks
- **Drills** - Success rates, detection times, SLA compliance
- **System Health** - Resource usage, availability, latency

### Alerts

See `alerts/alert_rules.yaml` for configured alerts:

| Alert | Severity | Description |
|-------|----------|-------------|
| CriticalFraudRiskDetected | Critical | Fraud score > 0.95 |
| SLAComplianceViolation | Critical | Compliance < 99% |
| EvidenceLedgerWriteFailure | Critical | Write errors detected |
| BlockchainAnchorDelayed | High | Anchor > 2 hours late |

---

## Security

Guardian Shield follows security best practices:

- **Authentication** - OIDC/SAML for users, mTLS for services
- **Authorization** - RBAC with principle of least privilege
- **Encryption** - TLS 1.3 in transit, AES-256-GCM at rest
- **Audit Logging** - All actions logged with cryptographic integrity
- **Key Management** - HSM-protected master keys, automated rotation

See `docs/security_hardening_spec.md` for complete security configuration.

---

## API Documentation

Interactive API documentation available at `/docs` when running:

- **Evidence API** - CRUD operations for evidence entries
- **Verification API** - Hash chain and anchor verification
- **Alerts API** - Alert management and configuration
- **Drills API** - Manual drill triggering and scheduling
- **Export API** - Report generation and bundle export

See `docs/ledger_api_spec.yaml` for OpenAPI specification.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See `docs/developer_handoff_spec.md` for detailed development guidelines.

---

## License

Proprietary - Crypto Hound Institutional License

---

## Support

- **Documentation** - https://docs.cryptohound.io/shield
- **Security Issues** - security@cryptohound.io
- **General Support** - support@cryptohound.io

---

Built with ❤️ by the Crypto Hound Team
