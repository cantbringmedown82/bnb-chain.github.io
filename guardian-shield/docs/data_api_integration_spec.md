# Data API Integration Specification

## Overview

This document specifies the integration between the Guardian Shield frontend and the backend data APIs.

---

## 1. API Client Configuration

### 1.1 Base Configuration

```typescript
// services/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface APIClientConfig {
  baseURL: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

const defaultConfig: APIClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  retryCount: 3,
  retryDelay: 1000,
};

class APIClient {
  private instance: AxiosInstance;
  private config: APIClientConfig;
  
  constructor(config: Partial<APIClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request ID for tracing
        config.headers['X-Request-ID'] = crypto.randomUUID();
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Handle retry logic
        if (this.shouldRetry(error, config)) {
          config._retryCount = (config._retryCount || 0) + 1;
          await this.delay(this.config.retryDelay * config._retryCount);
          return this.instance(config);
        }
        
        return Promise.reject(this.normalizeError(error));
      }
    );
  }
  
  private shouldRetry(error: any, config: AxiosRequestConfig): boolean {
    const retryCount = (config as any)._retryCount || 0;
    const isRetryable = 
      error.code === 'ECONNABORTED' ||
      (error.response?.status >= 500 && error.response?.status < 600);
    
    return isRetryable && retryCount < this.config.retryCount;
  }
  
  private normalizeError(error: any): APIError {
    return {
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      details: error.response?.data?.details,
    };
  }
  
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  // Public methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config).then((res) => res.data);
  }
  
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config).then((res) => res.data);
  }
  
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config).then((res) => res.data);
  }
  
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config).then((res) => res.data);
  }
}

export const apiClient = new APIClient();
```

### 1.2 Error Types

```typescript
// types/api.ts
export interface APIError {
  code: string;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export type APIResponse<T> = {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    cursor?: string;
  };
};
```

---

## 2. Domain-Specific API Services

### 2.1 Evidence API

```typescript
// services/api/evidence.ts
import { apiClient } from './client';
import {
  EvidenceEntry,
  EvidenceFilters,
  EvidenceListResponse,
  CreateEvidenceRequest,
  ExportRequest,
  ExportJob,
  ChainVerificationResult,
  SignatureVerificationResult,
  AnchorVerificationResult,
} from '@/types/evidence';

export const evidenceApi = {
  /**
   * List evidence entries with pagination and filtering
   */
  list: async (filters: EvidenceFilters): Promise<EvidenceListResponse> => {
    const params = new URLSearchParams();
    
    if (filters.type) params.set('type', filters.type);
    if (filters.fromTimestamp) params.set('from_timestamp', filters.fromTimestamp);
    if (filters.toTimestamp) params.set('to_timestamp', filters.toTimestamp);
    if (filters.severity) params.set('severity', filters.severity);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.cursor) params.set('cursor', filters.cursor);
    
    return apiClient.get(`/evidence?${params}`);
  },
  
  /**
   * Get a single evidence entry by ID
   */
  get: async (id: string, includeProof = false): Promise<EvidenceEntry> => {
    const params = includeProof ? '?include_proof=true' : '';
    return apiClient.get(`/evidence/${id}${params}`);
  },
  
  /**
   * Get evidence entry by content hash
   */
  getByHash: async (hash: string): Promise<EvidenceEntry> => {
    return apiClient.get(`/evidence/by-hash/${hash}`);
  },
  
  /**
   * Append a new evidence entry
   */
  create: async (request: CreateEvidenceRequest): Promise<EvidenceEntry> => {
    return apiClient.post('/evidence', request);
  },
  
  /**
   * Verify hash chain integrity for a range of entries
   */
  verifyChain: async (fromSequence: number, toSequence: number): Promise<ChainVerificationResult> => {
    return apiClient.post('/verification/chain', {
      from_sequence: fromSequence,
      to_sequence: toSequence,
    });
  },
  
  /**
   * Verify signature of a specific entry
   */
  verifySignature: async (entryId: string): Promise<SignatureVerificationResult> => {
    return apiClient.get(`/verification/signature/${entryId}`);
  },
  
  /**
   * Verify blockchain anchor
   */
  verifyAnchor: async (txHash: string, chain: string): Promise<AnchorVerificationResult> => {
    return apiClient.get(`/verification/anchor/${txHash}?chain=${chain}`);
  },
  
  /**
   * Export evidence bundle
   */
  export: async (request: ExportRequest): Promise<ExportJob> => {
    return apiClient.post('/export', request);
  },
  
  /**
   * Get export job status
   */
  getExportStatus: async (jobId: string): Promise<ExportJob> => {
    return apiClient.get(`/export/${jobId}`);
  },
  
  /**
   * Download export bundle
   */
  downloadExport: async (jobId: string): Promise<Blob> => {
    const response = await apiClient.get(`/export/${jobId}/download`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  },
};
```

### 2.2 Alerts API

```typescript
// services/api/alerts.ts
import { apiClient } from './client';
import {
  Alert,
  AlertFilters,
  AlertListResponse,
  AlertRule,
  AlertRuleFilters,
} from '@/types/alerts';

export const alertsApi = {
  /**
   * List active alerts
   */
  listActive: async (filters?: AlertFilters): Promise<Alert[]> => {
    const params = new URLSearchParams();
    
    if (filters?.severity) {
      filters.severity.forEach((s) => params.append('severity', s));
    }
    if (filters?.search) params.set('search', filters.search);
    
    return apiClient.get(`/alerts/active?${params}`);
  },
  
  /**
   * List alert history
   */
  listHistory: async (filters: AlertFilters & { limit?: number; cursor?: string }): Promise<AlertListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.severity) {
      filters.severity.forEach((s) => params.append('severity', s));
    }
    if (filters?.state) {
      filters.state.forEach((s) => params.append('state', s));
    }
    if (filters?.fromTimestamp) params.set('from', filters.fromTimestamp);
    if (filters?.toTimestamp) params.set('to', filters.toTimestamp);
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.cursor) params.set('cursor', filters.cursor);
    
    return apiClient.get(`/alerts/history?${params}`);
  },
  
  /**
   * Get single alert details
   */
  get: async (id: string): Promise<Alert> => {
    return apiClient.get(`/alerts/${id}`);
  },
  
  /**
   * Acknowledge an alert
   */
  acknowledge: async (id: string, comment?: string): Promise<Alert> => {
    return apiClient.post(`/alerts/${id}/acknowledge`, { comment });
  },
  
  /**
   * Silence an alert
   */
  silence: async (id: string, duration: number, comment?: string): Promise<Alert> => {
    return apiClient.post(`/alerts/${id}/silence`, { duration, comment });
  },
  
  /**
   * List alert rules
   */
  listRules: async (filters?: AlertRuleFilters): Promise<AlertRule[]> => {
    const params = new URLSearchParams();
    if (filters?.group) params.set('group', filters.group);
    
    return apiClient.get(`/alerts/rules?${params}`);
  },
  
  /**
   * Update alert rule
   */
  updateRule: async (id: string, updates: Partial<AlertRule>): Promise<AlertRule> => {
    return apiClient.put(`/alerts/rules/${id}`, updates);
  },
};
```

### 2.3 Metrics API

```typescript
// services/api/metrics.ts
import { apiClient } from './client';
import {
  RealtimeMetrics,
  HistoricalMetrics,
  MetricQuery,
} from '@/types/metrics';

export const metricsApi = {
  /**
   * Get real-time metrics snapshot
   */
  getRealtime: async (): Promise<RealtimeMetrics> => {
    return apiClient.get('/metrics/realtime');
  },
  
  /**
   * Query historical metrics
   */
  queryHistorical: async (query: MetricQuery): Promise<HistoricalMetrics> => {
    return apiClient.post('/metrics/query', query);
  },
  
  /**
   * Get fraud score history
   */
  getFraudScoreHistory: async (range: '1h' | '24h' | '7d' | '30d'): Promise<{
    timestamps: string[];
    scores: number[];
  }> => {
    return apiClient.get(`/metrics/fraud-score?range=${range}`);
  },
  
  /**
   * Get SLA metrics
   */
  getSLAMetrics: async (range: '24h' | '7d' | '30d'): Promise<{
    compliance: number;
    responseTimeP50: number;
    responseTimeP95: number;
    responseTimeP99: number;
    availability: number;
  }> => {
    return apiClient.get(`/metrics/sla?range=${range}`);
  },
};
```

### 2.4 Drills API

```typescript
// services/api/drills.ts
import { apiClient } from './client';
import {
  Drill,
  DrillResult,
  DrillSchedule,
  DrillFilters,
} from '@/types/drills';

export const drillsApi = {
  /**
   * List drill executions
   */
  list: async (filters?: DrillFilters): Promise<Drill[]> => {
    const params = new URLSearchParams();
    
    if (filters?.scenario) params.set('scenario', filters.scenario);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.limit) params.set('limit', String(filters.limit));
    
    return apiClient.get(`/drills?${params}`);
  },
  
  /**
   * Get drill results
   */
  getResults: async (drillId: string): Promise<DrillResult[]> => {
    return apiClient.get(`/drills/${drillId}/results`);
  },
  
  /**
   * Trigger manual drill
   */
  trigger: async (scenario: string): Promise<Drill> => {
    return apiClient.post('/drills/trigger', { scenario });
  },
  
  /**
   * Get drill schedule
   */
  getSchedule: async (): Promise<DrillSchedule> => {
    return apiClient.get('/drills/schedule');
  },
  
  /**
   * Update drill schedule
   */
  updateSchedule: async (schedule: Partial<DrillSchedule>): Promise<DrillSchedule> => {
    return apiClient.put('/drills/schedule', schedule);
  },
};
```

---

## 3. WebSocket Integration

### 3.1 WebSocket Client

```typescript
// services/websocket/client.ts
import { EventEmitter } from 'events';

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

export class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private isIntentionallyClosed = false;
  
  constructor(config: WebSocketConfig) {
    super();
    this.config = config;
  }
  
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }
    
    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(this.config.url);
    
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit('connected');
    };
    
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit('message', message);
        this.emit(message.type, message.payload);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    this.ws.onclose = () => {
      this.emit('disconnected');
      
      if (!this.isIntentionallyClosed && this.shouldReconnect()) {
        this.scheduleReconnect();
      }
    };
    
    this.ws.onerror = (error) => {
      this.emit('error', error);
    };
  }
  
  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.ws?.close();
    this.ws = null;
  }
  
  send(type: string, payload: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    
    this.ws.send(JSON.stringify({ type, payload }));
  }
  
  private shouldReconnect(): boolean {
    return this.reconnectAttempts < this.config.maxReconnectAttempts;
  }
  
  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    
    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      30000
    );
    
    setTimeout(() => this.connect(), delay);
  }
}
```

### 3.2 Real-time Updates Hook

```typescript
// hooks/useRealtimeUpdates.ts
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WebSocketClient } from '@/services/websocket/client';
import { queryKeys } from '@/lib/queryKeys';
import { useUIStore } from '@/stores/uiStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://api.shield.cryptohound.io/ws';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((s) => s.addNotification);
  const wsRef = useRef<WebSocketClient | null>(null);
  
  useEffect(() => {
    const ws = new WebSocketClient({
      url: WS_URL,
      reconnectInterval: 1000,
      maxReconnectAttempts: 10,
    });
    
    wsRef.current = ws;
    
    // Handle different message types
    ws.on('new_alert', (alert) => {
      // Update alerts cache
      queryClient.setQueryData(
        queryKeys.alerts.active(),
        (old: Alert[] = []) => [alert, ...old]
      );
      
      // Show notification
      addNotification({
        type: 'alert',
        severity: alert.severity,
        title: alert.alertName,
        message: alert.summary,
      });
    });
    
    ws.on('alert_resolved', ({ alertId }) => {
      queryClient.setQueryData(
        queryKeys.alerts.active(),
        (old: Alert[] = []) => old.filter((a) => a.id !== alertId)
      );
    });
    
    ws.on('metric_update', (metrics) => {
      queryClient.setQueryData(queryKeys.metrics.realtime(), metrics);
    });
    
    ws.on('evidence_added', (entry) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.evidence.lists() });
    });
    
    ws.on('drill_completed', (drill) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drills.all });
      
      addNotification({
        type: 'info',
        title: 'Drill Completed',
        message: `${drill.scenario} drill ${drill.success ? 'passed' : 'failed'}`,
      });
    });
    
    ws.connect();
    
    return () => {
      ws.disconnect();
    };
  }, [queryClient, addNotification]);
  
  return wsRef.current;
}
```

---

## 4. Data Transformation

### 4.1 Response Transformers

```typescript
// services/api/transformers.ts
import { formatDistanceToNow, parseISO } from 'date-fns';

export const transformers = {
  /**
   * Transform evidence entry for display
   */
  evidenceEntry: (entry: RawEvidenceEntry): EvidenceEntry => ({
    ...entry,
    timestampFormatted: formatDistanceToNow(parseISO(entry.timestamp), {
      addSuffix: true,
    }),
    contentHashShort: entry.content_hash.slice(0, 8) + '...',
    isAnchored: entry.anchors && entry.anchors.length > 0,
  }),
  
  /**
   * Transform alert for display
   */
  alert: (alert: RawAlert): Alert => ({
    ...alert,
    firedAtFormatted: formatDistanceToNow(parseISO(alert.fired_at), {
      addSuffix: true,
    }),
    duration: alert.resolved_at
      ? formatDuration(parseISO(alert.fired_at), parseISO(alert.resolved_at))
      : formatDuration(parseISO(alert.fired_at), new Date()),
  }),
  
  /**
   * Transform metrics for charts
   */
  metricsTimeSeries: (data: RawMetricsData): ChartData => ({
    labels: data.timestamps.map((t) => formatTime(parseISO(t))),
    datasets: Object.entries(data.values).map(([key, values]) => ({
      label: formatMetricName(key),
      data: values,
    })),
  }),
};
```

### 4.2 Request Builders

```typescript
// services/api/requestBuilders.ts
export const requestBuilders = {
  /**
   * Build evidence export request
   */
  evidenceExport: (options: ExportOptions): ExportRequest => ({
    format: options.format,
    filters: {
      types: options.types,
      from_timestamp: options.dateRange?.from?.toISOString(),
      to_timestamp: options.dateRange?.to?.toISOString(),
    },
    include_signatures: options.includeSignatures ?? true,
    include_anchors: options.includeAnchors ?? true,
  }),
  
  /**
   * Build metric query
   */
  metricQuery: (metric: string, range: string, step?: string): MetricQuery => ({
    metric,
    start: getStartTime(range),
    end: new Date().toISOString(),
    step: step || getDefaultStep(range),
  }),
};
```

---

## 5. Error Handling

### 5.1 Error Handler

```typescript
// services/api/errorHandler.ts
import { toast } from '@/components/Toast';

export function handleAPIError(error: APIError): void {
  const errorMessages: Record<string, string> = {
    AUTHENTICATION_REQUIRED: 'Please log in to continue',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action',
    RESOURCE_NOT_FOUND: 'The requested resource was not found',
    VALIDATION_ERROR: 'Please check your input and try again',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  };
  
  const message = errorMessages[error.code] || error.message || 'An unexpected error occurred';
  
  toast.error(message, {
    duration: 5000,
    action: error.code === 'RATE_LIMIT_EXCEEDED' 
      ? undefined 
      : { label: 'Retry', onClick: () => window.location.reload() },
  });
}
```

### 5.2 Query Error Boundary

```typescript
// components/QueryErrorBoundary.tsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();
  
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary, error }) => (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <h3 className="font-medium text-red-800">Something went wrong</h3>
          <p className="text-sm text-red-600 mt-1">{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded"
          >
            Try again
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

**Specification Version:** 1.0  
**Last Updated:** {{DATE}}
