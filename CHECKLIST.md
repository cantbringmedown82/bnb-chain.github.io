# Crypto Hound — Security & Deployment Checklist

## Key items

- **Webhook security**: keep `STRIPE_WEBHOOK_SECRET` secret; use HTTPS in production and IP allowlist if possible.
- **JWT keys**: rotate keys, publish JWKS, secure private key in secrets manager.
- **Evidence file writes**: use serialized writes or durable DB for high-volume operations (server.js uses a serialized queue; consider moving to DB).
- **PVC & file permissions**: ensure PVC is mounted and writable by container user; use `ReadWriteMany` if multiple replicas write.
- **CI/CD secrets**: store PROD secrets in GitHub Actions secrets and enable branch protection on main.
- **TLS**: use cert-manager and validate domain DNS.
- **Logging/Audit**: centralize logs (Grafana/Prometheus) and ensure log retention and export for audits.

## Recommended next steps

- Add JSON Schema validation and stricter input validation for evidence entries.
- Add E2E tests for webhook flow and evidence append.
- Add rate limiting to API endpoints (e.g., using `express-rate-limit`) to prevent abuse and file system access DoS.
- Consider backing evidence ledger with PostgreSQL or object storage + transactional metadata to avoid file-based races at scale.
