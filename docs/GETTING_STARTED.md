# Getting Started Guide

This guide covers local development setup, testing, and deployment for the No-Trustees Mode backend.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for webhook testing)
- Docker (optional, for containerized deployment)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-org/bnb-chain.github.io.git
cd bnb-chain.github.io/site/backend
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp ../../.env.example .env
```

Edit `.env` with your values:

```env
# Required
STRIPE_SECRET=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
ADMIN_API_KEY=your_secure_admin_key

# Optional but recommended
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
SMTP_HOST=smtp.example.com
SMTP_USER=notifications@example.com
```

### 3. Initialize Evidence File

The evidence file is created automatically on first run, but you can initialize it manually:

```bash
mkdir -p deploy/reports
echo '{"reports":[]}' > deploy/reports/compliance-evidence-index.json
```

### 4. Start Development Server

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default.

## Stripe CLI Testing

### Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe
```

### Login and Forward Webhooks

```bash
# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/webhook
```

The CLI will output a webhook signing secret - use this as `STRIPE_WEBHOOK_SECRET`.

### Trigger Test Events

```bash
# Test checkout completion
stripe trigger checkout.session.completed

# Test invoice payment
stripe trigger invoice.paid

# Test subscription deletion
stripe trigger customer.subscription.deleted
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/healthz` | GET | Health check (always returns 200) |
| `/readyz` | GET | Readiness check with config status |
| `/evidence-index` | GET | List all compliance evidence |
| `/reports/*` | GET | Static report files |
| `/create-checkout-session` | POST | Create Stripe checkout session |
| `/webhook` | POST | Stripe webhook endpoint |
| `/admin/status/compliance` | GET | Compliance status (requires API key) |
| `/admin/trigger/test-digest` | POST | Trigger test notification (requires API key) |

## Docker Deployment

### Build Image

```bash
cd site/backend
docker build -t bnb-backend:latest .
```

### Run Container

```bash
docker run -d \
  --name bnb-backend \
  -p 3000:3000 \
  -e STRIPE_SECRET=sk_test_xxx \
  -e STRIPE_WEBHOOK_SECRET=whsec_xxx \
  -e ADMIN_API_KEY=your_key \
  bnb-backend:latest
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: ./site/backend
    ports:
      - "3000:3000"
    environment:
      - STRIPE_SECRET=${STRIPE_SECRET}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - ADMIN_API_KEY=${ADMIN_API_KEY}
      - TRUSTEES_ENABLED=false
      - AUTO_ANCHOR_COMPLIANCE=true
    volumes:
      - ./data/reports:/app/deploy/reports
```

Run with:

```bash
docker-compose up -d
```

## One-Command Deploy Script

For production deployment, use the included deploy script:

```bash
# Set required environment variables
export STRIPE_SECRET='sk_live_xxx'
export STRIPE_WEBHOOK_SECRET='whsec_xxx'
export ADMIN_API_KEY='your_production_key'

# Optional configuration
export SLACK_WEBHOOK_URL='https://hooks.slack.com/services/xxx'
export TZ='UTC'

# Run deployment
./deploynotrustees.sh
```

Options:
- `--skip-tests`: Skip running tests
- `--dry-run`: Show what would be done without executing

## Testing

### Run Tests

```bash
npm test
```

### Test Admin Endpoints

```bash
# Get compliance status
curl -H "x-admin-api-key: your_key" http://localhost:3000/admin/status/compliance

# Trigger test digest
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-admin-api-key: your_key" \
  -d '{"channel":"slack"}' \
  http://localhost:3000/admin/trigger/test-digest
```

## Troubleshooting

### Webhook Signature Verification Failed

1. Ensure `STRIPE_WEBHOOK_SECRET` is correct
2. For local testing, use the secret from `stripe listen` output
3. Check that raw body parsing is working (Content-Type: application/json)

### Evidence File Permission Errors

```bash
# Fix permissions
chmod 755 deploy/reports
chmod 644 deploy/reports/compliance-evidence-index.json
```

### PM2 Issues

```bash
# View logs
pm2 logs bnb-backend

# Restart with fresh environment
pm2 delete bnb-backend
pm2 start server.js --name bnb-backend

# Update environment
pm2 restart bnb-backend --update-env
```

## Next Steps

- See [NO_TRUSTEES_README.md](./NO_TRUSTEES_README.md) for rollout procedures
- See [INVESTOR_README.md](./INVESTOR_README.md) for product overview
- See [CHECKLIST.md](../CHECKLIST.md) for implementation status
