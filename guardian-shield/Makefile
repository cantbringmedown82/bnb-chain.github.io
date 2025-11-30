# Guardian Shield — Makefile
# Crypto Hound LLC
#
# One-command operations for deploy, drill, export, and maintenance.

.PHONY: help install deploy deploy-staging deploy-prod drill export clean test lint build

# Default target
help:
	@echo "Guardian Shield — Available Commands"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install          Install all dependencies"
	@echo "  make setup            Complete local development setup"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start development server"
	@echo "  make build            Build production assets"
	@echo "  make test             Run all tests"
	@echo "  make test-unit        Run unit tests"
	@echo "  make test-e2e         Run E2E tests"
	@echo "  make lint             Run linters"
	@echo "  make typecheck        Run TypeScript checks"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-staging   Deploy to staging environment"
	@echo "  make deploy-prod      Deploy to production environment"
	@echo "  make rollback         Rollback to previous deployment"
	@echo ""
	@echo "Drills & Exports:"
	@echo "  make drill            Run synthetic fraud drill"
	@echo "  make drill-critical   Run critical-only drill"
	@echo "  make export           Generate weekly compliance export"
	@echo "  make export-custom    Generate custom date range export"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean            Clean build artifacts"
	@echo "  make prune            Remove unused Docker images"
	@echo "  make logs             Tail production logs"
	@echo "  make status           Check system status"

# ============================================================================
# VARIABLES
# ============================================================================

DOCKER_REGISTRY ?= ghcr.io
IMAGE_NAME ?= cryptohound/guardian-shield
VERSION ?= $(shell git describe --tags --always --dirty)
KUBECTL_CONTEXT_STAGING ?= guardian-staging
KUBECTL_CONTEXT_PROD ?= guardian-production
NAMESPACE_STAGING ?= guardian-shield-staging
NAMESPACE_PROD ?= guardian-shield-production

# ============================================================================
# SETUP & INSTALLATION
# ============================================================================

install:
	@echo "Installing dependencies..."
	npm ci
	pip install -r requirements.txt
	@echo "Dependencies installed."

setup: install
	@echo "Setting up local environment..."
	cp -n .env.example .env.local || true
	npm run db:migrate
	@echo "Setup complete. Update .env.local with your configuration."

# ============================================================================
# DEVELOPMENT
# ============================================================================

dev:
	npm run dev

build:
	npm run build

test: test-unit test-e2e

test-unit:
	npm run test

test-e2e:
	npm run test:e2e

lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format

# ============================================================================
# DOCKER
# ============================================================================

docker-build:
	docker build -t $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) .
	docker tag $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest

docker-push: docker-build
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION)
	docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest

docker-run:
	docker run -p 3000:3000 --env-file .env.local $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest

# ============================================================================
# DEPLOYMENT
# ============================================================================

deploy-staging: docker-push
	@echo "Deploying to staging..."
	kubectl config use-context $(KUBECTL_CONTEXT_STAGING)
	kubectl set image deployment/guardian-shield \
		guardian-shield=$(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) \
		-n $(NAMESPACE_STAGING)
	kubectl rollout status deployment/guardian-shield -n $(NAMESPACE_STAGING)
	@echo "Deployed to staging: $(VERSION)"

deploy-prod: docker-push
	@echo "Deploying to production..."
	@read -p "Are you sure you want to deploy to production? [y/N] " confirm && \
		[ "$$confirm" = "y" ] || exit 1
	kubectl config use-context $(KUBECTL_CONTEXT_PROD)
	kubectl set image deployment/guardian-shield \
		guardian-shield=$(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) \
		-n $(NAMESPACE_PROD)
	kubectl rollout status deployment/guardian-shield -n $(NAMESPACE_PROD)
	@echo "Deployed to production: $(VERSION)"

rollback:
	@echo "Rolling back deployment..."
	kubectl rollout undo deployment/guardian-shield -n $(NAMESPACE_PROD)
	kubectl rollout status deployment/guardian-shield -n $(NAMESPACE_PROD)
	@echo "Rollback complete."

# ============================================================================
# DRILLS
# ============================================================================

drill:
	@echo "Starting synthetic fraud drill..."
	python -m guardian_drill run \
		--config drills/fraud_event_generator.yaml \
		--schedule drills/drill_schedule.yaml \
		--output drill-results-$(shell date +%Y%m%d-%H%M%S).json
	@echo "Drill complete. Results saved."

drill-critical:
	@echo "Starting critical-only drill..."
	python -m guardian_drill run \
		--config drills/fraud_event_generator.yaml \
		--scenarios mixer-chain,exchange-front-running,pool-rug-pull \
		--output drill-critical-$(shell date +%Y%m%d-%H%M%S).json
	@echo "Critical drill complete."

drill-dry-run:
	@echo "Running drill in dry-run mode..."
	python -m guardian_drill run \
		--config drills/fraud_event_generator.yaml \
		--dry-run \
		--verbose
	@echo "Dry run complete."

# ============================================================================
# EXPORTS
# ============================================================================

export:
	@echo "Generating weekly compliance export..."
	python -m guardian_export generate \
		--type weekly \
		--format pdfa \
		--output reports/weekly-$(shell date +%Y%m%d).pdf
	@echo "Export complete: reports/weekly-$(shell date +%Y%m%d).pdf"

export-custom:
	@read -p "Start date (YYYY-MM-DD): " start_date && \
	read -p "End date (YYYY-MM-DD): " end_date && \
	python -m guardian_export generate \
		--type custom \
		--from-date $$start_date \
		--to-date $$end_date \
		--format pdfa \
		--output reports/custom-$$start_date-$$end_date.pdf
	@echo "Custom export complete."

export-json:
	@echo "Generating JSON evidence export..."
	python -m guardian_export generate \
		--type full \
		--format json \
		--output exports/evidence-$(shell date +%Y%m%d).json
	@echo "JSON export complete."

verify-export:
	@read -p "Export file path: " export_path && \
	python -m guardian_export verify --file $$export_path
	@echo "Verification complete."

# ============================================================================
# MAINTENANCE
# ============================================================================

clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/.cache/
	rm -rf coverage/
	rm -rf playwright-report/
	rm -rf drill-results-*.json
	@echo "Clean complete."

prune:
	@echo "Pruning unused Docker resources..."
	docker system prune -f
	docker image prune -f
	@echo "Prune complete."

logs:
	kubectl logs -f deployment/guardian-shield -n $(NAMESPACE_PROD) --tail=100

logs-staging:
	kubectl logs -f deployment/guardian-shield -n $(NAMESPACE_STAGING) --tail=100

status:
	@echo "=== Guardian Shield System Status ==="
	@echo ""
	@echo "Production:"
	kubectl get deployment guardian-shield -n $(NAMESPACE_PROD) -o wide || true
	@echo ""
	@echo "Staging:"
	kubectl get deployment guardian-shield -n $(NAMESPACE_STAGING) -o wide || true
	@echo ""
	@echo "Recent events:"
	kubectl get events -n $(NAMESPACE_PROD) --sort-by='.lastTimestamp' | tail -5 || true

health:
	@echo "Checking system health..."
	curl -s http://localhost:3000/health | jq .
	@echo ""
	curl -s http://localhost:3000/api/v1/metadata | jq .

# ============================================================================
# DATABASE
# ============================================================================

db-migrate:
	@echo "Running database migrations..."
	npm run db:migrate

db-seed:
	@echo "Seeding database with test data..."
	npm run db:seed

db-reset:
	@echo "Resetting database..."
	npm run db:reset

# ============================================================================
# SECURITY
# ============================================================================

security-scan:
	@echo "Running security scan..."
	trivy fs --severity HIGH,CRITICAL .
	npm audit

dependency-check:
	@echo "Checking dependencies for vulnerabilities..."
	npm audit --audit-level=high
	pip-audit
