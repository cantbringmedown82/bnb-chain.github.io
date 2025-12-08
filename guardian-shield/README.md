# Guardian Shield — Crypto Hound LLC

Guardian Shield is a regulator-grade fraud defense orchestration suite designed for cryptocurrency compliance and fraud detection.

## 🛡️ Overview

- **Agents:** Monitor fraud cases, memorialize evidence, export reports
- **Shield Orchestrator:** Manages agent lifecycle, autoscaling, governance
- **Dashboards:** Grafana panels for fraud events, lineage graphs, SLA compliance
- **Alerts:** Prometheus rules route critical/high/watchlist events to regulators + investors
- **Evidence Ledger:** Append-only, hash-chained, signed, anchored
- **Portal:** Regulator interface for query, verification, and bundle export
- **Synthetic Drills:** Continuous validation of SLA + resilience
- **Security:** Quantum-grade hardening, penetration testing, and compliance bundles

## 📁 Directory Structure

```
guardian-shield/
├── config/
│   └── values.yaml                # Orchestrator + agent defaults
├── grafana/
│   └── dashboards.json            # Fraud + drill dashboards
├── alerts/
│   └── alert_rules.yaml           # Prometheus/Alertmanager rules
├── docs/
│   ├── incident_report_template.pdfa.md   # Weekly report template
│   ├── security_hardening_spec.md         # Auth, RBAC, key rotation, infra
│   ├── penetration_testing_spec.md        # Quantum-grade red-team scenarios
│   ├── ledger_schema.yaml                 # Append-only evidence ledger design
│   ├── ledger_api_spec.yaml               # API endpoints for append, verify, query, export
│   ├── regulator_portal_spec.md           # Portal UX + features
│   ├── ui_wireframe_spec.md               # Page layouts, branding, typography
│   ├── frontend_component_spec.md         # React components + props
│   ├── state_management_spec.md           # Redux/Context store + actions
│   ├── data_api_integration_spec.md       # Frontend ↔ Ledger API mapping
│   └── developer_handoff_spec.md          # Client libs, env configs, tests
├── ci/
│   ├── github-actions.yml          # CI/CD pipeline (deploy, drill, export)
│   └── gitlab-ci.yml               # GitLab CI alternative
├── drills/
│   ├── fraud_event_generator.yaml  # Synthetic scenarios (mixer, exchange, pool, dust)
│   └── drill_schedule.yaml         # Cron jobs for synthetic drills
├── Makefile                        # One-command deploy, drill, export, clean
└── README.md                       # Overview + setup instructions
```

## 🚀 Quickstart

### Prerequisites

- kubectl configured with cluster access
- Grafana CLI or API access
- Python 3.12+ (for validation)
- yamllint (optional, for YAML validation)

### Deploy

```bash
# Deploy configs + alerts
make deploy ENV=production

# Import dashboards
make dashboards ENV=production

# Run synthetic drill
make drill ENV=production

# Export weekly report
make export ENV=production
```

### Validation

```bash
# Validate all configuration files
make validate

# Run linters
make lint
```

### Synthetic Drills

```bash
# Run critical mixer drill
make drill-critical ENV=production

# Run all severity drills
make drill-all ENV=production

# Check drill status
make drill-status ENV=production
```

### Reports

```bash
# Generate weekly incident report
make export-weekly ENV=production

# Generate compliance bundle
make export-compliance ENV=production
```

### Verification

```bash
# Verify ledger integrity
make verify ENV=production

# Verify specific evidence hash
make verify-hash HASH=<sha256> ENV=production
```

### Health & Monitoring

```bash
# Check system health
make health ENV=production

# View logs
make logs ENV=production

# View metrics
make metrics ENV=production
```

### Cleanup

```bash
# Clean generated files
make clean

# Deep clean
make clean-all
```

## 📊 Dashboards

The Grafana dashboard includes:

- **Fraud Alerts Overview:** Total alerts, critical alerts, SLA compliance
- **Alerts by Severity:** Time series chart showing alert trends
- **Alert Distribution:** Pie chart by cluster type
- **Response Time Gauges:** P95 response times for critical alerts
- **Recent Fraud Cases:** Table with case details
- **Synthetic Drill Metrics:** Heatmap, success rate, SLA compliance
- **Ledger Operations:** Write operations and anchor status

## 🔔 Alert Rules

Alert severity levels and SLA targets:

| Severity | Response SLA | Notification Targets |
|----------|-------------|---------------------|
| Critical | 5 minutes | Regulator, Investor, Dashboard |
| High | 15 minutes | Regulator, Dashboard |
| Medium | 60 minutes | Dashboard |
| Watchlist | 24 hours | Batch Report |

## 🔐 Security

- **Authentication:** GPG signatures + JWT tokens
- **Authorization:** Role-based access control (RBAC)
- **Encryption:** AES-256-GCM at rest, TLS 1.3 in transit
- **Key Management:** HSM-protected master keys, quarterly rotation
- **Audit:** Immutable audit logs, blockchain anchoring

See [Security Hardening Spec](docs/security_hardening_spec.md) for details.

## 🧪 Synthetic Drills

Automated drill scenarios:

| Scenario | Frequency | Severity |
|----------|-----------|----------|
| Mixer Interaction | Weekly (Mon 02:00 UTC) | Critical |
| Exchange Sweep | Daily (03:00 UTC) | High |
| Mining Pool Batch | Bi-weekly (1st, 15th) | Medium |
| Dust Output Move | Monthly (1st) | Watchlist |
| Comprehensive | Quarterly | All |

See [Drill Schedule](drills/drill_schedule.yaml) for configuration.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Incident Report Template](docs/incident_report_template.pdfa.md) | Weekly report structure |
| [Security Hardening](docs/security_hardening_spec.md) | Security architecture |
| [Penetration Testing](docs/penetration_testing_spec.md) | Red team scenarios |
| [Ledger Schema](docs/ledger_schema.yaml) | Database design |
| [Ledger API](docs/ledger_api_spec.yaml) | OpenAPI specification |
| [Portal Spec](docs/regulator_portal_spec.md) | Portal features |
| [UI Wireframes](docs/ui_wireframe_spec.md) | Page layouts |
| [Components](docs/frontend_component_spec.md) | React components |
| [State Management](docs/state_management_spec.md) | Redux store |
| [API Integration](docs/data_api_integration_spec.md) | Frontend-API mapping |
| [Developer Handoff](docs/developer_handoff_spec.md) | SDK and testing |

## 🔧 CI/CD

### GitHub Actions

The pipeline includes:
- Configuration validation
- Security scanning (Trivy, TruffleHog)
- Deployment to Kubernetes
- Dashboard import
- Synthetic drill execution
- Weekly report generation (scheduled)

See [GitHub Actions](ci/github-actions.yml) for configuration.

### GitLab CI

Alternative pipeline with equivalent functionality.

See [GitLab CI](ci/gitlab-ci.yml) for configuration.

## 📧 Support

- **Developer Support:** dev-support@cryptohound.com
- **Security Team:** security@cryptohound.com
- **Documentation:** https://docs.guardianshield.cryptohound.com

## 📄 License

Copyright © 2025 Crypto Hound LLC. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
