# Governance Badge Workflow - Quick Start Guide

## Overview

This repository includes an automated governance ledger system that seals trustee meeting logs with cryptographic hashes and maintains a "Governance Ledger Status" badge.

## How It Works

### For Trustees (Adding New Meeting Logs)

1. **Create a new log file** using the template:
   ```bash
   cp docs/meeting-log-template.md docs/meeting-logs/YYYY/YYYY-MM-DD-weekly-log.md
   ```

2. **Fill in the details** for the meeting:
   - Replace `{{DATE}}` with the actual meeting date
   - Update Recovery Updates, Engagement Metrics, Compliance Checks, and Closing Actions
   - **Do NOT add a seal footer** - this will be added automatically

3. **Commit and push** the new log:
   ```bash
   git add docs/meeting-logs/
   git commit -m "Add meeting log for YYYY-MM-DD"
   git push
   ```

4. **Automatic sealing** happens via GitHub Actions:
   - The workflow detects the new log
   - Generates a SHA256 seal ID
   - Appends the seal footer
   - Commits the sealed log back to the repository
   - Updates the Governance Ledger badge

### Naming Convention

All meeting logs **must** follow this naming pattern:
```
YYYY-MM-DD-weekly-log.md
```

Examples:
- `2025-11-22-weekly-log.md`
- `2026-01-03-weekly-log.md`

### Directory Structure

```
docs/meeting-logs/
├── README.md
├── 2025/
│   ├── 2025-11-22-weekly-log.md
│   ├── 2025-11-29-weekly-log.md
│   └── 2025-12-06-weekly-log.md
└── 2026/
    ├── README.md
    └── (future logs)
```

## What Gets Sealed

When you add a new meeting log, the GitHub Action automatically:

1. **Calculates** a SHA256 hash of the file content
2. **Appends** a seal footer like this:
   ```markdown
   ---
   
   **Seal Confirmation:**  
   This log has been sealed and archived under Crypto Hound Institutional License.  
   Seal ID: [64-character SHA256 hash]  
   Sealed at: [ISO 8601 timestamp]
   ```

3. **Commits** the sealed log with message: `Seal log with ID [hash]`
4. **Updates** the `governance-ledger` release with latest seal information

## Governance Ledger Badge

The badge shows whether governance logs are up to date:

![Governance Ledger Status](https://img.shields.io/badge/Governance%20Ledger-Up%20to%20Date-brightgreen)

The badge is linked to a GitHub release that contains:
- Latest sealed log filename
- Seal ID
- Timestamp

## Troubleshooting

### The workflow didn't trigger

**Check:**
- Did you push to the `docs/meeting-logs/` directory?
- Is the file a `.md` markdown file?
- Check the Actions tab in GitHub for workflow status

### Seal footer appears twice

**This shouldn't happen** - the workflow checks for the seal footer before adding it. If this occurs:
1. Manually remove the duplicate footer
2. Commit and push
3. Report the issue for investigation

### Need to manually seal a log

If you need to seal a log without triggering the workflow:

```bash
# Calculate seal ID
seal=$(sha256sum docs/meeting-logs/YYYY/YYYY-MM-DD-weekly-log.md | cut -d' ' -f1)
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Append seal footer manually
cat >> docs/meeting-logs/YYYY/YYYY-MM-DD-weekly-log.md << EOF

---

**Seal Confirmation:**  
This log has been sealed and archived under Crypto Hound Institutional License.  
Seal ID: $seal  
Sealed at: $timestamp
EOF
```

## Security Considerations

- **Seal IDs are permanent** - once a log is sealed, the seal becomes part of the permanent audit trail
- **Any changes** to a sealed log will change its hash, making tampering detectable
- **Timestamps are in UTC** for consistency across time zones
- **All seals** reference the Crypto Hound Institutional License

## Workflow File Location

The automation is defined in:
```
.github/workflows/governance-badge.yml
```

## Questions or Issues?

Contact the repository maintainers or open an issue in GitHub.
