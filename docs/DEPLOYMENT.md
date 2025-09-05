# Deployment & Release Workflow

This document defines the standard workflow for pushing changes to GitHub and creating releases.

## 🚀 Standard Deployment Process

When instructed to "push changes to GitHub" or similar, **ALWAYS** follow this complete workflow:

### 1. 📊 Version Management

- **Determine version type** based on changes:
    - **MAJOR** (x.0.0): Breaking changes, major new features
    - **MINOR** (x.y.0): New features, enhancements (backward compatible)
    - **PATCH** (x.y.z): Bug fixes, hotfixes, small improvements

- **Update version in `package.json`**:
    ```json
    "version": "x.y.z"
    ```

### 2. 📝 Documentation Updates

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

### 3. 🏷️ Git Operations

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

Before starting the deployment process:

- [ ] All tests passing
- [ ] No lint errors
- [ ] Database migrations tested (if applicable)
- [ ] Breaking changes documented
- [ ] Dependencies updated if needed

## 🔄 Workflow Summary

1. **Analyze changes** → Determine version type
2. **Update package.json** → Bump version number
3. **Update CHANGELOG.md** → Document all changes
4. **Update README.md** → Refresh recent changes section
5. **Commit all changes** → Single commit with version
6. **Create tag** → Only for MAJOR/MINOR
7. **Push everything** → Code + tags to GitHub

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
