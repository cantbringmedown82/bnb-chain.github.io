# Implementation Checklist

Prioritized actionable items for No-Trustees Mode deployment.

## Critical (P0) - Security & Data Integrity

- [x] **Webhook Hardening**
  - Stripe signature verification implemented
  - Raw body parsing for webhook route only
  - Error handling with appropriate HTTP status codes

- [x] **Evidence Writes**
  - Atomic temp-file write + rename pattern
  - Serialized write queue (in-memory Promise chain)
  - Entry validation before appending
  - Directory auto-creation on startup

- [x] **Environment Normalization**
  - Canonical env var names standardized
  - `.env.example` with all variables documented
  - Sensitive values use placeholders only

- [ ] **Secrets Management**
  - [ ] GPG keys provisioned via secrets manager (not in repo)
  - [ ] Blockchain signing keys in Kubernetes Secrets
  - [ ] Stripe secrets in CI/CD secret store
  - [ ] ADMIN_API_KEY rotated on deployment

## High (P1) - Operational Readiness

- [x] **Health Endpoints**
  - `/healthz` for liveness probes
  - `/readyz` with config status
  - Admin status endpoint with auth

- [x] **Admin Routes**
  - Token-protected endpoints
  - Test digest trigger
  - Compliance status view

- [x] **Deploy Script**
  - One-command deployment
  - Environment validation
  - Health checks post-deploy
  - PM2 process management

- [ ] **Persistent Storage (PVC)**
  - [ ] Kubernetes PVC for evidence files
  - [ ] Backup strategy for compliance data
  - [ ] Volume mount configuration in Helm

## Medium (P2) - Notifications & Reporting

- [x] **Notifier Framework**
  - withRetry helper with configurable attempts
  - withTimeout wrapper
  - Placeholder implementations

- [ ] **Slack Integration**
  - [ ] Replace placeholder with fetch call
  - [ ] Handle rate limiting (429 responses)
  - [ ] Test with actual webhook

- [ ] **Email Integration**
  - [ ] Integrate nodemailer
  - [ ] TLS/SSL configuration
  - [ ] Template support for digest emails

- [ ] **PDF Generation**
  - [ ] Integrate pdfkit or puppeteer
  - [ ] Branded report template
  - [ ] Digital signature support

## Medium (P2) - Infrastructure

- [ ] **Leader Election**
  - [ ] Kubernetes lease-based election
  - [ ] Single-writer for evidence file
  - [ ] Failover handling

- [ ] **Database Migration**
  - [ ] Prisma/TypeORM setup (if needed)
  - [ ] Migration scripts in deploy
  - [ ] Rollback procedures

- [ ] **Container Configuration**
  - [ ] Dockerfile for backend
  - [ ] Docker Compose for local dev
  - [ ] Helm charts for Kubernetes

## Low (P3) - Testing & Documentation

- [x] **Documentation**
  - Getting Started guide
  - No-Trustees Mode rollout guide
  - Investor overview

- [ ] **Unit Tests**
  - [ ] metricsNormalizer tests
  - [ ] withRetry tests
  - [ ] Evidence validation tests

- [ ] **Integration Tests**
  - [ ] Webhook signature verification
  - [ ] Admin endpoint authorization
  - [ ] Evidence append operations

- [ ] **E2E Tests**
  - [ ] Full deploy cycle
  - [ ] Stripe webhook flow
  - [ ] Notification delivery

## Future (P4) - Enhancements

- [ ] **Multi-tenant Support**
  - [ ] Tenant isolation in evidence files
  - [ ] Per-tenant configuration
  - [ ] Billing per tenant

- [ ] **Blockchain Anchoring**
  - [ ] BSC integration
  - [ ] Ethereum fallback
  - [ ] Transaction batching

- [ ] **Audit Viewer UI**
  - [ ] Evidence index browser
  - [ ] Anchor verification
  - [ ] Export functionality

---

## Progress Summary

| Priority | Total | Complete | Remaining |
|----------|-------|----------|-----------|
| P0 Critical | 4 | 3 | 1 |
| P1 High | 4 | 3 | 1 |
| P2 Medium | 8 | 1 | 7 |
| P3 Low | 4 | 1 | 3 |
| P4 Future | 3 | 0 | 3 |

Last Updated: 2024
