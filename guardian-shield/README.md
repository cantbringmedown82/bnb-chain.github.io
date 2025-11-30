# Guardian Shield

**Fraud Defense Orchestration Suite for Crypto Hound Institutional Products**

Guardian Shield is a comprehensive fraud detection and compliance platform designed for institutional cryptocurrency custody and trading operations. It provides real-time monitoring, evidence memorialization, and regulatory reporting capabilities.

---

## Overview

Guardian Shield enables:

- **Real-time Fraud Detection**: Monitor blockchain activity for suspicious patterns including mixer usage, exchange manipulation, pool exploitation, and dust attacks
- **Evidence Memorialization**: Append-only ledger with cryptographic signatures and blockchain anchoring for tamper-evident audit trails
- **Compliance Reporting**: Automated weekly reports with PDF/A export for regulatory submission
- **Synthetic Drills**: Scheduled testing scenarios to validate detection and response systems
- **Regulator Portal**: Secure read-only access for authorized regulatory bodies

---

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker (optional, for containerized deployment)
- kubectl (for Kubernetes deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/cryptohound/guardian-shield.git
cd guardian-shield

# Install dependencies
make install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
make dev
```

### One-Command Operations

```bash
# Deploy to staging
make deploy-staging

# Deploy to production
make deploy-prod

# Run synthetic drill
make drill

# Generate weekly export
make export

# Clean build artifacts
make clean
```

---

## Directory Structure

```
guardian-shield/
├── config/
│   └── values.yaml           # Orchestrator + agent configuration
├── grafana/
│   └── dashboards.json       # Monitoring dashboards
├── alerts/
│   └── alert_rules.yaml      # Prometheus/Alertmanager rules
├── docs/
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
├── ci/
│   ├── github-actions.yml    # GitHub Actions CI/CD
│   └── gitlab-ci.yml         # GitLab CI alternative
├── drills/
│   ├── fraud_event_generator.yaml
│   └── drill_schedule.yaml
├── Makefile                  # One-command operations
└── README.md                 # This file
```

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GUARDIAN_API_URL` | Evidence Ledger API endpoint | Yes |
| `GUARDIAN_API_KEY` | API authentication key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SLACK_WEBHOOK_URL` | Slack notifications | No |
| `SENDGRID_API_KEY` | Email notifications | No |

### Agent Configuration

Edit `config/values.yaml` to customize:

- Orchestrator resource limits
- Agent polling intervals
- Alert severity thresholds
- Evidence retention policies

---

## Fraud Detection Categories

| Category | Severity | Description |
|----------|----------|-------------|
| Mixer Activity | High/Critical | Transactions through known mixing services |
| Exchange Manipulation | High/Critical | Wash trading, front-running, sandwich attacks |
| Pool Exploitation | Critical | Rug pulls, flash loan attacks |
| Dust Attacks | Low/Medium | Wallet linking, spam tokens |

---

## Evidence Ledger

Guardian Shield maintains an append-only evidence ledger with:

- **Hash Chaining**: Each entry includes the hash of the previous entry
- **Digital Signatures**: Ed25519 signatures on all entries
- **Blockchain Anchoring**: Periodic anchoring to Ethereum/BSC for immutability
- **7-Year Retention**: Meets regulatory compliance requirements

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/evidence` | POST | Append new evidence entry |
| `/evidence` | GET | Query evidence entries |
| `/verify` | POST | Verify ledger integrity |
| `/export` | POST | Request evidence export |
| `/metadata` | GET | Get ledger metadata |

---

## Monitoring

### Grafana Dashboards

Import `grafana/dashboards.json` to visualize:

- Fraud events by severity
- SLA response times
- Evidence ledger growth
- Agent health status
- Drill completion rates

### Alerting

Alert rules in `alerts/alert_rules.yaml` cover:

- Critical fraud detection
- SLA threshold violations
- Evidence write failures
- Agent health degradation
- Tamper detection

---

## Synthetic Drills

Automated drills validate system readiness:

| Drill | Schedule | Description |
|-------|----------|-------------|
| Weekly Full | Monday 06:00 UTC | All scenarios, full validation |
| Daily Critical | Daily 12:00 UTC | Critical events only |
| Hourly Health | Every hour | Basic health check |
| Monthly Stress | 1st of month | High-volume load test |

Run a drill manually:

```bash
make drill
```

---

## Compliance Reports

Weekly reports are automatically generated and include:

- Executive summary with key metrics
- Fraud events by category
- Evidence ledger integrity status
- SLA compliance metrics
- Drill results summary
- Cryptographic attestation

Generate a report manually:

```bash
make export
```

---

## Security

Guardian Shield implements defense-in-depth security:

- **Authentication**: OIDC with MFA enforcement
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS 1.3 in transit, AES-256-GCM at rest
- **Key Management**: HSM-backed key storage
- **Audit Logging**: Comprehensive activity logging

See `docs/security_hardening_spec.md` for full details.

---

## Development

### Testing

```bash
# Run all tests
make test

# Unit tests only
make test-unit

# E2E tests
make test-e2e
```

### Linting

```bash
make lint
make typecheck
```

### Building

```bash
make build
make docker-build
```

---

## Deployment

### Kubernetes

```bash
# Staging
make deploy-staging

# Production
make deploy-prod

# Rollback
make rollback
```

### Docker Compose

```bash
cd deploy
docker compose up -d
```

---

## Documentation

Comprehensive documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| `security_hardening_spec.md` | Security requirements and controls |
| `penetration_testing_spec.md` | Pen testing scenarios and methodology |
| `ledger_schema.yaml` | Evidence ledger data model |
| `ledger_api_spec.yaml` | OpenAPI specification |
| `regulator_portal_spec.md` | Regulator portal features |
| `developer_handoff_spec.md` | Developer setup and guidelines |

---

## Support

- **Technical Issues**: security@cryptohound.io
- **Compliance Questions**: compliance@cryptohound.io
- **Emergency Contact**: +1-XXX-XXX-XXXX (24/7)

---

## License

Proprietary — Crypto Hound LLC

This software is provided under the Crypto Hound Institutional License. Unauthorized use, reproduction, or distribution is prohibited.

---

*Guardian Shield v1.0.0 — Built by Crypto Hound LLC*
