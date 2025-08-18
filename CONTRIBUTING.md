# Contributing to Svelte Dynamic Forms

Thank you for your interest in contributing to Svelte Dynamic Forms! This document provides guidelines and information for contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `master`
4. **Make your changes**
5. **Test your changes**
6. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/svelte-dynamic-forms.git
cd svelte-dynamic-forms

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build the package
npm run build
```

## Code Style

- Use **Prettier** for code formatting (run `npm run format`)
- Use **ESLint** for code linting (run `npm run lint`)
- Follow existing code patterns and conventions
- Write clear, descriptive commit messages

## Making Changes

### Before You Start

For **major changes**, please open an issue first to discuss:
- New features
- Breaking changes
- Architectural changes
- API modifications

### Development Process

1. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following these guidelines:
   - Keep changes focused and atomic
   - Add tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass

3. **Test your changes**:
   ```bash
   npm run test
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new validation feature"
   ```

### Commit Message Convention

We use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding/updating tests
- `chore:` maintenance tasks

## Types of Contributions

### Bug Reports
- Use the bug report template
- Include minimal reproduction case
- Provide environment details
- Check if issue already exists

### Feature Requests
- Use the feature request template
- Explain the use case clearly
- Consider implementation complexity
- Discuss alternatives

### Code Contributions
- Follow the development process above
- Add tests for new features
- Update documentation
- Ensure backward compatibility (unless breaking change is necessary)

### Documentation
- Fix typos and unclear explanations
- Add examples and use cases
- Improve API documentation
- Update README if needed

## Pull Request Process

1. **Fill out the PR template** completely
2. **Link related issues** using "Fixes #123"
3. **Ensure all checks pass**:
   - Tests pass
   - Linting passes
   - Build succeeds
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Maintain clean commit history**

### Review Process

- PRs require approval from maintainers
- We'll review within 3-5 business days
- Be responsive to feedback
- Keep discussions respectful and constructive

## Testing

- Write tests for new features
- Ensure existing tests still pass
- Test with different Svelte versions if applicable
- Include edge cases in testing

## Documentation

When contributing code that affects the public API:

1. **Update the README** if needed
2. **Add JSDoc comments** to new functions/components
3. **Update TypeScript definitions**
4. **Add examples** for new features

## Release Process

Releases are handled by maintainers:
- Version bumping follows semantic versioning
- Changelog is updated for each release
- NPM publishing is automated

## Community

- Be respectful and inclusive
- Help others in issues and discussions
- Share knowledge and best practices
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Start a discussion in the repository
- Review existing issues and documentation

Thank you for contributing! 🎉
