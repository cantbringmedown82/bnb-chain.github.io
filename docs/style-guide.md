# Style Guide

This style guide ensures consistency across all BNB Chain documentation and governance materials.

## General Principles

1. **Clarity First**: Write in clear, simple language
2. **Be Concise**: Respect the reader's time
3. **Stay Accurate**: Verify all technical details
4. **Be Inclusive**: Use inclusive language and examples
5. **Maintain Consistency**: Follow established patterns

## Writing Style

### Voice and Tone
- Use active voice: "The validator processes transactions" (not "Transactions are processed by the validator")
- Be direct and professional
- Avoid jargon when possible; explain when necessary
- Write in second person for instructions: "You can deploy..." (not "One can deploy...")

### Grammar and Mechanics
- Use American English spelling
- Use sentence case for headings
- Place punctuation inside quotation marks
- Use the Oxford comma in lists

## Formatting

### Headings
```markdown
# Page Title (H1) - Only one per page

## Main Section (H2)

### Subsection (H3)

#### Minor Section (H4)
```

### Lists

**Unordered Lists**
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

**Ordered Lists**
```markdown
1. First step
2. Second step
3. Third step
```

**Task Lists**
```markdown
- [x] Completed task
- [ ] Pending task
```

### Code

**Inline Code**
Use backticks for: commands, file names, variable names, and short code snippets.
```markdown
Run `mkdocs serve` to start the server.
```

**Code Blocks**
Use fenced code blocks with language specification:
```markdown
​```javascript
const example = "code";
console.log(example);
​```
```

### Links

**Internal Links**
```markdown
See the [Meeting Log Template](meeting-log-template.md) for details.
```

**External Links**
```markdown
Visit [BNB Chain](https://www.bnbchain.org) for more information.
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
```

### Images

```markdown
![Alt text describing the image](path/to/image.png)
```

### Emphasis

- **Bold** for strong emphasis: `**important**`
- *Italic* for mild emphasis: `*note*`
- `Code` for technical terms: `` `variable` ``

## Technical Documentation

### Commands
- Show the full command with all necessary flags
- Include example output when helpful
- Explain what the command does before showing it

Example:
```markdown
To build the documentation site:
​```bash
mkdocs build
​```
This creates a `site/` directory with the built HTML files.
```

### File Paths
- Use absolute paths when clarity is needed
- Use relative paths for project files
- Always use forward slashes, even for Windows

### Version Numbers
- Use semantic versioning: `1.2.3`
- Specify version compatibility when relevant
- Keep documentation updated with latest versions

### Parameters and Options
- List required parameters first
- Mark optional parameters clearly
- Provide default values when applicable

Example:
```markdown
## Configuration Options

- `site_name` (required): The name of your documentation site
- `theme` (optional, default: `mkdocs`): The theme to use
- `docs_dir` (optional, default: `docs`): Source directory
```

## Meeting Logs

### File Naming
- Format: `YYYY-MM-DD-weekly-log.md`
- Example: `2025-11-22-weekly-log.md`
- Use hyphens, not underscores
- Always include full date

### Structure
- Follow the [Meeting Log Template](meeting-log-template.md) exactly
- Include all required sections
- Use consistent heading levels
- Keep summaries concise but complete

### Action Items
- Use task list format: `- [ ]` for pending, `- [x]` for complete
- Include assignee and due date
- Be specific and actionable

Example:
```markdown
- [x] Update documentation - Assignee: Jane Doe - Due: 2025-11-22
- [ ] Review pull requests - Assignee: John Smith - Due: 2025-11-29
```

## Governance Documents

### Transparency
- Document all decisions clearly
- Include rationale for major decisions
- Link to relevant discussions or issues
- Maintain chronological order

### Accessibility
- Use descriptive link text (not "click here")
- Provide text alternatives for images
- Structure content logically with headings
- Keep paragraphs short and focused

## Common Terms

### Capitalization
- BNB Chain (not "bnb chain" or "BNB chain")
- GitHub (not "Github")
- JavaScript (not "Javascript")
- TypeScript (not "Typescript")

### Abbreviations
- Spell out on first use: "Application Programming Interface (API)"
- Use abbreviation thereafter: "The API provides..."
- Don't use abbreviations in headings

## Review Checklist

Before submitting documentation:

- [ ] Spell check completed
- [ ] Links tested and working
- [ ] Code examples tested
- [ ] Headings follow hierarchy
- [ ] Consistent terminology used
- [ ] Images have alt text
- [ ] No placeholder text remains
- [ ] Formatting is consistent
- [ ] Grammar and punctuation correct

## Examples

### Good Example
```markdown
## Deploy to production

To deploy the documentation to production:

​```bash
mkdocs build
​```

This command builds the site into the `site/` directory. The build includes:
- Compiled HTML pages
- Optimized assets
- Search index

After building, deploy using GitHub Pages:

​```bash
mkdocs gh-deploy
​```
```

### Poor Example (Don't Do This)
```markdown
## Deployment

Just run mkdocs build and then deploy it.
```

## Updates to This Guide

This style guide is a living document. To propose changes:
1. Open an issue describing the proposed change
2. Discuss with the community
3. Submit a pull request if approved

Last updated: 2025-11-22
