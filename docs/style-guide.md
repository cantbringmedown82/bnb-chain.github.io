# Style Guide

This style guide provides standards for writing documentation for the BNB Chain project.

## General Principles

1. **Clarity**: Write clear, concise content
2. **Consistency**: Follow established patterns
3. **Accuracy**: Ensure technical accuracy
4. **Accessibility**: Make content accessible to all readers

## Document Structure

### Headers
- Use ATX-style headers (`#`, `##`, `###`)
- Only one H1 (`#`) per document (the title)
- Use sentence case for headers
- Leave one blank line before and after headers

### Lists
- Use `-` for unordered lists
- Use `1.` for ordered lists
- Indent nested lists by 2 spaces
- Add blank line before and after lists

### Code Blocks
- Use triple backticks with language identifier
- Indent code blocks properly
- Include comments for complex code
- Keep code examples concise

Example:
```python
# This is a Python example
def hello_world():
    print("Hello, World!")
```

### Links
- Use descriptive link text
- Prefer relative links for internal documents
- Verify all links work before committing

Format: `[Link Text](url)`

### Images
- Use descriptive alt text
- Keep images under 500KB when possible
- Store images in `docs/assets/`
- Use relative paths

Format: `![Alt text](path/to/image.png)`

## Writing Style

### Voice and Tone
- Use active voice
- Write in present tense
- Be concise and direct
- Use "you" for the reader

**Good**: "You can configure the settings by..."
**Bad**: "The settings can be configured by..."

### Technical Terms
- Define acronyms on first use
- Use consistent terminology
- Link to glossary when available

### Formatting

**Bold**: Use for UI elements, important terms
- Example: Click the **Save** button

*Italic*: Use for emphasis, publication titles
- Example: See the *BNB Chain Whitepaper*

`Code`: Use for code, commands, file names
- Example: Run `mkdocs serve`

## File Naming

- Use lowercase
- Use hyphens for spaces
- Be descriptive
- Include date for meeting logs (YYYY-MM-DD)

Examples:
- `getting-started.md`
- `api-reference.md`
- `2025-11-22-weekly-log.md`

## Markdown Best Practices

### Spacing
- One blank line between sections
- No trailing whitespace
- End files with a single newline

### Line Length
- Soft limit: 80 characters
- Hard limit: 120 characters
- Break long lines at natural points

### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
```

## Documentation Types

### Tutorials
- Step-by-step instructions
- Include prerequisites
- Provide expected outcomes
- Add troubleshooting section

### Reference
- Comprehensive coverage
- Organized logically
- Include examples
- Keep up-to-date

### Guides
- Task-oriented
- Explain why, not just how
- Link to related content
- Include best practices

## Review Checklist

Before submitting documentation:

- [ ] Spell check completed
- [ ] Links verified
- [ ] Code examples tested
- [ ] Images optimized
- [ ] Headers properly formatted
- [ ] Style guide followed
- [ ] Peer review completed

## Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [MkDocs Documentation](https://www.mkdocs.org/)
- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)

## Getting Help

- Ask in team channel
- Review existing documentation
- Consult with tech writers
- Refer to this style guide
