# Robust JS/TS Monorepo

A reference implementation for building production-ready JavaScript/TypeScript monorepos using Yarn workspaces, Nx, and Changesets. This repository demonstrates best practices for dependency management, build orchestration, versioning, and automated releases in a multi-package codebase.

## Table of Contents

- [Introduction](#introduction)
- [Motivation](#motivation)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Repository Structure](#repository-structure)
- [Usage](#usage)
- [Workflows](#workflows)
- [Best Practices](#best-practices)
- [Scripts Reference](#scripts-reference)
- [CI/CD](#cicd)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This monorepo demonstrates how to combine three powerful tools to create a maintainable and scalable codebase:

- **Yarn (v4)**: Modern package manager with workspaces support and constraints enforcement
- **Nx**: Build system with intelligent task orchestration and caching
- **Changesets**: Version management and changelog generation for coordinated releases

The result is a development environment that supports multiple packages with proper dependency management, optimized builds, and automated release workflows.

## Motivation

Managing multiple related packages in a single repository introduces several challenges:

1. **Dependency Consistency**: Ensuring all packages use compatible versions of shared dependencies
2. **Build Efficiency**: Avoiding unnecessary rebuilds when only specific packages change
3. **Version Management**: Coordinating version bumps across interdependent packages
4. **Release Coordination**: Publishing multiple packages in the correct order
5. **Circular Dependencies**: Detecting and preventing dependency cycles
6. **Code Quality**: Running linting and type-checking only on affected code

This repository addresses these challenges with a combination of tooling and conventions.

## Architecture

The monorepo uses a layered architecture with clear separation of concerns:

```
apps/          # Deployable applications (private packages)
├── client/    # Frontend applications
└── server/    # Backend services

features/      # Feature-specific code (public packages)
├── client/    # UI components and features
└── server/    # Backend features and handlers

libs/          # Shared libraries (public packages)
└── validator/ # Shared validation logic
```

### Dependency Rules

- **Apps** can depend on features and libs
- **Features** can depend on libs
- **Libs** should have minimal external dependencies
- No circular dependencies are allowed (enforced via script)

## Key Features

### 1. Yarn Constraints

Constraints defined in [yarn.config.cjs](yarn.config.cjs) automatically enforce:

- Consistent Node.js version across all packages
- Consistent package manager version
- Unified dependency versions (latest version wins)

Run `yarn constraints` to check violations or `yarn constraints --fix` to automatically fix them.

### 2. Nx Task Orchestration

Nx configuration in [nx.json](nx.json) provides:

- **Task Dependencies**: Ensures dependencies are built before dependents
- **Affected Commands**: Runs tasks only for packages affected by changes
- **Caching**: Skips tasks when inputs haven't changed
- **Parallel Execution**: Runs independent tasks concurrently

### 3. Changesets Workflow

Changesets configuration in [.changeset/config.json](.changeset/config.json) enables:

- Explicit version bump declarations
- Automatic changelog generation
- Coordinated multi-package releases
- Separation between version bumps and publishing

### 4. Circular Dependency Detection

Custom script ([scripts/check-circulardeps.mjs](scripts/check-circulardeps.mjs)) uses Nx's dependency graph to detect cycles:

```javascript
// Generates Nx graph and performs depth-first search to find cycles
nx graph --file=nx-graph.json
```

### 5. Selective Publishing

Custom script ([scripts/print-unpublished-packages.mjs](scripts/print-unpublished-packages.mjs)) identifies packages that need publishing:

- Compares local package versions with npm registry
- Returns only packages with unpublished versions
- Used in CI to optimize build and publish steps

## Prerequisites

- Node.js 20.18.1 (specified in [.node-version](.node-version))
- Yarn 4.7.0 (managed via Corepack)

## Setup

1. **Clone the repository**:

```bash
git clone <repository-url>
cd robust-monorepo-yarn-nx-changesets
```

2. **Enable Corepack** (manages Yarn version automatically):

```bash
corepack enable
```

3. **Install dependencies**:

```bash
yarn install
```

4. **Verify setup**:

```bash
# Check constraints
yarn constraints

# Check for circular dependencies
yarn check-circulardeps:all

# Run type checking
yarn typecheck:all
```

## Repository Structure

```
.
├── .changeset/              # Changeset configuration and pending changes
├── .github/workflows/       # CI/CD workflow definitions
├── apps/                    # Application packages (private)
│   ├── client/auth-app/     # Authentication frontend app
│   └── server/auth-api/     # Authentication backend API
├── features/                # Feature packages (public)
│   ├── client/sign-in-form/ # Sign-in UI component
│   └── server/sign-in-handler/ # Sign-in backend handler
├── libs/                    # Shared libraries (public)
│   └── validator/           # Validation utilities
├── scripts/                 # Build and release scripts
├── .node-version            # Node.js version specification
├── nx.json                  # Nx configuration
├── package.json             # Root package configuration
├── yarn.config.cjs          # Yarn constraints
└── yarn.lock                # Locked dependency versions
```

## Usage

### Development

**Run type checking**:

```bash
# All packages
yarn typecheck:all

# Only affected packages (compares against main branch)
yarn typecheck:affected
```

**Run linting**:

```bash
# All packages
yarn lint:all

# Only affected packages
yarn lint:affected
```

**Run both type checking and linting**:

```bash
# All packages
yarn quality:all

# Only affected packages
yarn quality:affected
```

### Building

**Build all packages**:

```bash
yarn build:all
```

**Build only affected packages**:

```bash
# Compares against main branch by default
yarn build:affected

# Compare against specific base
BASE=origin/develop yarn build:affected
```

**Build only unpublished packages**:

```bash
yarn build:unpublished
```

### Version Management

**Create a changeset** (declare intended version bump):

```bash
yarn changeset
```

This opens an interactive prompt:

1. Select which packages have changes
2. Choose bump type (major, minor, patch)
3. Write a summary of changes

The changeset is saved in `.changeset/` as a markdown file.

**Apply changesets** (bump versions and update changelogs):

```bash
yarn changeset version
```

This:
- Updates package.json versions
- Updates CHANGELOG.md files
- Deletes applied changesets
- Updates dependent package versions

**Publish packages**:

```bash
yarn release
```

This:
- Builds unpublished packages
- Publishes to npm registry

### Dependency Management

**Check constraints**:

```bash
yarn constraints
```

**Fix constraint violations**:

```bash
yarn constraints --fix
```

**Check for circular dependencies**:

```bash
yarn check-circulardeps:all
```

## Workflows

### Adding a New Package

1. Create package directory in appropriate location (`apps/`, `features/`, or `libs/`)
2. Add `package.json` with required fields:
   - `name`: Must follow `@robust-monorepo-yarn-nx-changesets/<package-name>` convention
   - `version`: Start at `0.0.1`
   - `private`: `true` for apps, omit for publishable packages
   - `engines.node`: Will be set automatically by constraints
   - `packageManager`: Will be set automatically by constraints

3. Add build and typecheck scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

4. Run constraints to ensure consistency:

```bash
yarn constraints --fix
```

### Making Changes and Releasing

1. **Make code changes** in one or more packages

2. **Create a changeset**:

```bash
yarn changeset
```

3. **Commit changes** including the changeset file:

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

4. **Open a pull request** to main branch

5. **CI checks run automatically**:
   - Constraint validation
   - Circular dependency detection
   - Type checking and linting (affected packages only)
   - Version change prevention (manual version bumps are blocked)

6. **After merge**, the release workflow:
   - Creates a "Version Packages" PR with version bumps and changelog updates
   - OR publishes packages if a version PR is merged

### Release Process

The release process is automated via GitHub Actions:

1. **Merge feature branches** with changesets to main
2. **Automated PR created** titled "chore: publish new release" with:
   - Version bumps for changed packages
   - Updated CHANGELOG.md files
   - Updated dependencies in dependent packages
3. **Review and merge** the release PR
4. **Packages automatically published** to npm
5. **Apps rebuilt and deployed** if they depend on published packages

## Best Practices

### 1. Use Affected Commands in CI

Always use affected commands in CI to reduce build times:

```yaml
- run: BASE=origin/${{ github.event.pull_request.base.ref }} yarn quality:affected
```

This only checks packages affected by the PR changes.

### 2. Enforce Constraints

Run `yarn constraints` in CI to catch version inconsistencies:

```yaml
- run: yarn constraints
```

Never commit constraint violations to main branch.

### 3. Prevent Manual Version Bumps

Use the provided GitHub Action ([.github/workflows/quality.yaml](.github/workflows/quality.yaml#L13-L60)) to block PRs that manually change package versions. All version changes must go through changesets.

### 4. Check Circular Dependencies

Run the circular dependency check in CI:

```yaml
- run: yarn check-circulardeps:all
```

Circular dependencies cause issues with build order and can lead to runtime errors.

### 5. Build Before Publishing

The release script builds unpublished packages before publishing:

```bash
yarn build:unpublished && yarn changeset publish
```

This ensures only necessary builds run and all published packages include compiled code.

### 6. Use Workspace Protocol for Internal Dependencies

Reference other monorepo packages using workspace protocol:

```json
{
  "dependencies": {
    "@robust-monorepo-yarn-nx-changesets/validator": "0.0.3"
  }
}
```

Yarn automatically resolves these to local packages during development.

### 7. Cache Nx Results

Nx caches task results based on inputs. This is configured in [nx.json](nx.json):

```json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "outputs": ["{projectRoot}/dist"]
    }
  }
}
```

Commit the `.nx` directory for remote caching (optional).

### 8. Set Up Task Dependencies

Ensure tasks run in the correct order:

```json
{
  "targetDefaults": {
    "typecheck": {
      "dependsOn": ["^build", "^typecheck"]
    }
  }
}
```

This means typecheck runs after all dependencies are built and type-checked.

## Scripts Reference

### Root Package Scripts

| Script | Description |
|--------|-------------|
| `build:all` | Build all packages in the monorepo |
| `build:affected` | Build only packages affected by changes (compares against main) |
| `build:unpublished` | Build only packages not yet published to npm |
| `typecheck:all` | Type-check all packages |
| `typecheck:affected` | Type-check only affected packages |
| `lint:all` | Lint all packages |
| `lint:affected` | Lint only affected packages |
| `quality:all` | Run typecheck and lint on all packages |
| `quality:affected` | Run typecheck and lint on affected packages |
| `check-circulardeps:all` | Check for circular dependencies using Nx graph |
| `release` | Build unpublished packages and publish to npm |

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE` | Base branch/commit for affected commands | `origin/main` |
| `HEAD` | Head branch/commit for affected commands | `HEAD` |

Example:

```bash
BASE=origin/develop HEAD=feature-branch yarn build:affected
```

## CI/CD

### Quality Workflow

Runs on pull requests to main ([.github/workflows/quality.yaml](.github/workflows/quality.yaml)):

1. **Disable manual version changes**: Fails if package.json versions are manually changed
2. **Check quality**:
   - Enable Corepack
   - Install dependencies with `yarn --immutable`
   - Run `yarn constraints`
   - Run `yarn check-circulardeps:all`
   - Run `yarn quality:affected` (only affected packages)

### Release Workflow

Runs on push to main ([.github/workflows/release.yaml](.github/workflows/release.yaml)):

1. **Release libs and features**:
   - Install dependencies
   - Build affected packages
   - Run `changesets/action` which:
     - Creates version PR if changesets exist
     - OR publishes packages if version PR is merged
2. **Release apps** (separate workflow):
   - Rebuilds and redeploys apps that depend on published packages

### Required Secrets

Set these in GitHub repository settings:

- `NPM_TOKEN`: npm authentication token with publish permissions
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
