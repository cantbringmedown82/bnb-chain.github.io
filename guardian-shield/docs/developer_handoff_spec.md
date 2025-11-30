# Developer Handoff Specification
## Guardian Shield — Crypto Hound LLC

---

## 1. Overview

This document provides comprehensive handoff documentation for developers implementing the Guardian Shield Regulator Portal. It includes client library specifications, environment configurations, testing requirements, and deployment guidelines.

---

## 2. Technology Stack

### 2.1 Frontend

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| State Management | Redux Toolkit | 2.x |
| Data Fetching | React Query | 5.x |
| Routing | React Router | 6.x |
| UI Components | Custom + Radix UI | - |
| Styling | Tailwind CSS | 3.x |
| Testing | Vitest + Testing Library | - |
| E2E Testing | Playwright | - |

### 2.2 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| Storybook | Component documentation |
| Chromatic | Visual regression testing |

---

## 3. Project Setup

### 3.1 Prerequisites

```bash
# Required versions
node >= 20.0.0
npm >= 10.0.0

# Verify installation
node --version
npm --version
```

### 3.2 Installation

```bash
# Clone repository
git clone https://github.com/cryptohound/guardian-shield-portal.git
cd guardian-shield-portal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

### 3.3 Project Structure

```
guardian-shield-portal/
├── public/                    # Static assets
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/            # React components (atomic design)
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   └── pages/
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context providers
│   ├── store/                 # Redux store configuration
│   │   ├── slices/
│   │   └── middleware/
│   ├── lib/                   # Utilities and services
│   │   ├── api/               # API client and services
│   │   └── utils/             # Helper functions
│   ├── types/                 # TypeScript definitions
│   ├── styles/                # Global styles
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── .storybook/                # Storybook configuration
├── .env.example               # Environment template
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

---

## 4. Environment Configuration

### 4.1 Environment Variables

```bash
# .env.example

# API Configuration
VITE_API_URL=https://api.guardian-shield.cryptohound.io/v1
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_ISSUER=https://auth.cryptohound.io
VITE_AUTH_CLIENT_ID=guardian-shield-portal

# Feature Flags
VITE_FEATURE_EXPORT_CSV=true
VITE_FEATURE_DARK_MODE=false

# Analytics (optional)
VITE_ANALYTICS_ID=

# Development
VITE_MOCK_API=false
VITE_DEBUG_MODE=false
```

### 4.2 Environment Files

| File | Purpose | Git Tracked |
|------|---------|-------------|
| `.env` | Default values | Yes |
| `.env.local` | Local overrides | No |
| `.env.development` | Development settings | Yes |
| `.env.staging` | Staging settings | Yes |
| `.env.production` | Production settings | Yes |

### 4.3 Configuration Access

```typescript
// lib/config.ts
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },
  auth: {
    issuer: import.meta.env.VITE_AUTH_ISSUER,
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  },
  features: {
    exportCsv: import.meta.env.VITE_FEATURE_EXPORT_CSV === 'true',
    darkMode: import.meta.env.VITE_FEATURE_DARK_MODE === 'true',
  },
};
```

---

## 5. Client Libraries

### 5.1 API Client

```typescript
// Installation included in package.json dependencies

// Usage
import { evidenceApi, reportsApi, verificationApi } from '@/lib/api';

// Query evidence
const result = await evidenceApi.query({
  type: 'fraud_event',
  severity: ['critical', 'high'],
  limit: 50,
});

// Verify entry
const verification = await evidenceApi.verify(entryId);

// Download report
const blob = await reportsApi.download(reportId);
```

### 5.2 Authentication Library

```typescript
// Auth hook usage
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }
  
  return <Dashboard user={user} />;
}
```

### 5.3 Form Validation

```typescript
// Using Zod for validation
import { z } from 'zod';

const exportOptionsSchema = z.object({
  format: z.enum(['json', 'pdfa', 'csv']),
  fromTimestamp: z.string().datetime().optional(),
  toTimestamp: z.string().datetime().optional(),
  includeSignatures: z.boolean().default(true),
});

type ExportOptions = z.infer<typeof exportOptionsSchema>;
```

---

## 6. Testing Requirements

### 6.1 Unit Testing

```typescript
// Example component test
// tests/unit/components/Badge.test.tsx
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/atoms/Badge';

describe('Badge', () => {
  it('renders with correct severity color', () => {
    render(<Badge severity="critical">Critical</Badge>);
    
    const badge = screen.getByText('Critical');
    expect(badge).toHaveClass('bg-red-500');
  });
  
  it('applies correct size classes', () => {
    render(<Badge severity="high" size="sm">High</Badge>);
    
    const badge = screen.getByText('High');
    expect(badge).toHaveClass('text-xs');
  });
});
```

### 6.2 Integration Testing

```typescript
// Example integration test
// tests/integration/evidence.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EvidenceBrowser } from '@/components/pages/Evidence';

const queryClient = new QueryClient();

describe('EvidenceBrowser', () => {
  it('loads and displays evidence entries', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EvidenceBrowser />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/12345/)).toBeInTheDocument();
    });
  });
});
```

### 6.3 E2E Testing

```typescript
// Example E2E test
// tests/e2e/evidence-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Evidence Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login
    await page.fill('[name="email"]', 'test@regulator.gov');
    await page.fill('[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
  });
  
  test('can search and verify evidence', async ({ page }) => {
    await page.click('text=Evidence');
    await page.fill('[placeholder="Search evidence..."]', 'mixer');
    await page.click('button:has-text("Search")');
    
    await expect(page.locator('table tbody tr')).toHaveCount(10);
    
    // Click first row
    await page.click('table tbody tr:first-child');
    
    // Verify entry
    await page.click('button:has-text("Verify Integrity")');
    await expect(page.locator('.verification-success')).toBeVisible();
  });
});
```

### 6.4 Test Coverage Requirements

| Category | Minimum Coverage |
|----------|-----------------|
| Statements | 80% |
| Branches | 75% |
| Functions | 85% |
| Lines | 80% |

---

## 7. Code Style Guide

### 7.1 TypeScript Guidelines

```typescript
// Use explicit return types for functions
function calculateHash(data: string): string {
  // ...
}

// Use interfaces for objects, types for unions
interface User {
  id: string;
  name: string;
}

type Severity = 'critical' | 'high' | 'medium' | 'low';

// Use const assertions for literal types
const SEVERITY_COLORS = {
  critical: '#f44336',
  high: '#ff9800',
} as const;
```

### 7.2 React Guidelines

```typescript
// Use function components with TypeScript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// Use named exports
export { Button };

// Colocate related files
// components/Button/
//   index.ts
//   Button.tsx
//   Button.test.tsx
//   Button.stories.tsx
```

### 7.3 Import Order

```typescript
// 1. External libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal modules (absolute imports)
import { Button } from '@/components/atoms/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Relative imports
import { formatDate } from './utils';
import styles from './styles.module.css';
```

---

## 8. API Mock Server

### 8.1 MSW Setup

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/evidence', (req, res, ctx) => {
    return res(
      ctx.json({
        entries: mockEvidenceEntries,
        next_cursor: null,
        total_count: mockEvidenceEntries.length,
      })
    );
  }),
  
  rest.get('/api/v1/evidence/:id', (req, res, ctx) => {
    const { id } = req.params;
    const entry = mockEvidenceEntries.find(e => e.id === id);
    
    if (!entry) {
      return res(ctx.status(404));
    }
    
    return res(ctx.json(entry));
  }),
];
```

### 8.2 Mock Data

```typescript
// tests/mocks/data.ts
export const mockEvidenceEntries = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    sequence: 12345,
    timestamp: '2025-01-15T10:30:00.000Z',
    type: 'fraud_event',
    severity: 'critical',
    payload: {
      category: 'mixer',
      addresses: ['0x1234...5678'],
    },
    hash: 'a3b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    signature: 'mock-signature',
    signing_key_id: 'key-2025-01',
  },
];
```

---

## 9. Deployment

### 9.1 Build Process

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build

# Build output in ./dist
```

### 9.2 Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    sourcemap: process.env.NODE_ENV !== 'production',
  },
});
```

### 9.3 Deployment Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| Development | localhost:5173 | - |
| Staging | staging.guardian-shield.cryptohound.io | staging |
| Production | guardian-shield.cryptohound.io | main |

---

## 10. Troubleshooting

### 10.1 Common Issues

| Issue | Solution |
|-------|----------|
| API connection errors | Check `VITE_API_URL` in `.env.local` |
| Authentication failures | Clear localStorage, re-login |
| Build failures | Delete `node_modules`, run `npm install` |
| Type errors | Run `npm run typecheck` |

### 10.2 Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('debug', 'guardian:*');

// Check API requests
// Open DevTools > Network tab
```

### 10.3 Support Contacts

| Role | Contact |
|------|---------|
| Tech Lead | techlead@cryptohound.io |
| Backend Team | backend@cryptohound.io |
| DevOps | devops@cryptohound.io |

---

## 11. Definition of Done

### 11.1 Feature Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Coverage thresholds met
- [ ] No linting errors
- [ ] Storybook updated
- [ ] Documentation updated
- [ ] Accessibility validated
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] QA approved

### 11.2 Release Checklist

- [ ] All features complete
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Performance benchmarks met
- [ ] Security scan clean
- [ ] Release notes written
- [ ] Stakeholder sign-off

---

*Document Version: 1.0*
*Last Updated: 2025-01-15*
*Classification: Internal*
