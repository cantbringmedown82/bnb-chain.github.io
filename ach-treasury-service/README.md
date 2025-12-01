# ACH Treasury Service

A TypeScript/Express API service for ACH (Automated Clearing House) payment processing and treasury management.

## Quick Start

### Local Development

```bash
# initialize repo
npm install

# optional: add TypeScript dev deps if not already
npm install -D typescript ts-node @types/node @types/express @types/body-parser @types/pg

# start locally
npm run dev
# open: http://localhost:8443/health
```

### Docker

```bash
# build and run with docker compose
docker compose up --build

# apply migrations (replace container name if needed)
docker exec -it ach-treasury-service-api-1 psql $DB_URL -f migrations/001_init.sql
```

### Test Batch Creation

```bash
curl -X POST http://localhost:8443/api/ach/batches \
  -H "Content-Type: application/json" \
  -d '{
    "companyName":"ACH Treasury",
    "companyId":"123456789",
    "odfiRouting":"111000025",
    "classCode":"PPD",
    "effectiveDate":"2025-12-01"
  }'
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### ACH Batches
- `POST /api/ach/batches` - Create a new ACH batch
- `GET /api/ach/batches` - List all batches
- `POST /api/ach/batches/:id/submit` - Submit a batch for processing

### Returns & Reclamations
- `POST /api/ach/returns` - Record an ACH return
- `POST /api/ach/reclamations` - Record a reclamation

### Consents
- `POST /api/consents/ach` - Record ACH consent
- `POST /api/consents/:id/revoke` - Revoke consent

### Forms
- `GET /api/forms/catalog` - Get forms catalog
- `POST /api/forms/:id/generate` - Generate a form

### Compliance Packs
- `POST /api/packs/generate` - Generate compliance pack

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8443 |
| DB_URL | PostgreSQL connection string | postgres://postgres:postgres@localhost:5432/ach |
| WEBHOOK_SECRET | Secret for webhook signing | change-me |

## Database

The service uses PostgreSQL. Run the migration script to set up the schema:

```bash
psql $DB_URL -f migrations/001_init.sql
```

## Security Considerations

For production deployments, consider implementing:
- Rate limiting (e.g., via express-rate-limit middleware or API gateway)
- Input validation and sanitization
- Request authentication and authorization
- TLS/HTTPS termination

## License

MIT
