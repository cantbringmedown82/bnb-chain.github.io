#!/usr/bin/env bash
# deploynotrustees.sh - One-command deploy script for No-Trustees Mode
#
# This script performs a complete deployment with:
# - Environment validation
# - Dependencies installation
# - Database migrations (if applicable)
# - Service startup via PM2
# - Health checks
# - Test digest triggers
#
# SECURITY: This script does NOT contain secrets. All sensitive values
# must be provided via environment variables or a secrets manager.
#
# Usage:
#   ./deploynotrustees.sh [--skip-tests] [--dry-run]
#
# Required Environment Variables (must be set before running):
#   STRIPE_SECRET            - Stripe API secret key (sk_live_xxx or sk_test_xxx)
#   STRIPE_WEBHOOK_SECRET    - Stripe webhook signing secret (whsec_xxx)
#   ADMIN_API_KEY            - Admin endpoint API key
#
# Optional Environment Variables:
#   SLACK_WEBHOOK_URL        - Slack webhook for notifications
#   SMTP_HOST                - SMTP server hostname
#   SMTP_PORT                - SMTP server port (default: 587)
#   SMTP_USER                - SMTP username/email
#   SMTP_PASS                - SMTP password
#   TRUSTEES_ENABLED         - Set to 'false' for No-Trustees Mode (default: false)
#   AUTO_ANCHOR_COMPLIANCE   - Enable auto-anchoring (default: true)
#   COMPLIANCE_ANCHOR_CHAIN  - Blockchain for anchoring (e.g., 'bsc', 'eth')
#   TENANT_ID                - Tenant identifier
#   TZ                       - Timezone (recommend: UTC)
#   PORT                     - Server port (default: 3000)
#   PUBLIC_URL               - Public URL for callbacks
#   PRICE_ID                 - Stripe Price ID for subscriptions

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script options
SKIP_TESTS=false
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-tests)
      SKIP_TESTS=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================================
# Step 1: Validate required environment variables
# ============================================================
log_info "Validating required environment variables..."

REQUIRED_VARS=(
  "STRIPE_SECRET"
  "STRIPE_WEBHOOK_SECRET"
  "ADMIN_API_KEY"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    MISSING_VARS+=("$var")
  fi
done

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
  log_error "Missing required environment variables:"
  for var in "${MISSING_VARS[@]}"; do
    echo "  - $var"
  done
  echo ""
  echo "Please set these variables before running this script."
  echo "Example:"
  echo "  export STRIPE_SECRET='sk_test_xxx'"
  echo "  export STRIPE_WEBHOOK_SECRET='whsec_xxx'"
  echo "  export ADMIN_API_KEY='your-admin-key'"
  exit 1
fi

log_info "All required environment variables are set"

# ============================================================
# Step 2: Set default values for optional variables
# ============================================================
log_info "Setting default values for optional variables..."

export TRUSTEES_ENABLED="${TRUSTEES_ENABLED:-false}"
export AUTO_ANCHOR_COMPLIANCE="${AUTO_ANCHOR_COMPLIANCE:-true}"
export COMPLIANCE_ANCHOR_CHAIN="${COMPLIANCE_ANCHOR_CHAIN:-bsc}"
export TENANT_ID="${TENANT_ID:-default}"
export TZ="${TZ:-UTC}"
export PORT="${PORT:-3000}"

# Warn about TZ if not explicitly set
if [[ -z "${TZ:-}" ]]; then
  log_warn "TZ not set - using UTC. Consider setting TZ explicitly."
fi

# ============================================================
# Step 3: Navigate to backend directory
# ============================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/site/backend"

if [[ ! -d "$BACKEND_DIR" ]]; then
  log_error "Backend directory not found: $BACKEND_DIR"
  exit 1
fi

cd "$BACKEND_DIR"
log_info "Working directory: $BACKEND_DIR"

# ============================================================
# Step 4: Install dependencies
# ============================================================
log_info "Installing Node.js dependencies..."

if [[ "$DRY_RUN" == "true" ]]; then
  log_info "[DRY RUN] Would run: npm ci"
else
  if [[ -f "package-lock.json" ]]; then
    npm ci
  else
    npm install
  fi
fi

# ============================================================
# Step 5: Initialize evidence file
# ============================================================
log_info "Ensuring evidence file exists..."

REPORTS_DIR="${BACKEND_DIR}/deploy/reports"
EVIDENCE_FILE="${REPORTS_DIR}/compliance-evidence-index.json"

if [[ "$DRY_RUN" == "true" ]]; then
  log_info "[DRY RUN] Would create: $REPORTS_DIR"
  log_info "[DRY RUN] Would initialize: $EVIDENCE_FILE"
else
  mkdir -p "$REPORTS_DIR"

  if [[ ! -f "$EVIDENCE_FILE" ]]; then
    echo '{"reports":[]}' > "$EVIDENCE_FILE"
    log_info "Initialized evidence file: $EVIDENCE_FILE"
  else
    log_info "Evidence file already exists: $EVIDENCE_FILE"
  fi
fi

# ============================================================
# Step 6: Run tests (unless skipped)
# ============================================================
if [[ "$SKIP_TESTS" == "true" ]]; then
  log_warn "Skipping tests (--skip-tests flag set)"
else
  log_info "Running tests..."

  if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY RUN] Would run: npm test"
  else
    if npm test 2>/dev/null; then
      log_info "Tests passed"
    else
      log_warn "Tests failed or no tests configured - continuing"
    fi
  fi
fi

# ============================================================
# Step 7: Database migrations (placeholder)
# ============================================================
log_info "Checking for database migrations..."

# TODO: Add actual database migration commands here
# Example for Prisma:
# if [[ -f "prisma/schema.prisma" ]]; then
#   npx prisma migrate deploy
# fi

log_info "No database migrations configured (placeholder)"

# ============================================================
# Step 8: Start service with PM2
# ============================================================
log_info "Starting service with PM2..."

if [[ "$DRY_RUN" == "true" ]]; then
  log_info "[DRY RUN] Would run: pm2 start server.js --name bnb-backend"
else
  # Check if PM2 is installed
  if ! command -v pm2 &> /dev/null; then
    log_warn "PM2 not installed - installing globally..."
    npm install -g pm2
  fi

  # Stop existing instance if running
  pm2 stop bnb-backend 2>/dev/null || true
  pm2 delete bnb-backend 2>/dev/null || true

  # Start the server
  pm2 start server.js --name bnb-backend --env production

  # Save PM2 process list
  pm2 save

  log_info "Service started with PM2"
fi

# ============================================================
# Step 9: Health checks
# ============================================================
log_info "Running health checks..."

if [[ "$DRY_RUN" == "true" ]]; then
  log_info "[DRY RUN] Would check: http://localhost:${PORT}/healthz"
  log_info "[DRY RUN] Would check: http://localhost:${PORT}/readyz"
else
  # Wait for server to start
  sleep 3

  # Check health endpoint
  HEALTH_URL="http://localhost:${PORT}/healthz"
  if curl -sf "$HEALTH_URL" > /dev/null; then
    log_info "Health check passed: $HEALTH_URL"
  else
    log_error "Health check failed: $HEALTH_URL"
    pm2 logs bnb-backend --lines 20
    exit 1
  fi

  # Check readiness endpoint
  READY_URL="http://localhost:${PORT}/readyz"
  READY_RESPONSE=$(curl -sf "$READY_URL" || echo '{}')
  log_info "Readiness check: $READY_RESPONSE"
fi

# ============================================================
# Step 10: Trigger test digest (optional)
# ============================================================
log_info "Triggering test digest..."

if [[ "$DRY_RUN" == "true" ]]; then
  log_info "[DRY RUN] Would trigger test digest via admin API"
else
  ADMIN_URL="http://localhost:${PORT}/admin/trigger/test-digest"

  DIGEST_RESPONSE=$(curl -sf -X POST "$ADMIN_URL" \
    -H "Content-Type: application/json" \
    -H "x-admin-api-key: ${ADMIN_API_KEY}" \
    -d '{"channel":"all"}' 2>/dev/null || echo '{"error":"request failed"}')

  if echo "$DIGEST_RESPONSE" | grep -q '"success":true'; then
    log_info "Test digest triggered successfully"
  else
    log_warn "Test digest trigger returned: $DIGEST_RESPONSE"
  fi
fi

# ============================================================
# Deployment complete
# ============================================================
echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Service URL: http://localhost:${PORT}"
echo "Health:      http://localhost:${PORT}/healthz"
echo "Readiness:   http://localhost:${PORT}/readyz"
echo "Evidence:    http://localhost:${PORT}/evidence-index"
echo ""
echo "PM2 Commands:"
echo "  pm2 status           - View service status"
echo "  pm2 logs bnb-backend - View logs"
echo "  pm2 restart bnb-backend - Restart service"
echo "  pm2 stop bnb-backend - Stop service"
echo ""
