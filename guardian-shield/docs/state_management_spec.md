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
  userProfile: UserProfileState;
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

#### User Profile State

```typescript
interface UserProfileState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  notifications: NotificationSettings | null;
  security: SecuritySettings | null;
  activityLog: Activity[];
  sessions: SessionsList | null;
  apiKeys: APIKey[];
  loading: {
    profile: boolean;
    preferences: boolean;
    notifications: boolean;
    activity: boolean;
    sessions: boolean;
    apiKeys: boolean;
  };
  error: {
    profile: string | null;
    preferences: string | null;
    notifications: string | null;
    activity: string | null;
    sessions: string | null;
    apiKeys: string | null;
  };
  pagination: {
    activity: {
      current_page: number;
      total_pages: number;
      per_page: number;
    };
  };
}

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: 'regulator' | 'auditor' | 'investor' | 'viewer';
  organization: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  timezone: string;
  language: string;
  contact_email?: string;
  contact_phone?: string;
}

interface NotificationSettings {
  email: {
    critical_alerts: boolean;
    high_alerts: boolean;
    medium_alerts: boolean;
    weekly_reports: boolean;
    drill_notifications: boolean;
    system_maintenance: boolean;
  };
  in_app: {
    alert_updates: boolean;
    system_announcements: boolean;
    drill_reminders: boolean;
    report_ready: boolean;
  };
  delivery: {
    email_digest: 'immediate' | 'hourly' | 'daily';
    quiet_hours?: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
    };
    emergency_override: boolean;
  };
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  two_factor_method?: 'totp' | 'sms';
  active_sessions: number;
  api_keys_count: number;
}

type ActivityType = 
  | 'profile_update' 
  | 'login' 
  | 'logout' 
  | 'evidence_access' 
  | 'report_download' 
  | 'verification' 
  | 'api_key_operation';

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

interface SessionsList {
  current_session: UserSession;
  other_sessions: UserSession[];
}

interface UserSession {
  id: string;
  device: string;
  ip_address: string;
  location: string;
  created_at: string;
  last_active: string;
}

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  environment: 'production' | 'development';
  created_at: string;
  last_used: string | null;
  scopes: string[];
  expires_at: string | null;
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

### 3.7 User Profile Actions

```typescript
// Async Thunks
export const fetchUserProfile = createAsyncThunk<UserProfile, void>(
  'userProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk<UserProfile, Partial<UserPreferences>>(
  'userProfile/updateProfile',
  async (preferences, { rejectWithValue }) => {
    try {
      await api.patch('/users/profile', { preferences });
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk<NotificationSettings, Partial<NotificationSettings>>(
  'userProfile/updateNotifications',
  async (settings, { rejectWithValue }) => {
    try {
      await api.patch('/users/profile/notifications', settings);
      const response = await api.get('/users/profile');
      return response.data.notifications;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update notifications');
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk<string, File>(
  'userProfile/uploadPhoto',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await api.post('/users/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.avatar_url;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to upload photo');
    }
  }
);

export const fetchActivityLog = createAsyncThunk<{ activities: Activity[], pagination: any }, { page: number; per_page: number; type?: string }>(
  'userProfile/fetchActivity',
  async ({ page, per_page, type }, { rejectWithValue }) => {
    try {
      const params = { page, per_page, ...(type && { type }) };
      const response = await api.get('/users/profile/activity', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch activity');
    }
  }
);

export const fetchActiveSessions = createAsyncThunk<SessionsList, void>(
  'userProfile/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile/sessions');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch sessions');
    }
  }
);

export const revokeSession = createAsyncThunk<string, string>(
  'userProfile/revokeSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/profile/sessions/${sessionId}`);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to revoke session');
    }
  }
);

export const fetchAPIKeys = createAsyncThunk<APIKey[], void>(
  'userProfile/fetchAPIKeys',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile/api-keys');
      return response.data.api_keys;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch API keys');
    }
  }
);

export const createAPIKey = createAsyncThunk<APIKey, { name: string; environment: string; scopes: string[]; expires_at?: string | null }>(
  'userProfile/createAPIKey',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/profile/api-keys', data);
      return response.data.api_key;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create API key');
    }
  }
);

export const revokeAPIKey = createAsyncThunk<string, string>(
  'userProfile/revokeAPIKey',
  async (keyId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/profile/api-keys/${keyId}`);
      return keyId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to revoke API key');
    }
  }
);

// Sync Actions
export const clearProfileError = createAction<keyof UserProfileState['error']>('userProfile/clearError');
export const resetProfileState = createAction('userProfile/reset');
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

### 4.7 User Profile Selectors

```typescript
export const selectUserProfile = (state: RootState) => state.userProfile;
export const selectProfile = (state: RootState) => state.userProfile.profile;
export const selectUserPreferences = (state: RootState) => state.userProfile.preferences;
export const selectNotificationSettings = (state: RootState) => state.userProfile.notifications;
export const selectSecuritySettings = (state: RootState) => state.userProfile.security;
export const selectActivityLog = (state: RootState) => state.userProfile.activityLog;
export const selectUserSessions = (state: RootState) => state.userProfile.sessions;
export const selectAPIKeys = (state: RootState) => state.userProfile.apiKeys;

export const selectProfileLoading = (state: RootState) => state.userProfile.loading.profile;
export const selectActivityLoading = (state: RootState) => state.userProfile.loading.activity;
export const selectSessionsLoading = (state: RootState) => state.userProfile.loading.sessions;
export const selectAPIKeysLoading = (state: RootState) => state.userProfile.loading.apiKeys;

export const selectProfileError = (state: RootState) => state.userProfile.error.profile;
export const selectActivityError = (state: RootState) => state.userProfile.error.activity;

export const selectHasTwoFactorEnabled = createSelector(
  selectSecuritySettings,
  (security) => security?.two_factor_enabled ?? false
);

export const selectActiveAPIKeys = createSelector(
  selectAPIKeys,
  (keys) => keys.filter(key => !key.expires_at || new Date(key.expires_at) > new Date())
);

export const selectProductionAPIKeys = createSelector(
  selectAPIKeys,
  (keys) => keys.filter(key => key.environment === 'production')
);

export const selectRecentActivity = (count: number) =>
  createSelector(selectActivityLog, (activities) =>
    activities.slice(0, count)
  );

export const selectActivityByType = (type: Activity['type']) =>
  createSelector(selectActivityLog, (activities) =>
    activities.filter(activity => activity.type === type)
  );

export const selectEmailNotificationsEnabled = createSelector(
  selectNotificationSettings,
  (settings) => ({
    critical: settings?.email.critical_alerts ?? true,
    high: settings?.email.high_alerts ?? true,
    medium: settings?.email.medium_alerts ?? false,
    reports: settings?.email.weekly_reports ?? true,
  })
);

export const selectQuietHoursActive = createSelector(
  selectNotificationSettings,
  (settings) => {
    if (!settings?.delivery.quiet_hours?.enabled) return false;
    
    const now = new Date();
    const timezone = settings.delivery.quiet_hours.timezone;
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone 
    });
    
    const start = settings.delivery.quiet_hours.start;
    const end = settings.delivery.quiet_hours.end;
    
    return currentTime >= start && currentTime <= end;
  }
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
  userProfile: userProfileReducer,
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
