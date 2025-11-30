require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET);

// Evidence file path
const EVIDENCE_PATH = path.join(__dirname, 'deploy', 'reports', 'compliance-evidence-index.json');

// Simple serialized write queue to avoid concurrent file writes
let writeQueue = Promise.resolve();

async function ensureEvidenceFile() {
  try {
    await fs.mkdir(path.dirname(EVIDENCE_PATH), { recursive: true });
    await fs.access(EVIDENCE_PATH);
  } catch (err) {
    // create a minimal evidence file
    const initial = { reports: [] };
    await fs.writeFile(EVIDENCE_PATH + '.tmp', JSON.stringify(initial, null, 2));
    await fs.rename(EVIDENCE_PATH + '.tmp', EVIDENCE_PATH);
  }
}

function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  const required = ['report_date', 'sha256', 'file', 'signature', 'anchor_tx'];
  return required.every((k) => typeof entry[k] === 'string' && entry[k].length > 0);
}

async function appendEvidenceEntry(entry) {
  if (!isValidEntry(entry)) {
    throw new Error('Invalid evidence entry shape');
  }

  // Serialize writes using the queue
  writeQueue = writeQueue.then(async () => {
    // read-modify-write with atomic rename
    const raw = await fs.readFile(EVIDENCE_PATH, 'utf8');
    const data = JSON.parse(raw || '{"reports":[]}');
    data.reports = data.reports || [];
    data.reports.push(entry);
    const tmpPath = EVIDENCE_PATH + '.tmp';
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmpPath, EVIDENCE_PATH);
  });

  // return the pending promise for caller if they want to await it
  return writeQueue;
}

// Middleware: use raw body for webhook route only, use JSON for others.
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') return next();
  // apply JSON parser to non-webhook routes
  bodyParser.json()(req, res, next);
});

// Serve static reports
app.use('/reports', express.static(path.join(__dirname, 'deploy', 'reports')));

// Evidence index endpoint
app.get('/evidence-index', async (req, res) => {
  try {
    await ensureEvidenceFile();
    const evidence = await fs.readFile(EVIDENCE_PATH, 'utf8');
    res.json(JSON.parse(evidence));
  } catch (err) {
    console.error('Failed to read evidence index', err);
    res.status(500).json({ error: 'Failed to read evidence index' });
  }
});

// Stripe routes
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.PUBLIC_URL}/success`,
      cancel_url: `${process.env.PUBLIC_URL}/cancel`,
    });
    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session creation failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook - must use raw body for signature verification
app.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          // Optional: record session info or append to evidence ledger if appropriate
          // Example placeholder: await appendEvidenceEntry({ report_date: new Date().toISOString(), sha256: '', file: '', signature: '', anchor_tx: '' });
          break;
        case 'invoice.paid':
          // handle invoice paid
          break;
        case 'customer.subscription.deleted':
          // handle cancellations
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      console.error('Error handling webhook event', err);
      return res.status(500).send('Internal handler error');
    }

    res.json({ received: true });
  }
);

// Mount router for non-webhook stripe routes
app.use('/', router);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 3000;
ensureEvidenceFile()
  .then(() => app.listen(PORT, () => console.log(`Backend on ${PORT}`)))
  .catch((err) => {
    console.error('Failed to ensure evidence file at startup', err);
    process.exit(1);
  });
