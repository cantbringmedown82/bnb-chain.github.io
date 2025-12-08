# Guardian Shield — Frontend Component Specification
## Crypto Hound LLC — React Components + Props

---

## 1. Overview

This document specifies the React component library for the Guardian Shield Regulator Portal. All components use TypeScript and follow Material-UI (MUI) design patterns.

---

## 2. Layout Components

### 2.1 AppLayout

**Purpose:** Main application shell with header, sidebar, and content area.

```tsx
interface AppLayoutProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

// Usage
<AppLayout sidebarOpen={true}>
  <MainContent>
    {/* Page content */}
  </MainContent>
</AppLayout>
```

**Component Structure:**
```tsx
const AppLayout: React.FC<AppLayoutProps> = ({ children, sidebarOpen, onSidebarToggle }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={onSidebarToggle} />
      <Sidebar open={sidebarOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
```

### 2.2 Header

**Purpose:** Application header with logo, page title, user menu, and notifications.

```tsx
interface HeaderProps {
  logo?: string;
  title?: string;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  notifications?: Notification[];
  onMenuClick?: () => void;
  onNotificationClick?: (id: string) => void;
  onLogout?: () => void;
}

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  read: boolean;
}

// Usage
<Header
  logo="/logo.svg"
  title="Guardian Shield"
  user={{ name: "John Doe", role: "Regulator" }}
  notifications={notifications}
  onLogout={handleLogout}
/>
```

### 2.3 Sidebar

**Purpose:** Navigation sidebar with menu items.

```tsx
interface SidebarProps {
  open: boolean;
  navItems: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavItem[];
  disabled?: boolean;
}

// Usage
<Sidebar
  open={true}
  navItems={[
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { id: 'ledger', label: 'Evidence Ledger', icon: <ListIcon />, path: '/ledger' },
    { id: 'verification', label: 'Verification', icon: <VerifiedIcon />, path: '/verify' },
    { id: 'reports', label: 'Reports', icon: <DescriptionIcon />, path: '/reports' },
    { id: 'drills', label: 'Drills', icon: <TargetIcon />, path: '/drills' },
    { id: 'alerts', label: 'Alerts Feed', icon: <NotificationsIcon />, path: '/alerts', badge: 3 },
  ]}
  activeItem="dashboard"
/>
```

### 2.4 Footer

**Purpose:** Application footer with watermark and links.

```tsx
interface FooterProps {
  watermark?: string;
  timestamp?: Date | number;
  links?: FooterLink[];
  version?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

// Usage
<Footer
  watermark="Anchored Evidence — Crypto Hound LLC"
  timestamp={Date.now()}
  version="1.0.0"
  links={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ]}
/>
```

---

## 3. Evidence Components

### 3.1 EvidenceSearch

**Purpose:** Search and filter evidence entries.

```tsx
interface EvidenceSearchProps {
  filters: EvidenceFilters;
  onSearch: (query: string) => void;
  onFilterChange: (filters: EvidenceFilters) => void;
  onClear: () => void;
  loading?: boolean;
}

interface EvidenceFilters {
  caseId?: string;
  severity?: ('critical' | 'high' | 'medium' | 'watchlist')[];
  evidenceType?: ('json' | 'yaml' | 'png' | 'pdfa')[];
  status?: ('pending' | 'sealed' | 'archived' | 'exported')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Usage
<EvidenceSearch
  filters={currentFilters}
  onSearch={handleSearch}
  onFilterChange={handleFilterChange}
  onClear={handleClear}
  loading={isLoading}
/>
```

### 3.2 EvidenceTable

**Purpose:** Display evidence entries in a sortable, paginated table.

```tsx
interface EvidenceTableProps {
  columns: Column[];
  data: LedgerEntry[];
  loading?: boolean;
  highlightColor?: string;
  actions?: TableAction[];
  pagination: PaginationProps;
  onRowClick?: (entry: LedgerEntry) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

interface Column {
  id: string;
  label: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, row: LedgerEntry) => React.ReactNode;
}

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (entry: LedgerEntry) => void;
  condition?: (entry: LedgerEntry) => boolean;
}

interface LedgerEntry {
  entryId: string;
  caseId: string;
  severity: 'critical' | 'high' | 'medium' | 'watchlist';
  evidenceType: string;
  status: string;
  hash: string;
  signature: string;
  anchorStatus: string;
  createdAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

// Usage
<EvidenceTable
  columns={[
    { id: 'entryId', label: 'Entry ID', width: 100 },
    { id: 'caseId', label: 'Case ID', sortable: true },
    { id: 'severity', label: 'Severity', render: (v) => <SeverityBadge severity={v} /> },
    { id: 'evidenceType', label: 'Type' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Date', sortable: true },
  ]}
  data={ledgerEntries}
  highlightColor="#C62828"
  actions={[
    { label: 'View Proofs', onClick: viewProofs },
    { label: 'Export Entry', onClick: exportEntry },
  ]}
  pagination={{ page: 1, pageSize: 20, total: 892 }}
  onRowClick={handleRowClick}
/>
```

### 3.3 EvidenceDetail

**Purpose:** Display detailed evidence entry information.

```tsx
interface EvidenceDetailProps {
  entry: LedgerEntry;
  onVerify?: () => void;
  onExport?: () => void;
  onViewBlock?: () => void;
  loading?: boolean;
}

// Usage
<EvidenceDetail
  entry={selectedEntry}
  onVerify={handleVerify}
  onExport={handleExport}
  onViewBlock={handleViewBlock}
/>
```

---

## 4. Verification Components

### 4.1 VerificationUpload

**Purpose:** Upload or specify evidence for verification.

```tsx
interface VerificationUploadProps {
  onUpload: (file: File) => void;
  onBundleIdSubmit: (bundleId: string) => void;
  onHashSubmit: (hash: string) => void;
  placeholder?: string;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  loading?: boolean;
}

// Usage
<VerificationUpload
  onUpload={handleFileUpload}
  onBundleIdSubmit={handleBundleVerify}
  onHashSubmit={handleHashVerify}
  placeholder="Drag & drop evidence bundle or enter Bundle ID"
  maxSize={100 * 1024 * 1024} // 100MB
  acceptedTypes={['.json', '.pdf', '.zip']}
/>
```

### 4.2 VerificationResults

**Purpose:** Display verification results.

```tsx
interface VerificationResultsProps {
  status: 'pending' | 'success' | 'failure';
  hashValid: boolean | null;
  signatureValid: boolean | null;
  anchorStatus: 'pending' | 'anchored' | 'confirmed' | 'not_found' | null;
  anchorDetails?: {
    network: string;
    transactionId: string;
    blockNumber: number;
    confirmations: number;
  };
  onDownloadCertificate?: () => void;
  onViewBlockchain?: () => void;
}

// Usage
<VerificationResults
  status="success"
  hashValid={true}
  signatureValid={true}
  anchorStatus="confirmed"
  anchorDetails={{
    network: 'Bitcoin',
    transactionId: 'abc123...',
    blockNumber: 824156,
    confirmations: 142,
  }}
  onDownloadCertificate={handleDownloadCert}
  onViewBlockchain={handleViewBlockchain}
/>
```

---

## 5. Report Components

### 5.1 ReportList

**Purpose:** Display list of reports with download/preview actions.

```tsx
interface ReportListProps {
  type: 'weekly' | 'drill' | 'compliance';
  reports: Report[];
  onDownload: (report: Report) => void;
  onPreview?: (report: Report) => void;
  onVerify?: (report: Report) => void;
  loading?: boolean;
  pagination?: PaginationProps;
}

interface Report {
  id: string;
  title: string;
  period?: string;
  generatedAt: Date;
  metrics?: {
    alerts?: number;
    critical?: number;
    slaRate?: number;
  };
  hash: string;
  signature: string;
  downloadUrl: string;
}

// Usage
<ReportList
  type="weekly"
  reports={weeklyReports}
  onDownload={downloadReport}
  onPreview={previewReport}
  onVerify={verifyReport}
/>
```

### 5.2 ExportButton

**Purpose:** Trigger compliance bundle export.

```tsx
interface ExportButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  icon?: React.ReactNode;
}

// Usage
<ExportButton
  label="Export Compliance Bundle"
  onClick={exportBundle}
  loading={isExporting}
/>
```

---

## 6. Drill Components

### 6.1 HeatmapPanel

**Purpose:** Display drill frequency heatmap.

```tsx
interface HeatmapPanelProps {
  title: string;
  data: HeatmapDataPoint[];
  colorScale?: string[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltip?: (point: HeatmapDataPoint) => string;
}

interface HeatmapDataPoint {
  x: string | number;
  y: string | number;
  value: number;
  metadata?: Record<string, any>;
}

// Usage
<HeatmapPanel
  title="Synthetic Drill Frequency"
  data={drillFrequencyData}
  xAxisLabel="Day"
  yAxisLabel="Hour"
/>
```

### 6.2 StatPanel

**Purpose:** Display single statistic with optional comparison.

```tsx
interface StatPanelProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  threshold?: {
    value: number;
    status: 'success' | 'warning' | 'error';
  };
  icon?: React.ReactNode;
  onClick?: () => void;
}

// Usage
<StatPanel
  title="Drill Success Rate"
  value={98.5}
  unit="%"
  threshold={{ value: 95, status: 'success' }}
  trend={{ value: 2.3, direction: 'up', label: 'from last week' }}
/>
```

### 6.3 LogsTable

**Purpose:** Display drill execution logs.

```tsx
interface LogsTableProps {
  columns: string[];
  data: LogEntry[];
  maxHeight?: number;
  onRowClick?: (entry: LogEntry) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface LogEntry {
  timestamp: Date;
  scenario: string;
  severity: string;
  status: 'pass' | 'fail' | 'running';
  actionsTaken: string[];
  responseTime?: number;
  metadata?: Record<string, any>;
}

// Usage
<LogsTable
  columns={['Timestamp', 'Scenario', 'Severity', 'Status', 'Actions Taken']}
  data={drillLogs}
  autoRefresh={true}
  refreshInterval={30000}
/>
```

---

## 7. Alert Components

### 7.1 AlertsStream

**Purpose:** Real-time alerts feed with WebSocket support.

```tsx
interface AlertsStreamProps {
  alerts: Alert[];
  severityIcons?: Record<string, React.ReactNode>;
  onAlertClick?: (alert: Alert) => void;
  onAcknowledge?: (alertId: string) => void;
  autoScroll?: boolean;
  maxItems?: number;
}

interface Alert {
  id: string;
  caseId: string;
  severity: 'critical' | 'high' | 'medium' | 'watchlist';
  title: string;
  description: string;
  timestamp: Date;
  routing: {
    regulator: boolean;
    investor: boolean;
    dashboard: boolean;
  };
  acknowledged: boolean;
  metadata?: Record<string, any>;
}

// Usage
<AlertsStream
  alerts={alerts}
  severityIcons={{
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    watchlist: '👁️',
  }}
  onAlertClick={handleAlertClick}
  onAcknowledge={handleAcknowledge}
  autoScroll={true}
/>
```

### 7.2 RoutingIndicators

**Purpose:** Display alert routing status indicators.

```tsx
interface RoutingIndicatorsProps {
  destinations: RoutingDestination[];
  size?: 'small' | 'medium' | 'large';
}

interface RoutingDestination {
  id: string;
  label: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp?: Date;
}

// Usage
<RoutingIndicators
  destinations={[
    { id: 'regulator', label: 'Regulator Notified', status: 'sent' },
    { id: 'investor', label: 'Investor Update Sent', status: 'sent' },
    { id: 'dashboard', label: 'Dashboard Updated', status: 'sent' },
  ]}
/>
```

### 7.3 AlertCard

**Purpose:** Individual alert display card.

```tsx
interface AlertCardProps {
  alert: Alert;
  expanded?: boolean;
  onExpand?: () => void;
  onViewDetails?: () => void;
  onViewEvidence?: () => void;
  onAcknowledge?: () => void;
}

// Usage
<AlertCard
  alert={alert}
  expanded={isExpanded}
  onViewDetails={handleViewDetails}
  onViewEvidence={handleViewEvidence}
  onAcknowledge={handleAcknowledge}
/>
```

---

## 8. Shared Components

### 8.1 SeverityBadge

**Purpose:** Display severity level with appropriate styling.

```tsx
interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'watchlist';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  showLabel?: boolean;
}

// Usage
<SeverityBadge severity="critical" showIcon showLabel />
```

### 8.2 StatusIndicator

**Purpose:** Display status with color coding.

```tsx
interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'pending' | 'info';
  label: string;
  animated?: boolean;
}

// Usage
<StatusIndicator status="success" label="Verified" />
```

### 8.3 HashDisplay

**Purpose:** Display truncated hash with copy functionality.

```tsx
interface HashDisplayProps {
  hash: string;
  truncate?: boolean;
  truncateLength?: number;
  copyable?: boolean;
  verifiable?: boolean;
  onVerify?: () => void;
}

// Usage
<HashDisplay
  hash="a948904f2f0f479b8f8564cbf12dac6b6d0e..."
  truncate
  truncateLength={16}
  copyable
/>
```

### 8.4 DateTimeDisplay

**Purpose:** Format and display timestamps.

```tsx
interface DateTimeDisplayProps {
  value: Date | string | number;
  format?: 'full' | 'date' | 'time' | 'relative';
  timezone?: string;
}

// Usage
<DateTimeDisplay value={new Date()} format="relative" />
```

---

## 9. Form Components

### 9.1 DateRangePicker

**Purpose:** Select date range for filtering.

```tsx
interface DateRangePickerProps {
  value: { start: Date | null; end: Date | null };
  onChange: (range: { start: Date | null; end: Date | null }) => void;
  minDate?: Date;
  maxDate?: Date;
  presets?: DateRangePreset[];
}

interface DateRangePreset {
  label: string;
  getValue: () => { start: Date; end: Date };
}

// Usage
<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  presets={[
    { label: 'Last 7 days', getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
    { label: 'Last 30 days', getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  ]}
/>
```

### 9.2 MultiSelect

**Purpose:** Select multiple values from dropdown.

```tsx
interface MultiSelectProps {
  label: string;
  value: string[];
  options: SelectOption[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Usage
<MultiSelect
  label="Severity"
  value={selectedSeverities}
  options={[
    { value: 'critical', label: 'Critical', icon: '🚨' },
    { value: 'high', label: 'High', icon: '⚠️' },
    { value: 'medium', label: 'Medium', icon: '⚡' },
    { value: 'watchlist', label: 'Watchlist', icon: '👁️' },
  ]}
  onChange={setSelectedSeverities}
/>
```

---

## 10. Utility Components

### 10.1 LoadingOverlay

**Purpose:** Display loading state over content.

```tsx
interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  children: React.ReactNode;
}

// Usage
<LoadingOverlay loading={isLoading} message="Loading evidence...">
  <EvidenceTable {...props} />
</LoadingOverlay>
```

### 10.2 EmptyState

**Purpose:** Display empty state message.

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Usage
<EmptyState
  icon={<SearchIcon />}
  title="No results found"
  description="Try adjusting your filters or search query"
  action={{ label: 'Clear Filters', onClick: clearFilters }}
/>
```

### 10.3 ErrorBoundary

**Purpose:** Catch and display React errors gracefully.

```tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Usage
<ErrorBoundary
  fallback={<ErrorMessage message="Something went wrong" />}
  onError={logError}
>
  <Dashboard />
</ErrorBoundary>
```

---

*© 2025 Crypto Hound LLC. All rights reserved.*
