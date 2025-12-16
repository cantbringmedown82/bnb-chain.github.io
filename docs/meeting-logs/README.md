# Trustee Meeting Logs Archive

This directory contains sealed and archived trustee meeting logs for Crypto Hound governance.

## Structure

```
/docs/meeting-logs/
   ├── 2025/
   │    ├── 2025-11-22-weekly-log.md
   │    ├── 2025-11-29-weekly-log.md
   │    └── 2025-12-06-weekly-log.md
   ├── 2026/
   │    ├── 2026-01-03-weekly-log.md
   │    └── ...
```

## Naming Convention

All meeting logs should follow the naming pattern:
- `YYYY-MM-DD-weekly-log.md`

Examples:
- `2025-11-22-weekly-log.md`
- `2026-01-03-weekly-log.md`

## Automated Sealing

When a new log is added to this directory:
1. The GitHub Action workflow automatically generates a Seal ID (SHA256 hash)
2. A seal footer is appended to the log if not already present
3. The sealed log is committed and pushed
4. The Governance Ledger Status badge is updated

## Template

Use the template at `/docs/meeting-log-template.md` for creating new logs.

## Seal Confirmation

Each log contains a seal footer with:
- Seal ID (SHA256 hash of the file content)
- Timestamp of when the log was sealed
- Reference to Crypto Hound Institutional License
