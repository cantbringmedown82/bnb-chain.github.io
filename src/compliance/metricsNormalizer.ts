/**
 * Metrics Normalizer for Compliance Reporting
 *
 * Provides type-safe metrics normalization with divide-by-zero protection.
 */

/**
 * Raw metrics input
 */
export interface RawMetrics {
  total: number;
  valid: number;
  invalid: number;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Normalized metrics with calculated percentages
 */
export interface NormalizedMetrics {
  total: number;
  valid: number;
  invalid: number;
  validPct: string;
  invalidPct: string;
  timestamp: string;
  normalized: true;
}

/**
 * Normalizes raw metrics into a standard format with percentage calculations.
 * Includes divide-by-zero protection for percentage calculations.
 *
 * @param raw - Raw metrics input
 * @returns Normalized metrics with percentages as strings with one decimal place
 */
export function normalize(raw: RawMetrics): NormalizedMetrics {
  const total = Math.max(0, raw.total ?? 0);
  const valid = Math.max(0, Math.min(raw.valid ?? 0, total));
  const invalid = Math.max(0, Math.min(raw.invalid ?? 0, total));

  // Divide-by-zero protection
  const validPct = total > 0 ? ((valid / total) * 100).toFixed(1) : '0.0';
  const invalidPct = total > 0 ? ((invalid / total) * 100).toFixed(1) : '0.0';

  return {
    total,
    valid,
    invalid,
    validPct,
    invalidPct,
    timestamp: raw.timestamp || new Date().toISOString(),
    normalized: true,
  };
}

/**
 * Validates that metrics are within expected bounds
 *
 * @param metrics - Normalized metrics to validate
 * @returns true if metrics are valid
 */
export function validateMetrics(metrics: NormalizedMetrics): boolean {
  if (metrics.total < 0) return false;
  if (metrics.valid < 0 || metrics.valid > metrics.total) return false;
  if (metrics.invalid < 0 || metrics.invalid > metrics.total) return false;

  const validPct = parseFloat(metrics.validPct);
  const invalidPct = parseFloat(metrics.invalidPct);

  if (isNaN(validPct) || validPct < 0 || validPct > 100) return false;
  if (isNaN(invalidPct) || invalidPct < 0 || invalidPct > 100) return false;

  return true;
}

/**
 * Creates a summary string from normalized metrics
 *
 * @param metrics - Normalized metrics
 * @returns Human-readable summary string
 */
export function summarize(metrics: NormalizedMetrics): string {
  return `Total: ${metrics.total}, Valid: ${metrics.valid} (${metrics.validPct}%), Invalid: ${metrics.invalid} (${metrics.invalidPct}%)`;
}

export default {
  normalize,
  validateMetrics,
  summarize,
};
