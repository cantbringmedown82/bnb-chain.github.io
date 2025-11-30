require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const Stripe = require('stripe');

const app = express();

// Stripe initialization - will fail gracefully if not configured
const stripeSecret = process.env.STRIPE_SECRET;
const stripe = stripeSecret ? Stripe(stripeSecret) : null;

if (!stripeSecret) {
  console.warn('STRIPE_SECRET not configured - Stripe features will be disabled');
}

const EVIDENCE_PATH = path.join(__dirname, 'deploy', 'reports', 'compliance-evidence-index.json');
let writeQueue = Promise.resolve();

async function ensureEvidenceFile() {
  await fs.mkdir(path.dirname(EVIDENCE_PATH), { recursive: true });
  try {
    await fs.access(EVIDENCE_PATH);
  } catch (err) {
    const initial = { reports: [] };
    const tmp = EVIDENCE_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(initial, null, 2), 'utf8');
    await fs.rename(tmp, EVIDENCE_PATH);
  }
}

function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  const required = ['report_date', 'sha256', 'file', 'signature', 'anchor_tx'];
  return required.every((k) => typeof entry[k] === 'string' && entry[k].length > 0);
}

async function appendEvidenceEntry(entry) {
  if (!isValidEntry(entry)) throw new Error('Invalid evidence entry');
  writeQueue = writeQueue.then(async () => {
    const raw = await fs.readFile(EVIDENCE_PATH, 'utf8');
    const data = JSON.parse(raw || '{"reports":[]}');
    data.reports = data.reports || [];
    data.reports.push(entry);
    const tmp = EVIDENCE_PATH + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, EVIDENCE_PATH);
  });
  return writeQueue;
}

// Apply JSON middleware to all routes except /webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') return next();
  bodyParser.json()(req, res, next);
});

// Serve reports statically
app.use('/reports', express.static(path.join(__dirname, 'deploy', 'reports')));

// Simple in-memory rate limiter for file system access endpoints
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Get or create request history for this IP
  let requests = rateLimitStore.get(ip) || [];
  // Filter to only include requests within the window
  requests = requests.filter((timestamp) => timestamp > windowStart);

  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil((requests[0] + RATE_LIMIT_WINDOW_MS - now) / 1000),
    });
  }

  requests.push(now);
  rateLimitStore.set(ip, requests);

  // Clean up old entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [key, timestamps] of rateLimitStore.entries()) {
      if (timestamps.every((t) => t <= windowStart)) {
        rateLimitStore.delete(key);
      }
    }
  }

  next();
}

app.get('/evidence-index', rateLimit, async (req, res) => {
  try {
    await ensureEvidenceFile();
    const evidence = await fs.readFile(EVIDENCE_PATH, 'utf8');
    res.json(JSON.parse(evidence));
  } catch (err) {
    console.error('Failed to read evidence index', err);
    res.status(500).json({ error: 'Failed to read evidence index' });
  }
});

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.PUBLIC_URL || ''}/success`,
      cancel_url: `${process.env.PUBLIC_URL || ''}/cancel`,
    });
    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session creation failed', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).send('Stripe not configured');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).send('Webhook secret not configured');
  }

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err && err.message);
    return res.status(400).send(`Webhook Error: ${err && err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Placeholder: handle session completion
        break;
      case 'invoice.paid':
        // Placeholder
        break;
      case 'customer.subscription.deleted':
        // Placeholder
        break;
      default:
        console.log('Unhandled event type', event.type);
    }
  } catch (err) {
    console.error('Error handling webhook event', err);
    return res.status(500).send('Internal handler error');
  }

  res.json({ received: true });
});

app.use('/', router);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.get('/healthz', (_, res) => res.json({ ok: true }));
app.get('/readyz', (_, res) => {
  const slack = !!process.env.SLACK_WEBHOOK_URL;
  const smtp = !!process.env.SMTP_HOST && !!process.env.SMTP_USER;
  const trusteesEnabled = process.env.TRUSTEES_ENABLED === 'true';
  res.json({ slack, smtp, trusteesEnabled });
});

// Export for testing
module.exports = { app, ensureEvidenceFile, isValidEntry, appendEvidenceEntry };

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  ensureEvidenceFile()
    .then(() => app.listen(PORT, () => console.log(`Backend on ${PORT}`)))
    .catch((err) => {
      console.error('Failed to ensure evidence file at startup', err);
      process.exit(1);
    });
}
