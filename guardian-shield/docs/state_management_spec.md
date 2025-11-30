# State Management Specification
## Guardian Shield — Crypto Hound LLC

---

## 1. Overview

This document specifies the state management architecture for the Guardian Shield Regulator Portal using React Context API and Redux Toolkit for complex state operations.

---

## 2. State Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Application State                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   Auth State    │  │   UI State      │  │ Notification    │            │
│  │   (Context)     │  │   (Context)     │  │ State (Context) │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       Redux Store                                    │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │ Evidence  │  │  Reports  │  │  Drills   │  │  Exports  │        │   │
│  │  │  Slice    │  │  Slice    │  │  Slice    │  │  Slice    │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Context State

### 3.1 Auth Context

```typescript
// types/auth.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'regulator_viewer' | 'regulator_exporter' | 'regulator_admin';
  organization: string;
  permissions: Permission[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// context/AuthContext.tsx
interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };
  
  const hasPermission = (permission: Permission) => {
    return state.user?.permissions.includes(permission) ?? false;
  };
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth reducer actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: string };
```

### 3.2 UI Context

```typescript
// context/UIContext.tsx
interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  locale: string;
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
}

interface UIContextValue extends UIState {
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UIState>({
    sidebarCollapsed: false,
    theme: 'light',
    locale: 'en',
    pageTitle: 'Dashboard',
    breadcrumbs: [],
  });
  
  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };
  
  return (
    <UIContext.Provider value={{ ...state, toggleSidebar, setTheme, ... }}>
      {children}
    </UIContext.Provider>
  );
}
```

### 3.3 Notification Context

```typescript
// context/NotificationContext.tsx
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    if (notification.duration !== 0) {
      setTimeout(() => dismissNotification(id), notification.duration ?? 5000);
    }
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
```

---

## 4. Redux Store

### 4.1 Store Configuration

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import evidenceReducer from './slices/evidenceSlice';
import reportsReducer from './slices/reportsSlice';
import drillsReducer from './slices/drillsSlice';
import exportsReducer from './slices/exportsSlice';

export const store = configureStore({
  reducer: {
    evidence: evidenceReducer,
    reports: reportsReducer,
    drills: drillsReducer,
    exports: exportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['evidence/setDateRange'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4.2 Evidence Slice

```typescript
// store/slices/evidenceSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface EvidenceState {
  entries: EvidenceEntry[];
  selectedEntry: EvidenceEntry | null;
  filters: EvidenceFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  sorting: {
    key: string;
    direction: 'asc' | 'desc';
  };
  loading: boolean;
  error: string | null;
  verificationResults: Record<string, VerificationResult>;
}

const initialState: EvidenceState = {
  entries: [],
  selectedEntry: null,
  filters: {
    type: null,
    severity: [],
    dateRange: null,
    searchQuery: '',
  },
  pagination: {
    page: 1,
    pageSize: 50,
    total: 0,
    hasMore: false,
  },
  sorting: {
    key: 'sequence',
    direction: 'desc',
  },
  loading: false,
  error: null,
  verificationResults: {},
};

// Async thunks
export const fetchEvidence = createAsyncThunk(
  'evidence/fetch',
  async (params: FetchEvidenceParams, { rejectWithValue }) => {
    try {
      const response = await evidenceApi.query(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyEntry = createAsyncThunk(
  'evidence/verify',
  async (entryId: string, { rejectWithValue }) => {
    try {
      const result = await evidenceApi.verify(entryId);
      return { entryId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const evidenceSlice = createSlice({
  name: 'evidence',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<EvidenceFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page on filter change
    },
    setSorting: (state, action: PayloadAction<{ key: string; direction: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    selectEntry: (state, action: PayloadAction<EvidenceEntry | null>) => {
      state.selectedEntry = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvidence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvidence.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.entries;
        state.pagination.total = action.payload.total;
        state.pagination.hasMore = action.payload.hasMore;
      })
      .addCase(fetchEvidence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEntry.fulfilled, (state, action) => {
        state.verificationResults[action.payload.entryId] = action.payload.result;
      });
  },
});

export const { setFilters, setSorting, setPage, selectEntry, clearFilters } = evidenceSlice.actions;
export default evidenceSlice.reducer;

// Selectors
export const selectEvidence = (state: RootState) => state.evidence.entries;
export const selectSelectedEntry = (state: RootState) => state.evidence.selectedEntry;
export const selectEvidenceLoading = (state: RootState) => state.evidence.loading;
export const selectVerificationResult = (entryId: string) => 
  (state: RootState) => state.evidence.verificationResults[entryId];
```

### 4.3 Reports Slice

```typescript
// store/slices/reportsSlice.ts
interface ReportsState {
  weeklyReports: Report[];
  monthlyReports: Report[];
  customExports: ExportJob[];
  loading: boolean;
  error: string | null;
}

export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [weekly, monthly] = await Promise.all([
        reportsApi.getWeekly(),
        reportsApi.getMonthly(),
      ]);
      return { weekly, monthly };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const downloadReport = createAsyncThunk(
  'reports/download',
  async (reportId: string, { rejectWithValue }) => {
    try {
      await reportsApi.download(reportId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 4.4 Exports Slice

```typescript
// store/slices/exportsSlice.ts
interface ExportsState {
  jobs: ExportJob[];
  activeJob: string | null;
  loading: boolean;
  error: string | null;
}

export const requestExport = createAsyncThunk(
  'exports/request',
  async (options: ExportOptions, { rejectWithValue }) => {
    try {
      const job = await exportsApi.request(options);
      return job;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const pollExportStatus = createAsyncThunk(
  'exports/pollStatus',
  async (jobId: string, { dispatch, rejectWithValue }) => {
    try {
      const status = await exportsApi.getStatus(jobId);
      if (status.status === 'processing') {
        // Continue polling
        setTimeout(() => dispatch(pollExportStatus(jobId)), 5000);
      }
      return status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## 5. Actions Reference

### 5.1 Evidence Actions

| Action | Type | Payload | Description |
|--------|------|---------|-------------|
| `setFilters` | Sync | `Partial<EvidenceFilters>` | Update filter criteria |
| `setSorting` | Sync | `{ key, direction }` | Set sort column and direction |
| `setPage` | Sync | `number` | Navigate to page |
| `selectEntry` | Sync | `EvidenceEntry \| null` | Select entry for detail view |
| `clearFilters` | Sync | None | Reset all filters |
| `fetchEvidence` | Async | `FetchEvidenceParams` | Load evidence entries |
| `verifyEntry` | Async | `string` | Verify entry integrity |

### 5.2 Reports Actions

| Action | Type | Payload | Description |
|--------|------|---------|-------------|
| `fetchReports` | Async | None | Load all reports |
| `downloadReport` | Async | `string` | Download report by ID |
| `verifyReport` | Async | `string` | Verify report signature |

### 5.3 Exports Actions

| Action | Type | Payload | Description |
|--------|------|---------|-------------|
| `requestExport` | Async | `ExportOptions` | Initiate new export |
| `pollExportStatus` | Async | `string` | Check export progress |
| `downloadExport` | Async | `string` | Download completed export |

---

## 6. State Persistence

### 6.1 Local Storage

Persisted state:
- Auth token
- UI preferences (sidebar, theme)
- Recent search queries

```typescript
// lib/storage.ts
const STORAGE_KEYS = {
  AUTH_TOKEN: 'guardian_auth_token',
  UI_PREFERENCES: 'guardian_ui_prefs',
  RECENT_SEARCHES: 'guardian_recent_searches',
};

export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
  
  getUIPreferences: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.UI_PREFERENCES) || '{}'),
  setUIPreferences: (prefs: UIPreferences) => 
    localStorage.setItem(STORAGE_KEYS.UI_PREFERENCES, JSON.stringify(prefs)),
};
```

### 6.2 Session Storage

Persisted state:
- Current page state (filters, pagination)
- Selected entries

---

## 7. Middleware

### 7.1 Logging Middleware

```typescript
// store/middleware/logger.ts
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(action.type);
    console.log('Payload:', action.payload);
    console.log('Previous state:', store.getState());
    const result = next(action);
    console.log('Next state:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};
```

### 7.2 Error Handling Middleware

```typescript
// store/middleware/errorHandler.ts
const errorMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  if (action.type.endsWith('/rejected')) {
    const notification = {
      type: 'error' as const,
      title: 'Operation Failed',
      message: action.payload,
    };
    // Dispatch notification through context or store
  }
  
  return result;
};
```

---

## 8. Type Definitions

```typescript
// types/state.ts
interface EvidenceEntry {
  id: string;
  sequence: number;
  timestamp: string;
  type: EventType;
  severity: Severity;
  payload: Record<string, unknown>;
  hash: string;
  prevHash: string;
  signature: string;
  anchor?: AnchorInfo;
}

interface EvidenceFilters {
  type: EventType | null;
  severity: Severity[];
  dateRange: { start: Date; end: Date } | null;
  searchQuery: string;
}

interface VerificationResult {
  valid: boolean;
  hashValid: boolean;
  signatureValid: boolean;
  anchorValid: boolean;
  errors: string[];
}

type EventType = 'fraud_event' | 'alert_triggered' | 'report_generated' | 'drill_executed' | 'configuration_change';
type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
```

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
*Classification: Internal*
