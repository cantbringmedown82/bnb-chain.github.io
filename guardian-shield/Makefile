# Guardian Shield Makefile
# Common tasks for development, testing, and deployment

.PHONY: help install dev test lint build deploy clean

# Default target
help:
	@echo "Guardian Shield - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  install        Install all dependencies"
	@echo "  dev            Start development environment"
	@echo "  dev-backend    Start backend only"
	@echo "  dev-frontend   Start frontend only"
	@echo ""
	@echo "Testing:"
	@echo "  test           Run all tests"
	@echo "  test-backend   Run backend tests"
	@echo "  test-frontend  Run frontend tests"
	@echo "  test-e2e       Run end-to-end tests"
	@echo "  coverage       Generate coverage report"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint           Run all linters"
	@echo "  lint-backend   Run Python linters"
	@echo "  lint-frontend  Run TypeScript linters"
	@echo "  format         Format all code"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  build          Build all components"
	@echo "  build-images   Build Docker images"
	@echo "  deploy-staging Deploy to staging"
	@echo "  deploy-prod    Deploy to production"
	@echo ""
	@echo "Drills:"
	@echo "  drill-mixer    Run mixer detection drill"
	@echo "  drill-exchange Run exchange anomaly drill"
	@echo "  drill-pool     Run pool attack drill"
	@echo "  drill-all      Run all drills"
	@echo ""
	@echo "Utilities:"
	@echo "  clean          Clean build artifacts"
	@echo "  logs           View service logs"
	@echo "  status         Check service status"

# Variables
PYTHON := python3
NODE := node
NPM := npm
DOCKER := docker
KUBECTL := kubectl
HELM := helm

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m

# Development
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@cd backend && pip install -e ".[dev,test]"
	@cd frontend && $(NPM) ci
	@echo "$(GREEN)Dependencies installed successfully$(NC)"

dev:
	@echo "$(GREEN)Starting development environment...$(NC)"
	@docker compose -f deploy/compose.yaml up -d db redis
	@make dev-backend &
	@make dev-frontend &
	@wait

dev-backend:
	@echo "$(GREEN)Starting backend...$(NC)"
	@cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	@echo "$(GREEN)Starting frontend...$(NC)"
	@cd frontend && $(NPM) run dev

# Testing
test: test-backend test-frontend
	@echo "$(GREEN)All tests completed$(NC)"

test-backend:
	@echo "$(GREEN)Running backend tests...$(NC)"
	@cd backend && pytest -v --cov=app --cov-report=term-missing

test-frontend:
	@echo "$(GREEN)Running frontend tests...$(NC)"
	@cd frontend && $(NPM) run test

test-e2e:
	@echo "$(GREEN)Running end-to-end tests...$(NC)"
	@cd tests/e2e && $(NPM) run test

coverage:
	@echo "$(GREEN)Generating coverage report...$(NC)"
	@cd backend && pytest --cov=app --cov-report=html
	@cd frontend && $(NPM) run test -- --coverage
	@echo "$(GREEN)Coverage reports generated$(NC)"

# Code Quality
lint: lint-backend lint-frontend
	@echo "$(GREEN)Linting completed$(NC)"

lint-backend:
	@echo "$(GREEN)Linting Python code...$(NC)"
	@cd backend && ruff check .
	@cd backend && mypy . --ignore-missing-imports

lint-frontend:
	@echo "$(GREEN)Linting TypeScript code...$(NC)"
	@cd frontend && $(NPM) run lint
	@cd frontend && $(NPM) run type-check

format:
	@echo "$(GREEN)Formatting code...$(NC)"
	@cd backend && ruff format .
	@cd frontend && $(NPM) run format

# Build
build: build-backend build-frontend
	@echo "$(GREEN)Build completed$(NC)"

build-backend:
	@echo "$(GREEN)Building backend...$(NC)"
	@cd backend && pip install build && python -m build

build-frontend:
	@echo "$(GREEN)Building frontend...$(NC)"
	@cd frontend && $(NPM) run build

build-images:
	@echo "$(GREEN)Building Docker images...$(NC)"
	@$(DOCKER) build -t guardian-shield/orchestrator:latest -f docker/orchestrator.Dockerfile .
	@$(DOCKER) build -t guardian-shield/evidence-api:latest -f docker/evidence-api.Dockerfile .
	@$(DOCKER) build -t guardian-shield/fraud-monitor:latest -f docker/fraud-monitor.Dockerfile .
	@$(DOCKER) build -t guardian-shield/frontend:latest -f docker/frontend.Dockerfile .
	@echo "$(GREEN)Docker images built successfully$(NC)"

# Deployment
deploy-staging:
	@echo "$(YELLOW)Deploying to staging...$(NC)"
	@$(HELM) upgrade --install guardian-shield ./helm \
		--namespace guardian-shield-staging \
		--create-namespace \
		-f helm/values-staging.yaml \
		--wait --timeout 10m
	@make smoke-test ENV=staging
	@echo "$(GREEN)Staging deployment completed$(NC)"

deploy-prod:
	@echo "$(RED)Deploying to production...$(NC)"
	@read -p "Are you sure you want to deploy to production? [y/N] " confirm && \
		[ "$$confirm" = "y" ] || exit 1
	@$(HELM) upgrade --install guardian-shield ./helm \
		--namespace guardian-shield \
		-f helm/values-production.yaml \
		--wait --timeout 15m
	@make smoke-test ENV=production
	@echo "$(GREEN)Production deployment completed$(NC)"

smoke-test:
	@echo "$(GREEN)Running smoke tests for $(ENV)...$(NC)"
	@./scripts/smoke-test.sh $(ENV)

# Drills
drill-mixer:
	@echo "$(GREEN)Running mixer detection drill...$(NC)"
	@curl -X POST http://localhost:8000/api/v1/drills/trigger \
		-H "Content-Type: application/json" \
		-d '{"scenario": "mixer"}'

drill-exchange:
	@echo "$(GREEN)Running exchange anomaly drill...$(NC)"
	@curl -X POST http://localhost:8000/api/v1/drills/trigger \
		-H "Content-Type: application/json" \
		-d '{"scenario": "exchange"}'

drill-pool:
	@echo "$(GREEN)Running pool attack drill...$(NC)"
	@curl -X POST http://localhost:8000/api/v1/drills/trigger \
		-H "Content-Type: application/json" \
		-d '{"scenario": "pool"}'

drill-all:
	@echo "$(GREEN)Running all drills...$(NC)"
	@make drill-mixer
	@sleep 60
	@make drill-exchange
	@sleep 60
	@make drill-pool
	@echo "$(GREEN)All drills completed$(NC)"

# Verification
verify-chain:
	@echo "$(GREEN)Verifying evidence hash chain...$(NC)"
	@curl http://localhost:8000/api/v1/verification/chain \
		-H "Content-Type: application/json" \
		-d '{"from_sequence": 1, "to_sequence": -1}'

verify-anchors:
	@echo "$(GREEN)Verifying blockchain anchors...$(NC)"
	@./scripts/verify-anchors.sh

# Utilities
clean:
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	@rm -rf backend/dist backend/build backend/*.egg-info
	@rm -rf frontend/dist frontend/node_modules/.cache
	@rm -rf .pytest_cache .coverage htmlcov
	@find . -type d -name __pycache__ -exec rm -rf {} +
	@echo "$(GREEN)Clean completed$(NC)"

logs:
	@echo "$(GREEN)Viewing service logs...$(NC)"
	@$(KUBECTL) logs -f -l app=guardian-shield --all-containers

status:
	@echo "$(GREEN)Service status:$(NC)"
	@$(KUBECTL) get pods -l app=guardian-shield
	@echo ""
	@$(KUBECTL) get svc -l app=guardian-shield

db-migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	@cd backend && alembic upgrade head

db-rollback:
	@echo "$(YELLOW)Rolling back last migration...$(NC)"
	@cd backend && alembic downgrade -1

generate-keys:
	@echo "$(GREEN)Generating signing keys...$(NC)"
	@openssl ecparam -genkey -name prime256v1 -out keys/signing.key
	@openssl ec -in keys/signing.key -pubout -out keys/signing.pub
	@echo "$(GREEN)Keys generated$(NC)"
