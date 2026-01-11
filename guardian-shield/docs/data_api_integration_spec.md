# Guardian Shield — Data API Integration Specification
## Crypto Hound LLC — Frontend ↔ Ledger API Mapping

---

## 1. Overview

This document specifies how the Guardian Shield frontend components integrate with the Evidence Ledger API, including data fetching patterns, error handling, and caching strategies.

---

## 2. API Client Configuration

### 2.1 Base Configuration

```typescript
// api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store';
import { refreshToken, logout } from '../store/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.guardianshield.cryptohound.com/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 - try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await store.dispatch(refreshToken()).unwrap();
        const state = store.getState();
        originalRequest.headers.Authorization = `Bearer ${state.auth.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 2.2 API Error Types

```typescript
// api/types.ts
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
};
```

---

## 3. API Service Modules

### 3.1 Ledger API

```typescript
// api/ledger.ts
import { apiClient } from './client';
import { ApiResponse, LedgerEntry, LedgerFilters, QueryResponse } from './types';

export const ledgerApi = {
  /**
   * Append evidence to ledger
   * POST /ledger/append
   */
  append: async (data: {
    caseId: string;
    bundleId?: string;
    evidenceType: string;
    evidenceContent: string; // Base64
    hash: string;
    signature: string;
    anchor?: 'blockchain_anchor:enabled' | 'blockchain_anchor:disabled';
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<{
    status: string;
    entryId: string;
    blockId: string;
    parentHash: string;
    timestamp: string;
  }>> => {
    const response = await apiClient.post('/ledger/append', data);
    return response.data;
  },

  /**
   * Query ledger entries
   * GET /ledger/query
   */
  query: async (params: {
    caseId?: string;
    severity?: string[];
    evidenceType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<QueryResponse<LedgerEntry>> => {
    const response = await apiClient.get('/ledger/query', { params });
    return response.data;
  },

  /**
   * Get single entry
   * GET /ledger/entry/{entryId}
   */
  getEntry: async (entryId: string): Promise<ApiResponse<LedgerEntry>> => {
    const response = await apiClient.get(`/ledger/entry/${entryId}`);
    return response.data;
  },

  /**
   * Verify bundle
   * GET /ledger/verify/{bundleId}
   */
  verify: async (bundleId: string): Promise<ApiResponse<VerificationResult>> => {
    const response = await apiClient.get(`/ledger/verify/${bundleId}`);
    return response.data;
  },

  /**
   * Verify by hash
   * GET /ledger/verify/hash/{hash}
   */
  verifyHash: async (hash: string): Promise<ApiResponse<HashVerificationResult>> => {
    const response = await apiClient.get(`/ledger/verify/hash/${hash}`);
    return response.data;
  },

  /**
   * Export compliance bundle
   * POST /ledger/export
   */
  export: async (config: ExportConfig): Promise<ApiResponse<ExportJob>> => {
    const response = await apiClient.post('/ledger/export', config);
    return response.data;
  },

  /**
   * Download export
   * GET /ledger/export/{exportId}/download
   */
  downloadExport: async (exportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/ledger/export/${exportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * List blocks
   * GET /ledger/blocks
   */
  listBlocks: async (params: { page?: number; limit?: number }): Promise<QueryResponse<Block>> => {
    const response = await apiClient.get('/ledger/blocks', { params });
    return response.data;
  },

  /**
   * Get block details
   * GET /ledger/blocks/{blockId}
   */
  getBlock: async (blockId: string): Promise<ApiResponse<Block>> => {
    const response = await apiClient.get(`/ledger/blocks/${blockId}`);
    return response.data;
  },

  /**
   * Check ledger integrity
   * GET /ledger/integrity
   */
  checkIntegrity: async (): Promise<ApiResponse<IntegrityResult>> => {
    const response = await apiClient.get('/ledger/integrity');
    return response.data;
  },
};
```

### 3.2 Reports API

```typescript
// api/reports.ts
import { apiClient } from './client';
import { ApiResponse, Report, QueryResponse } from './types';

export const reportsApi = {
  /**
   * Get weekly reports
   * GET /reports/weekly
   */
  getWeekly: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<QueryResponse<Report>> => {
    const response = await apiClient.get('/reports/weekly', { params });
    return response.data;
  },

  /**
   * Get drill reports
   * GET /reports/drills
   */
  getDrills: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<QueryResponse<Report>> => {
    const response = await apiClient.get('/reports/drills', { params });
    return response.data;
  },

  /**
   * Get report by ID
   * GET /reports/{reportId}
   */
  getReport: async (reportId: string): Promise<ApiResponse<Report>> => {
    const response = await apiClient.get(`/reports/${reportId}`);
    return response.data;
  },

  /**
   * Download report
   * GET /reports/{reportId}/download
   */
  download: async (reportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Export compliance bundle
   * POST /reports/export
   */
  export: async (config: {
    format: 'pdfa' | 'json' | 'zip';
    caseId?: string;
    include?: string[];
    dateRange?: { start: string; end: string };
  }): Promise<ApiResponse<{ exportId: string; status: string }>> => {
    const response = await apiClient.post('/reports/export', config);
    return response.data;
  },

  /**
   * Get export status
   * GET /reports/export/{exportId}/status
   */
  getExportStatus: async (exportId: string): Promise<ApiResponse<ExportJob>> => {
    const response = await apiClient.get(`/reports/export/${exportId}/status`);
    return response.data;
  },
};
```

### 3.3 Alerts API

```typescript
// api/alerts.ts
import { apiClient } from './client';
import { ApiResponse, Alert, QueryResponse } from './types';

export const alertsApi = {
  /**
   * Get alerts
   * GET /alerts
   */
  getAlerts: async (params?: {
    severity?: string[];
    acknowledged?: boolean;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<QueryResponse<Alert>> => {
    const response = await apiClient.get('/alerts', { params });
    return response.data;
  },

  /**
   * Get alert by ID
   * GET /alerts/{alertId}
   */
  getAlert: async (alertId: string): Promise<ApiResponse<Alert>> => {
    const response = await apiClient.get(`/alerts/${alertId}`);
    return response.data;
  },

  /**
   * Acknowledge alert
   * POST /alerts/{alertId}/acknowledge
   */
  acknowledge: async (alertId: string): Promise<ApiResponse<Alert>> => {
    const response = await apiClient.post(`/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  /**
   * Get WebSocket URL for real-time alerts
   */
  getStreamUrl: (): string => {
    const baseUrl = process.env.REACT_APP_WS_URL || 'wss://api.guardianshield.cryptohound.com';
    return `${baseUrl}/alerts/stream`;
  },
};
```

### 3.4 Drills API

```typescript
// api/drills.ts
import { apiClient } from './client';
import { ApiResponse, DrillSchedule, DrillExecution, QueryResponse } from './types';

export const drillsApi = {
  /**
   * Get drill schedule
   * GET /drills/schedule
   */
  getSchedule: async (): Promise<ApiResponse<DrillSchedule[]>> => {
    const response = await apiClient.get('/drills/schedule');
    return response.data;
  },

  /**
   * Get drill executions
   * GET /drills/executions
   */
  getExecutions: async (params?: {
    status?: string;
    scenario?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<QueryResponse<DrillExecution>> => {
    const response = await apiClient.get('/drills/executions', { params });
    return response.data;
  },

  /**
   * Get drill metrics
   * GET /drills/metrics
   */
  getMetrics: async (): Promise<ApiResponse<{
    successRate: number;
    frequency: { date: string; hour: number; count: number }[];
    slaCompliance: {
      critical: { target: number; p50: number; p95: number; p99: number };
      high: { target: number; p50: number; p95: number; p99: number };
    };
  }>> => {
    const response = await apiClient.get('/drills/metrics');
    return response.data;
  },

  /**
   * Get drill logs
   * GET /drills/logs
   */
  getLogs: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<QueryResponse<DrillLog>> => {
    const response = await apiClient.get('/drills/logs', { params });
    return response.data;
  },
};
```

### 3.6 User Profile API

```typescript
// api/services/userProfile.ts
import { apiClient } from '../client';

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: 'regulator' | 'auditor' | 'investor' | 'viewer';
  organization: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export interface UserPreferences {
  timezone: string;
  language: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface NotificationSettings {
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

export interface SecuritySettings {
  two_factor_enabled: boolean;
  two_factor_method?: 'totp' | 'sms';
  active_sessions: number;
  api_keys_count: number;
}

export type ActivityType = 
  | 'profile_update' 
  | 'login' 
  | 'logout' 
  | 'evidence_access' 
  | 'report_download' 
  | 'verification' 
  | 'api_key_operation';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  ip_address: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export interface UserSession {
  id: string;
  device: string;
  ip_address: string;
  location: string;
  created_at: string;
  last_active: string;
}

export interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
  environment: 'production' | 'development';
  created_at: string;
  last_used: string | null;
  scopes: string[];
  expires_at: string | null;
}

export const userProfileApi = {
  /**
   * Get user profile
   * GET /users/profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   * PATCH /users/profile
   */
  updateProfile: async (preferences: Partial<UserPreferences>): Promise<void> => {
    await apiClient.patch('/users/profile', { preferences });
  },

  /**
   * Update notification settings
   * PATCH /users/profile/notifications
   */
  updateNotifications: async (settings: Partial<NotificationSettings>): Promise<void> => {
    await apiClient.patch('/users/profile/notifications', settings);
  },

  /**
   * Upload profile photo
   * POST /users/profile/photo
   */
  uploadPhoto: async (file: File): Promise<{ avatar_url: string; thumbnail_url: string }> => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await apiClient.post('/users/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  /**
   * Get activity log
   * GET /users/profile/activity
   */
  getActivity: async (params?: {
    page?: number;
    per_page?: number;
    type?: string;
    start_date?: string;
  }): Promise<{
    activities: Activity[];
    pagination: {
      current_page: number;
      per_page: number;
      total_entries: number;
      total_pages: number;
    };
  }> => {
    const response = await apiClient.get('/users/profile/activity', { params });
    return response.data;
  },

  /**
   * Get active sessions
   * GET /users/profile/sessions
   */
  getSessions: async (): Promise<{
    current_session: UserSession;
    other_sessions: UserSession[];
  }> => {
    const response = await apiClient.get('/users/profile/sessions');
    return response.data;
  },

  /**
   * Revoke session
   * DELETE /users/profile/sessions/{session_id}
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/users/profile/sessions/${sessionId}`);
  },

  /**
   * List API keys
   * GET /users/profile/api-keys
   */
  getAPIKeys: async (): Promise<{ api_keys: APIKey[] }> => {
    const response = await apiClient.get('/users/profile/api-keys');
    return response.data;
  },

  /**
   * Create API key
   * POST /users/profile/api-keys
   */
  createAPIKey: async (data: {
    name: string;
    environment: 'production' | 'development';
    scopes: string[];
    expires_at?: string | null;
  }): Promise<{
    api_key: APIKey & { key: string };
    warning: string;
  }> => {
    const response = await apiClient.post('/users/profile/api-keys', data);
    return response.data;
  },

  /**
   * Revoke API key
   * DELETE /users/profile/api-keys/{key_id}
   */
  revokeAPIKey: async (keyId: string): Promise<void> => {
    await apiClient.delete(`/users/profile/api-keys/${keyId}`);
  },
};
```

---

## 4. React Query Integration

### 4.1 Query Configuration

```typescript
// api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 4.2 Query Hooks

```typescript
// hooks/useLedger.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ledgerApi } from '../api/ledger';

export const LEDGER_KEYS = {
  all: ['ledger'] as const,
  entries: () => [...LEDGER_KEYS.all, 'entries'] as const,
  entry: (id: string) => [...LEDGER_KEYS.all, 'entry', id] as const,
  blocks: () => [...LEDGER_KEYS.all, 'blocks'] as const,
  block: (id: string) => [...LEDGER_KEYS.all, 'block', id] as const,
  integrity: () => [...LEDGER_KEYS.all, 'integrity'] as const,
};

export const useLedgerEntries = (filters: LedgerFilters) => {
  return useQuery({
    queryKey: [...LEDGER_KEYS.entries(), filters],
    queryFn: () => ledgerApi.query({
      caseId: filters.caseId || undefined,
      severity: filters.severity.length > 0 ? filters.severity : undefined,
      evidenceType: filters.evidenceType.length > 0 ? filters.evidenceType[0] : undefined,
      status: filters.status.length > 0 ? filters.status[0] : undefined,
      startDate: filters.dateRange.start || undefined,
      endDate: filters.dateRange.end || undefined,
      page: filters.page,
      limit: filters.pageSize,
      sort: `${filters.sortField}:${filters.sortDirection}`,
    }),
    keepPreviousData: true,
  });
};

export const useLedgerEntry = (entryId: string) => {
  return useQuery({
    queryKey: LEDGER_KEYS.entry(entryId),
    queryFn: () => ledgerApi.getEntry(entryId),
    enabled: !!entryId,
  });
};

export const useVerifyBundle = () => {
  return useMutation({
    mutationFn: (bundleId: string) => ledgerApi.verify(bundleId),
  });
};

export const useVerifyHash = () => {
  return useMutation({
    mutationFn: (hash: string) => ledgerApi.verifyHash(hash),
  });
};

export const useAppendEvidence = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ledgerApi.append,
    onSuccess: () => {
      queryClient.invalidateQueries(LEDGER_KEYS.entries());
    },
  });
};

export const useLedgerIntegrity = () => {
  return useQuery({
    queryKey: LEDGER_KEYS.integrity(),
    queryFn: ledgerApi.checkIntegrity,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### 4.3 Reports Hooks

```typescript
// hooks/useReports.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '../api/reports';

export const REPORTS_KEYS = {
  all: ['reports'] as const,
  weekly: () => [...REPORTS_KEYS.all, 'weekly'] as const,
  drills: () => [...REPORTS_KEYS.all, 'drills'] as const,
  report: (id: string) => [...REPORTS_KEYS.all, 'report', id] as const,
  export: (id: string) => [...REPORTS_KEYS.all, 'export', id] as const,
};

export const useWeeklyReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...REPORTS_KEYS.weekly(), { page, limit }],
    queryFn: () => reportsApi.getWeekly({ page, limit }),
  });
};

export const useDrillReports = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...REPORTS_KEYS.drills(), { page, limit }],
    queryFn: () => reportsApi.getDrills({ page, limit }),
  });
};

export const useExportReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportsApi.export,
    onSuccess: (data) => {
      // Start polling for export status
      queryClient.invalidateQueries(REPORTS_KEYS.export(data.data.exportId));
    },
  });
};

export const useExportStatus = (exportId: string, enabled = true) => {
  return useQuery({
    queryKey: REPORTS_KEYS.export(exportId),
    queryFn: () => reportsApi.getExportStatus(exportId),
    enabled: enabled && !!exportId,
    refetchInterval: (data) => {
      if (data?.data.status === 'completed' || data?.data.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: async (reportId: string) => {
      const blob = await reportsApi.download(reportId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${reportId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });
};
```

### 4.4 Alerts Hooks

```typescript
// hooks/useAlerts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState, useCallback } from 'react';
import { alertsApi } from '../api/alerts';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/auth';

export const ALERTS_KEYS = {
  all: ['alerts'] as const,
  list: () => [...ALERTS_KEYS.all, 'list'] as const,
  alert: (id: string) => [...ALERTS_KEYS.all, 'alert', id] as const,
};

export const useAlerts = (filters?: AlertFilters) => {
  return useQuery({
    queryKey: [...ALERTS_KEYS.list(), filters],
    queryFn: () => alertsApi.getAlerts(filters),
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: alertsApi.acknowledge,
    onSuccess: (_, alertId) => {
      queryClient.invalidateQueries(ALERTS_KEYS.list());
      queryClient.invalidateQueries(ALERTS_KEYS.alert(alertId));
    },
  });
};

// WebSocket hook for real-time alerts
export const useAlertsStream = () => {
  const { token } = useSelector(selectAuth);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!token) return;
    
    setStatus('connecting');
    const url = `${alertsApi.getStreamUrl()}?token=${token}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus('connected');
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setAlerts((prev) => [alert, ...prev].slice(0, 100)); // Keep last 100
    };

    ws.onclose = () => {
      setStatus('disconnected');
      // Exponential backoff reconnect
      if (reconnectAttemptsRef.current < 5) {
        const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000;
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { alerts, status, reconnect: connect };
};
```

### 4.3 User Profile Query Hooks

```typescript
// hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userProfileApi } from '../api/userProfile';

export const USER_PROFILE_KEYS = {
  all: ['userProfile'] as const,
  profile: () => [...USER_PROFILE_KEYS.all, 'profile'] as const,
  activity: () => [...USER_PROFILE_KEYS.all, 'activity'] as const,
  sessions: () => [...USER_PROFILE_KEYS.all, 'sessions'] as const,
  apiKeys: () => [...USER_PROFILE_KEYS.all, 'apiKeys'] as const,
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: USER_PROFILE_KEYS.profile(),
    queryFn: userProfileApi.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.profile() });
    },
  });
};

export const useUpdateNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfileApi.updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.profile() });
    },
  });
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfileApi.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.profile() });
    },
  });
};

export const useActivity = (params?: {
  page?: number;
  per_page?: number;
  type?: string;
  start_date?: string;
}) => {
  return useQuery({
    queryKey: [...USER_PROFILE_KEYS.activity(), params],
    queryFn: () => userProfileApi.getActivity(params),
    keepPreviousData: true,
  });
};

export const useUserSessions = () => {
  return useQuery({
    queryKey: USER_PROFILE_KEYS.sessions(),
    queryFn: userProfileApi.getSessions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfileApi.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.sessions() });
    },
  });
};

export const useAPIKeys = () => {
  return useQuery({
    queryKey: USER_PROFILE_KEYS.apiKeys(),
    queryFn: userProfileApi.getAPIKeys,
    select: (data) => data.api_keys,
  });
};

export const useCreateAPIKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfileApi.createAPIKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.apiKeys() });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.profile() });
    },
  });
};

export const useRevokeAPIKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userProfileApi.revokeAPIKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.apiKeys() });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEYS.profile() });
    },
  });
};
```

---

## 5. Data Transformation

### 5.1 Response Transformers

```typescript
// api/transformers.ts

export const transformLedgerEntry = (raw: any): LedgerEntry => ({
  entryId: raw.entry_id,
  blockId: raw.block_id,
  caseId: raw.case_id,
  bundleId: raw.bundle_id,
  evidenceType: raw.evidence_type,
  evidenceHash: raw.evidence_hash,
  evidenceSize: raw.evidence_size,
  evidenceLocation: raw.evidence_location,
  metadata: raw.metadata,
  severity: raw.severity,
  signature: raw.signature,
  status: raw.status,
  anchorStatus: raw.anchor_status,
  createdAt: raw.created_at,
  createdBy: raw.created_by,
});

export const transformAlert = (raw: any): Alert => ({
  id: raw.id,
  caseId: raw.case_id,
  severity: raw.severity,
  title: raw.title,
  description: raw.description,
  cluster: raw.cluster,
  value: raw.value,
  timestamp: raw.timestamp,
  routing: {
    regulator: raw.routing?.regulator ?? false,
    investor: raw.routing?.investor ?? false,
    dashboard: raw.routing?.dashboard ?? false,
  },
  acknowledged: raw.acknowledged ?? false,
  acknowledgedAt: raw.acknowledged_at,
  acknowledgedBy: raw.acknowledged_by,
  evidenceId: raw.evidence_id,
  metadata: raw.metadata,
});

export const transformReport = (raw: any): Report => ({
  id: raw.id,
  type: raw.type,
  title: raw.title,
  period: raw.period,
  generatedAt: raw.generated_at,
  metrics: raw.metrics ? {
    totalAlerts: raw.metrics.total_alerts,
    criticalAlerts: raw.metrics.critical_alerts,
    highAlerts: raw.metrics.high_alerts,
    mediumAlerts: raw.metrics.medium_alerts,
    watchlistAlerts: raw.metrics.watchlist_alerts,
    slaComplianceRate: raw.metrics.sla_compliance_rate,
    drillSuccessRate: raw.metrics.drill_success_rate,
  } : undefined,
  hash: raw.hash,
  signature: raw.signature,
  anchorStatus: raw.anchor_status,
  downloadUrl: raw.download_url,
  previewUrl: raw.preview_url,
});
```

---

## 6. Error Handling

### 6.1 Error Handler Utility

```typescript
// utils/errorHandler.ts
import { isApiError, ApiError } from '../api/types';
import { store } from '../store';
import { addToast } from '../store/ui';

export const handleApiError = (error: unknown, context?: string): string => {
  let message = 'An unexpected error occurred';
  
  if (isApiError(error)) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        message = 'Your session has expired. Please log in again.';
        break;
      case 'FORBIDDEN':
        message = 'You do not have permission to perform this action.';
        break;
      case 'NOT_FOUND':
        message = context ? `${context} not found.` : 'Resource not found.';
        break;
      case 'VALIDATION_ERROR':
        message = error.message || 'Invalid input provided.';
        break;
      case 'RATE_LIMITED':
        message = 'Too many requests. Please wait and try again.';
        break;
      default:
        message = error.message || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  
  // Show toast notification
  store.dispatch(addToast({
    type: 'error',
    message,
    duration: 5000,
  }));
  
  return message;
};
```

---

## 7. Caching Strategy

### 7.1 Cache Invalidation Rules

| Data Type | Stale Time | Cache Time | Invalidation Triggers |
|-----------|------------|------------|----------------------|
| Ledger Entries | 1 min | 10 min | New entry, filter change |
| Reports | 5 min | 30 min | New report generated |
| Alerts | 30 sec | 5 min | Real-time WebSocket |
| Drill Metrics | 5 min | 30 min | Drill completion |
| Verification | No cache | No cache | Always fresh |
| Integrity Check | 10 min | 30 min | Manual refresh |

---

*© 2025 Crypto Hound LLC. All rights reserved.*
