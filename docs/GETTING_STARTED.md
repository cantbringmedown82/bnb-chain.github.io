# Getting Started — Crypto Hound (compact)

## Prereqs

- Node.js 18+
- Docker
- kubectl + cluster with ingress
- Stripe CLI (for testing webhooks)

## Env (example .env)

```bash
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PRICE_ID=price_xxx
PUBLIC_URL=http://localhost:3000
PORT=3000
```

## Local Node (backend)

```bash
cd site/backend
cp .env.example .env
npm install
# ensure deploy/reports exists and has an index
mkdir -p deploy/reports
cat > deploy/reports/compliance-evidence-index.json <<'JSON'
{ "reports": [] }
JSON
npm start
```

## Test Stripe webhook locally (stripe CLI)

```bash
# in a separate terminal
stripe login
stripe listen --forward-to localhost:3000/webhook
```

## Create checkout session (frontend or curl)

```bash
curl -X POST http://localhost:3000/create-checkout-session
```

## Docker build (images pushed to GHCR in CI in production)

```bash
# backend
docker build -t cryptohound-backend:local site/backend
# frontend
docker build -t cryptohound-frontend:local site/frontend
```

## Kubernetes (apply manifests)

```bash
# ensure kubeconfig points to your cluster
kubectl apply -f site/k8s/namespace.yaml
kubectl apply -f site/k8s/secrets-example.yaml
kubectl apply -f site/k8s/reports-pvc.yaml
kubectl apply -f site/k8s/backend-deployment.yaml
kubectl apply -f site/k8s/backend-service.yaml
kubectl apply -f site/k8s/frontend-deployment.yaml
kubectl apply -f site/k8s/frontend-service.yaml
kubectl apply -f site/k8s/ingress.yaml
```

## Notes

- Webhooks require the raw body for signature verification; use the Stripe CLI in dev and set `STRIPE_WEBHOOK_SECRET` accordingly.
- The backend will create a minimal `deploy/reports/compliance-evidence-index.json` if it is missing.
