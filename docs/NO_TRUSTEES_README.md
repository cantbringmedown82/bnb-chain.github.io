# No-Trustees Mode Guide

This document covers the rollout, rollback, and verification procedures for No-Trustees Mode operation.

## Overview

No-Trustees Mode enables autonomous compliance operation without manual trustee oversight. In this mode:

- **Auto-anchoring** is enabled for all compliance reports
- **Trustee review gates** are bypassed
- **Automated notifications** replace manual digest distribution
- **Enforcer bot** operates autonomously (if enabled)

## Prerequisites

Before enabling No-Trustees Mode:

- [ ] All notifier integrations tested (Slack, Email, PDF)
- [ ] Blockchain anchoring keys configured in secrets manager
- [ ] GPG signing keys provisioned (not stored in repo)
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested

## Rollout Procedure

### Step 1: Prepare Environment

```bash
# Set No-Trustees Mode configuration
export TRUSTEES_ENABLED=false
export AUTO_ANCHOR_COMPLIANCE=true
export MANUAL_REVIEW_ENABLED=false

# Configure anchoring (keys from secrets manager)
export COMPLIANCE_ANCHOR_CHAIN=bsc
# GPG_PRIVATE_KEY should be injected from secrets manager

# Configure notifications
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
export SMTP_HOST=smtp.example.com
export SMTP_USER=compliance@example.com
```

### Step 2: Pre-flight Checks

```bash
# Verify configuration
curl http://localhost:3000/readyz

# Expected response:
# {
#   "slack": true,
#   "smtp": true,
#   "trusteesEnabled": false
# }

# Test admin endpoint
curl -H "x-admin-api-key: $ADMIN_API_KEY" \
  http://localhost:3000/admin/status/compliance
```

### Step 3: Gradual Rollout

1. **Canary deployment** (10% traffic)
   ```bash
   # Deploy to canary environment
   ./deploynotrustees.sh --env canary
   ```

2. **Monitor for 24 hours**
   - Check Slack notifications arrive
   - Verify anchoring transactions on-chain
   - Review error rates in monitoring

3. **Full deployment** (100% traffic)
   ```bash
   ./deploynotrustees.sh --env production
   ```

### Step 4: Post-deployment Verification

```bash
# Trigger test digest to all channels
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -d '{"channel":"all"}' \
  http://localhost:3000/admin/trigger/test-digest
```

## Rollback Procedure

### Immediate Rollback

If issues are detected, rollback immediately:

```bash
# Re-enable trustees mode
export TRUSTEES_ENABLED=true
export AUTO_ANCHOR_COMPLIANCE=false
export MANUAL_REVIEW_ENABLED=true

# Restart service
pm2 restart bnb-backend --update-env
```

### Graceful Rollback

For planned rollback:

1. Disable auto-anchoring first
   ```bash
   export AUTO_ANCHOR_COMPLIANCE=false
   pm2 restart bnb-backend --update-env
   ```

2. Wait for pending operations to complete

3. Re-enable trustee mode
   ```bash
   export TRUSTEES_ENABLED=true
   export MANUAL_REVIEW_ENABLED=true
   pm2 restart bnb-backend --update-env
   ```

### Rollback Verification

```bash
# Verify trustees mode is re-enabled
curl http://localhost:3000/readyz
# trusteesEnabled should be true
```

## Verifier Checklist

### Slack Verification

- [ ] Webhook URL configured and validated
- [ ] Test message received in correct channel
- [ ] Message formatting correct (blocks render properly)
- [ ] Rate limiting not exceeded

```bash
# Test Slack
curl -X POST \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -d '{"channel":"slack"}' \
  http://localhost:3000/admin/trigger/test-digest
```

### Email Verification

- [ ] SMTP credentials working
- [ ] Test email received
- [ ] From address displays correctly
- [ ] Subject line formatted properly
- [ ] Body content complete

```bash
# Test Email
curl -X POST \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -d '{"channel":"email"}' \
  http://localhost:3000/admin/trigger/test-digest
```

### PDF Verification

- [ ] PDF generation working
- [ ] Report contains all metrics
- [ ] Branding/headers correct
- [ ] File accessible via `/reports` endpoint

```bash
# Test PDF
curl -X POST \
  -H "x-admin-api-key: $ADMIN_API_KEY" \
  -d '{"channel":"pdf"}' \
  http://localhost:3000/admin/trigger/test-digest

# List generated reports
curl http://localhost:3000/evidence-index
```

### Anchoring Verification

- [ ] Anchor chain configured (bsc/eth)
- [ ] Signing keys available
- [ ] Test anchor transaction successful
- [ ] Transaction visible on block explorer

## Safety Notes

### Auto-Anchoring Considerations

⚠️ **IMPORTANT**: Auto-anchoring creates immutable blockchain records. Once anchored:

- Data cannot be modified or deleted
- Transaction fees are incurred
- Chain congestion may cause delays

Recommendations:
- Test thoroughly in testnet before mainnet
- Monitor gas prices and set limits
- Have fallback manual process ready

### Monitoring Requirements

Ensure these metrics are monitored:

- Anchor transaction success rate
- Notification delivery rate
- Error rates by channel
- Latency percentiles (p50, p95, p99)

### Secret Management

Never store in repository:
- Private keys (GPG, blockchain)
- API secrets
- Webhook signing secrets

Use:
- Kubernetes Secrets
- AWS Secrets Manager
- HashiCorp Vault
- GitHub Actions Secrets (for CI/CD)

## Troubleshooting

### Anchoring Failures

```bash
# Check anchor chain status
curl http://localhost:3000/admin/status/compliance

# Verify chain RPC is accessible
# Check wallet balance for gas
```

### Notification Failures

```bash
# Check individual channel status
curl http://localhost:3000/readyz

# View recent errors
pm2 logs bnb-backend --err --lines 50
```

### Recovery from Split-Brain

If inconsistent state between environments:

1. Stop all instances
2. Reconcile evidence index
3. Re-anchor any missing entries
4. Restart in synchronized state

## Support

For issues with No-Trustees Mode:

1. Check logs: `pm2 logs bnb-backend`
2. Review this guide
3. Check [CHECKLIST.md](../CHECKLIST.md) for known issues
4. Open an issue with logs and configuration (redact secrets)
