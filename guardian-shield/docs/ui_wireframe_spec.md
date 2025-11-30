# UI Wireframe Specification

## Overview

This document specifies the UI wireframes for the Guardian Shield dashboard interfaces.

---

## 1. Layout System

### 1.1 Grid System

```
+------------------------------------------------------------------+
|                        Header (60px)                              |
+--------+----------------------------------------------------------+
|        |                                                          |
|  Nav   |                    Content Area                          |
| (240px)|                                                          |
|        |                                                          |
|        |                                                          |
+--------+----------------------------------------------------------+
|                        Footer (40px)                              |
+------------------------------------------------------------------+
```

### 1.2 Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| xs | < 576px | Stacked, collapsed nav |
| sm | 576-768px | Stacked, collapsed nav |
| md | 768-992px | Side nav, 2-col content |
| lg | 992-1200px | Side nav, 3-col content |
| xl | > 1200px | Side nav, 4-col content |

---

## 2. Navigation

### 2.1 Sidebar Navigation

```
+------------------------+
| [Logo] Guardian Shield |
+------------------------+
| ▼ Dashboard            |
|   ◉ Overview          |
|   ○ Fraud Monitor     |
|   ○ Evidence          |
|   ○ Drills            |
+------------------------+
| ▶ Alerts               |
+------------------------+
| ▶ Reports              |
+------------------------+
| ▶ Configuration        |
+------------------------+
| ▶ Admin                |
+------------------------+
|                        |
| [ User Menu ]    [⚙]  |
+------------------------+
```

### 2.2 Navigation Items

| Item | Icon | Subitems |
|------|------|----------|
| Dashboard | 📊 | Overview, Fraud Monitor, Evidence, Drills |
| Alerts | 🔔 | Active, History, Rules |
| Reports | 📄 | Generate, Scheduled, Archive |
| Configuration | ⚙️ | Agents, Thresholds, Integrations |
| Admin | 👤 | Users, Roles, Audit Log |

---

## 3. Dashboard - Overview

### 3.1 Wireframe

```
+------------------------------------------------------------------+
|                    Overview Dashboard                             |
+------------------------------------------------------------------+
|  [Today ▼]  [Last 7 days]  [Last 30 days]  [Custom]              |
+------------------------------------------------------------------+
|                                                                   |
|  +----------------+  +----------------+  +----------------+       |
|  | Fraud Score    |  | Active Alerts  |  | SLA Status     |       |
|  |     0.42      |  |      12       |  |    99.8%      |       |
|  |  [=========-]  |  |  ⬤3 ⬤5 ⬤4   |  |  [==========]  |       |
|  +----------------+  +----------------+  +----------------+       |
|                                                                   |
|  +----------------+  +----------------+  +----------------+       |
|  | Evidence       |  | Anchors       |  | Drills        |       |
|  |   1,234       |  |     45       |  |   Pass: 98%   |       |
|  |  Last: 2m ago  |  |  Last: 1h ago |  |  Next: 3h    |       |
|  +----------------+  +----------------+  +----------------+       |
|                                                                   |
|  +-------------------------------------+  +--------------------+  |
|  |         Fraud Events Trend          |  | Events by Type    |  |
|  |                                     |  |                    |  |
|  |    ╱╲    ╱╲                        |  |   [Pie Chart]     |  |
|  |   ╱  ╲  ╱  ╲   ╱                   |  |                    |  |
|  |  ╱    ╲╱    ╲ ╱                    |  |  Mixer: 35%       |  |
|  | ╱            ╲                      |  |  Exchange: 28%    |  |
|  +-------------------------------------+  +--------------------+  |
|                                                                   |
|  +---------------------------------------------------------------+
|  |                    Recent Activity                            |
|  +---------------------------------------------------------------+
|  | Time     | Type         | Severity | Details          | →    |
|  |----------|--------------|----------|------------------|------|
|  | 10:30:15 | Mixer        | High     | 5 txs detected   | View |
|  | 10:28:42 | Alert        | Critical | SLA breach       | View |
|  | 10:25:01 | Drill        | Info     | Passed           | View |
|  +---------------------------------------------------------------+
+------------------------------------------------------------------+
```

### 3.2 Components

| Component | Type | Data Source |
|-----------|------|-------------|
| Fraud Score | Gauge | Real-time metric |
| Active Alerts | Stat with breakdown | Alert API |
| SLA Status | Progress bar | SLA metrics |
| Evidence Count | Stat | Evidence API |
| Anchors Count | Stat | Anchor API |
| Drills Status | Stat | Drill metrics |
| Fraud Trend | Line chart | Time series |
| Events by Type | Pie chart | Aggregated events |
| Recent Activity | Table | Activity feed |

---

## 4. Dashboard - Fraud Monitor

### 4.1 Wireframe

```
+------------------------------------------------------------------+
|                    Fraud Monitor                                  |
+------------------------------------------------------------------+
|  Filters: [Type ▼] [Severity ▼] [Date Range] [Address ____] [🔍] |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------------------------+  +--------------------+  |
|  |        Real-time Fraud Score        |  |  Severity Legend  |  |
|  |                                     |  |                    |  |
|  |         ╭───────────╮               |  |  ⬤ Critical      |  |
|  |        ╱             ╲              |  |  ⬤ High          |  |
|  |       │    0.42      │             |  |  ⬤ Medium        |  |
|  |        ╲   Safe     ╱               |  |  ⬤ Low           |  |
|  |         ╰───────────╯               |  |                    |  |
|  +-------------------------------------+  +--------------------+  |
|                                                                   |
|  +---------------------------------------------------------------+
|  |                    Fraud Events                               |
|  +---------------------------------------------------------------+
|  | □ | Time     | Type     | Severity | Score | Addresses | →   |
|  |---|----------|----------|----------|-------|-----------|-----|
|  | □ | 10:30:15 | Mixer    | High     | 0.85  | 3         | ⋮   |
|  | □ | 10:25:42 | Exchange | Medium   | 0.65  | 2         | ⋮   |
|  | □ | 10:20:01 | Pool     | Low      | 0.35  | 5         | ⋮   |
|  +---------------------------------------------------------------+
|  | ◀ Previous  |  Page 1 of 25  |  Next ▶  |  [Export Selected] |
|  +---------------------------------------------------------------+
+------------------------------------------------------------------+
```

---

## 5. Dashboard - Evidence

### 5.1 Wireframe

```
+------------------------------------------------------------------+
|                    Evidence Ledger                                |
+------------------------------------------------------------------+
|  [Type ▼]  [Date Range]  [Search hash/ID: ____________]  [🔍]    |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------------+  +-----------------------------------+|
|  | Ledger Status         |  | Integrity Verification            ||
|  | Entries: 12,456       |  |                                   ||
|  | Last: 2m ago          |  | Hash Chain: ✓ Valid               ||
|  | Chain Valid: ✓        |  | Signatures: ✓ Valid               ||
|  | Last Anchor: 45m ago  |  | Anchors: ✓ Verified               ||
|  +------------------------+  +-----------------------------------+|
|                                                                   |
|  +---------------------------------------------------------------+
|  |                    Evidence Entries                           |
|  +---------------------------------------------------------------+
|  | # | Time     | Type          | Hash     | Anchored | Actions |
|  |---|----------|---------------|----------|----------|---------|
|  | 1 | 10:30:15 | fraud_event   | a1b2c3.. | ✓        | 👁 ✓ ↓ |
|  | 2 | 10:28:42 | alert         | d4e5f6.. | ✓        | 👁 ✓ ↓ |
|  | 3 | 10:25:01 | drill_result  | 7890ab.. | -        | 👁 ✓ ↓ |
|  +---------------------------------------------------------------+
|                                                                   |
|  [Verify Chain]  [Export Bundle]  [Trigger Anchor]               |
+------------------------------------------------------------------+
```

### 5.2 Entry Detail Modal

```
+------------------------------------------------------------------+
|  [×]            Evidence Entry Detail                             |
+------------------------------------------------------------------+
|                                                                   |
|  Entry ID:      550e8400-e29b-41d4-a716-446655440000             |
|  Sequence:      12,456                                           |
|  Timestamp:     2025-01-15T10:30:15.123Z                         |
|  Type:          fraud_event                                      |
|                                                                   |
|  +---------------------------------------------------------------+
|  | Content                                                       |
|  +---------------------------------------------------------------+
|  | {                                                             |
|  |   "event_id": "...",                                         |
|  |   "severity": "high",                                        |
|  |   "risk_score": 0.85,                                        |
|  |   "event_type": "mixer",                                     |
|  |   ...                                                        |
|  | }                                                             |
|  +---------------------------------------------------------------+
|                                                                   |
|  Hash Chain:                                                     |
|  Previous: d4e5f6... → This: a1b2c3... → Next: 7890ab...        |
|                                                                   |
|  Signature:     ✓ Valid (shield-signer-001)                      |
|                                                                   |
|  Blockchain Anchor:                                              |
|  Chain: BSC | TX: 0x1234... | Block: #12345678 | ✓ Verified     |
|                                                                   |
|  [Verify Signature]  [Verify Anchor]  [View on Explorer]         |
+------------------------------------------------------------------+
```

---

## 6. Alerts

### 6.1 Active Alerts Wireframe

```
+------------------------------------------------------------------+
|                    Active Alerts                                  |
+------------------------------------------------------------------+
|  [All ▼]  [Critical]  [High]  [Medium]  [Low]       [🔍 Search]  |
+------------------------------------------------------------------+
|                                                                   |
|  +---------------------------------------------------------------+
|  | ⬤ CriticalFraudRiskDetected                           [×Ack] |
|  | Fired: 10:30:15 | Duration: 5m | Source: fraud-monitor       |
|  | Fraud risk score 0.96 exceeds critical threshold              |
|  +---------------------------------------------------------------+
|                                                                   |
|  +---------------------------------------------------------------+
|  | ⬤ AlertResponseTimeSLABreach                          [×Ack] |
|  | Fired: 10:25:42 | Duration: 10m | Source: sla-monitor        |
|  | P95 response time 45s exceeds 30s SLA                         |
|  +---------------------------------------------------------------+
|                                                                   |
|  +---------------------------------------------------------------+
|  | ⬤ MixerActivityDetected                               [×Ack] |
|  | Fired: 10:20:01 | Duration: 15m | Source: fraud-monitor      |
|  | 15 mixer transactions in last 5 minutes                       |
|  +---------------------------------------------------------------+
|                                                                   |
|  [Acknowledge Selected]  [Silence Selected]                      |
+------------------------------------------------------------------+
```

---

## 7. Color Scheme

### 7.1 Severity Colors

| Severity | Background | Text | Border |
|----------|------------|------|--------|
| Critical | #FEE2E2 | #991B1B | #EF4444 |
| High | #FEF3C7 | #92400E | #F59E0B |
| Medium | #FEF9C3 | #854D0E | #EAB308 |
| Low | #DCFCE7 | #166534 | #22C55E |
| Info | #DBEAFE | #1E40AF | #3B82F6 |

### 7.2 Status Colors

| Status | Color |
|--------|-------|
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #EF4444 |
| Pending | #6B7280 |

---

## 8. Responsive Behavior

### 8.1 Mobile (< 768px)

- Collapsed sidebar (hamburger menu)
- Single column layout
- Stacked cards
- Simplified tables (hide less important columns)
- Touch-optimized buttons

### 8.2 Tablet (768px - 1024px)

- Mini sidebar (icons only)
- Two column layout
- Scrollable tables

### 8.3 Desktop (> 1024px)

- Full sidebar
- Multi-column layout
- Full-featured tables

---

## 9. Accessibility

### 9.1 Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

### 9.2 Implementation

```css
/* Focus indicator */
:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
}
.skip-link:focus {
  top: 0;
}
```

---

**Specification Version:** 1.0  
**Last Updated:** {{DATE}}
