# Reports Directory

This directory stores compliance evidence and reports.

## Files

- `compliance-evidence-index.json` - Index of all compliance evidence entries
- Generated PDF reports

## Initialization

The evidence index file is automatically created on server startup if it doesn't exist.
You can also initialize it manually:

```bash
echo '{"reports":[]}' > compliance-evidence-index.json
```

## Persistence

In production, mount this directory as a persistent volume:

```yaml
# Kubernetes example
volumes:
  - name: reports-volume
    persistentVolumeClaim:
      claimName: compliance-reports-pvc
volumeMounts:
  - name: reports-volume
    mountPath: /app/deploy/reports
```

## Backup

Ensure regular backups of the evidence index for compliance purposes.
