# Guardian Shield — State Management Specification
## Crypto Hound LLC — Redux/Context Store + Actions

---

## 1. Overview

This document specifies the state management architecture for the Guardian Shield Regulator Portal using Redux Toolkit with TypeScript.

---

## 2. Store Structure

### 2.1 Root State

```typescript
interface RootState {
  auth: AuthState;
  ledger: LedgerState;
  verification: VerificationState;
  reports: ReportsState;
  drills: DrillsState;
  alerts: AlertsState;
  ui: UIState;
}
```

### 2.2 State Slices

#### Auth State

```typescript
interface AuthState {
  user: User | null;
  role: 'admin' | 'regulator' | 'auditor' | 'investor' | 'viewer' | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  mfaRequired: boolean;
  mfaVerified: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: Date;
}

interface AuthError {
  code: string;
  message: string;
  field?: string;
}
```

#### Ledger State

```typescript
interface LedgerState {
  entries: LedgerEntry[];
  selectedEntry: LedgerEntry | null;
  filters: LedgerFilters;
  pagination: PaginationState;
  sorting: SortingState;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface LedgerEntry {
  entryId: string;
  blockId: string;
  caseId: string;
  bundleId?: string;
  evidenceType: 'json' | 'yaml' | 'png' | 'pdfa' | 'csv';
  evidenceHash: string;
  evidenceSize: number;
  evidenceLocation: string;
  metadata?: Record<string, any>;
  severity: 'critical' | 'high' | 'medium' | 'watchlist';
  signature: string;
  status: 'pending' | 'sealed' | 'archived' | 'exported';
  anchorStatus: 'pending' | 'anchored' | 'confirmed';
  createdAt: string;
  createdBy: string;
}

interface LedgerFilters {
  caseId: string;
  severity: string[];
  evidenceType: string[];
  status: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  searchQuery: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface SortingState {
  field: string;
  direction: 'asc' | 'desc';
}
```

#### Verification State

```typescript
interface VerificationState {
  bundleId: string | null;
  hash: string | null;
  status: 'idle' | 'verifying' | 'success' | 'failure';
  results: VerificationResults | null;
  loading: boolean;
  error: string | null;
}

interface VerificationResults {
  hashValid: boolean;
  signatureValid: boolean;
  signerInfo?: {
    name: string;
    email: string;
    keyId: string;
  };
  anchorStatus: 'pending' | 'anchored' | 'confirmed' | 'not_found';
  anchorDetails?: {
    network: string;
    transactionId: string;
    blockNumber: number;
    confirmations: number;
    timestamp: string;
  };
  verifiedAt: string;
}
```

#### Reports State

```typescript
interface ReportsState {
  weekly: Report[];
  drills: Report[];
  compliance: Report[];
  selectedReport: Report | null;
  exportStatus: 'idle' | 'pending' | 'success' | 'error';
  exportProgress: number;
  currentExport: ExportJob | null;
  loading: boolean;
  error: string | null;
}

interface Report {
  id: string;
  type: 'weekly' | 'drill' | 'compliance';
  title: string;
  period?: string;
  generatedAt: string;
  metrics?: ReportMetrics;
  hash: string;
  signature: string;
  anchorStatus: string;
  downloadUrl: string;
  previewUrl?: string;
}

interface ReportMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  watchlistAlerts: number;
  slaComplianceRate: number;
  drillSuccessRate?: number;
}

interface ExportJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  format: 'pdfa' | 'json' | 'zip';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}
```

#### Drills State

```typescript
interface DrillsState {
  schedule: DrillSchedule[];
  executions: DrillExecution[];
  frequency: DrillFrequencyData[];
  successRate: number;
  slaCompliance: SlaComplianceData;
  logs: DrillLog[];
  loading: boolean;
  error: string | null;
}

interface DrillSchedule {
  id: string;
  scenario: string;
  severity: string;
  cron: string;
  nextRun: string;
  enabled: boolean;
}

interface DrillExecution {
  id: string;
  scheduleId: string;
  scenario: string;
  severity: string;
  status: 'running' | 'pass' | 'fail';
  startedAt: string;
  completedAt?: string;
  responseTime?: number;
  slaTarget: number;
  slaMet: boolean;
  actions: string[];
  error?: string;
}

interface DrillFrequencyData {
  date: string;
  hour: number;
  count: number;
}

interface SlaComplianceData {
  critical: {
    target: number;
    p50: number;
    p95: number;
    p99: number;
  };
  high: {
    target: number;
    p50: number;
    p95: number;
    p99: number;
  };
}

interface DrillLog {
  timestamp: string;
  scenario: string;
  severity: string;
  status: string;
  actionsTaken: string[];
  responseTime?: number;
}
```

#### Alerts State

```typescript
interface AlertsState {
  stream: Alert[];
  unreadCount: number;
  routing: RoutingStatus;
  filters: AlertFilters;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  loading: boolean;
  error: string | null;
}

interface Alert {
  id: string;
  caseId: string;
  severity: 'critical' | 'high' | 'medium' | 'watchlist';
  title: string;
  description: string;
  cluster?: string;
  value?: string;
  timestamp: string;
  routing: {
    regulator: boolean;
    investor: boolean;
    dashboard: boolean;
  };
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  evidenceId?: string;
  metadata?: Record<string, any>;
}

interface RoutingStatus {
  regulator: boolean;
  investor: boolean;
  dashboard: boolean;
}

interface AlertFilters {
  severity: string[];
  acknowledged: boolean | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}
```

#### UI State

```typescript
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: UINotification[];
  modals: ModalState;
  toasts: Toast[];
  breadcrumbs: Breadcrumb[];
}

interface UINotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface ModalState {
  evidenceDetail: boolean;
  reportPreview: boolean;
  exportConfig: boolean;
  alertDetail: boolean;
}

interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Breadcrumb {
  label: string;
  path: string;
}
```

---

## 3. Actions

### 3.1 Auth Actions

```typescript
// Action Types
const AUTH_ACTIONS = {
  LOGIN_REQUEST: 'auth/loginRequest',
  LOGIN_SUCCESS: 'auth/loginSuccess',
  LOGIN_FAILURE: 'auth/loginFailure',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refreshToken',
  MFA_REQUIRED: 'auth/mfaRequired',
  MFA_VERIFY: 'auth/mfaVerify',
  UPDATE_USER: 'auth/updateUser',
  CLEAR_ERROR: 'auth/clearError',
} as const;

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verifyMfa = createAsyncThunk(
  'auth/verifyMfa',
  async (code: string, { getState, rejectWithValue }) => {
    try {
      const response = await authApi.verifyMfa(code);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await authApi.logout();
    dispatch(clearAllState());
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await authApi.refresh(auth.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
```

### 3.2 Ledger Actions

```typescript
// Action Types
const LEDGER_ACTIONS = {
  FETCH_ENTRIES: 'ledger/fetchEntries',
  FETCH_ENTRY: 'ledger/fetchEntry',
  SET_FILTERS: 'ledger/setFilters',
  SET_PAGE: 'ledger/setPage',
  SET_SORTING: 'ledger/setSorting',
  SELECT_ENTRY: 'ledger/selectEntry',
  CLEAR_SELECTION: 'ledger/clearSelection',
  RESET_FILTERS: 'ledger/resetFilters',
} as const;

// Async Thunks
export const fetchLedgerEntries = createAsyncThunk(
  'ledger/fetchEntries',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { ledger } = getState() as RootState;
      const response = await ledgerApi.query({
        ...ledger.filters,
        page: ledger.pagination.page,
        limit: ledger.pagination.pageSize,
        sort: `${ledger.sorting.field}:${ledger.sorting.direction}`,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchLedgerEntry = createAsyncThunk(
  'ledger/fetchEntry',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const response = await ledgerApi.getEntry(entryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Sync Actions
export const setLedgerFilters = createAction<Partial<LedgerFilters>>('ledger/setFilters');
export const setLedgerPage = createAction<number>('ledger/setPage');
export const setLedgerSorting = createAction<SortingState>('ledger/setSorting');
export const selectLedgerEntry = createAction<LedgerEntry>('ledger/selectEntry');
export const clearLedgerSelection = createAction('ledger/clearSelection');
export const resetLedgerFilters = createAction('ledger/resetFilters');
```

### 3.3 Verification Actions

```typescript
// Async Thunks
export const verifyBundle = createAsyncThunk(
  'verification/verifyBundle',
  async (bundleId: string, { rejectWithValue }) => {
    try {
      const response = await ledgerApi.verify(bundleId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const verifyHash = createAsyncThunk(
  'verification/verifyHash',
  async (hash: string, { rejectWithValue }) => {
    try {
      const response = await ledgerApi.verifyHash(hash);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const verifyFile = createAsyncThunk(
  'verification/verifyFile',
  async (file: File, { rejectWithValue }) => {
    try {
      // Calculate file hash
      const hash = await calculateSHA256(file);
      const response = await ledgerApi.verifyHash(hash);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Sync Actions
export const clearVerification = createAction('verification/clear');
```

### 3.4 Reports Actions

```typescript
// Async Thunks
export const fetchWeeklyReports = createAsyncThunk(
  'reports/fetchWeekly',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsApi.getWeekly();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchDrillReports = createAsyncThunk(
  'reports/fetchDrills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsApi.getDrills();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const exportComplianceBundle = createAsyncThunk(
  'reports/export',
  async (config: ExportConfig, { dispatch, rejectWithValue }) => {
    try {
      const response = await reportsApi.export(config);
      const exportId = response.data.exportId;
      
      // Poll for completion
      dispatch(pollExportStatus(exportId));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const pollExportStatus = createAsyncThunk(
  'reports/pollExport',
  async (exportId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await reportsApi.getExportStatus(exportId);
      
      if (response.data.status === 'processing') {
        // Continue polling
        setTimeout(() => dispatch(pollExportStatus(exportId)), 2000);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const downloadReport = createAsyncThunk(
  'reports/download',
  async (reportId: string, { rejectWithValue }) => {
    try {
      const response = await reportsApi.download(reportId);
      // Trigger file download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportId}.pdf`;
      link.click();
      return reportId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
```

### 3.5 Alerts Actions

```typescript
// Async Thunks
export const fetchAlerts = createAsyncThunk(
  'alerts/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { alerts } = getState() as RootState;
      const response = await alertsApi.getAlerts(alerts.filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'alerts/acknowledge',
  async (alertId: string, { rejectWithValue }) => {
    try {
      const response = await alertsApi.acknowledge(alertId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// WebSocket Actions
export const connectAlertsStream = createAction('alerts/connect');
export const disconnectAlertsStream = createAction('alerts/disconnect');
export const receiveAlert = createAction<Alert>('alerts/receive');
export const setConnectionStatus = createAction<'connected' | 'disconnected' | 'reconnecting'>('alerts/connectionStatus');

// Sync Actions
export const setAlertFilters = createAction<Partial<AlertFilters>>('alerts/setFilters');
export const markAllRead = createAction('alerts/markAllRead');
```

### 3.6 UI Actions

```typescript
// Sync Actions
export const toggleTheme = createAction('ui/toggleTheme');
export const setTheme = createAction<'light' | 'dark'>('ui/setTheme');
export const toggleSidebar = createAction('ui/toggleSidebar');
export const setSidebarOpen = createAction<boolean>('ui/setSidebarOpen');

export const openModal = createAction<keyof ModalState>('ui/openModal');
export const closeModal = createAction<keyof ModalState>('ui/closeModal');
export const closeAllModals = createAction('ui/closeAllModals');

export const addToast = createAction<Omit<Toast, 'id'>>('ui/addToast');
export const removeToast = createAction<string>('ui/removeToast');
export const clearToasts = createAction('ui/clearToasts');

export const addNotification = createAction<Omit<UINotification, 'id' | 'timestamp' | 'read'>>('ui/addNotification');
export const markNotificationRead = createAction<string>('ui/markNotificationRead');
export const clearNotifications = createAction('ui/clearNotifications');

export const setBreadcrumbs = createAction<Breadcrumb[]>('ui/setBreadcrumbs');
```

---

## 4. Selectors

### 4.1 Auth Selectors

```typescript
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = (state: RootState) => state.auth.role;
export const selectUserPermissions = (state: RootState) => state.auth.user?.permissions ?? [];

export const selectHasPermission = (permission: string) => 
  createSelector(selectUserPermissions, (permissions) => permissions.includes(permission));

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'admin'
);
```

### 4.2 Ledger Selectors

```typescript
export const selectLedger = (state: RootState) => state.ledger;
export const selectLedgerEntries = (state: RootState) => state.ledger.entries;
export const selectSelectedEntry = (state: RootState) => state.ledger.selectedEntry;
export const selectLedgerFilters = (state: RootState) => state.ledger.filters;
export const selectLedgerPagination = (state: RootState) => state.ledger.pagination;
export const selectLedgerLoading = (state: RootState) => state.ledger.loading;

export const selectFilteredEntries = createSelector(
  [selectLedgerEntries, selectLedgerFilters],
  (entries, filters) => {
    // Client-side filtering if needed
    return entries;
  }
);

export const selectEntriesBySeverity = createSelector(
  selectLedgerEntries,
  (entries) => {
    return entries.reduce((acc, entry) => {
      acc[entry.severity] = (acc[entry.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
);
```

### 4.3 Alerts Selectors

```typescript
export const selectAlerts = (state: RootState) => state.alerts;
export const selectAlertStream = (state: RootState) => state.alerts.stream;
export const selectUnreadCount = (state: RootState) => state.alerts.unreadCount;
export const selectConnectionStatus = (state: RootState) => state.alerts.connectionStatus;

export const selectCriticalAlerts = createSelector(
  selectAlertStream,
  (alerts) => alerts.filter((a) => a.severity === 'critical')
);

export const selectUnacknowledgedAlerts = createSelector(
  selectAlertStream,
  (alerts) => alerts.filter((a) => !a.acknowledged)
);

export const selectRecentAlerts = (count: number) =>
  createSelector(selectAlertStream, (alerts) => 
    alerts.slice(0, count)
  );
```

---

## 5. Middleware

### 5.1 WebSocket Middleware

```typescript
const alertsWebSocketMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  return (next) => (action) => {
    if (connectAlertsStream.match(action)) {
      const token = store.getState().auth.token;
      socket = new WebSocket(`wss://api.guardianshield.com/alerts?token=${token}`);

      socket.onopen = () => {
        store.dispatch(setConnectionStatus('connected'));
        reconnectAttempts = 0;
      };

      socket.onmessage = (event) => {
        const alert = JSON.parse(event.data);
        store.dispatch(receiveAlert(alert));
      };

      socket.onclose = () => {
        store.dispatch(setConnectionStatus('disconnected'));
        if (reconnectAttempts < maxReconnectAttempts) {
          store.dispatch(setConnectionStatus('reconnecting'));
          setTimeout(() => {
            reconnectAttempts++;
            store.dispatch(connectAlertsStream());
          }, Math.pow(2, reconnectAttempts) * 1000);
        }
      };

      socket.onerror = () => {
        socket?.close();
      };
    }

    if (disconnectAlertsStream.match(action)) {
      socket?.close();
      socket = null;
    }

    return next(action);
  };
};
```

### 5.2 Token Refresh Middleware

```typescript
const tokenRefreshMiddleware: Middleware = (store) => (next) => (action) => {
  const state = store.getState() as RootState;
  
  if (state.auth.isAuthenticated && state.auth.tokenExpiry) {
    const timeUntilExpiry = state.auth.tokenExpiry - Date.now();
    
    if (timeUntilExpiry < 5 * 60 * 1000) { // Less than 5 minutes
      store.dispatch(refreshToken());
    }
  }
  
  return next(action);
};
```

---

## 6. Store Configuration

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'guardian-shield',
  storage,
  whitelist: ['auth', 'ui'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  ledger: ledgerReducer,
  verification: verificationReducer,
  reports: reportsReducer,
  drills: drillsReducer,
  alerts: alertsReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(alertsWebSocketMiddleware, tokenRefreshMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
```

---

*© 2025 Crypto Hound LLC. All rights reserved.*
