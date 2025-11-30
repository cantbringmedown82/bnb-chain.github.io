/**
 * No-Trustees Mode Boot Assertions
 *
 * Runtime checks to ensure the system is properly configured
 * for autonomous operation without trustee oversight.
 */

/**
 * Required environment variables for No-Trustees Mode
 */
const REQUIRED_ENV_VARS = [
  'TRUSTEES_ENABLED',
  'AUTO_ANCHOR_COMPLIANCE',
  'COMPLIANCE_ANCHOR_CHAIN',
  'TENANT_ID',
] as const;

/**
 * Recommended environment variables (warnings only)
 */
const RECOMMENDED_ENV_VARS = [
  'SLACK_WEBHOOK_URL',
  'SMTP_HOST',
  'SMTP_USER',
  'TZ',
] as const;

export interface NoTrusteesModeConfig {
  trusteesEnabled: boolean;
  autoAnchorCompliance: boolean;
  complianceAnchorChain: string;
  tenantId: string;
  slackConfigured: boolean;
  smtpConfigured: boolean;
  timezone: string;
}

/**
 * Asserts that the environment is properly configured for No-Trustees Mode.
 * Throws an error if required configuration is missing.
 */
export function assertNoTrusteesMode(): NoTrusteesModeConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Check trustees should be disabled
  if (process.env.TRUSTEES_ENABLED === 'true') {
    errors.push('TRUSTEES_ENABLED must be false (or unset) for No-Trustees Mode');
  }

  // Check auto-anchor should be enabled
  if (process.env.AUTO_ANCHOR_COMPLIANCE !== 'true') {
    errors.push('AUTO_ANCHOR_COMPLIANCE must be true for No-Trustees Mode');
  }

  // Check recommended environment variables (warnings only)
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(`Recommended environment variable not set: ${envVar}`);
    }
  }

  // Specific TZ warning
  if (!process.env.TZ) {
    warnings.push('TZ not set - timestamps may use system default timezone. Recommend setting TZ=UTC');
  }

  // Log warnings
  for (const warning of warnings) {
    console.warn(`[No-Trustees Mode] Warning: ${warning}`);
  }

  // Throw on errors
  if (errors.length > 0) {
    throw new Error(`No-Trustees Mode configuration errors:\n${errors.join('\n')}`);
  }

  return {
    trusteesEnabled: process.env.TRUSTEES_ENABLED === 'true',
    autoAnchorCompliance: process.env.AUTO_ANCHOR_COMPLIANCE === 'true',
    complianceAnchorChain: process.env.COMPLIANCE_ANCHOR_CHAIN || '',
    tenantId: process.env.TENANT_ID || '',
    slackConfigured: !!process.env.SLACK_WEBHOOK_URL,
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    timezone: process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Starts the No-Trustees Mode runtime with proper initialization.
 * Returns the runtime configuration or throws on error.
 */
export async function startNoTrusteesRuntime(): Promise<NoTrusteesModeConfig> {
  console.log('[No-Trustees Mode] Initializing runtime...');

  const config = assertNoTrusteesMode();

  console.log('[No-Trustees Mode] Configuration validated:');
  console.log(`  - Trustees Enabled: ${config.trusteesEnabled}`);
  console.log(`  - Auto-Anchor: ${config.autoAnchorCompliance}`);
  console.log(`  - Anchor Chain: ${config.complianceAnchorChain}`);
  console.log(`  - Tenant ID: ${config.tenantId}`);
  console.log(`  - Slack Configured: ${config.slackConfigured}`);
  console.log(`  - SMTP Configured: ${config.smtpConfigured}`);
  console.log(`  - Timezone: ${config.timezone}`);

  console.log('[No-Trustees Mode] Runtime started successfully');

  return config;
}

export default {
  assertNoTrusteesMode,
  startNoTrusteesRuntime,
};
