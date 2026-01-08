# 🤝 Contributing to Fitness Duel

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/fitness-duel.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit: `git commit -m "Add: your feature description"`
6. Push: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

See [QUICK_START.md](QUICK_START.md) for setup instructions.

## Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Add types for all parameters and return values
- Avoid `any` type

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with 'I' prefix (optional)
- **Components**: PascalCase

### Code Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters

## Commit Messages

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Add tests
- `chore`: Maintenance

**Examples:**
```
feat(web): add video recording feature
fix(backend): resolve matchmaking timeout
docs(readme): update installation steps
```

## Pull Request Guidelines

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why
3. **Testing**: Describe how you tested
4. **Screenshots**: Add for UI changes
5. **Breaking Changes**: Document any breaking changes

## Testing

### Backend
```bash
cd apps/backend
npm test
```

### Web
```bash
cd apps/web
npm test
```

### Mobile
```bash
cd apps/mobile
npm test
```

## Areas for Contribution

### 🐛 Bug Fixes
- Fix WebRTC connection issues
- Resolve matchmaking edge cases
- Handle disconnection scenarios

### ✨ Features
- AI rep counter
- Match replay system
- Friend system
- Achievements
- Leaderboards

### 📚 Documentation
- Improve README files
- Add code comments
- Create tutorials
- Write API docs

### 🎨 Design
- Improve UI/UX
- Add animations
- Create icons
- Design new themes

### 🧪 Testing
- Write unit tests
- Add integration tests
- Test on different devices
- Performance testing

### ♿ Accessibility
- Add ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode

### 🌍 Internationalization
- Add translations
- Support RTL languages
- Localize content

## Code Review Process

1. All PRs require at least one review
2. Address all review comments
3. Keep PRs focused and small
4. Update tests as needed
5. Ensure CI/CD passes

## Community Guidelines

- Be respectful and inclusive
- Help others learn
- Give constructive feedback
- Follow the code of conduct

## Questions?

- Open an issue for bugs
- Start a discussion for features
- Join our Discord (coming soon)
- Email: dev@fitnessduel.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Fitness Duel better! 💪**
