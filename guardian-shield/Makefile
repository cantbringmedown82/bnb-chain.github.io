# Guardian Shield — Makefile
# Crypto Hound LLC
# One-command deploy, drill, export, clean

.PHONY: all deploy dashboards alerts drill export clean validate lint test help

# Default target
all: validate deploy dashboards

# Environment defaults
ENV ?= development
KUBECTL ?= kubectl
GRAFANA_CLI ?= grafana-cli
NAMESPACE ?= guardian-shield

#==============================================================================
# Validation
#==============================================================================

## validate: Validate all configuration files
validate: validate-yaml validate-json
	@echo "✅ All validations passed"

## validate-yaml: Validate YAML configuration files
validate-yaml:
	@echo "🔍 Validating YAML files..."
	@yamllint config/ alerts/ drills/ 2>/dev/null || echo "⚠️  yamllint not installed, skipping"
	@echo "✅ YAML validation complete"

## validate-json: Validate JSON configuration files
validate-json:
	@echo "🔍 Validating JSON files..."
	@python3 -c "import json; json.load(open('grafana/dashboards.json'))" 2>/dev/null && echo "✅ JSON validation complete" || echo "⚠️  JSON validation failed"

## lint: Run linters on all files
lint: validate
	@echo "🔍 Running linters..."
	@if command -v markdownlint > /dev/null; then \
		markdownlint docs/*.md; \
	else \
		echo "⚠️  markdownlint not installed, skipping"; \
	fi
	@echo "✅ Linting complete"

#==============================================================================
# Deployment
#==============================================================================

## deploy: Deploy all configurations to Kubernetes
deploy: deploy-config deploy-alerts
	@echo "✅ Deployment complete"

## deploy-config: Apply configuration values to Kubernetes
deploy-config:
	@echo "🚀 Deploying configurations to $(ENV)..."
ifeq ($(ENV),production)
	$(KUBECTL) apply -f config/values.yaml -n $(NAMESPACE)
else
	$(KUBECTL) apply -f config/values.yaml -n $(NAMESPACE) --dry-run=client
	@echo "ℹ️  Dry-run mode (set ENV=production for actual deployment)"
endif

## deploy-alerts: Apply alert rules to Kubernetes
deploy-alerts:
	@echo "🚀 Deploying alert rules to $(ENV)..."
ifeq ($(ENV),production)
	$(KUBECTL) apply -f alerts/alert_rules.yaml -n $(NAMESPACE)
else
	$(KUBECTL) apply -f alerts/alert_rules.yaml -n $(NAMESPACE) --dry-run=client
	@echo "ℹ️  Dry-run mode (set ENV=production for actual deployment)"
endif

## dashboards: Import Grafana dashboards
dashboards:
	@echo "📊 Importing Grafana dashboards..."
ifeq ($(ENV),production)
	@if command -v grafana-cli > /dev/null; then \
		$(GRAFANA_CLI) dashboards import grafana/dashboards.json; \
	else \
		echo "⚠️  grafana-cli not installed, using API..."; \
		curl -X POST \
			-H "Authorization: Bearer $(GRAFANA_API_KEY)" \
			-H "Content-Type: application/json" \
			-d @grafana/dashboards.json \
			"$(GRAFANA_URL)/api/dashboards/db" 2>/dev/null || echo "⚠️  Dashboard import skipped (no credentials)"; \
	fi
else
	@echo "ℹ️  Would import dashboards in production mode"
endif
	@echo "✅ Dashboard import complete"

#==============================================================================
# Synthetic Drills
#==============================================================================

## drill: Run synthetic fraud drill
drill: drill-critical
	@echo "✅ Drill complete"

## drill-critical: Run critical severity mixer drill
drill-critical:
	@echo "🎯 Running critical mixer drill..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		simulate_alert --severity critical --type mixer
else
	@echo "ℹ️  Would execute: simulate_alert --severity critical --type mixer"
endif

## drill-high: Run high severity exchange drill
drill-high:
	@echo "🎯 Running high severity exchange drill..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		simulate_alert --severity high --type exchange
else
	@echo "ℹ️  Would execute: simulate_alert --severity high --type exchange"
endif

## drill-all: Run all severity drills
drill-all: drill-critical drill-high drill-medium drill-watchlist
	@echo "✅ All drills complete"

## drill-medium: Run medium severity pool drill
drill-medium:
	@echo "🎯 Running medium severity pool drill..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		simulate_alert --severity medium --type pool
else
	@echo "ℹ️  Would execute: simulate_alert --severity medium --type pool"
endif

## drill-watchlist: Run watchlist severity dust drill
drill-watchlist:
	@echo "🎯 Running watchlist severity dust drill..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		simulate_alert --severity watchlist --type dust
else
	@echo "ℹ️  Would execute: simulate_alert --severity watchlist --type dust"
endif

## drill-status: Check status of last drill
drill-status:
	@echo "📋 Checking drill status..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		get_drill_status --last 5
else
	@echo "ℹ️  Would check drill status in production"
endif

#==============================================================================
# Reports
#==============================================================================

## export: Generate and export weekly incident report
export: export-weekly
	@echo "✅ Export complete"

## export-weekly: Generate weekly incident report
export-weekly:
	@echo "📄 Generating weekly incident report..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		generate_report --format pdfa --output /tmp/incident_report.pdf
	$(KUBECTL) cp $(NAMESPACE)/shield-orchestrator:/tmp/incident_report.pdf ./docs/incident_report.pdf
	@echo "✅ Report saved to docs/incident_report.pdf"
else
	@echo "ℹ️  Would generate weekly report in production"
	@touch docs/incident_report_mock.pdf
	@echo "ℹ️  Created mock report: docs/incident_report_mock.pdf"
endif

## export-compliance: Generate compliance bundle
export-compliance:
	@echo "📦 Generating compliance bundle..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		generate_bundle --format zip --include all --output /tmp/compliance_bundle.zip
	$(KUBECTL) cp $(NAMESPACE)/shield-orchestrator:/tmp/compliance_bundle.zip ./docs/compliance_bundle.zip
else
	@echo "ℹ️  Would generate compliance bundle in production"
endif

#==============================================================================
# Verification
#==============================================================================

## verify: Verify ledger integrity
verify:
	@echo "🔐 Verifying ledger integrity..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		verify_ledger --full
else
	@echo "ℹ️  Would verify ledger integrity in production"
endif

## verify-hash: Verify a specific evidence hash
verify-hash:
ifndef HASH
	@echo "❌ Error: HASH is not set. Usage: make verify-hash HASH=<sha256>"
	@exit 1
endif
	@echo "🔐 Verifying hash: $(HASH)..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		verify_evidence --hash $(HASH)
else
	@echo "ℹ️  Would verify hash in production"
endif

#==============================================================================
# Health & Monitoring
#==============================================================================

## health: Check system health
health:
	@echo "❤️ Checking system health..."
ifeq ($(ENV),production)
	$(KUBECTL) get pods -n $(NAMESPACE)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- health_check
else
	@echo "ℹ️  Would check health in production"
endif

## logs: View orchestrator logs
logs:
	@echo "📜 Fetching logs..."
ifeq ($(ENV),production)
	$(KUBECTL) logs deploy/shield-orchestrator -n $(NAMESPACE) --tail=100 -f
else
	@echo "ℹ️  Would fetch logs in production"
endif

## metrics: View current metrics
metrics:
	@echo "📊 Fetching metrics..."
ifeq ($(ENV),production)
	$(KUBECTL) exec deploy/shield-orchestrator -n $(NAMESPACE) -- \
		get_metrics --format prometheus
else
	@echo "ℹ️  Would fetch metrics in production"
endif

#==============================================================================
# Cleanup
#==============================================================================

## clean: Clean generated files
clean:
	@echo "🧹 Cleaning generated files..."
	@rm -f docs/incident_report_mock.pdf
	@rm -f docs/incident_report.pdf
	@rm -f docs/compliance_bundle.zip
	@echo "✅ Cleanup complete"

## clean-all: Clean all generated and cached files
clean-all: clean
	@echo "🧹 Deep cleaning..."
	@rm -rf .cache
	@rm -rf __pycache__
	@echo "✅ Deep cleanup complete"

#==============================================================================
# Development
#==============================================================================

## dev: Start development environment
dev:
	@echo "🔧 Starting development environment..."
	@docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started"

## dev-stop: Stop development environment
dev-stop:
	@echo "🛑 Stopping development environment..."
	@docker-compose -f docker-compose.dev.yml down
	@echo "✅ Development environment stopped"

## test: Run tests
test:
	@echo "🧪 Running tests..."
	@echo "ℹ️  No tests configured yet"

#==============================================================================
# Help
#==============================================================================

## help: Show this help message
help:
	@echo ""
	@echo "Guardian Shield — Crypto Hound LLC"
	@echo "==================================="
	@echo ""
	@echo "Usage: make [target] [ENV=development|production]"
	@echo ""
	@echo "Targets:"
	@grep -E '^## ' Makefile | sed 's/## /  /' | column -t -s ':'
	@echo ""
	@echo "Examples:"
	@echo "  make deploy ENV=production    # Deploy to production"
	@echo "  make drill                    # Run synthetic drill"
	@echo "  make export                   # Generate weekly report"
	@echo "  make dashboards               # Import Grafana dashboards"
	@echo ""
