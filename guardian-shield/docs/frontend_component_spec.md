# Frontend Component Specification

## Overview

This document specifies the React/TypeScript component architecture for the Guardian Shield dashboard.

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| State Management | Zustand | 4.x |
| Data Fetching | TanStack Query | 5.x |
| Styling | Tailwind CSS | 3.x |
| Charts | Recharts | 2.x |
| Tables | TanStack Table | 8.x |
| Forms | React Hook Form | 7.x |
| Routing | React Router | 6.x |
| Testing | Vitest + Testing Library | Latest |

---

## 2. Project Structure

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── ...
│   ├── dashboard/
│   │   ├── OverviewCards/
│   │   ├── FraudGauge/
│   │   ├── EventsChart/
│   │   └── ...
│   ├── alerts/
│   │   ├── AlertList/
│   │   ├── AlertCard/
│   │   └── ...
│   ├── evidence/
│   │   ├── EvidenceTable/
│   │   ├── EntryDetail/
│   │   └── ...
│   └── layout/
│       ├── Header/
│       ├── Sidebar/
│       └── Footer/
├── hooks/
│   ├── useAlerts.ts
│   ├── useEvidence.ts
│   ├── useDrills.ts
│   └── ...
├── services/
│   ├── api/
│   │   ├── client.ts
│   │   ├── alerts.ts
│   │   ├── evidence.ts
│   │   └── ...
│   └── websocket/
│       └── client.ts
├── stores/
│   ├── alertStore.ts
│   ├── uiStore.ts
│   └── ...
├── types/
│   ├── api.ts
│   ├── evidence.ts
│   ├── alerts.ts
│   └── ...
├── utils/
│   ├── format.ts
│   ├── validation.ts
│   └── ...
└── styles/
    └── globals.css
```

---

## 3. Component Specifications

### 3.1 Common Components

#### Button

```typescript
// components/common/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

// Usage
<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>
```

#### Card

```typescript
// components/common/Card/Card.tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Usage
<Card title="Fraud Score" subtitle="Real-time">
  <FraudGauge value={0.42} />
</Card>
```

#### Modal

```typescript
// components/common/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// Usage
<Modal isOpen={isOpen} onClose={close} title="Entry Detail">
  <EntryDetail entry={entry} />
</Modal>
```

#### DataTable

```typescript
// components/common/Table/DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: PaginationState;
  sorting?: SortingState;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
}

// Usage
<DataTable
  data={events}
  columns={eventColumns}
  pagination={pagination}
  onPaginationChange={setPagination}
  onRowClick={handleRowClick}
/>
```

### 3.2 Dashboard Components

#### FraudGauge

```typescript
// components/dashboard/FraudGauge/FraudGauge.tsx
interface FraudGaugeProps {
  value: number; // 0-1
  thresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Implementation notes:
// - Use SVG for the gauge arc
// - Animate value changes
// - Color based on severity threshold
// - Show numeric value in center
```

#### EventsChart

```typescript
// components/dashboard/EventsChart/EventsChart.tsx
interface EventsChartProps {
  data: {
    timestamp: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }[];
  timeRange: '1h' | '24h' | '7d' | '30d';
  onTimeRangeChange?: (range: string) => void;
}

// Implementation notes:
// - Stacked area chart using Recharts
// - Severity color coding
// - Tooltip with breakdown
// - Time range selector
```

#### SeverityBadge

```typescript
// components/common/SeverityBadge/SeverityBadge.tsx
interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  size?: 'sm' | 'md';
  withDot?: boolean;
}

// Usage
<SeverityBadge severity="critical" withDot />
```

### 3.3 Alerts Components

#### AlertCard

```typescript
// components/alerts/AlertCard/AlertCard.tsx
interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onSilence: (id: string) => void;
  onViewDetails: (id: string) => void;
  expanded?: boolean;
}

// States:
// - Firing (with duration)
// - Silenced (with expiry)
// - Acknowledged (with ack info)
```

#### AlertList

```typescript
// components/alerts/AlertList/AlertList.tsx
interface AlertListProps {
  alerts: Alert[];
  filter?: AlertFilter;
  onFilterChange?: (filter: AlertFilter) => void;
  loading?: boolean;
}

interface AlertFilter {
  severity?: Severity[];
  state?: AlertState[];
  search?: string;
}
```

### 3.4 Evidence Components

#### EvidenceTable

```typescript
// components/evidence/EvidenceTable/EvidenceTable.tsx
interface EvidenceTableProps {
  entries: EvidenceEntry[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  onEntryClick: (entry: EvidenceEntry) => void;
  onVerify: (entry: EvidenceEntry) => void;
  onExport: (entries: EvidenceEntry[]) => void;
}

// Columns:
// - Sequence number
// - Timestamp
// - Type (with icon)
// - Content hash (truncated)
// - Anchored status
// - Actions (view, verify, export)
```

#### EntryDetail

```typescript
// components/evidence/EntryDetail/EntryDetail.tsx
interface EntryDetailProps {
  entry: EvidenceEntry;
  onVerifySignature: () => void;
  onVerifyAnchor: () => void;
  onViewOnExplorer: () => void;
}

// Sections:
// - Metadata (ID, sequence, timestamp, type)
// - Content (JSON viewer)
// - Hash chain visualization
// - Signature verification status
// - Anchor details (if anchored)
```

#### HashChainVisualizer

```typescript
// components/evidence/HashChainVisualizer/HashChainVisualizer.tsx
interface HashChainVisualizerProps {
  previousHash: string;
  currentHash: string;
  nextHash?: string;
  isValid: boolean;
}

// Visual representation:
// [Previous] --→ [Current] --→ [Next]
//  d4e5f6..       a1b2c3..      7890ab..
```

---

## 4. Hooks

### 4.1 Data Fetching Hooks

```typescript
// hooks/useEvidence.ts
export function useEvidence(filters: EvidenceFilters) {
  return useQuery({
    queryKey: ['evidence', filters],
    queryFn: () => evidenceApi.list(filters),
    staleTime: 30000,
  });
}

export function useEvidenceEntry(id: string) {
  return useQuery({
    queryKey: ['evidence', id],
    queryFn: () => evidenceApi.get(id),
    enabled: !!id,
  });
}

// hooks/useAlerts.ts
export function useAlerts(filters: AlertFilters) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertsApi.list(filters),
    refetchInterval: 10000, // Real-time updates
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: alertsApi.acknowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
```

### 4.2 Real-time Hooks

```typescript
// hooks/useRealTimeMetrics.ts
export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      setMetrics(JSON.parse(event.data));
    };
    return () => ws.close();
  }, []);
  
  return metrics;
}
```

---

## 5. State Management

### 5.1 UI Store

```typescript
// stores/uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModal: string | null;
  
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  activeModal: null,
  
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));
```

### 5.2 Alert Store

```typescript
// stores/alertStore.ts
interface AlertState {
  selectedAlerts: string[];
  filters: AlertFilters;
  
  selectAlert: (id: string) => void;
  deselectAlert: (id: string) => void;
  clearSelection: () => void;
  setFilters: (filters: AlertFilters) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  selectedAlerts: [],
  filters: {},
  
  selectAlert: (id) => set((s) => ({ 
    selectedAlerts: [...s.selectedAlerts, id] 
  })),
  deselectAlert: (id) => set((s) => ({ 
    selectedAlerts: s.selectedAlerts.filter(a => a !== id) 
  })),
  clearSelection: () => set({ selectedAlerts: [] }),
  setFilters: (filters) => set({ filters }),
}));
```

---

## 6. API Service Layer

### 6.1 API Client

```typescript
// services/api/client.ts
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle auth error
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

### 6.2 Evidence API

```typescript
// services/api/evidence.ts
export const evidenceApi = {
  list: async (filters: EvidenceFilters): Promise<EvidenceListResponse> => {
    const { data } = await apiClient.get('/evidence', { params: filters });
    return data;
  },
  
  get: async (id: string): Promise<EvidenceEntry> => {
    const { data } = await apiClient.get(`/evidence/${id}`);
    return data;
  },
  
  verifyChain: async (from: number, to: number): Promise<ChainVerificationResult> => {
    const { data } = await apiClient.post('/verification/chain', { from_sequence: from, to_sequence: to });
    return data;
  },
  
  export: async (request: ExportRequest): Promise<ExportJob> => {
    const { data } = await apiClient.post('/export', request);
    return data;
  },
};
```

---

## 7. Testing

### 7.1 Component Testing

```typescript
// components/dashboard/FraudGauge/FraudGauge.test.tsx
import { render, screen } from '@testing-library/react';
import { FraudGauge } from './FraudGauge';

describe('FraudGauge', () => {
  it('renders with correct value', () => {
    render(<FraudGauge value={0.42} />);
    expect(screen.getByText('0.42')).toBeInTheDocument();
  });
  
  it('shows critical color above threshold', () => {
    render(<FraudGauge value={0.96} />);
    expect(screen.getByTestId('gauge-arc')).toHaveClass('text-red-500');
  });
  
  it('shows safe label for low values', () => {
    render(<FraudGauge value={0.2} showLabel />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });
});
```

### 7.2 Hook Testing

```typescript
// hooks/useEvidence.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEvidence } from './useEvidence';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useEvidence', () => {
  it('fetches evidence entries', async () => {
    const { result } = renderHook(() => useEvidence({}), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.entries).toHaveLength(10);
  });
});
```

---

## 8. Performance Optimization

### 8.1 Memoization

```typescript
// Use React.memo for expensive renders
const EventsChart = React.memo(({ data, timeRange }: EventsChartProps) => {
  // ...
});

// Memoize expensive computations
const processedData = useMemo(
  () => processChartData(rawData),
  [rawData]
);

// Memoize callbacks
const handleRowClick = useCallback(
  (row: EvidenceEntry) => openModal(row.id),
  [openModal]
);
```

### 8.2 Code Splitting

```typescript
// Lazy load heavy components
const EventsChart = lazy(() => import('./EventsChart'));
const EntryDetail = lazy(() => import('./EntryDetail'));

// Usage
<Suspense fallback={<Skeleton />}>
  <EventsChart data={data} />
</Suspense>
```

### 8.3 Virtualization

```typescript
// Use virtual list for large datasets
import { useVirtualizer } from '@tanstack/react-virtual';

const EvidenceList = ({ entries }: { entries: EvidenceEntry[] }) => {
  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
  });
  
  // Render only visible items
};
```

---

**Specification Version:** 1.0  
**Last Updated:** {{DATE}}
