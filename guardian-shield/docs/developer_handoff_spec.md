# Developer Handoff Specification

## Overview

This document provides all information needed for developers to implement, deploy, and maintain the Guardian Shield system.

---

## 1. Repository Structure

### 1.1 Monorepo Layout

```
guardian-shield/
├── config/
│   └── values.yaml            # Orchestrator + agent defaults
├── grafana/
│   └── dashboards.json        # Fraud + drill dashboards
├── alerts/
│   └── alert_rules.yaml       # Prometheus/Alertmanager rules
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
│   └── developer_handoff_spec.md  # This file
├── ci/
│   ├── github-actions.yml
│   └── gitlab-ci.yml
├── drills/
│   ├── fraud_event_generator.yaml
│   └── drill_schedule.yaml
├── Makefile
└── README.md
```

---

## 2. Getting Started

### 2.1 Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x | Frontend development |
| Python | 3.12+ | Backend development |
| Docker | 24.x+ | Containerization |
| Kubernetes | 1.28+ | Orchestration |
| Helm | 3.x | K8s deployments |
| Make | 4.x | Task automation |

### 2.2 Quick Start

```bash
# Clone the repository
git clone https://github.com/cryptohound/guardian-shield.git
cd guardian-shield

# Install dependencies
make install

# Start development environment
make dev

# Run tests
make test

# Build for production
make build
```

### 2.3 Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Required environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/shield"
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="your-secret-key"
export CHAIN_RPC_URL="https://bsc-dataseed1.binance.org"
export SIGNING_KEY_PATH="/path/to/signing/key"
```

---

## 3. Architecture Overview

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Load Balancer                            │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌───────────────────┐
│   Frontend    │   │   Backend API   │   │ Regulator Portal  │
│   (React)     │   │   (FastAPI)     │   │   (React)         │
└───────────────┘   └─────────────────┘   └───────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌───────────────────┐
│ Evidence      │   │  Alert Engine   │   │   Drill Engine    │
│ Ledger        │   │  (Prometheus)   │   │                   │
└───────────────┘   └─────────────────┘   └───────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌───────────────────┐
│  PostgreSQL   │   │     Redis       │   │   BSC (Anchors)   │
└───────────────┘   └─────────────────┘   └───────────────────┘
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| Shield Orchestrator | Central coordination, governance |
| Fraud Monitor Agent | Real-time fraud detection |
| Evidence Agent | Append-only ledger management |
| Report Exporter | Compliance report generation |
| Alert Engine | Alert routing and notification |
| Drill Engine | Synthetic test execution |

---

## 4. Development Workflow

### 4.1 Branching Strategy

```
main
  └── develop
       ├── feature/SHIELD-123-new-fraud-detector
       ├── feature/SHIELD-124-export-improvements
       └── bugfix/SHIELD-125-alert-routing
```

### 4.2 Commit Convention

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: api, frontend, ledger, alerts, drills, ci

Example:
feat(ledger): add blockchain anchor verification endpoint
```

### 4.3 Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Run `make lint test`
4. Open PR against `develop`
5. Pass CI checks
6. Get 2 approvals
7. Squash and merge

---

## 5. API Development

### 5.1 Backend Stack

| Layer | Technology |
|-------|------------|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 |
| Validation | Pydantic |
| Auth | JWT + mTLS |
| Docs | OpenAPI 3.0 |

### 5.2 Adding New Endpoint

```python
# 1. Define schema (schemas/evidence.py)
from pydantic import BaseModel

class EvidenceCreate(BaseModel):
    type: str
    content: dict

# 2. Define model (models/evidence.py)
from sqlalchemy import Column, String, JSON
from .base import Base

class EvidenceEntry(Base):
    __tablename__ = "evidence_entries"
    id = Column(String, primary_key=True)
    type = Column(String, index=True)
    content = Column(JSON)

# 3. Add service logic (services/evidence.py)
from ..models import EvidenceEntry
from ..schemas import EvidenceCreate

class EvidenceService:
    def create(self, data: EvidenceCreate) -> EvidenceEntry:
        # Implementation
        pass

# 4. Create endpoint (api/v1/evidence.py)
from fastapi import APIRouter, Depends
from ..schemas import EvidenceCreate
from ..services import EvidenceService

router = APIRouter()

@router.post("/evidence")
def create_evidence(
    data: EvidenceCreate,
    service: EvidenceService = Depends()
):
    return service.create(data)

# 5. Add tests (tests/test_evidence.py)
def test_create_evidence(client):
    response = client.post("/evidence", json={...})
    assert response.status_code == 201
```

---

## 6. Frontend Development

### 6.1 Frontend Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript 5 |
| State | Zustand + TanStack Query |
| Styling | Tailwind CSS |
| Testing | Vitest + Testing Library |

### 6.2 Adding New Component

```typescript
// 1. Create component (components/Dashboard/MetricCard.tsx)
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold">{value}</p>
      {trend && <TrendIndicator direction={trend} />}
    </div>
  );
}

// 2. Add tests (components/Dashboard/MetricCard.test.tsx)
import { render, screen } from '@testing-library/react';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="Fraud Score" value={0.42} />);
    expect(screen.getByText('Fraud Score')).toBeInTheDocument();
    expect(screen.getByText('0.42')).toBeInTheDocument();
  });
});

// 3. Export from index (components/Dashboard/index.ts)
export { MetricCard } from './MetricCard';
```

### 6.3 Adding New Query Hook

```typescript
// hooks/queries/useMetrics.ts
import { useQuery } from '@tanstack/react-query';
import { metricsApi } from '@/services/api/metrics';
import { queryKeys } from '@/lib/queryKeys';

export function useFraudScore() {
  return useQuery({
    queryKey: queryKeys.metrics.fraudScore,
    queryFn: metricsApi.getFraudScore,
    refetchInterval: 10000, // Real-time updates
  });
}
```

---

## 7. Testing

### 7.1 Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit | Pytest/Vitest | 80% |
| Integration | Pytest/Playwright | 60% |
| E2E | Playwright | Critical paths |
| Contract | Hardhat | 100% |

### 7.2 Running Tests

```bash
# Backend tests
make test-backend

# Frontend tests
make test-frontend

# Integration tests
make test-integration

# All tests
make test
```

### 7.3 Writing Tests

```python
# Backend test example
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_evidence(client: AsyncClient, seed_evidence):
    response = await client.get("/api/v1/evidence")
    assert response.status_code == 200
    assert len(response.json()["entries"]) > 0
```

```typescript
// Frontend test example
import { renderHook, waitFor } from '@testing-library/react';
import { useEvidenceList } from './useEvidence';
import { wrapper } from '@/test/utils';

test('fetches evidence list', async () => {
  const { result } = renderHook(() => useEvidenceList({}), { wrapper });
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.entries.length).toBeGreaterThan(0);
});
```

---

## 8. Deployment

### 8.1 Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Feature testing | localhost |
| Staging | Integration testing | staging.shield.cryptohound.io |
| Production | Live system | shield.cryptohound.io |

### 8.2 Deployment Process

```bash
# Build images
make build-images

# Deploy to staging
make deploy-staging

# Run smoke tests
make smoke-test ENV=staging

# Deploy to production (requires approval)
make deploy-production
```

### 8.3 Helm Values

```yaml
# config/values.yaml (environment-specific overrides)
global:
  environment: staging

orchestrator:
  replicas: 2
  image:
    tag: v1.2.3

agents:
  fraudMonitor:
    replicas: 3
    alertThresholds:
      critical: 0.95
```

---

## 9. Monitoring & Observability

### 9.1 Metrics

| Metric | Type | Description |
|--------|------|-------------|
| fraud_risk_score | gauge | Current fraud risk score |
| evidence_entries_total | counter | Total evidence entries |
| alert_response_time_seconds | histogram | Alert response latency |
| drill_success_rate | gauge | Drill pass rate |

### 9.2 Logging

```python
# Structured logging format
import structlog

logger = structlog.get_logger()

logger.info(
    "evidence_created",
    entry_id=entry.id,
    entry_type=entry.type,
    content_hash=entry.content_hash,
)
```

### 9.3 Tracing

```python
# OpenTelemetry instrumentation
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("create_evidence") as span:
    span.set_attribute("evidence.type", entry.type)
    result = create_evidence(entry)
    span.set_attribute("evidence.id", result.id)
```

---

## 10. Security Considerations

### 10.1 Security Checklist

- [ ] All endpoints require authentication
- [ ] Input validation on all API inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Secrets stored in Vault
- [ ] mTLS for service-to-service communication

### 10.2 Security Review Process

1. Self-review against OWASP Top 10
2. Automated SAST scan (Semgrep)
3. Dependency scan (Snyk)
4. Security team review for sensitive changes

---

## 11. Troubleshooting

### 11.1 Common Issues

| Issue | Solution |
|-------|----------|
| Evidence write failure | Check ledger service logs, verify hash chain |
| Alert not firing | Verify Prometheus config, check alert rules |
| Anchor delayed | Check BSC connectivity, verify signing key |
| High memory usage | Review cache settings, check for leaks |

### 11.2 Debug Commands

```bash
# Check pod logs
kubectl logs -f deployment/shield-orchestrator

# Port-forward for local debugging
kubectl port-forward svc/evidence-api 8080:8080

# Get service metrics
curl http://localhost:8080/metrics

# Verify hash chain
curl http://localhost:8080/api/v1/verification/chain \
  -d '{"from_sequence": 1, "to_sequence": 100}'
```

---

## 12. Support & Resources

### 12.1 Documentation

| Resource | Location |
|----------|----------|
| API Docs | `/docs/api` |
| Architecture | `/docs/architecture` |
| Runbooks | `/docs/runbooks` |

### 12.2 Contacts

| Role | Contact |
|------|---------|
| Tech Lead | tech-lead@cryptohound.io |
| Security | security@cryptohound.io |
| DevOps | devops@cryptohound.io |
| On-call | PagerDuty |

### 12.3 Communication

- Slack: #guardian-shield
- Jira: SHIELD project
- Wiki: Confluence/guardian-shield

---

**Document Version:** 1.0  
**Last Updated:** {{DATE}}  
**Maintainer:** Guardian Shield Team
