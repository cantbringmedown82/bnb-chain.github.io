# Data API Integration Specification
## Guardian Shield — Crypto Hound LLC

---

## 1. Overview

This document specifies the integration mapping between the Guardian Shield frontend and the Evidence Ledger API, including request/response handling, error management, and data transformation.

---

## 2. API Client Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Frontend                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │  React Components│                                                       │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │  Custom Hooks   │  useEvidence, useReports, useVerification             │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │  Redux Actions  │  Async thunks for state management                    │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │  API Services   │  evidenceApi, reportsApi, verificationApi             │
│  └────────┬────────┘                                                        │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                        │
│  │  HTTP Client    │  Axios instance with interceptors                      │
│  └────────┬────────┘                                                        │
│           │                                                                 │
└───────────┼─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Evidence Ledger API                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. HTTP Client Configuration

### 3.1 Axios Instance

```typescript
// lib/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.guardian-shield.cryptohound.io/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('guardian_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add request ID for tracing
    config.headers['X-Request-ID'] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired, attempt refresh or redirect to login
      await handleUnauthorized();
    }
    return Promise.reject(transformError(error));
  }
);
```

### 3.2 Error Transformation

```typescript
// lib/api/errors.ts
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

export function transformError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as any;
    return {
      code: data.code || `HTTP_${error.response.status}`,
      message: data.message || error.message,
      details: data.details,
      requestId: error.response.headers['x-request-id'],
    };
  }
  
  if (error.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the server. Please check your connection.',
    };
  }
  
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message,
  };
}
```

---

## 4. API Service Layer

### 4.1 Evidence API

```typescript
// lib/api/evidence.ts
import { apiClient } from './client';

export interface QueryEvidenceParams {
  type?: string;
  severity?: string[];
  fromTimestamp?: string;
  toTimestamp?: string;
  fromSequence?: number;
  toSequence?: number;
  limit?: number;
  cursor?: string;
}

export interface QueryEvidenceResponse {
  entries: EvidenceEntry[];
  nextCursor: string | null;
  totalCount: number;
}

export const evidenceApi = {
  query: async (params: QueryEvidenceParams): Promise<QueryEvidenceResponse> => {
    const response = await apiClient.get('/evidence', {
      params: {
        type: params.type,
        severity: params.severity?.join(','),
        from_timestamp: params.fromTimestamp,
        to_timestamp: params.toTimestamp,
        from_sequence: params.fromSequence,
        to_sequence: params.toSequence,
        limit: params.limit || 50,
        cursor: params.cursor,
      },
    });
    return transformQueryResponse(response.data);
  },
  
  getById: async (id: string): Promise<EvidenceEntry> => {
    const response = await apiClient.get(`/evidence/${id}`);
    return transformEvidenceEntry(response.data);
  },
  
  getBySequence: async (sequence: number): Promise<EvidenceEntry> => {
    const response = await apiClient.get(`/evidence/sequence/${sequence}`);
    return transformEvidenceEntry(response.data);
  },
  
  verify: async (id: string): Promise<VerificationResult> => {
    const response = await apiClient.get(`/verify/${id}`);
    return response.data;
  },
};
```

### 4.2 Reports API

```typescript
// lib/api/reports.ts
export const reportsApi = {
  getWeekly: async (): Promise<Report[]> => {
    const response = await apiClient.get('/reports/weekly');
    return response.data.reports.map(transformReport);
  },
  
  getMonthly: async (): Promise<Report[]> => {
    const response = await apiClient.get('/reports/monthly');
    return response.data.reports.map(transformReport);
  },
  
  download: async (reportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
  
  verifySignature: async (reportId: string): Promise<SignatureVerification> => {
    const response = await apiClient.get(`/reports/${reportId}/verify`);
    return response.data;
  },
};
```

### 4.3 Exports API

```typescript
// lib/api/exports.ts
export interface ExportOptions {
  format: 'json' | 'pdfa' | 'csv';
  fromSequence?: number;
  toSequence?: number;
  fromTimestamp?: string;
  toTimestamp?: string;
  includeSignatures?: boolean;
  includeAnchors?: boolean;
}

export const exportsApi = {
  request: async (options: ExportOptions): Promise<ExportJob> => {
    const response = await apiClient.post('/export', {
      format: options.format,
      from_sequence: options.fromSequence,
      to_sequence: options.toSequence,
      from_timestamp: options.fromTimestamp,
      to_timestamp: options.toTimestamp,
      include_signatures: options.includeSignatures ?? true,
      include_anchors: options.includeAnchors ?? true,
    });
    return transformExportJob(response.data);
  },
  
  getStatus: async (exportId: string): Promise<ExportJob> => {
    const response = await apiClient.get(`/export/${exportId}`);
    return transformExportJob(response.data);
  },
  
  download: async (exportId: string): Promise<Blob> => {
    const response = await apiClient.get(`/export/${exportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
```

### 4.4 Verification API

```typescript
// lib/api/verification.ts
export const verificationApi = {
  verifyLedger: async (options?: VerifyLedgerOptions): Promise<LedgerVerificationResult> => {
    const response = await apiClient.post('/verify', {
      from_sequence: options?.fromSequence,
      to_sequence: options?.toSequence,
      verify_anchors: options?.verifyAnchors ?? true,
    });
    return response.data;
  },
  
  verifyByHash: async (hash: string): Promise<HashVerificationResult> => {
    const response = await apiClient.get(`/verify/${hash}`);
    return response.data;
  },
  
  getLedgerMetadata: async (): Promise<LedgerMetadata> => {
    const response = await apiClient.get('/metadata');
    return transformLedgerMetadata(response.data);
  },
};
```

---

## 5. Data Transformers

### 5.1 Evidence Entry Transformer

```typescript
// lib/api/transformers/evidence.ts
interface ApiEvidenceEntry {
  id: string;
  sequence: number;
  timestamp: string;
  type: string;
  severity: string;
  payload: Record<string, unknown>;
  hash: string;
  prev_hash: string;
  signature: string;
  signing_key_id: string;
  anchor_chain?: string;
  anchor_tx_hash?: string;
  anchor_block_number?: number;
  anchor_timestamp?: string;
}

export function transformEvidenceEntry(api: ApiEvidenceEntry): EvidenceEntry {
  return {
    id: api.id,
    sequence: api.sequence,
    timestamp: new Date(api.timestamp),
    type: api.type as EventType,
    severity: api.severity as Severity,
    payload: api.payload,
    hash: api.hash,
    prevHash: api.prev_hash,
    signature: api.signature,
    signingKeyId: api.signing_key_id,
    anchor: api.anchor_chain ? {
      chain: api.anchor_chain,
      txHash: api.anchor_tx_hash!,
      blockNumber: api.anchor_block_number!,
      timestamp: new Date(api.anchor_timestamp!),
    } : undefined,
  };
}

export function transformQueryResponse(api: any): QueryEvidenceResponse {
  return {
    entries: api.entries.map(transformEvidenceEntry),
    nextCursor: api.next_cursor,
    totalCount: api.total_count,
  };
}
```

### 5.2 Report Transformer

```typescript
// lib/api/transformers/reports.ts
export function transformReport(api: any): Report {
  return {
    id: api.id,
    type: api.type,
    period: {
      start: new Date(api.period_start),
      end: new Date(api.period_end),
    },
    generatedAt: new Date(api.generated_at),
    format: api.format,
    size: api.size,
    signature: api.signature,
    verified: api.verified,
  };
}
```

---

## 6. React Query / SWR Integration

### 6.1 Evidence Queries

```typescript
// hooks/useEvidence.ts
import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { evidenceApi } from '../lib/api/evidence';

export function useEvidence(params: QueryEvidenceParams) {
  return useQuery({
    queryKey: ['evidence', params],
    queryFn: () => evidenceApi.query(params),
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
}

export function useInfiniteEvidence(params: Omit<QueryEvidenceParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['evidence-infinite', params],
    queryFn: ({ pageParam }) => evidenceApi.query({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useEvidenceById(id: string) {
  return useQuery({
    queryKey: ['evidence', id],
    queryFn: () => evidenceApi.getById(id),
    enabled: !!id,
  });
}

export function useVerifyEvidence() {
  return useMutation({
    mutationFn: (id: string) => evidenceApi.verify(id),
    onSuccess: (data, variables) => {
      // Optionally invalidate queries or update cache
    },
  });
}
```

### 6.2 Reports Queries

```typescript
// hooks/useReports.ts
export function useWeeklyReports() {
  return useQuery({
    queryKey: ['reports', 'weekly'],
    queryFn: reportsApi.getWeekly,
    staleTime: 60000,
  });
}

export function useMonthlyReports() {
  return useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: reportsApi.getMonthly,
    staleTime: 60000,
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: async (reportId: string) => {
      const blob = await reportsApi.download(reportId);
      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
```

---

## 7. Error Handling

### 7.1 Error Types

```typescript
// types/errors.ts
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.UNAUTHORIZED]: 'Your session has expired. Please log in again.',
  [ApiErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ApiErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ApiErrorCode.VALIDATION_ERROR]: 'Invalid request data.',
  [ApiErrorCode.RATE_LIMITED]: 'Too many requests. Please try again later.',
  [ApiErrorCode.SERVER_ERROR]: 'An unexpected error occurred. Please try again.',
  [ApiErrorCode.NETWORK_ERROR]: 'Unable to connect to the server.',
};
```

### 7.2 Error Boundary

```typescript
// components/ErrorBoundary.tsx
export function ApiErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}
```

---

## 8. Request/Response Mapping Table

| Frontend Action | API Endpoint | Method | Request | Response |
|-----------------|--------------|--------|---------|----------|
| Load evidence | `/evidence` | GET | QueryParams | `{ entries, next_cursor, total_count }` |
| Get entry detail | `/evidence/{id}` | GET | - | EvidenceEntry |
| Search evidence | `/evidence` | GET | QueryParams + search | `{ entries, ... }` |
| Verify entry | `/verify/{hash}` | GET | - | VerificationResult |
| List reports | `/reports/weekly` | GET | - | `{ reports: Report[] }` |
| Download report | `/reports/{id}/download` | GET | - | Blob (PDF) |
| Request export | `/export` | POST | ExportOptions | ExportJob |
| Check export status | `/export/{id}` | GET | - | ExportJob |
| Download export | `/export/{id}/download` | GET | - | Blob |
| Get metadata | `/metadata` | GET | - | LedgerMetadata |

---

## 9. Caching Strategy

| Data Type | Cache TTL | Invalidation |
|-----------|-----------|--------------|
| Evidence list | 30 seconds | On filter change |
| Evidence detail | 5 minutes | On verification |
| Reports list | 1 minute | On new report |
| Ledger metadata | 1 minute | On evidence append |
| Verification results | 10 minutes | Never |

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
*Classification: Internal*
