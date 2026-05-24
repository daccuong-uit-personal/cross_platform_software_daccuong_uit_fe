# Skill: Frontend Architecture & Workspace Organization

**Agent Owner:** Frontend Architect Agent  
**Last Updated:** May 2026  
**Priority:** Critical for codebase governance

---

## Overview

This skill defines the architectural patterns, workspace organization, and import boundaries that ensure a scalable, maintainable monorepo. All code contributions must respect these architectural decisions.

## Core Principles

1. **Clear Separation of Concerns**: Apps → Features → Domain → Core/UI
2. **Strict Import Boundaries**: Enforced by ESLint and Nx
3. **Lazy Loading by Default**: Features loaded on-demand via routing
4. **Type Safety**: Strict TypeScript, no `any`
5. **Independent Deployability**: Features can be built/tested independently

---

## Nx Monorepo Structure

### Library Types

```
@fe/core        (type:core)        → Core utilities, services, guards
@fe/domain-*    (type:domain)      → Business logic, models, services
@fe/features-*  (type:feature)     → User-facing features
@fe/ui          (type:ui)          → Reusable components
@fe/app-shell   (type:app)         → Main application
```

### Project Naming Convention

```
libs/{type}/{name}/
  ├── project.json
  ├── ng-package.json
  ├── tsconfig.json
  └── src/
      ├── index.ts              # Public API barrel export
      └── lib/                  # Implementation
```

Examples:
- `libs/core/` → Published as `@fe/core`
- `libs/domain/social/` → Published as `@fe/domain-social`
- `libs/features/home/` → Published as `@fe/features-home`
- `libs/ui/` → Published as `@fe/ui`

---

## Import Boundary Rules

### Dependency Graph

```
┌─────────────────────────────────┐
│  apps/app-shell (type:app)      │ Can import from: core, ui, features
├─────────────────────────────────┤
│  libs/features/* (type:feature) │ Can import from: core, ui, domain
├─────────────────────────────────┤
│  libs/domain/* (type:domain)    │ Can import from: core, ui
├──────────────────┬──────────────┤
│  libs/core       │  libs/ui     │ Isolated - import only from core
│  (type:core)     │  (type:ui)   │
└──────────────────┴──────────────┘
```

### ESLint Configuration

```javascript
// eslint.config.mjs
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      enforcedBoundaries: [
        {
          "sourceTag": "type:app",
          "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:core"]
        },
        {
          "sourceTag": "type:feature",
          "onlyDependOnLibsWithTags": ["type:ui", "type:domain", "type:core"]
        },
        {
          "sourceTag": "type:domain",
          "onlyDependOnLibsWithTags": ["type:ui", "type:core"]
        },
        {
          "sourceTag": "type:ui",
          "onlyDependOnLibsWithTags": ["type:core"]
        }
      ]
    }
  ]
}
```

### project.json Tagging Example

```json
{
  "name": "features-home",
  "projectType": "library",
  "sourceRoot": "libs/features/home/src",
  "tags": {
    "type": "feature",
    "scope": "home"
  }
}
```

---

## Module Structure

### Feature Module Layout

```
libs/features/{feature}/
├── src/
│   ├── index.ts                    # Public API
│   └── lib/
│       ├── lib.routes.ts           # Routes (exported in index.ts)
│       ├── {feature}.component.ts  # Main component
│       ├── data-access/            # State & services
│       │   ├── {feature}.facade.ts # State facade
│       │   └── {feature}.service.ts
│       └── components/             # Child components
│           ├── sub-1.component.ts
│           └── sub-2.component.ts
```

### Domain Module Layout

```
libs/domain/{domain}/
├── src/
│   ├── index.ts                    # Public API (models, services)
│   └── lib/
│       ├── models/
│       │   └── {domain}.model.ts   # Data models
│       └── services/
│           └── {domain}.service.ts # Business logic
```

### Core Module Layout

```
libs/core/
├── src/
│   ├── index.ts                    # Public API
│   └── lib/
│       ├── config/                 # Configuration
│       ├── guards/                 # Route guards
│       ├── interceptors/           # HTTP interceptors
│       ├── services/               # Core services
│       ├── models/                 # Shared models
│       └── design-system/          # Design tokens
```

---

## Public API Pattern (Barrel Exports)

### Exporting from Libraries

```typescript
// libs/domain/social/src/index.ts - Public API
export * from './lib/models/social.models';
export * from './lib/services/social-post.service';
export * from './lib/services/social-comment.service';
export * from './lib/services/social-user.service';

// NOT exported - internal only
// ❌ src/lib/services/internal-helper.service.ts
```

### Importing from Libraries

```typescript
// ✅ Correct - Import from public API
import { Post, Comment } from '@fe/domain-social';

// ❌ Incorrect - Direct path imports
import { Post } from '@fe/domain-social/src/lib/models/social.models';
```

---

## Lazy Loading Strategy

### Feature Route Configuration

```typescript
// apps/app-shell/src/app/routes/app.routes.ts
export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: AUTH_ROUTES,  // Eager load for auth
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => 
      import('@fe/features-home').then(m => m.HOME_ROUTES),  // Lazy load
  },
  {
    path: 'media',
    canActivate: [authGuard],
    loadChildren: () => 
      import('@fe/features-media').then(m => m.MEDIA_ROUTES),  // Lazy load
  },
];
```

### Route Definition in Features

```typescript
// libs/features/home/src/lib/lib.routes.ts
import { Route } from '@angular/router';
import { HomeShellComponent } from './components/home-shell/home-shell.component';

export const HOME_ROUTES: Route[] = [
  {
    path: '',
    component: HomeShellComponent,
    children: [
      {
        path: 'feed',
        component: FeedComponent,
      },
      {
        path: 'discover',
        component: DiscoverComponent,
      },
    ],
  },
];
```

---

## TypeScript Configuration

### Base Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "baseUrl": ".",
    "paths": {
      "@fe/core": ["libs/core/src/index.ts"],
      "@fe/domain-*": ["libs/domain/*/src/index.ts"],
      "@fe/features-*": ["libs/features/*/src/index.ts"],
      "@fe/ui": ["libs/ui/src/index.ts"]
    }
  }
}
```

---

## Build & Deployment

### Affected Builds

```bash
# Only rebuild changed libraries
npx nx affected -t build

# Build specific library
npx nx build core

# Build with dependencies
npx nx build home --with-deps
```

### Bundle Analysis

```bash
# Analyze bundle size
npx nx build app-shell --stats-json

# View interactive treemap
npm run analyze
```

---

## Code Quality Standards

### Linting

```bash
# Lint all
npx nx lint

# Lint specific project
npx nx lint core

# Fix auto-fixable issues
npx nx lint --fix
```

### Testing

```bash
# Test all
npx nx test

# Test specific project
npx nx test home

# Test with coverage
npx nx test --coverage
```

### Formatting

```bash
# Check formatting
npx nx format:check

# Format all files
npx nx format:write
```

---

## Performance Considerations

### Code Splitting

- Features are lazy-loaded by route
- Each feature is independently bundled
- Core is eagerly loaded with app shell
- UI components are shared across features

### Change Detection

- All components should use `OnPush` strategy
- Use `trackBy` in `*ngFor`
- Use Signals for UI state (automatic change detection)

### Memory Management

- Unsubscribe from observables (use `takeUntilDestroyed`)
- Avoid memory leaks in services
- Clean up timers and intervals

---

## CI/CD Integration

### Pipeline Stages

1. **Build**: Compile TypeScript
2. **Lint**: Check code style and boundaries
3. **Test**: Run unit tests with coverage
4. **Bundle**: Analyze bundle size
5. **Deploy**: Push to CDN/hosting

### Commands for CI

```bash
# In CI pipeline
npx nx affected -t build,lint,test
npx nx build app-shell --configuration=production
npm run analyze  # Bundle size check
```

---

## Best Practices

### ✅ DO

- Define public APIs via barrel exports (`index.ts`)
- Use feature scope tags in `project.json`
- Lazy-load features via routing
- Keep core minimal and focused
- Document public APIs with JSDoc
- Follow consistent naming conventions
- Use TypeScript strict mode
- Implement boundary checks in ESLint

### ❌ DON'T

- Import directly from `lib/` paths
- Create circular dependencies
- Violate layer boundaries
- Hardcode URLs or configurations
- Create global god stores
- Mix concerns in services
- Skip type checking
- Commit unbuilt code

---

## Architecture Decision Log

| Decision | Rationale | Date |
|----------|-----------|------|
| Angular 21 Signals | Native state management, better DX | May 2026 |
| Nx Monorepo | Scalability, code sharing, CI benefits | May 2026 |
| Strict boundaries | Maintainability, clear dependencies | May 2026 |
| Lazy loading by route | Performance, smaller initial bundle | May 2026 |
| Design tokens | Consistency, maintainability, theming | May 2026 |

---

## References

- [Project Structure](../architecture/nx-workspace.md)
- [Frontend Playbook](../ai-context/frontend-ai-playbook.md)
- [Nx Official Docs](https://nx.dev/docs)
- [Angular Style Guide](https://angular.io/guide/styleguide)
