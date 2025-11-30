# State Management Specification

## Overview

This document specifies the state management architecture for the Guardian Shield dashboard using Zustand for client state and TanStack Query for server state.

---

## 1. State Categories

### 1.1 State Types

| Category | Examples | Manager |
|----------|----------|---------|
| Server State | Evidence entries, alerts, drills | TanStack Query |
| UI State | Sidebar open, active modal, theme | Zustand |
| Form State | Filter values, search input | React Hook Form |
| URL State | Current page, sort order | React Router |

### 1.2 Decision Matrix

| Characteristic | Use TanStack Query | Use Zustand |
|----------------|-------------------|-------------|
| Comes from API | ✓ | |
| Cached/Deduplicated | ✓ | |
| Needs background refresh | ✓ | |
| Needs optimistic updates | ✓ | |
| Global UI state | | ✓ |
| Persisted locally | | ✓ |
| Derivations/computations | | ✓ |

---

## 2. Server State (TanStack Query)

### 2.1 Query Configuration

```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,        // 30 seconds
      gcTime: 5 * 60 * 1000,       // 5 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 2.2 Query Keys Strategy

```typescript
// lib/queryKeys.ts
export const queryKeys = {
  // Evidence
  evidence: {
    all: ['evidence'] as const,
    lists: () => [...queryKeys.evidence.all, 'list'] as const,
    list: (filters: EvidenceFilters) => 
      [...queryKeys.evidence.lists(), filters] as const,
    details: () => [...queryKeys.evidence.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.evidence.details(), id] as const,
  },
  
  // Alerts
  alerts: {
    all: ['alerts'] as const,
    lists: () => [...queryKeys.alerts.all, 'list'] as const,
    list: (filters: AlertFilters) => 
      [...queryKeys.alerts.lists(), filters] as const,
    active: () => [...queryKeys.alerts.all, 'active'] as const,
    detail: (id: string) => [...queryKeys.alerts.all, 'detail', id] as const,
  },
  
  // Drills
  drills: {
    all: ['drills'] as const,
    list: () => [...queryKeys.drills.all, 'list'] as const,
    results: (drillId: string) => 
      [...queryKeys.drills.all, 'results', drillId] as const,
  },
  
  // Metrics
  metrics: {
    all: ['metrics'] as const,
    realtime: () => [...queryKeys.metrics.all, 'realtime'] as const,
    historical: (range: string) => 
      [...queryKeys.metrics.all, 'historical', range] as const,
  },
  
  // Verification
  verification: {
    chain: (from: number, to: number) => 
      ['verification', 'chain', from, to] as const,
    signature: (entryId: string) => 
      ['verification', 'signature', entryId] as const,
    anchor: (txHash: string) => 
      ['verification', 'anchor', txHash] as const,
  },
};
```

### 2.3 Query Hooks

```typescript
// hooks/queries/useEvidence.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { evidenceApi } from '@/services/api/evidence';
import { queryKeys } from '@/lib/queryKeys';

export function useEvidenceList(filters: EvidenceFilters) {
  return useQuery({
    queryKey: queryKeys.evidence.list(filters),
    queryFn: () => evidenceApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useEvidenceEntry(id: string) {
  return useQuery({
    queryKey: queryKeys.evidence.detail(id),
    queryFn: () => evidenceApi.get(id),
    enabled: !!id,
  });
}

export function useVerifyChain() {
  return useMutation({
    mutationFn: ({ from, to }: { from: number; to: number }) =>
      evidenceApi.verifyChain(from, to),
  });
}

export function useExportEvidence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: evidenceApi.export,
    onSuccess: (data) => {
      // Store export job for polling
      queryClient.setQueryData(['export', data.job_id], data);
    },
  });
}
```

### 2.4 Real-time Updates

```typescript
// hooks/queries/useRealtimeAlerts.ts
export function useRealtimeAlerts() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const ws = new WebSocket(ALERTS_WS_URL);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      switch (update.type) {
        case 'new_alert':
          queryClient.setQueryData(
            queryKeys.alerts.active(),
            (old: Alert[] | undefined) => 
              old ? [update.alert, ...old] : [update.alert]
          );
          break;
          
        case 'alert_resolved':
          queryClient.setQueryData(
            queryKeys.alerts.active(),
            (old: Alert[] | undefined) =>
              old?.filter(a => a.id !== update.alertId)
          );
          break;
          
        case 'metric_update':
          queryClient.setQueryData(
            queryKeys.metrics.realtime(),
            update.metrics
          );
          break;
      }
    };
    
    return () => ws.close();
  }, [queryClient]);
}
```

### 2.5 Optimistic Updates

```typescript
// hooks/queries/useAlerts.ts
export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: alertsApi.acknowledge,
    
    onMutate: async (alertId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.active() });
      
      // Snapshot current value
      const previousAlerts = queryClient.getQueryData(queryKeys.alerts.active());
      
      // Optimistically update
      queryClient.setQueryData(
        queryKeys.alerts.active(),
        (old: Alert[] | undefined) =>
          old?.map(a => 
            a.id === alertId 
              ? { ...a, state: 'acknowledged' }
              : a
          )
      );
      
      return { previousAlerts };
    },
    
    onError: (err, alertId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.alerts.active(),
        context?.previousAlerts
      );
    },
    
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
  });
}
```

---

## 3. Client State (Zustand)

### 3.1 Store Organization

```
stores/
├── uiStore.ts       # UI state (sidebar, modals, theme)
├── filterStore.ts   # Filter state for different views
├── selectionStore.ts # Selected items (alerts, evidence)
└── preferencesStore.ts # User preferences (persisted)
```

### 3.2 UI Store

```typescript
// stores/uiStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modals
  activeModal: string | null;
  modalData: unknown;
  
  // Notifications
  notifications: Notification[];
  
  // Actions
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      activeModal: null,
      modalData: null,
      notifications: [],
      
      toggleSidebar: () => 
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      collapseSidebar: () => 
        set({ sidebarCollapsed: true }),
      
      expandSidebar: () => 
        set({ sidebarCollapsed: false }),
      
      openModal: (modal, data) => 
        set({ activeModal: modal, modalData: data }),
      
      closeModal: () => 
        set({ activeModal: null, modalData: null }),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...notification, id: crypto.randomUUID() },
          ],
        })),
      
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    { name: 'ui-store' }
  )
);
```

### 3.3 Filter Store

```typescript
// stores/filterStore.ts
import { create } from 'zustand';

interface FilterState {
  // Evidence filters
  evidenceFilters: {
    type?: string;
    fromTimestamp?: string;
    toTimestamp?: string;
    search?: string;
  };
  
  // Alert filters
  alertFilters: {
    severity?: Severity[];
    state?: AlertState[];
    search?: string;
  };
  
  // Drill filters
  drillFilters: {
    scenario?: string;
    status?: 'success' | 'failure';
  };
  
  // Actions
  setEvidenceFilters: (filters: Partial<FilterState['evidenceFilters']>) => void;
  clearEvidenceFilters: () => void;
  setAlertFilters: (filters: Partial<FilterState['alertFilters']>) => void;
  clearAlertFilters: () => void;
  setDrillFilters: (filters: Partial<FilterState['drillFilters']>) => void;
  clearDrillFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  evidenceFilters: {},
  alertFilters: {},
  drillFilters: {},
  
  setEvidenceFilters: (filters) =>
    set((state) => ({
      evidenceFilters: { ...state.evidenceFilters, ...filters },
    })),
  
  clearEvidenceFilters: () =>
    set({ evidenceFilters: {} }),
  
  setAlertFilters: (filters) =>
    set((state) => ({
      alertFilters: { ...state.alertFilters, ...filters },
    })),
  
  clearAlertFilters: () =>
    set({ alertFilters: {} }),
  
  setDrillFilters: (filters) =>
    set((state) => ({
      drillFilters: { ...state.drillFilters, ...filters },
    })),
  
  clearDrillFilters: () =>
    set({ drillFilters: {} }),
}));
```

### 3.4 Selection Store

```typescript
// stores/selectionStore.ts
import { create } from 'zustand';

interface SelectionState {
  // Selected items by view
  selectedAlerts: Set<string>;
  selectedEvidence: Set<string>;
  
  // Actions
  selectAlert: (id: string) => void;
  deselectAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  selectAllAlerts: (ids: string[]) => void;
  clearAlertSelection: () => void;
  
  selectEvidence: (id: string) => void;
  deselectEvidence: (id: string) => void;
  toggleEvidence: (id: string) => void;
  selectAllEvidence: (ids: string[]) => void;
  clearEvidenceSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedAlerts: new Set(),
  selectedEvidence: new Set(),
  
  selectAlert: (id) =>
    set((state) => ({
      selectedAlerts: new Set([...state.selectedAlerts, id]),
    })),
  
  deselectAlert: (id) =>
    set((state) => {
      const next = new Set(state.selectedAlerts);
      next.delete(id);
      return { selectedAlerts: next };
    }),
  
  toggleAlert: (id) =>
    set((state) => {
      const next = new Set(state.selectedAlerts);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedAlerts: next };
    }),
  
  selectAllAlerts: (ids) =>
    set({ selectedAlerts: new Set(ids) }),
  
  clearAlertSelection: () =>
    set({ selectedAlerts: new Set() }),
  
  // Similar for evidence...
  selectEvidence: (id) =>
    set((state) => ({
      selectedEvidence: new Set([...state.selectedEvidence, id]),
    })),
  
  deselectEvidence: (id) =>
    set((state) => {
      const next = new Set(state.selectedEvidence);
      next.delete(id);
      return { selectedEvidence: next };
    }),
  
  toggleEvidence: (id) =>
    set((state) => {
      const next = new Set(state.selectedEvidence);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedEvidence: next };
    }),
  
  selectAllEvidence: (ids) =>
    set({ selectedEvidence: new Set(ids) }),
  
  clearEvidenceSelection: () =>
    set({ selectedEvidence: new Set() }),
}));
```

### 3.5 Preferences Store (Persisted)

```typescript
// stores/preferencesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Dashboard
  defaultTimeRange: '1h' | '24h' | '7d' | '30d';
  refreshInterval: number; // seconds
  
  // Tables
  defaultPageSize: number;
  compactMode: boolean;
  
  // Notifications
  desktopNotifications: boolean;
  soundEnabled: boolean;
  
  // Actions
  setTheme: (theme: PreferencesState['theme']) => void;
  setDefaultTimeRange: (range: PreferencesState['defaultTimeRange']) => void;
  setRefreshInterval: (interval: number) => void;
  setDefaultPageSize: (size: number) => void;
  setCompactMode: (compact: boolean) => void;
  setDesktopNotifications: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      defaultTimeRange: '24h',
      refreshInterval: 30,
      defaultPageSize: 25,
      compactMode: false,
      desktopNotifications: true,
      soundEnabled: false,
      
      setTheme: (theme) => set({ theme }),
      setDefaultTimeRange: (range) => set({ defaultTimeRange: range }),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      setDefaultPageSize: (size) => set({ defaultPageSize: size }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      setDesktopNotifications: (enabled) => set({ desktopNotifications: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    {
      name: 'shield-preferences',
      version: 1,
    }
  )
);
```

---

## 4. Selectors and Derived State

### 4.1 Zustand Selectors

```typescript
// stores/selectors.ts
import { useFilterStore } from './filterStore';
import { useSelectionStore } from './selectionStore';

// Shallow equality selector for filters
export const useEvidenceFilters = () =>
  useFilterStore((state) => state.evidenceFilters);

export const useAlertFilters = () =>
  useFilterStore((state) => state.alertFilters);

// Derived state: selection count
export const useAlertSelectionCount = () =>
  useSelectionStore((state) => state.selectedAlerts.size);

export const useIsAlertSelected = (id: string) =>
  useSelectionStore((state) => state.selectedAlerts.has(id));

// Derived state: has active filters
export const useHasActiveEvidenceFilters = () =>
  useFilterStore((state) => Object.keys(state.evidenceFilters).length > 0);
```

### 4.2 Combined Hooks

```typescript
// hooks/useFilteredEvidence.ts
import { useEvidenceList } from './queries/useEvidence';
import { useEvidenceFilters } from '@/stores/selectors';

export function useFilteredEvidence() {
  const filters = useEvidenceFilters();
  return useEvidenceList(filters);
}
```

---

## 5. State Synchronization

### 5.1 URL State Sync

```typescript
// hooks/useURLStateSync.ts
import { useSearchParams } from 'react-router-dom';
import { useFilterStore } from '@/stores/filterStore';
import { useEffect } from 'react';

export function useURLStateSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { evidenceFilters, setEvidenceFilters } = useFilterStore();
  
  // Sync URL -> Store on mount
  useEffect(() => {
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    setEvidenceFilters({
      type: type || undefined,
      fromTimestamp: from || undefined,
      toTimestamp: to || undefined,
    });
  }, []);
  
  // Sync Store -> URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (evidenceFilters.type) params.set('type', evidenceFilters.type);
    if (evidenceFilters.fromTimestamp) params.set('from', evidenceFilters.fromTimestamp);
    if (evidenceFilters.toTimestamp) params.set('to', evidenceFilters.toTimestamp);
    
    setSearchParams(params, { replace: true });
  }, [evidenceFilters, setSearchParams]);
}
```

---

## 6. Testing State

### 6.1 Testing Zustand Stores

```typescript
// stores/__tests__/filterStore.test.ts
import { act, renderHook } from '@testing-library/react';
import { useFilterStore } from '../filterStore';

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({
      evidenceFilters: {},
      alertFilters: {},
      drillFilters: {},
    });
  });
  
  it('sets evidence filters', () => {
    const { result } = renderHook(() => useFilterStore());
    
    act(() => {
      result.current.setEvidenceFilters({ type: 'fraud_event' });
    });
    
    expect(result.current.evidenceFilters.type).toBe('fraud_event');
  });
  
  it('clears evidence filters', () => {
    const { result } = renderHook(() => useFilterStore());
    
    act(() => {
      result.current.setEvidenceFilters({ type: 'fraud_event' });
      result.current.clearEvidenceFilters();
    });
    
    expect(result.current.evidenceFilters).toEqual({});
  });
});
```

### 6.2 Testing Query Hooks

```typescript
// hooks/__tests__/useEvidence.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEvidenceList } from '../queries/useEvidence';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useEvidenceList', () => {
  it('fetches evidence list', async () => {
    server.use(
      http.get('/api/evidence', () => {
        return HttpResponse.json({
          entries: [{ id: '1', type: 'fraud_event' }],
          total: 1,
        });
      })
    );
    
    const { result } = renderHook(
      () => useEvidenceList({}),
      { wrapper: createWrapper() }
    );
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data?.entries).toHaveLength(1);
  });
});
```

---

**Specification Version:** 1.0  
**Last Updated:** {{DATE}}
