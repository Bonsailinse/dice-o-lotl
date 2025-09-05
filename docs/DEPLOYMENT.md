# Deployment & Release Workflow

This document defines the standard workflow for pushing changes to GitHub and creating releases.

## 🚀 Standard Deployment Process

When you intend to push changes to GitHub, **ALWAYS** follow this complete workflow:

### 1. � Pre-commit Quality Checks

**MANDATORY**: Run these commands before EVERY commit to ensure code quality:

```bash
# 1. Format code with Prettier
npm run format

# 2. Check code quality with ESLint
npm run lint

# 3. Run all unit tests
npm test

# 4. Verify TypeScript compilation
npm run build

# 5. Test database connectivity (if database changes)
npm run test:db

# 6. Run full CI test suite
npm run test:ci
```

#### Quick Pre-commit Script

For convenience, you can run this one-liner before every commit:

```bash
npm run format && npm run lint && npm test && npm run build && npm run test:db && npm run test:ci
```

**⚠️ IMPORTANT**: If ANY of these commands fail, DO NOT commit. Fix the issues first.

#### What Each Command Checks

- **`npm run format`**: Applies consistent code formatting with Prettier
- **`npm run lint`**: Checks for code quality issues, unused imports, and style violations
- **`npm test`**: Runs all unit tests to ensure functionality
- **`npm run build`**: Verifies TypeScript compilation without errors
- **`npm run test:db`**: Tests database connectivity and operations
- **`npm run test:ci`**: Runs comprehensive CI test suite

### 2. �📊 Version Management

- **Determine version type** based on changes:
    - **MAJOR** (x.0.0): Breaking changes, major new features
    - **MINOR** (x.y.0): New features, enhancements (backward compatible)
    - **PATCH** (x.y.z): Bug fixes, hotfixes, small improvements

- **Update version in `package.json`**:
    ```json
    "version": "x.y.z"
    ```

### 3. 📝 Documentation Updates

#### Update CHANGELOG.md

- Add new section for the version
- List all changes under appropriate categories:
    - **Added**: New features
    - **Changed**: Changes in existing functionality
    - **Deprecated**: Soon-to-be removed features
    - **Removed**: Removed features
    - **Fixed**: Bug fixes
    - **Security**: Security improvements

#### Update README.md

- Update the "Recent Changes" or "What's New" paragraph
- Ensure it reflects the latest improvements
- Keep it concise but informative

### 4. 🏷️ Git Operations

#### Commit Changes

Use conventional commit format with version in parentheses:

```bash
git add .
git commit -m "feat: add database integration and user sync (v1.3.0)"
git commit -m "fix: resolve sync errors in user service (v1.2.1)"
git commit -m "feat!: breaking API changes for new auth system (v2.0.0)"
```

**Conventional Commit Types:**

- `feat:` - New features (minor version)
- `fix:` - Bug fixes (patch version)
- `feat!:` - Breaking changes (major version)
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

#### Create Tags (Conditional)

- **MAJOR releases**: Create annotated tag
- **MINOR releases**: Create annotated tag
- **PATCH releases**: No tag (hotfixes don't need tags)

For MAJOR/MINOR versions:

```bash
git tag -a v{version} -m "Release v{version}: {description}"
```

#### Push Everything

```bash
git push origin main
git push origin --tags  # Only if tags were created
```

## 🎯 Version Decision Matrix

| Change Type          | Version Bump | Tag Required | Commit Type | Examples                                |
| -------------------- | ------------ | ------------ | ----------- | --------------------------------------- |
| Breaking API changes | MAJOR        | ✅           | `feat!:`    | Complete rewrites, incompatible changes |
| New features         | MINOR        | ✅           | `feat:`     | New commands, database integration      |
| Bug fixes            | PATCH        | ❌           | `fix:`      | Error fixes, small improvements         |
| Documentation only   | PATCH        | ❌           | `docs:`     | README updates, comment fixes           |

## 📋 Pre-deployment Checklist

Before starting the deployment process, ensure you have completed step 1 (Pre-commit Quality Checks) and verify:

- [ ] All pre-commit checks passing (format, lint, test, build, test:db, test:ci)
- [ ] Database migrations tested (if applicable)
- [ ] Breaking changes documented
- [ ] Dependencies updated if needed

## 🔄 Workflow Summary

1. **Run pre-commit checks** → `npm run format && npm run lint && npm test && npm run build && npm run test:db && npm run test:ci`
2. **Analyze changes** → Determine version type
3. **Update package.json** → Bump version number
4. **Update CHANGELOG.md** → Document all changes
5. **Update README.md** → Refresh recent changes section
6. **Commit all changes** → Single commit with version
7. **Create tag** → Only for MAJOR/MINOR
8. **Push everything** → Code + tags to GitHub

## 🎪 Example Scenarios

### New Feature (MINOR bump):

- Version: 1.2.0 → 1.3.0
- Commit: `feat: add database integration and user sync (v1.3.0)`
- Tag: v1.3.0
- Changelog: New features section
- README: Update recent changes

### Bug Fix (PATCH bump):

- Version: 1.2.0 → 1.2.1
- Commit: `fix: resolve sync errors in user service (v1.2.1)`
- Tag: None
- Changelog: Fixed section
- README: Brief mention of fixes

### Breaking Change (MAJOR bump):

- Version: 1.2.0 → 2.0.0
- Commit: `feat!: breaking API changes for new auth system (v2.0.0)`
- Tag: v2.0.0
- Changelog: Detailed breaking changes
- README: Migration guide if needed

---

**⚠️ IMPORTANT**: This workflow must be followed for EVERY GitHub push request unless explicitly told otherwise.
