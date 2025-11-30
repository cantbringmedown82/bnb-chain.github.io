/**
 * Tests for metricsNormalizer
 */

import { normalize, validateMetrics, summarize, NormalizedMetrics, RawMetrics } from './metricsNormalizer';

describe('normalize', () => {
  test('normalizes valid metrics', () => {
    const raw: RawMetrics = {
      total: 100,
      valid: 95,
      invalid: 5,
    };
    const result = normalize(raw);

    expect(result.total).toBe(100);
    expect(result.valid).toBe(95);
    expect(result.invalid).toBe(5);
    expect(result.validPct).toBe('95.0');
    expect(result.invalidPct).toBe('5.0');
    expect(result.normalized).toBe(true);
  });

  test('handles divide-by-zero when total is 0', () => {
    const raw: RawMetrics = {
      total: 0,
      valid: 0,
      invalid: 0,
    };
    const result = normalize(raw);

    expect(result.total).toBe(0);
    expect(result.validPct).toBe('0.0');
    expect(result.invalidPct).toBe('0.0');
  });

  test('clamps negative values to 0', () => {
    const raw: RawMetrics = {
      total: -10,
      valid: -5,
      invalid: -3,
    };
    const result = normalize(raw);

    expect(result.total).toBe(0);
    expect(result.valid).toBe(0);
    expect(result.invalid).toBe(0);
  });

  test('clamps values exceeding total', () => {
    const raw: RawMetrics = {
      total: 50,
      valid: 100,
      invalid: 100,
    };
    const result = normalize(raw);

    expect(result.valid).toBe(50);
    expect(result.invalid).toBe(50);
  });

  test('preserves timestamp if provided', () => {
    const timestamp = '2024-01-01T00:00:00.000Z';
    const raw: RawMetrics = {
      total: 10,
      valid: 8,
      invalid: 2,
      timestamp,
    };
    const result = normalize(raw);

    expect(result.timestamp).toBe(timestamp);
  });

  test('generates timestamp if not provided', () => {
    const raw: RawMetrics = {
      total: 10,
      valid: 8,
      invalid: 2,
    };
    const result = normalize(raw);

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).getTime()).not.toBeNaN();
  });

  test('handles fractional percentages', () => {
    const raw: RawMetrics = {
      total: 3,
      valid: 1,
      invalid: 2,
    };
    const result = normalize(raw);

    expect(result.validPct).toBe('33.3');
    expect(result.invalidPct).toBe('66.7');
  });
});

describe('validateMetrics', () => {
  test('returns true for valid metrics', () => {
    const metrics: NormalizedMetrics = {
      total: 100,
      valid: 95,
      invalid: 5,
      validPct: '95.0',
      invalidPct: '5.0',
      timestamp: '2024-01-01T00:00:00.000Z',
      normalized: true,
    };

    expect(validateMetrics(metrics)).toBe(true);
  });

  test('returns false for negative total', () => {
    const metrics: NormalizedMetrics = {
      total: -1,
      valid: 0,
      invalid: 0,
      validPct: '0.0',
      invalidPct: '0.0',
      timestamp: '2024-01-01T00:00:00.000Z',
      normalized: true,
    };

    expect(validateMetrics(metrics)).toBe(false);
  });

  test('returns false for valid exceeding total', () => {
    const metrics: NormalizedMetrics = {
      total: 10,
      valid: 15,
      invalid: 5,
      validPct: '150.0',
      invalidPct: '50.0',
      timestamp: '2024-01-01T00:00:00.000Z',
      normalized: true,
    };

    expect(validateMetrics(metrics)).toBe(false);
  });

  test('returns false for invalid percentage format', () => {
    const metrics: NormalizedMetrics = {
      total: 100,
      valid: 50,
      invalid: 50,
      validPct: 'invalid',
      invalidPct: '50.0',
      timestamp: '2024-01-01T00:00:00.000Z',
      normalized: true,
    };

    expect(validateMetrics(metrics)).toBe(false);
  });
});

describe('summarize', () => {
  test('returns formatted summary string', () => {
    const metrics: NormalizedMetrics = {
      total: 100,
      valid: 95,
      invalid: 5,
      validPct: '95.0',
      invalidPct: '5.0',
      timestamp: '2024-01-01T00:00:00.000Z',
      normalized: true,
    };

    const summary = summarize(metrics);

    expect(summary).toBe('Total: 100, Valid: 95 (95.0%), Invalid: 5 (5.0%)');
  });
});
