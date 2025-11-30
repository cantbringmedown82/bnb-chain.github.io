# Frontend Component Specification
## Guardian Shield — Crypto Hound LLC

---

## 1. Overview

This document specifies the React/TypeScript components for the Guardian Shield Regulator Portal. Components follow atomic design principles with a focus on accessibility, testability, and reusability.

---

## 2. Component Architecture

```
src/
├── components/
│   ├── atoms/           # Basic building blocks
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── Input/
│   │   ├── Spinner/
│   │   └── Icon/
│   ├── molecules/       # Combinations of atoms
│   │   ├── StatCard/
│   │   ├── SearchBar/
│   │   ├── TableRow/
│   │   └── AlertItem/
│   ├── organisms/       # Complex components
│   │   ├── DataTable/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── Chart/
│   ├── templates/       # Page layouts
│   │   ├── DashboardLayout/
│   │   └── ContentLayout/
│   └── pages/           # Route components
│       ├── Dashboard/
│       ├── Evidence/
│       ├── Reports/
│       └── Settings/
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── lib/                 # Utilities and API clients
└── types/               # TypeScript definitions
```

---

## 3. Atom Components

### 3.1 Button

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  children: React.ReactNode;
}

// Usage
<Button variant="primary" size="md" loading={isSubmitting}>
  Submit
</Button>
```

**Styling**:
- Primary: Navy background, white text
- Secondary: White background, navy border
- Danger: Red background, white text
- Ghost: Transparent, navy text

### 3.2 Badge

```tsx
interface BadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

// Usage
<Badge severity="critical">Critical</Badge>
```

**Colors**:
- Critical: #f44336 (Red)
- High: #ff9800 (Orange)
- Medium: #ffc107 (Amber)
- Low: #4caf50 (Green)
- Info: #2196f3 (Blue)

### 3.3 Input

```tsx
interface InputProps {
  type: 'text' | 'password' | 'email' | 'search';
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

// Usage
<Input
  type="search"
  placeholder="Search evidence..."
  icon={<SearchIcon />}
  value={query}
  onChange={setQuery}
/>
```

### 3.4 Spinner

```tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// Usage
<Spinner size="md" />
```

### 3.5 Icon

```tsx
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// Usage
<Icon name="alert" size={24} color="#f44336" />
```

---

## 4. Molecule Components

### 4.1 StatCard

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  severity?: 'critical' | 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
  loading?: boolean;
}

// Usage
<StatCard
  title="Critical Alerts"
  value={12}
  change={{ value: 3, direction: 'up' }}
  severity="critical"
  icon={<AlertIcon />}
/>
```

### 4.2 SearchBar

```tsx
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  filters?: FilterConfig[];
  onFilterChange?: (filters: FilterValues) => void;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'date' | 'multiselect';
  options?: { value: string; label: string }[];
}

// Usage
<SearchBar
  placeholder="Search evidence..."
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  filters={[
    { key: 'type', label: 'Type', type: 'select', options: eventTypes },
    { key: 'severity', label: 'Severity', type: 'multiselect', options: severities },
  ]}
/>
```

### 4.3 AlertItem

```tsx
interface AlertItemProps {
  timestamp: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  address?: string;
  onClick?: () => void;
}

// Usage
<AlertItem
  timestamp="2025-01-15T10:30:00Z"
  title="Mixer activity detected"
  description="High-value transfer to known mixer"
  severity="critical"
  address="0x1234...5678"
  onClick={() => openDetails(alert)}
/>
```

---

## 5. Organism Components

### 5.1 DataTable

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  onRowClick?: (row: T) => void;
  rowKey: keyof T | ((row: T) => string);
  emptyMessage?: string;
}

interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

// Usage
<DataTable
  data={evidenceEntries}
  columns={[
    { key: 'sequence', header: 'Seq', sortable: true, width: '80px' },
    { key: 'timestamp', header: 'Timestamp', sortable: true, render: formatDate },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'severity', header: 'Severity', render: (s) => <Badge severity={s}>{s}</Badge> },
    { key: 'hash', header: 'Hash', render: truncateHash },
    { key: 'verified', header: '✓', render: (v) => v ? '✅' : '❌' },
  ]}
  pagination={{ page, pageSize, total, onChange: setPage }}
  sorting={{ sortKey, sortDir, onSort: handleSort }}
  onRowClick={openEvidenceDetail}
  rowKey="id"
/>
```

### 5.2 Sidebar

```tsx
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  items: NavItem[];
  activeItem?: string;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | string;
}

// Usage
<Sidebar
  collapsed={sidebarCollapsed}
  onToggle={toggleSidebar}
  items={navigationItems}
  activeItem={currentPath}
/>
```

### 5.3 Header

```tsx
interface HeaderProps {
  user: User;
  notifications: Notification[];
  onLogout: () => void;
  onNotificationClick: (id: string) => void;
}

// Usage
<Header
  user={currentUser}
  notifications={unreadNotifications}
  onLogout={handleLogout}
  onNotificationClick={markAsRead}
/>
```

### 5.4 Chart

```tsx
interface ChartProps {
  type: 'line' | 'bar' | 'gauge' | 'pie';
  data: ChartData;
  options?: ChartOptions;
  height?: number;
  loading?: boolean;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

// Usage
<Chart
  type="line"
  data={{
    labels: timestamps,
    datasets: [
      { label: 'Critical', data: criticalCounts, color: '#f44336' },
      { label: 'High', data: highCounts, color: '#ff9800' },
    ],
  }}
  height={250}
/>
```

---

## 6. Template Components

### 6.1 DashboardLayout

```tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Provides: Header, Sidebar, Main content area
```

### 6.2 ContentLayout

```tsx
interface ContentLayoutProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

// Usage
<ContentLayout
  title="Evidence Browser"
  breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Evidence' }]}
  actions={<Button>Export</Button>}
>
  {/* Page content */}
</ContentLayout>
```

---

## 7. Custom Hooks

### 7.1 useEvidence

```tsx
function useEvidence(options?: QueryOptions) {
  return {
    data: EvidenceEntry[],
    loading: boolean,
    error: Error | null,
    refetch: () => void,
    fetchMore: () => void,
    hasMore: boolean,
  };
}
```

### 7.2 useVerification

```tsx
function useVerification(entryId: string) {
  return {
    verify: () => Promise<VerificationResult>,
    verifying: boolean,
    result: VerificationResult | null,
  };
}
```

### 7.3 useExport

```tsx
function useExport() {
  return {
    requestExport: (options: ExportOptions) => Promise<string>,
    checkStatus: (exportId: string) => Promise<ExportStatus>,
    download: (exportId: string) => Promise<void>,
  };
}
```

---

## 8. Context Providers

### 8.1 AuthContext

```tsx
interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  permissions: Permission[];
}
```

### 8.2 ThemeContext

```tsx
interface ThemeContextValue {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}
```

### 8.3 NotificationContext

```tsx
interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;
}
```

---

## 9. Testing Requirements

### 9.1 Unit Tests

All components must have:
- Render tests
- Props validation tests
- Event handler tests
- Accessibility tests (axe-core)

### 9.2 Integration Tests

Page components must have:
- API integration tests
- Navigation tests
- State management tests

### 9.3 E2E Tests

Critical flows:
- Login → Dashboard → Evidence → Export
- Search and filter evidence
- Verify evidence integrity

---

## 10. Storybook Documentation

Each component must include:
- Default story
- All variant stories
- Interactive controls
- Accessibility notes
- Usage guidelines

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
*Classification: Internal*
