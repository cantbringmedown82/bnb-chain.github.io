# Weekly Incident Report Template

**Report Period:** {{START_DATE}} to {{END_DATE}}  
**Generated:** {{GENERATION_TIMESTAMP}}  
**Report ID:** {{REPORT_UUID}}

---

## Executive Summary

### Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Fraud Events | {{TOTAL_FRAUD_EVENTS}} | {{STATUS_BADGE}} |
| Critical Alerts | {{CRITICAL_ALERTS}} | {{STATUS_BADGE}} |
| SLA Compliance | {{SLA_COMPLIANCE}}% | {{STATUS_BADGE}} |
| Evidence Entries Added | {{EVIDENCE_ENTRIES}} | {{STATUS_BADGE}} |
| Blockchain Anchors | {{BLOCKCHAIN_ANCHORS}} | {{STATUS_BADGE}} |

### Period Highlights

- {{HIGHLIGHT_1}}
- {{HIGHLIGHT_2}}
- {{HIGHLIGHT_3}}

---

## Fraud Event Summary

### Events by Severity

| Severity | Count | Change vs Last Period |
|----------|-------|----------------------|
| Critical | {{CRITICAL_COUNT}} | {{CRITICAL_CHANGE}} |
| High | {{HIGH_COUNT}} | {{HIGH_CHANGE}} |
| Medium | {{MEDIUM_COUNT}} | {{MEDIUM_CHANGE}} |
| Low | {{LOW_COUNT}} | {{LOW_CHANGE}} |

### Events by Type

| Type | Count | Percentage |
|------|-------|------------|
| Mixer | {{MIXER_COUNT}} | {{MIXER_PCT}}% |
| Exchange | {{EXCHANGE_COUNT}} | {{EXCHANGE_PCT}}% |
| Pool | {{POOL_COUNT}} | {{POOL_PCT}}% |
| Dust | {{DUST_COUNT}} | {{DUST_PCT}}% |
| Other | {{OTHER_COUNT}} | {{OTHER_PCT}}% |

### Notable Incidents

#### Incident 1
- **Timestamp:** {{INCIDENT_1_TIME}}
- **Severity:** {{INCIDENT_1_SEVERITY}}
- **Type:** {{INCIDENT_1_TYPE}}
- **Description:** {{INCIDENT_1_DESCRIPTION}}
- **Resolution:** {{INCIDENT_1_RESOLUTION}}
- **Evidence ID:** {{INCIDENT_1_EVIDENCE_ID}}

---

## Evidence Ledger Status

### Ledger Integrity

| Check | Status | Last Verified |
|-------|--------|---------------|
| Hash Chain Valid | {{HASH_CHAIN_STATUS}} | {{HASH_CHAIN_VERIFIED}} |
| Signatures Valid | {{SIGNATURES_STATUS}} | {{SIGNATURES_VERIFIED}} |
| Anchors Verified | {{ANCHORS_STATUS}} | {{ANCHORS_VERIFIED}} |

### Anchor Summary

| Anchor ID | Timestamp | Chain | TX Hash | Status |
|-----------|-----------|-------|---------|--------|
| {{ANCHOR_1_ID}} | {{ANCHOR_1_TIME}} | {{ANCHOR_1_CHAIN}} | {{ANCHOR_1_TX}} | {{ANCHOR_1_STATUS}} |
| {{ANCHOR_2_ID}} | {{ANCHOR_2_TIME}} | {{ANCHOR_2_CHAIN}} | {{ANCHOR_2_TX}} | {{ANCHOR_2_STATUS}} |

---

## SLA Performance

### Response Time Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| P50 Response Time | < 5s | {{P50_RESPONSE}} | {{P50_STATUS}} |
| P95 Response Time | < 30s | {{P95_RESPONSE}} | {{P95_STATUS}} |
| P99 Response Time | < 60s | {{P99_RESPONSE}} | {{P99_STATUS}} |

### Availability Metrics

| Service | Target | Actual | Status |
|---------|--------|--------|--------|
| Orchestrator | 99.9% | {{ORCH_AVAILABILITY}}% | {{ORCH_STATUS}} |
| Evidence API | 99.9% | {{EVIDENCE_AVAILABILITY}}% | {{EVIDENCE_STATUS}} |
| Alert Pipeline | 99.9% | {{ALERT_AVAILABILITY}}% | {{ALERT_STATUS}} |

---

## Synthetic Drill Results

### Drill Execution Summary

| Scenario | Executions | Successes | Success Rate |
|----------|------------|-----------|--------------|
| Mixer Detection | {{MIXER_DRILL_EXEC}} | {{MIXER_DRILL_SUCCESS}} | {{MIXER_DRILL_RATE}}% |
| Exchange Anomaly | {{EXCHANGE_DRILL_EXEC}} | {{EXCHANGE_DRILL_SUCCESS}} | {{EXCHANGE_DRILL_RATE}}% |
| Pool Detection | {{POOL_DRILL_EXEC}} | {{POOL_DRILL_SUCCESS}} | {{POOL_DRILL_RATE}}% |
| Dust Attack | {{DUST_DRILL_EXEC}} | {{DUST_DRILL_SUCCESS}} | {{DUST_DRILL_RATE}}% |

### Failed Drills

{{FAILED_DRILLS_TABLE}}

---

## Compliance Actions

### Regulator Notifications

| Date | Type | Recipient | Status |
|------|------|-----------|--------|
| {{NOTIFY_1_DATE}} | {{NOTIFY_1_TYPE}} | {{NOTIFY_1_RECIPIENT}} | {{NOTIFY_1_STATUS}} |

### Audit Trail

| Action | Timestamp | Actor | Details |
|--------|-----------|-------|---------|
| {{AUDIT_1_ACTION}} | {{AUDIT_1_TIME}} | {{AUDIT_1_ACTOR}} | {{AUDIT_1_DETAILS}} |

---

## Recommendations

1. {{RECOMMENDATION_1}}
2. {{RECOMMENDATION_2}}
3. {{RECOMMENDATION_3}}

---

## Appendix

### A. Glossary

- **SLA**: Service Level Agreement
- **P50/P95/P99**: Percentile response times
- **Hash Chain**: Cryptographic linking of evidence records
- **Anchor**: Blockchain timestamp proof of evidence existence

### B. Data Sources

- Prometheus metrics: `shield-prometheus:9090`
- Evidence Ledger: `evidence-api:8080`
- Alert Manager: `alertmanager:9093`

---

**Seal Confirmation:**  
This report has been sealed and archived under Crypto Hound Institutional License.  
Seal ID: {{SEAL_ID}}  
Sealed at: {{SEAL_TIMESTAMP}}  
Signature: {{SEAL_SIGNATURE}}
