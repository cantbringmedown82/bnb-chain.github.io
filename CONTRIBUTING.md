# Contributing to BNB Chain Documentation

Thank you for your interest in contributing to BNB Chain documentation! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Python 3.x installed
- Git installed
- A GitHub account
- Basic knowledge of Markdown

### Setup

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/bnb-chain.github.io.git
   cd bnb-chain.github.io
   ```

3. **Install dependencies**
   ```bash
   pip install mkdocs-material mkdocs-video mkdocs-redirects
   ```

4. **Run locally**
   ```bash
   mkdocs serve
   # Visit http://localhost:8000
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Documentation Improvements**
   - Fix typos and grammatical errors
   - Improve clarity and readability
   - Add missing information
   - Update outdated content

2. **New Content**
   - Tutorials and guides
   - Code examples
   - FAQ entries
   - Best practices

3. **Technical Contributions**
   - Fix broken links
   - Improve site structure
   - Enhance search functionality
   - Optimize performance

4. **Translation**
   - Translate documentation to other languages
   - Review and improve existing translations

5. **Community Support**
   - Answer questions in issues
   - Help other contributors
   - Review pull requests

### Finding Something to Work On

- Browse [open issues](https://github.com/bnb-chain/bnb-chain.github.io/issues)
- Look for `good first issue` or `help wanted` labels
- Check the [project board](https://github.com/bnb-chain/bnb-chain.github.io/projects) for planned work
- Propose new ideas by opening an issue

## Documentation Standards

### Style Guide

Please follow our [Style Guide](docs/style-guide.md) for consistency:

- Use American English spelling
- Write in second person ("you can do...")
- Use active voice
- Keep sentences short and clear
- Include code examples where helpful

### File Organization

```
docs/
├── topic/
│   ├── overview.md
│   ├── getting-started.md
│   └── advanced.md
└── index.md
```

### Markdown Guidelines

- Use ATX-style headers (`#`, `##`, `###`)
- Use fenced code blocks with language specification
- Add alt text to images
- Use relative links for internal navigation
- Follow the template structure when creating new pages

### Code Examples

- Test all code examples before submitting
- Include necessary context and setup
- Add comments to explain complex parts
- Show expected output when relevant

Example:
````markdown
To deploy a smart contract:

```javascript
// Deploy contract
const contract = await Contract.deploy();
await contract.deployed();
console.log("Contract deployed to:", contract.address);
```
````

## Pull Request Process

### Before You Submit

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the style guide
   - Test locally with `mkdocs serve`
   - Verify all links work

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```
   
   Write clear commit messages:
   - Use present tense ("Add feature" not "Added feature")
   - Keep first line under 50 characters
   - Add detailed explanation if needed

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting a Pull Request

1. **Create the PR**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template

2. **PR Title**
   - Be descriptive and concise
   - Use format: `[Category] Brief description`
   - Example: `[Docs] Add staking tutorial`

3. **PR Description**
   - Explain what changes you made and why
   - Link related issues
   - Include screenshots for UI changes
   - List any breaking changes

4. **Review Process**
   - Maintainers will review your PR
   - Address feedback and make requested changes
   - Push additional commits to the same branch
   - Re-request review when ready

5. **After Approval**
   - Maintainer will merge your PR
   - Delete your branch
   - Pull latest changes to your local repo

### PR Checklist

- [ ] Changes follow the style guide
- [ ] Documentation builds without errors
- [ ] All links are working
- [ ] Code examples are tested
- [ ] Commit messages are clear
- [ ] PR description is complete
- [ ] Related issues are linked

## Documentation Build

### Local Testing

Always test your changes locally:

```bash
# Serve with live reload
mkdocs serve

# Build static site
mkdocs build

# Check for broken links
mkdocs build --strict
```

### CI/CD

- Pull requests trigger automated builds
- All checks must pass before merge
- Build status shown in PR

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code and documentation contributions
- **Discussions**: General questions and ideas
- **Governance Meetings**: Weekly on Fridays at 14:00 UTC

### Getting Help

- Read the [Onboarding Quick Guide](docs/onboarding-quick-guide.md)
- Check existing [documentation](https://docs.bnbchain.org)
- Search [closed issues](https://github.com/bnb-chain/bnb-chain.github.io/issues?q=is%3Aissue+is%3Aclosed)
- Ask in GitHub Discussions
- Attend governance meetings

### Recognition

Contributors are recognized in several ways:
- Listed in release notes
- Mentioned in monthly updates
- Added to contributors list
- Considered for maintainer role

## Governance

This project follows a transparent governance model. See [GOVERNANCE.md](GOVERNANCE.md) for details on:
- Decision-making processes
- Roles and responsibilities
- Meeting schedules
- Conflict resolution

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

If you have questions not covered here:
- Open an issue with the `question` label
- Attend a governance meeting
- Reach out to maintainers

## Thank You!

Your contributions help make BNB Chain documentation better for everyone. We appreciate your time and effort!

---

*Last Updated: 2025-11-22*
