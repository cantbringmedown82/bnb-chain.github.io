/**
 * Admin routes for No-Trustees Mode
 * Protected by ADMIN_API_KEY environment variable
 */
const express = require('express');
const router = express.Router();

/**
 * Middleware to validate admin API key
 * API key must be passed via x-admin-api-key header (not query params for security)
 */
function requireAdminKey(req, res, next) {
  const apiKey = req.headers['x-admin-api-key'];
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    console.error('ADMIN_API_KEY not configured');
    return res.status(500).json({ error: 'Admin API not configured' });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

/**
 * GET /admin/status/compliance
 * Returns compliance status including anchor and notifier health
 */
router.get('/status/compliance', requireAdminKey, (req, res) => {
  const status = {
    anchors: {
      chain: process.env.COMPLIANCE_ANCHOR_CHAIN || 'not_configured',
      autoAnchor: process.env.AUTO_ANCHOR_COMPLIANCE === 'true',
    },
    notifiers: {
      slack: !!process.env.SLACK_WEBHOOK_URL,
      email: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
      pdf: true, // PDF generation is always available (placeholder)
    },
    mode: {
      trusteesEnabled: process.env.TRUSTEES_ENABLED === 'true',
      manualReviewEnabled: process.env.MANUAL_REVIEW_ENABLED === 'true',
      enforcerBotEnabled: process.env.ENFORCER_BOT_ENABLED === 'true',
    },
    tenant: process.env.TENANT_ID || 'default',
    timestamp: new Date().toISOString(),
  };

  res.json(status);
});

/**
 * POST /admin/trigger/test-digest
 * Triggers a test digest to verify notifier configuration
 */
router.post('/trigger/test-digest', requireAdminKey, async (req, res) => {
  const { channel } = req.body || {};

  try {
    // Placeholder: In production, this would call the unified dispatcher
    const testMetrics = {
      total: 100,
      valid: 95,
      invalid: 5,
      validPct: '95.0',
      invalidPct: '5.0',
      timestamp: new Date().toISOString(),
    };

    console.log(`Test digest triggered for channel: ${channel || 'all'}`);
    console.log('Test metrics:', JSON.stringify(testMetrics, null, 2));

    // TODO: Integrate with unifiedDispatcher.dispatchDigest(channel, testMetrics)

    res.json({
      success: true,
      message: `Test digest triggered for channel: ${channel || 'all'}`,
      metrics: testMetrics,
    });
  } catch (err) {
    console.error('Failed to trigger test digest', err);
    res.status(500).json({ error: 'Failed to trigger test digest', details: err.message });
  }
});

/**
 * GET /admin/health
 * Returns admin endpoint health status
 */
router.get('/health', requireAdminKey, (req, res) => {
  res.json({
    ok: true,
    adminEndpoint: true,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
