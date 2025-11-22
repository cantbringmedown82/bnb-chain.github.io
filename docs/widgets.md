# Widgets

This document provides information about various widgets and badges used in the BNB Chain documentation and governance system.

## Governance Ledger Status Badge

The Governance Ledger Status badge provides real-time visibility into the health of our governance process.

### Badge Display

![Governance Ledger Status](https://img.shields.io/badge/Governance%20Ledger-Up%20to%20Date-brightgreen)

### Badge URL

```markdown
![Governance Ledger Status](https://img.shields.io/badge/Governance%20Ledger-Up%20to%20Date-brightgreen)
```

### Status Meanings

| Badge | Status | Description |
|-------|--------|-------------|
| ![Up to Date](https://img.shields.io/badge/Governance%20Ledger-Up%20to%20Date-brightgreen) | Up to Date | Latest meeting log has been published within expected timeframe |
| ![Pending](https://img.shields.io/badge/Governance%20Ledger-Pending-yellow) | Pending | Meeting log expected soon |
| ![Overdue](https://img.shields.io/badge/Governance%20Ledger-Overdue-red) | Overdue | Meeting log is past due |

### How It Works

The governance badge is automatically updated through a GitHub Actions workflow:

1. **Trigger**: Activated when files in `docs/meeting-logs/` are modified
2. **Check**: Workflow identifies the latest meeting log file
3. **Update**: Badge status is updated based on the log timestamp
4. **Display**: Badge reflects current governance status

### Implementation

The badge is implemented using [Shields.io](https://shields.io/) static badges and monitored by the governance-badge workflow.

Workflow file: `.github/workflows/governance-badge.yml`

## Other Badges and Widgets

### Build Status

Shows the current build status of the documentation site:

```markdown
![Build Status](https://github.com/bnb-chain/bnb-chain.github.io/workflows/Deploy%20MkDocs%20site%20to%20GitHub%20Pages/badge.svg)
```

### Documentation Version

Track the documentation version:

```markdown
![Version](https://img.shields.io/badge/docs-latest-blue)
```

### License Badge

Display the project license:

```markdown
![License](https://img.shields.io/badge/license-MIT-green)
```

### Community Badges

Community and social badges:

```markdown
![Twitter Follow](https://img.shields.io/twitter/follow/bnbchain?style=social)
![Discord](https://img.shields.io/discord/789402563035660338?label=discord)
```

## Custom Widgets

### Meeting Log Counter

Display the total number of published meeting logs:

```markdown
![Meeting Logs](https://img.shields.io/badge/dynamic/json?color=blue&label=Meeting%20Logs&query=$.count&url=https://api.example.com/meeting-logs/count)
```

### Contribution Activity

Show recent contribution activity:

```markdown
![Contributions](https://img.shields.io/github/commit-activity/m/bnb-chain/bnb-chain.github.io)
```

### Last Updated

Display when documentation was last updated:

```markdown
![Last Commit](https://img.shields.io/github/last-commit/bnb-chain/bnb-chain.github.io)
```

## Embedding Badges

### In Markdown Files

Simply paste the markdown syntax:

```markdown
![Badge Name](badge-url)
```

### In HTML

Use standard img tags:

```html
<img src="badge-url" alt="Badge Name" />
```

### In README

Typically placed at the top of README.md:

```markdown
# BNB Chain Documentation

![Build Status](build-badge-url)
![Governance Status](governance-badge-url)
![License](license-badge-url)

Project description goes here...
```

## Badge Customization

### Colors

Shields.io supports various colors:
- `brightgreen` - Success/Positive
- `green` - Good
- `yellow` - Warning/Pending
- `orange` - Alert
- `red` - Error/Critical
- `blue` - Info
- `lightgrey` - Neutral

### Styles

Different badge styles available:
- `flat` (default)
- `flat-square`
- `plastic`
- `for-the-badge`
- `social`

Example:
```markdown
![Badge](https://img.shields.io/badge/Label-Value-blue?style=for-the-badge)
```

## Best Practices

1. **Keep It Simple**: Don't overload pages with too many badges
2. **Meaningful Information**: Only show badges that provide value
3. **Update Regularly**: Ensure badges reflect current status
4. **Consistent Placement**: Put badges in predictable locations
5. **Accessibility**: Always include alt text for badges

## Maintenance

### Updating Badges
- Static badges: Update URLs manually
- Dynamic badges: Maintain API endpoints
- GitHub Actions badges: Update workflow names if changed

### Monitoring
- Regularly verify badges are displaying correctly
- Check for broken badge URLs
- Ensure automated updates are functioning

## Resources

- [Shields.io Documentation](https://shields.io/)
- [GitHub Badges Guide](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [Badge Style Gallery](https://shields.io/badges)

## Support

For issues with badges or widgets:
1. Check the badge URL is correct
2. Verify API endpoints are accessible (for dynamic badges)
3. Review GitHub Actions logs (for automated badges)
4. Open an issue if problems persist

Last updated: 2025-11-22
