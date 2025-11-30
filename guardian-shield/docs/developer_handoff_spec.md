# Guardian Shield — Developer Handoff Specification
## Crypto Hound LLC — Client Libraries, Environment Configs, Tests

---

## 1. Overview

This document provides comprehensive handoff documentation for developers integrating with or extending the Guardian Shield platform.

---

## 2. Repository Structure

```
guardian-shield/
├── config/                     # Configuration files
│   └── values.yaml             # Orchestrator + agent defaults
├── grafana/                    # Grafana dashboards
│   └── dashboards.json         # Dashboard definitions
├── alerts/                     # Alerting rules
│   └── alert_rules.yaml        # Prometheus/Alertmanager rules
├── docs/                       # Documentation
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
├── ci/                         # CI/CD pipelines
│   ├── github-actions.yml
│   └── gitlab-ci.yml
├── drills/                     # Synthetic drill configs
│   ├── fraud_event_generator.yaml
│   └── drill_schedule.yaml
├── Makefile                    # Build automation
└── README.md                   # Project overview
```

---

## 3. Client Libraries

### 3.1 JavaScript/TypeScript SDK

#### Installation

```bash
npm install @cryptohound/guardian-shield-sdk
# or
yarn add @cryptohound/guardian-shield-sdk
```

#### Configuration

```typescript
import { GuardianShieldClient } from '@cryptohound/guardian-shield-sdk';

const client = new GuardianShieldClient({
  baseUrl: 'https://api.guardianshield.cryptohound.com/v1',
  apiKey: process.env.GUARDIAN_SHIELD_API_KEY,
  timeout: 30000,
  retries: 3,
});
```

#### Usage Examples

```typescript
// Query ledger entries
const entries = await client.ledger.query({
  severity: ['critical', 'high'],
  dateRange: {
    start: '2025-01-01',
    end: '2025-01-31',
  },
  page: 1,
  limit: 20,
});

// Verify evidence bundle
const verification = await client.ledger.verify('bundle-id-here');
console.log(verification.hashValid); // true
console.log(verification.signatureValid); // true
console.log(verification.anchorStatus); // 'confirmed'

// Export compliance bundle
const exportJob = await client.reports.export({
  format: 'pdfa',
  include: ['event_log', 'alert_trace', 'pdf_report'],
});

// Poll for completion
const result = await client.reports.waitForExport(exportJob.exportId);
console.log(result.downloadUrl);

// Subscribe to real-time alerts
client.alerts.subscribe({
  onAlert: (alert) => {
    console.log('New alert:', alert.title, alert.severity);
  },
  onError: (error) => {
    console.error('Connection error:', error);
  },
  onReconnect: () => {
    console.log('Reconnected to alert stream');
  },
});
```

### 3.2 Python SDK

#### Installation

```bash
pip install guardian-shield-sdk
```

#### Configuration

```python
from guardian_shield import GuardianShieldClient

client = GuardianShieldClient(
    base_url="https://api.guardianshield.cryptohound.com/v1",
    api_key=os.environ["GUARDIAN_SHIELD_API_KEY"],
    timeout=30,
)
```

#### Usage Examples

```python
# Query ledger entries
entries = client.ledger.query(
    severity=["critical", "high"],
    date_range={"start": "2025-01-01", "end": "2025-01-31"},
    page=1,
    limit=20,
)

for entry in entries.data:
    print(f"{entry.case_id}: {entry.severity}")

# Verify evidence
verification = client.ledger.verify("bundle-id-here")
assert verification.hash_valid
assert verification.signature_valid

# Async alert streaming
async def handle_alerts():
    async for alert in client.alerts.stream():
        print(f"Alert: {alert.title} ({alert.severity})")

asyncio.run(handle_alerts())
```

### 3.3 Go SDK

#### Installation

```bash
go get github.com/cryptohound/guardian-shield-sdk-go
```

#### Usage

```go
package main

import (
    "context"
    "fmt"
    "os"
    
    gs "github.com/cryptohound/guardian-shield-sdk-go"
)

func main() {
    client := gs.NewClient(
        gs.WithBaseURL("https://api.guardianshield.cryptohound.com/v1"),
        gs.WithAPIKey(os.Getenv("GUARDIAN_SHIELD_API_KEY")),
    )
    
    // Query ledger
    entries, err := client.Ledger.Query(context.Background(), &gs.QueryParams{
        Severity: []string{"critical", "high"},
        Page:     1,
        Limit:    20,
    })
    if err != nil {
        panic(err)
    }
    
    for _, entry := range entries.Data {
        fmt.Printf("%s: %s\n", entry.CaseID, entry.Severity)
    }
    
    // Verify bundle
    result, _ := client.Ledger.Verify(context.Background(), "bundle-id")
    fmt.Printf("Hash valid: %v\n", result.HashValid)
}
```

---

## 4. Environment Configuration

### 4.1 Environment Variables

```bash
# .env.example

# API Configuration
GUARDIAN_SHIELD_API_URL=https://api.guardianshield.cryptohound.com/v1
GUARDIAN_SHIELD_WS_URL=wss://api.guardianshield.cryptohound.com
GUARDIAN_SHIELD_API_KEY=your-api-key-here

# Authentication
AUTH_JWT_SECRET=your-jwt-secret-here
AUTH_JWT_EXPIRY=24h
AUTH_REFRESH_TOKEN_EXPIRY=7d

# Database
DATABASE_URL=postgresql://user:password@host:5432/guardian_shield
DATABASE_POOL_SIZE=20
DATABASE_SSL_MODE=require

# Redis Cache
REDIS_URL=redis://host:6379/0
REDIS_PASSWORD=your-redis-password

# Message Queue
RABBITMQ_URL=amqp://user:password@host:5672/guardian_shield

# Monitoring
PROMETHEUS_PUSHGATEWAY=http://prometheus-pushgateway:9091
GRAFANA_URL=https://grafana.guardianshield.com
LOKI_URL=https://loki.guardianshield.com

# Blockchain Anchoring
BITCOIN_RPC_URL=https://bitcoin-rpc.example.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-key
ANCHOR_WALLET_ADDRESS=0x1234567890abcdef

# GPG Signing
GPG_KEY_ID=your-gpg-key-id
GPG_PASSPHRASE=your-gpg-passphrase

# External Services
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
PAGERDUTY_SERVICE_KEY=your-pagerduty-key
SENDGRID_API_KEY=your-sendgrid-key

# Feature Flags
FEATURE_QUANTUM_SIGNATURES=false
FEATURE_REALTIME_ALERTS=true
FEATURE_AUTO_ANCHOR=true
```

### 4.2 Development Environment

```bash
# docker-compose.dev.yml
version: '3.9'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: guardian
      POSTGRES_PASSWORD: guardian_dev
      POSTGRES_DB: guardian_shield_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guardian
      RABBITMQ_DEFAULT_PASS: guardian_dev

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - ./grafana/dashboards.json:/var/lib/grafana/dashboards/guardian-shield.json

volumes:
  postgres_data:
```

### 4.3 Production Environment

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: guardian-shield-api
  namespace: guardian-shield
spec:
  replicas: 3
  selector:
    matchLabels:
      app: guardian-shield-api
  template:
    metadata:
      labels:
        app: guardian-shield-api
    spec:
      containers:
        - name: api
          image: ghcr.io/cryptohound/guardian-shield-api:latest
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: guardian-shield-secrets
                  key: database-url
            - name: AUTH_JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: guardian-shield-secrets
                  key: jwt-secret
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2Gi"
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```

---

## 5. Testing

### 5.1 Unit Tests

```typescript
// tests/ledger.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ledgerApi } from '../api/ledger';
import { mockServer } from './mocks/server';

describe('Ledger API', () => {
  beforeEach(() => mockServer.listen());
  afterEach(() => mockServer.resetHandlers());

  it('should query ledger entries', async () => {
    const result = await ledgerApi.query({
      severity: ['critical'],
      page: 1,
      limit: 10,
    });

    expect(result.data).toHaveLength(10);
    expect(result.meta.pagination.total).toBeGreaterThan(0);
  });

  it('should verify bundle successfully', async () => {
    const result = await ledgerApi.verify('valid-bundle-id');

    expect(result.hashValid).toBe(true);
    expect(result.signatureValid).toBe(true);
    expect(result.anchorStatus).toBe('confirmed');
  });

  it('should handle invalid bundle', async () => {
    await expect(ledgerApi.verify('invalid-bundle-id')).rejects.toThrow('NOT_FOUND');
  });
});
```

### 5.2 Integration Tests

```typescript
// tests/integration/ledger.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GuardianShieldClient } from '@cryptohound/guardian-shield-sdk';
import { setupTestEnvironment, teardownTestEnvironment } from './setup';

describe('Ledger Integration', () => {
  let client: GuardianShieldClient;

  beforeAll(async () => {
    await setupTestEnvironment();
    client = new GuardianShieldClient({
      baseUrl: process.env.TEST_API_URL,
      apiKey: process.env.TEST_API_KEY,
    });
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  it('should append and verify evidence', async () => {
    // Append evidence
    const appendResult = await client.ledger.append({
      caseId: 'test_case_001',
      evidenceType: 'json',
      evidenceContent: Buffer.from(JSON.stringify({ test: true })).toString('base64'),
      hash: 'computed-sha256-hash',
      signature: 'test-signature',
    });

    expect(appendResult.entryId).toBeDefined();

    // Verify the evidence
    const verifyResult = await client.ledger.verifyHash(appendResult.hash);
    expect(verifyResult.exists).toBe(true);
    expect(verifyResult.signatureValid).toBe(true);
  });

  it('should query entries with filters', async () => {
    const result = await client.ledger.query({
      severity: ['critical'],
      limit: 5,
    });

    expect(result.data.length).toBeLessThanOrEqual(5);
    result.data.forEach((entry) => {
      expect(entry.severity).toBe('critical');
    });
  });
});
```

### 5.3 E2E Tests

```typescript
// tests/e2e/portal.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Regulator Portal', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard with stats', async ({ page }) => {
    await expect(page.locator('[data-testid="alerts-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="sla-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="evidence-stat"]')).toBeVisible();
  });

  test('should search evidence ledger', async ({ page }) => {
    await page.click('[data-testid="nav-ledger"]');
    await page.waitForURL('/ledger');

    await page.fill('[data-testid="search-input"]', 'fraud_tx_');
    await page.press('[data-testid="search-input"]', 'Enter');

    await expect(page.locator('[data-testid="evidence-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="evidence-row"]').first()).toBeVisible();
  });

  test('should verify evidence bundle', async ({ page }) => {
    await page.click('[data-testid="nav-verification"]');
    await page.waitForURL('/verify');

    await page.fill('[data-testid="bundle-id-input"]', 'test-bundle-id');
    await page.click('[data-testid="verify-button"]');

    await expect(page.locator('[data-testid="verification-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="hash-valid"]')).toHaveText('✅ Valid');
  });

  test('should download weekly report', async ({ page }) => {
    await page.click('[data-testid="nav-reports"]');
    await page.waitForURL('/reports');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="download-report-btn"]'),
    ]);

    expect(download.suggestedFilename()).toMatch(/report.*\.pdf$/);
  });
});
```

### 5.4 Load Tests

```yaml
# tests/load/k6-script.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '1m', target: 100 },  // Ramp up to 100
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate under 1%
  },
};

const BASE_URL = __ENV.API_URL || 'https://api-staging.guardianshield.com/v1';
const API_KEY = __ENV.API_KEY;

export default function () {
  // Query ledger
  const queryRes = http.get(`${BASE_URL}/ledger/query?limit=20`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  check(queryRes, {
    'query status is 200': (r) => r.status === 200,
    'query has data': (r) => JSON.parse(r.body).data.length > 0,
  });

  sleep(1);

  // Verify bundle
  const verifyRes = http.get(`${BASE_URL}/ledger/verify/test-bundle-id`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  check(verifyRes, {
    'verify status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

---

## 6. Deployment Checklist

### 6.1 Pre-Deployment

- [ ] All tests passing
- [ ] Security scan completed (CodeQL, Snyk)
- [ ] Documentation updated
- [ ] API versioning reviewed
- [ ] Database migrations prepared
- [ ] Environment variables configured
- [ ] Secrets rotated
- [ ] Monitoring dashboards updated
- [ ] Alert rules configured
- [ ] Backup procedures verified

### 6.2 Deployment Steps

1. **Database Migration**
   ```bash
   make db-migrate ENV=production
   ```

2. **Deploy Services**
   ```bash
   make deploy ENV=production
   ```

3. **Import Dashboards**
   ```bash
   make dashboards ENV=production
   ```

4. **Verify Health**
   ```bash
   make health-check ENV=production
   ```

5. **Run Smoke Tests**
   ```bash
   make smoke-test ENV=production
   ```

### 6.3 Post-Deployment

- [ ] Health endpoints responding
- [ ] Metrics flowing to Prometheus
- [ ] Logs appearing in Loki
- [ ] Alerts configured and tested
- [ ] WebSocket connections working
- [ ] Synthetic drill executed

---

## 7. Support & Escalation

### 7.1 Contact Information

| Role | Contact | Escalation Time |
|------|---------|-----------------|
| Developer Support | dev-support@cryptohound.com | 4 hours |
| Security Team | security@cryptohound.com | 1 hour |
| On-Call Engineer | pagerduty.com/cryptohound | 15 minutes |
| Project Lead | lead@cryptohound.com | 24 hours |

### 7.2 Documentation Links

- API Documentation: https://docs.guardianshield.cryptohound.com/api
- SDK Reference: https://docs.guardianshield.cryptohound.com/sdk
- Architecture Guide: https://docs.guardianshield.cryptohound.com/architecture
- Runbooks: https://docs.guardianshield.cryptohound.com/runbooks

---

*© 2025 Crypto Hound LLC. All rights reserved.*
