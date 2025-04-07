# Contributing to AccountKit SDK

Thanks for your interest in improving the AccountKit SDK! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `yarn install`
3. Make your changes
4. Test your changes: `yarn lint && yarn build`

## Pull Request Process

1. Make sure your code follows our style guide (enforced by ESLint and Prettier)
2. Update documentation if needed
3. Make sure all checks pass (lint, format, build)
4. Submit a PR with a clear description of the changes and why they're needed

## Coding Standards

- Code formatting is handled by Prettier
- Linting is handled by ESLint
- Write clear, readable code with good comments
- Maintain type safety (this is a TypeScript project)

## Commit Messages

Follow conventional commits format:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Updating build process, dependencies, etc.

## Releases

The project follows semantic versioning:

- Patch: Bug fixes (`yarn release:patch`)
- Minor: Backward-compatible features (`yarn release:minor`)
- Major: Breaking changes (`yarn release:major`)

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
