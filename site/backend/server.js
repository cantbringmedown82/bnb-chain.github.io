require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// JSON for normal endpoints
app.use(bodyParser.json());

// Static serve reports (PDFs/signatures) from deploy/reports
app.use('/reports', express.static(path.join(__dirname, 'deploy/reports')));

// Evidence index
app.get('/evidence-index', (req, res) => {
  const evidence = require('./deploy/reports/compliance-evidence-index.json');
  res.json(evidence);
});

// Stripe routes
const stripeRoutes = require('./routes/stripe');
app.use('/', stripeRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend on ${PORT}`));
