/**
 * Unified Dispatcher for Compliance Digests
 *
 * Dispatches digest notifications to configured channels without throwing errors.
 * Failures are logged but do not propagate.
 */

import { NormalizedMetrics } from './metricsNormalizer';
import { sendSlackMessage, sendEmail, generatePDF } from './notifiers';

/**
 * Available notification channels (excluding 'all')
 */
export const NOTIFICATION_CHANNELS = ['slack', 'email', 'pdf'] as const;

/**
 * Single notification channel type
 */
export type SingleChannel = typeof NOTIFICATION_CHANNELS[number];

/**
 * Available notification channels including 'all'
 */
export type NotificationChannel = SingleChannel | 'all';

/**
 * Result of a dispatch operation
 */
export interface DispatchResult {
  channel: SingleChannel;
  success: boolean;
  error?: string;
  timestamp: string;
}

/**
 * Dispatches a compliance digest to the specified channel(s).
 * Does not throw errors - all failures are logged and returned in results.
 *
 * @param channel - Target channel(s) for the digest
 * @param metrics - Normalized metrics to include in the digest
 * @returns Array of dispatch results for each channel attempted
 */
export async function dispatchDigest(
  channel: NotificationChannel,
  metrics: NormalizedMetrics
): Promise<DispatchResult[]> {
  const results: DispatchResult[] = [];
  const channels: readonly SingleChannel[] = channel === 'all' ? NOTIFICATION_CHANNELS : [channel as SingleChannel];

  for (const ch of channels) {
    const result: DispatchResult = {
      channel: ch,
      success: false,
      timestamp: new Date().toISOString(),
    };

    try {
      switch (ch) {
        case 'slack':
          await dispatchToSlack(metrics);
          result.success = true;
          break;

        case 'email':
          await dispatchToEmail(metrics);
          result.success = true;
          break;

        case 'pdf':
          await dispatchToPDF(metrics);
          result.success = true;
          break;

        default:
          result.error = `Unknown channel: ${ch}`;
          console.error(`[UnifiedDispatcher] Unknown channel: ${ch}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      result.error = errorMessage;
      console.error(`[UnifiedDispatcher] Failed to dispatch to ${ch}: ${errorMessage}`);
    }

    results.push(result);
  }

  // Log summary
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`[UnifiedDispatcher] Dispatch complete: ${successful} succeeded, ${failed} failed`);

  return results;
}

/**
 * Dispatches to Slack channel
 */
async function dispatchToSlack(metrics: NormalizedMetrics): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new Error('SLACK_WEBHOOK_URL not configured');
  }

  const message = formatSlackMessage(metrics);
  await sendSlackMessage(message);
  console.log('[UnifiedDispatcher] Slack digest sent successfully');
}

/**
 * Dispatches via email
 */
async function dispatchToEmail(metrics: NormalizedMetrics): Promise<void> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('SMTP not configured (SMTP_HOST and SMTP_USER required)');
  }

  const subject = `Compliance Digest - ${metrics.timestamp}`;
  const body = formatEmailBody(metrics);
  await sendEmail(subject, body);
  console.log('[UnifiedDispatcher] Email digest sent successfully');
}

/**
 * Generates and saves a PDF report
 */
async function dispatchToPDF(metrics: NormalizedMetrics): Promise<void> {
  const filename = `compliance-digest-${Date.now()}.pdf`;
  await generatePDF(metrics, filename);
  console.log(`[UnifiedDispatcher] PDF digest generated: ${filename}`);
}

/**
 * Formats metrics for Slack
 */
function formatSlackMessage(metrics: NormalizedMetrics): string {
  return JSON.stringify({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📊 Compliance Digest',
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Total:* ${metrics.total}` },
          { type: 'mrkdwn', text: `*Valid:* ${metrics.valid} (${metrics.validPct}%)` },
          { type: 'mrkdwn', text: `*Invalid:* ${metrics.invalid} (${metrics.invalidPct}%)` },
          { type: 'mrkdwn', text: `*Timestamp:* ${metrics.timestamp}` },
        ],
      },
    ],
  });
}

/**
 * Formats metrics for email
 */
function formatEmailBody(metrics: NormalizedMetrics): string {
  return `
Compliance Digest
=================

Summary:
- Total: ${metrics.total}
- Valid: ${metrics.valid} (${metrics.validPct}%)
- Invalid: ${metrics.invalid} (${metrics.invalidPct}%)

Generated: ${metrics.timestamp}

---
This is an automated compliance digest from the No-Trustees Mode system.
`.trim();
}

export default {
  dispatchDigest,
};
