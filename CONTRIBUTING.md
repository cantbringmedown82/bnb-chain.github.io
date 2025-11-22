# Contributing to BNB Chain Documentation

Thank you for your interest in contributing to the BNB Chain documentation! This guide will help you get started.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Issues

Before creating an issue, please check if a similar issue already exists.

**Bug Reports**
- Use a clear, descriptive title
- Describe the expected vs. actual behavior
- Include steps to reproduce
- Add screenshots if applicable

**Feature Requests**
- Use a clear, descriptive title
- Explain the problem this feature would solve
- Describe the desired solution
- List any alternatives considered

### Improving Documentation

Documentation improvements are always welcome!

**Types of Contributions**
- Fix typos or grammatical errors
- Clarify confusing sections
- Add missing information
- Update outdated content
- Add examples or tutorials

### Pull Request Process

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then clone
   git clone https://github.com/YOUR_USERNAME/bnb-chain.github.io.git
   cd bnb-chain.github.io
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Branch naming conventions:
   - `feature/` - New features or content
   - `fix/` - Bug fixes
   - `docs/` - Documentation updates
   - `refactor/` - Code refactoring

3. **Make Your Changes**
   - Follow the [Style Guide](docs/style-guide.md)
   - Test your changes locally
   - Keep commits focused and atomic

4. **Test Locally**
   ```bash
   # Install dependencies
   pip install mkdocs-material mkdocs-video mkdocs-redirects
   
   # Run local server
   mkdocs serve
   
   # Build documentation
   mkdocs build
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```
   
   Commit message guidelines:
   - Use present tense ("Add feature" not "Added feature")
   - Keep first line under 50 characters
   - Add detailed description if needed

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template
   - Link related issues

### Pull Request Guidelines

**Required**
- [ ] Changes follow the [Style Guide](docs/style-guide.md)
- [ ] Documentation builds without errors
- [ ] All links work correctly
- [ ] Commit messages are clear
- [ ] PR description explains changes

**Nice to Have**
- Screenshots for visual changes
- Examples demonstrating changes
- Related issue linked

### Review Process

1. **Initial Review** (1-2 days)
   - Automated checks run
   - Core team member assigned

2. **Feedback** (2-3 days)
   - Reviewer provides feedback
   - Author addresses comments

3. **Approval** (1 day)
   - Required approvals obtained
   - All checks pass

4. **Merge**
   - PR merged by core team
   - Deployed automatically

## Development Setup

### Prerequisites

- Python 3.x
- Git
- Text editor or IDE

### Installation

```bash
# Clone the repository
git clone https://github.com/bnb-chain/bnb-chain.github.io.git
cd bnb-chain.github.io

# Install dependencies
pip install mkdocs-material
pip install mkdocs-video
pip install mkdocs-redirects

# Run development server
mkdocs serve
```

### Project Structure

```
bnb-chain.github.io/
├── .github/
│   └── workflows/        # CI/CD workflows
├── docs/
│   ├── meeting-logs/     # Meeting logs
│   ├── bnb-smart-chain/  # BSC documentation
│   ├── bnb-greenfield/   # Greenfield documentation
│   └── ...               # Other docs
├── mkdocs.yml            # MkDocs configuration
├── README.md
├── CONTRIBUTING.md       # This file
├── GOVERNANCE.md         # Governance process
└── CODE_OF_CONDUCT.md    # Code of conduct
```

## Style Guide

Please follow our [Style Guide](docs/style-guide.md) for:
- Markdown formatting
- Writing style
- Code examples
- File naming

## Questions?

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Open a GitHub Issue
- **Feature Requests**: Open a GitHub Issue with [Feature Request] label

## Recognition

Contributors are recognized in:
- Git commit history
- GitHub contributors page
- Release notes (for significant contributions)

## Additional Resources

- [Style Guide](docs/style-guide.md)
- [Governance](GOVERNANCE.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [MkDocs Documentation](https://www.mkdocs.org/)
- [Markdown Guide](https://www.markdownguide.org/)

---

Thank you for contributing to BNB Chain documentation! 🚀
