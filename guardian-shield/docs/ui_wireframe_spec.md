# Guardian Shield — UI Wireframe Specification
## Crypto Hound LLC — Page Layouts, Branding, Typography

---

## 1. Application Shell

### 1.1 Main Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                  │
│ ┌─────────┬────────────────────────────────────────────┬──────────────┐ │
│ │  LOGO   │              Page Title                    │ User | ⚙️ | 🔔 │ │
│ └─────────┴────────────────────────────────────────────┴──────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR   │                    MAIN CONTENT                             │
│ ┌───────┐ │ ┌─────────────────────────────────────────────────────────┐ │
│ │       │ │ │                                                         │ │
│ │ Nav   │ │ │                                                         │ │
│ │ Items │ │ │                                                         │ │
│ │       │ │ │           Page Content Area                             │ │
│ │       │ │ │                                                         │ │
│ │       │ │ │                                                         │ │
│ │       │ │ │                                                         │ │
│ └───────┘ │ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                  │
│ Anchored Evidence — Crypto Hound LLC │ © 2025 │ Privacy │ Terms │ v1.0 │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Header Component

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🐕 Guardian Shield     Evidence Ledger                    John D. ▼ 🔔3 │
│    Regulator Portal    ─────────────                         ⚙️        │
└─────────────────────────────────────────────────────────────────────────┘
```

**Header Elements:**
- Logo: Crypto Hound logo (40x40px)
- Product Name: "Guardian Shield"
- Subtitle: "Regulator Portal"
- Page Title: Current page name
- User Menu: Dropdown with profile, settings, logout
- Notifications: Bell icon with unread count
- Settings: Gear icon for preferences

### 1.3 Sidebar Navigation

```
┌───────────────────┐
│ 📊 Dashboard      │ ← Active (highlighted)
│ 📋 Evidence Ledger│
│ ✓  Verification   │
│ 📄 Reports        │
│ 🎯 Drills         │
│ 🔔 Alerts Feed    │
│ 📜 Audit Log      │
├───────────────────┤
│ ⚙️ Settings       │
│ ❓ Help           │
└───────────────────┘
```

**Navigation States:**
- Default: Text color #757575
- Hover: Background #E3F2FD
- Active: Background #1976D2, Text white
- Disabled: Text #BDBDBD

---

## 2. Dashboard Page

### 2.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Dashboard                                           Last updated: 10:30 │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│ │  Alerts (24h)│ │ Critical     │ │ SLA Rate     │ │ Evidence     │    │
│ │     247      │ │     3        │ │   99.2%      │ │    1,432     │    │
│ │   ↑ 12%      │ │   ● Active   │ │   ✓ Target   │ │   Entries    │    │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ ┌────────────────────────────┐  │
│ │                                    │ │                            │  │
│ │    Alerts by Severity (7 days)     │ │   Alert Distribution       │  │
│ │    [Line Chart]                    │ │   [Pie Chart]              │  │
│ │                                    │ │                            │  │
│ └────────────────────────────────────┘ └────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│ Recent Critical Alerts                                    [View All →] │
│ ┌─────────────────────────────────────────────────────────────────────┐│
│ │ 🚨 fraud_tx_20e65f │ Mixer interaction │ 5 min ago │ [View]        ││
│ │ 🚨 fraud_tx_8cb241 │ Exchange sweep    │ 2 hrs ago │ [View]        ││
│ │ 🚨 fraud_tx_3fe892 │ Mixer interaction │ 6 hrs ago │ [View]        ││
│ └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Stat Card Component

```
┌──────────────────────┐
│ Metric Label         │  ← 14px, #757575
│ ┌──────────────────┐ │
│ │                  │ │
│ │      247         │ │  ← 32px, #212121, Bold
│ │                  │ │
│ └──────────────────┘ │
│ ↑ 12% from last week │  ← 12px, #4CAF50 (green for up)
└──────────────────────┘
```

---

## 3. Evidence Ledger Page

### 3.1 Evidence List Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Evidence Ledger                                            [+ Export ▼] │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Search evidence...                               [🔍]             │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Filters: [Severity ▼] [Type ▼] [Status ▼] [Date Range 📅] [Clear All]  │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Entry ID │ Case ID          │ Severity │ Type │ Status  │ Date      │ │
│ ├──────────┼──────────────────┼──────────┼──────┼─────────┼───────────┤ │
│ │ e7f3a2b1 │ fraud_tx_20e65f  │ 🚨 Crit  │ JSON │ ✓Sealed │ 1/15 10:30│ │
│ │ [Hover: View details →]                                             │ │
│ ├──────────┼──────────────────┼──────────┼──────┼─────────┼───────────┤ │
│ │ a2b1c9d4 │ fraud_tx_8cb241  │ ⚠️ High  │ PDF  │ ✓Sealed │ 1/14 14:22│ │
│ ├──────────┼──────────────────┼──────────┼──────┼─────────┼───────────┤ │
│ │ c9d4e5f6 │ fraud_tx_3fe892  │ ⚡ Med   │ PNG  │ ○Pending│ 1/13 09:15│ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 892 entries    [◀ Prev] [1] [2] [3] ... [45] [Next ▶]  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Evidence Detail Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Evidence Entry Details                                           [✕]   │
├─────────────────────────────────────────────────────────────────────────┤
│ Entry ID:    e7f3a2b1-c9d4-4e5f-a2b1-c9d4e5f6a7b8                      │
│ Case ID:     fraud_tx_20e65feb                                          │
│ Severity:    🚨 Critical                                                │
│ Type:        JSON                                                       │
│ Status:      ✓ Sealed                                                   │
│ Created:     2025-01-15T10:30:22Z                                       │
│ Created By:  fraud_monitor_agent                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Integrity Verification                                                  │
│ ──────────────────────                                                  │
│ Hash:        a948904f2f0f479b8f8564cbf12dac6b... ✅ Valid               │
│ Signature:   Crypto Hound LLC ✅ Verified                               │
│ Anchor:      Bitcoin tx 3a7f... ✅ 142 confirmations                    │
├─────────────────────────────────────────────────────────────────────────┤
│ Metadata                                                                │
│ ──────────                                                              │
│ Source: fraud_monitor_agent                                             │
│ Tags: mixer, critical, tornado-cash                                     │
│ Cluster: tornado-cash-like                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ [View Evidence Content] [Download] [View in Block] [Verify Anchor]     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Verification Page

### 4.1 Verification Upload Zone

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Evidence Verification                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │                                                                 │ │ │
│ │ │                     📁                                          │ │ │
│ │ │                                                                 │ │ │
│ │ │         Drag & drop evidence bundle here                        │ │ │
│ │ │                     or                                          │ │ │
│ │ │              [Browse Files]                                     │ │ │
│ │ │                                                                 │ │ │
│ │ │     Supported: .json, .pdf, .zip (max 100MB)                   │ │ │
│ │ │                                                                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ─────────────────────────── OR ────────────────────────────             │
│                                                                         │
│ Bundle ID: [________________________________] [Verify Bundle]           │
│                                                                         │
│ Hash:      [________________________________] [Verify Hash]             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Verification Results

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Verification Results                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                           ✅                                        │ │
│ │                    VERIFICATION PASSED                              │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Details                                                                 │
│ ───────                                                                 │
│                                                                         │
│ ✅ Hash Validation                                                      │
│    SHA-256: a948904f2f0f479b8f8564cbf12dac6b6d...                       │
│    Status: Matches ledger record                                        │
│                                                                         │
│ ✅ Signature Validation                                                 │
│    Signer: Crypto Hound LLC <security@cryptohound.com>                 │
│    Key ID: 0xABCD1234EFGH5678                                          │
│    Status: Valid signature                                              │
│                                                                         │
│ ✅ Blockchain Anchor                                                    │
│    Network: Bitcoin                                                     │
│    Transaction: 3a7f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d...                  │
│    Block: 824,156                                                       │
│    Confirmations: 142                                                   │
│    Status: Confirmed                                                    │
│                                                                         │
│ [Download Verification Certificate] [View on Blockchain Explorer]      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Reports Page

### 5.1 Reports List

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Reports                                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ [Weekly Reports] [Drill Reports] [Compliance Bundles]                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ Weekly Incident Reports                                                 │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 📄 Week of Jan 8-15, 2025                                          │ │
│ │    Generated: Jan 15, 2025 06:00 UTC                                │ │
│ │    Alerts: 247 │ Critical: 3 │ SLA: 99.2%                          │ │
│ │    [Preview] [Download PDF] [Verify]                                │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ 📄 Week of Jan 1-8, 2025                                           │ │
│ │    Generated: Jan 8, 2025 06:00 UTC                                 │ │
│ │    Alerts: 189 │ Critical: 1 │ SLA: 99.8%                          │ │
│ │    [Preview] [Download PDF] [Verify]                                │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Showing 1-10 of 52 reports                          [Load More]        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Alerts Feed Page

### 6.1 Live Alerts Stream

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Alerts Feed                                    🔴 Live │ [Filters ▼]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🚨 CRITICAL │ fraud_tx_20e65feb │ Just now                         │ │
│ │                                                                     │ │
│ │ Mixer Interaction Detected                                         │ │
│ │ Fraud-linked cluster interacted with mixer/coinjoin service.       │ │
│ │ Value: 15.7 BTC                                                    │ │
│ │                                                                     │ │
│ │ Routing: [✅ Regulator] [✅ Investor] [✅ Dashboard]               │ │
│ │                                                                     │ │
│ │ [View Details] [View Evidence] [Acknowledge]                       │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ HIGH │ fraud_tx_8cb241 │ 2 hours ago                            │ │
│ │                                                                     │ │
│ │ Exchange Hot Wallet Contact                                        │ │
│ │ Fraud-linked cluster touched exchange hot wallet.                  │ │
│ │ Exchange: Binance                                                  │ │
│ │                                                                     │ │
│ │ Routing: [✅ Regulator] [✅ Dashboard]                             │ │
│ │                                                                     │ │
│ │ [View Details] [View Evidence] [Acknowledged ✓]                    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Branding Guidelines

### 7.1 Logo Usage

**Primary Logo:**
- Full color on light backgrounds
- White on dark backgrounds
- Minimum size: 32x32px
- Clear space: 8px all sides

**Logo Variants:**
```
🐕 Guardian Shield          ← Full logo (horizontal)
🐕                          ← Icon only
Guardian Shield             ← Text only
```

### 7.2 Typography Scale

```css
/* Headings */
h1 { font-size: 32px; font-weight: 700; line-height: 1.2; }
h2 { font-size: 24px; font-weight: 600; line-height: 1.3; }
h3 { font-size: 20px; font-weight: 600; line-height: 1.4; }
h4 { font-size: 18px; font-weight: 600; line-height: 1.4; }

/* Body */
body { font-size: 16px; font-weight: 400; line-height: 1.5; }
small { font-size: 14px; font-weight: 400; line-height: 1.4; }
caption { font-size: 12px; font-weight: 400; line-height: 1.4; }

/* Monospace (hashes, IDs) */
code { font-family: 'JetBrains Mono', monospace; font-size: 14px; }
```

### 7.3 Iconography

| Icon | Usage | Source |
|------|-------|--------|
| 🚨 | Critical severity | Emoji / Custom |
| ⚠️ | High severity | Emoji / Custom |
| ⚡ | Medium severity | Emoji / Custom |
| 👁️ | Watchlist severity | Emoji / Custom |
| ✅ | Success / Valid | Emoji / Custom |
| ❌ | Error / Invalid | Emoji / Custom |
| 📊 | Dashboard | Material Icons |
| 📋 | Ledger | Material Icons |
| 📄 | Reports | Material Icons |
| 🔔 | Alerts | Material Icons |

---

## 8. Component Spacing

### 8.1 Spacing Scale

```css
/* Base: 8px */
--space-1: 4px;   /* 0.5x */
--space-2: 8px;   /* 1x */
--space-3: 12px;  /* 1.5x */
--space-4: 16px;  /* 2x */
--space-5: 24px;  /* 3x */
--space-6: 32px;  /* 4x */
--space-7: 48px;  /* 6x */
--space-8: 64px;  /* 8x */
```

### 8.2 Border Radius

```css
--radius-sm: 4px;   /* Small elements */
--radius-md: 8px;   /* Cards, inputs */
--radius-lg: 12px;  /* Modals */
--radius-xl: 16px;  /* Large cards */
```

---

*© 2025 Crypto Hound LLC. All rights reserved.*
