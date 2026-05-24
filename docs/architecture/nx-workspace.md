# Project Structure Documentation

## Overview

This document provides a comprehensive overview of the **Cross-Platform Social Commerce Creator Platform (Frontend)** project structure. It serves as the source of truth for understanding the codebase organization, following **Nx monorepo** conventions with clear separation between apps, libs, and domain-driven design.

**Last Updated:** May 2026  
**Project Type:** Angular 21 + Nx Monorepo  
**Build System:** Nx + Vite  
**Package Manager:** npm

---

## Directory Tree Structure

### Root Configuration Files

```
/
├── package.json                    # Root workspace dependencies
├── package-lock.json               # Dependency lock file
├── tsconfig.base.json              # Base TypeScript config
├── nx.json                         # Nx workspace config
├── jest.config.ts                  # Jest test configuration
├── jest.preset.js                  # Jest presets
├── eslint.config.mjs               # ESLint configuration
├── .prettierrc                      # Code formatter config
├── .prettierignore                 # Prettier ignore rules
├── .gitignore                      # Git ignore patterns
├── .cursorrules                    # Cursor AI rules
├── .windsurfrules                  # Windsurf AI rules
├── docker-compose.yml              # Docker composition for local dev
├── Dockerfile                      # Container image definition
├── nginx.conf                      # Nginx configuration for deployment
├── README.md                       # Project overview (entry point)
```

---

## Application Layer (`/apps`)

### App Shell (Main Application)
```
apps/
└── app-shell/                       # Main Angular application shell
    ├── project.json                 # Nx project config
    ├── tsconfig.json               
    ├── tsconfig.app.json           
    ├── tsconfig.spec.json          
    ├── eslint.config.mjs           
    ├── src/
    │   ├── main.ts                 # Application bootstrap
    │   ├── index.html              # Root HTML template
    │   ├── styles.css              # Global styles
    │   ├── app/
    │   │   ├── app.component.ts    # Root component
    │   │   ├── app.component.spec.ts
    │   │   ├── app.config.ts       # App configuration & providers
    │   │   ├── transloco-loader.ts # i18n loader
    │   │   ├── layout/             # Shell layout components
    │   │   │   ├── app-shell.component.ts
    │   │   │   ├── app-shell.component.html
    │   │   │   └── index.ts
    │   │   ├── routes/             # Route configuration
    │   │   │   ├── app.routes.ts   # Main route definitions
    │   │   │   └── index.ts
    │   │   └── assets/             # Local assets
    │   ├── environments/
    │   │   └── environment.ts       # Environment configuration
    │   └── assets/                 # Public assets (images, etc.)
    └── public/
        ├── favicon.ico             # Favicon
        ├── assets/
        │   ├── images/
        │   │   └── logo/
        │   │       └── reals-logo.svg
        │   └── i18n/               # Internationalization files
        │       ├── en.json         # English translations
        │       └── vi.json         # Vietnamese translations
```

**Purpose:** Main application entry point. Houses routing, layout, and i18n configuration.

---

## Library Layer (`/libs`)

### Core Library (`/libs/core`)
```
libs/
└── core/                            # Shared core utilities and services
    ├── project.json
    ├── ng-package.json
    ├── package.json
    ├── jest.config.cts
    ├── tsconfig.json
    ├── tsconfig.lib.json
    ├── tsconfig.spec.json
    ├── eslint.config.mjs
    ├── README.md
    ├── src/
    │   ├── index.ts                # Public API barrel export
    │   ├── test-setup.ts           # Test configuration
    │   └── lib/
    │       ├── config/             # Configuration management
    │       │   ├── app-config.ts
    │       │   ├── assets-config.ts
    │       │   ├── url-config.ts
    │       │   └── index.ts
    │       ├── design-system/      # Design tokens & theming
    │       │   ├── design-tokens.ts
    │       │   ├── ui-settings.service.ts
    │       │   └── shared-typography.css
    │       ├── guards/             # Route guards
    │       │   ├── auth.guard.ts
    │       │   └── guest.guard.ts
    │       ├── interceptors/       # HTTP interceptors
    │       │   ├── auth.interceptor.ts
    │       │   ├── error.interceptor.ts
    │       │   └── loading.interceptor.ts
    │       ├── models/             # Shared models & types
    │       │   └── error.model.ts
    │       ├── services/           # Core services
    │       │   ├── api.service.ts
    │       │   ├── auth.service.ts
    │       │   ├── cache.service.ts
    │       │   ├── error.service.ts
    │       │   ├── loading.service.ts
    │       │   └── theme.service.ts
    │       └── shared-typography/
    │           └── shared-typography.css
```

**Purpose:** Cross-cutting concerns - authentication, API communication, design tokens, guards, and core services.

---

### Domain Libraries (`/libs/domain`)

#### Media Domain
```
libs/
└── domain/
    └── media/                      # Media domain (photos, videos)
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── README.md
        └── src/
            ├── index.ts            # Public API
            └── lib/
                └── services/
                    └── media.service.ts
```

#### Profile Domain
```
    └── profile/                    # User profile domain
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── README.md
        └── src/
            ├── index.ts
            └── lib/
                └── services/
                    └── profile.service.ts
```

#### Social Domain
```
    └── social/                     # Social features (posts, comments, notifications)
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── README.md
        └── src/
            ├── index.ts
            ├── lib/
            │   ├── models/
            │   │   ├── index.ts
            │   │   └── social.models.ts    # Shared models (Post, Comment, User)
            │   ├── services/
            │   │   ├── index.ts
            │   │   ├── social-post.service.ts
            │   │   ├── social-comment.service.ts
            │   │   ├── social-notification.service.ts
            │   │   ├── social-user.service.ts
            │   │   └── social-search.service.ts
            │   ├── mocks/
            │   │   ├── index.ts
            │   │   └── mock-data.ts
            │   └── mock-data.ts
```

**Purpose:** Domain-specific business logic, models, and services. Each domain encapsulates a functional area.

---

### Feature Libraries (`/libs/features`)

#### Auth Feature
```
libs/
└── features/
    └── auth/                       # Authentication feature
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── jest.config.cts
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── tsconfig.spec.json
        ├── eslint.config.mjs
        ├── README.md
        └── src/
            ├── index.ts
            ├── test-setup.ts
            └── lib/
                ├── lib.routes.ts           # Feature routes
                ├── data-access/            # State management
                │   ├── index.ts
                │   └── auth.facade.ts
                ├── login/                  # Login feature
                │   └── components/
                │       ├── login-form-email.component.ts
                │       └── login-selection.component.ts
                ├── login.component.ts
                ├── register/               # Registration feature
                │   └── components/
                │       ├── register-form-email.component.ts
                │       └── register-selection.component.ts
                └── register.component.ts
```

#### Dashboard Feature
```
    └── dashboard/                  # Dashboard feature
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── jest.config.cts
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── tsconfig.spec.json
        ├── eslint.config.mjs
        ├── README.md
        └── src/
            ├── index.ts
            ├── test-setup.ts
            └── lib/
                ├── dashboard.component.ts
                ├── dashboard.component.css
                ├── dashboard.component.html
                └── lib.routes.ts
```

#### Home Feature
```
    └── home/                       # Home/Feed feature (main user interface)
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── jest.config.cts
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── tsconfig.spec.json
        ├── README.md
        └── src/
            ├── index.ts
            ├── test-setup.ts
            └── lib/
                ├── home.module.ts
                ├── home.routes.ts
                ├── lib.routes.ts
                ├── home/
                │   └── home.component.ts
                └── components/
                    ├── home-shell/
                    │   ├── home-shell.component.ts
                    │   ├── home-shell.component.html
                    │   └── home-shell.component.css
                    ├── feed/                   # Main feed display
                    │   ├── feed.component.ts
                    │   ├── feed.component.html
                    │   └── feed.component.css
                    ├── activity/               # Activity/notifications panel
                    │   ├── activity.component.ts
                    │   ├── activity.component.html
                    │   └── activity.component.css
                    ├── right-sidebar/          # Trending/suggestions sidebar
                    │   ├── right-sidebar.component.ts
                    │   ├── right-sidebar.component.html
                    │   └── right-sidebar.component.css
                    ├── discover/               # Discovery/explore page
                    │   ├── discover.component.ts
                    │   ├── discover.component.html
                    │   └── discover.component.css
                    ├── create/                 # Content creation interface
                    │   ├── create.component.ts
                    │   ├── create.component.html
                    │   └── create.component.css
                    ├── bottom-menu/            # Mobile bottom navigation
                    │   ├── bottom-menu.component.ts
                    │   ├── bottom-menu.component.html
                    │   └── bottom-menu.component.css
                    └── feature-placeholder/    # Placeholder for new features
                        ├── feature-placeholder.component.ts
                        ├── feature-placeholder.component.html
                        └── feature-placeholder.component.css
```

#### Media Feature
```
    └── media/                      # Media management feature
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── jest.config.cts
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── tsconfig.spec.json
        ├── README.md
        └── src/
            ├── index.ts
            ├── test-setup.ts
            └── lib/
                ├── lib.routes.ts
                ├── models/
                │   └── media.model.ts
                ├── services/
                │   └── media-api.service.ts
                ├── media/
                │   └── media-platform.component.ts
                └── media-studio/           # Content studio for creators
                    ├── media-studio.component.ts
                    ├── media-studio.component.html
                    └── media-studio.component.css
```

#### Profile Feature
```
    └── profile/                    # User profile feature
        ├── project.json
        ├── ng-package.json
        ├── package.json
        ├── jest.config.cts
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── tsconfig.spec.json
        ├── README.md
        └── src/
            ├── index.ts
            ├── test-setup.ts
            └── lib/
                ├── lib.routes.ts
                ├── profile.component.ts
                ├── profile.component.html
                └── profile.component.css
```

#### Settings Feature
```
    └── settings/                   # Settings/preferences feature
        ├── project.json
        ├── eslint.config.mjs
        ├── jest.config.cts
        ├── tsconfig.json
        ├── tsconfig.lib.json
        ├── tsconfig.spec.json
        ├── README.md
        └── src/
            ├── index.ts
            ├── test-setup.ts
            └── lib/
                ├── lib.routes.ts
                ├── settings.ts
                ├── settings.html
                ├── settings.css
                ├── settings.spec.ts
                └── ui-settings/
                    └── ui-settings.component.ts
```

#### Social Feature
```
    └── social/                     # Social interactions (posts, comments)
        └── src/
            └── lib/
                └── feed/
                    └── feed.component.ts   # Social feed display
```

**Purpose:** User-facing features implementing specific functionality. Each feature is independently deployable and testable.

---

### UI System Library (`/libs/ui`)

```
libs/
└── ui/                             # Shared UI components & design system
    ├── project.json
    ├── ng-package.json
    ├── package.json
    ├── eslint.config.mjs
    ├── tsconfig.json
    ├── tsconfig.lib.json
    ├── tsconfig.lib.prod.json
    ├── tsconfig.spec.json
    ├── README.md
    └── src/
        ├── index.ts                # Public API barrel export
        ├── lib/
        │   ├── button/             # Button components
        │   │   ├── button.ts
        │   │   └── action-button.ts
        │   ├── card/               # Card components
        │   │   └── card.ts
        │   ├── input/              # Input components
        │   │   └── input.ts
        │   ├── header/             # Header components
        │   │   └── app-header.component.ts
        │   ├── footer/             # Footer components
        │   │   ├── app-footer.component.ts
        │   │   └── auth-footer.component.ts
        │   ├── logo/               # Logo component
        │   │   └── logo.component.ts
        │   ├── layouts/            # Layout wrappers
        │   │   └── form-layout.component.ts
        │   ├── language-selector/  # Language switcher
        │   │   └── language-selector.ts
        │   ├── loader/             # Loading indicators
        │   │   ├── index.ts
        │   │   └── inline-loader.component.ts
        │   ├── skeleton/           # Skeleton loaders
        │   │   ├── index.ts
        │   │   ├── skeleton.component.ts
        │   │   ├── skeleton-card.component.ts
        │   │   └── skeleton-list.component.ts
        │   ├── directives/         # Custom directives
        │   │   ├── index.ts
        │   │   └── loading.directive.ts
        │   ├── components/
        │   │   ├── index.ts
        │   │   ├── shared-header/  # App header bar
        │   │   │   ├── shared-header.component.ts
        │   │   │   ├── shared-header.component.html
        │   │   │   └── shared-header.component.css
        │   │   ├── shared-table/   # Data table component
        │   │   │   ├── shared-table.component.ts
        │   │   │   ├── shared-table.component.html
        │   │   │   └── shared-table.component.css
        │   │   ├── sidebar-menu/   # Navigation sidebar
        │   │   │   ├── sidebar-menu.component.ts
        │   │   │   ├── sidebar-menu.component.html
        │   │   │   ├── sidebar-menu.component.css
        │   │   │   └── safe-html.pipe.ts
        │   │   └── social/         # Social feature components
        │   │       ├── index.ts
        │   │       ├── post-card/              # Post card display
        │   │       │   └── post-card.component.ts
        │   │       ├── user-card/             # User profile card
        │   │       │   └── user-card.component.ts
        │   │       ├── like-button/           # Like/heart button
        │   │       │   └── like-button.component.ts
        │   │       ├── comment-section/       # Comment display & input
        │   │       │   └── comment-section.component.ts
        │   │       └── follow-button/         # Follow button
        │   │           └── follow-button.component.ts
        │   └── styles/             # Global styles
        │       └── component-styles.ts
        └── ui.spec.ts              # Integration tests
```

**Purpose:** Reusable UI components following design system. Provides foundational building blocks for all features.

---

## Documentation Layer (`/docs`)

```
docs/
├── INDEX.md                        # Documentation hub (start here)
├── architecture/nx-workspace.md            # This file - comprehensive structure guide
├── development/coding-standards.md              # Quick lookup & common tasks
├── api/backend-contracts.md         # Backend API documentation
├── requirements/product-requirements.md             # Development roadmap & planning
├── ui-ux/                         # Design System documentation
│   ├── INDEX.md                    # Design system overview
│   ├── DESIGN_TOKENS.md            # Token documentation & reference
│   ├── DESIGN_SYSTEM_GUIDE.md      # Design system usage guide
│   ├── IMPLEMENTATION_SUMMARY.md   # Implementation details
│   └── design-tokens.json          # Machine-readable token configuration
├── ai-context/                             # AI Agent documentation
│   ├── AGENTS.md                   # Agent coordination hub
│   └── frontend-ai-playbook.md     # Development workflow & best practices
├── architecture/                   # Architecture & design decisions
│   ├── i18n-guidelines.md          # Internationalization standards
│   ├── media-feature.md            # Media feature specifications
│   └── auth-redirect-note.md       # Authentication flow notes
└── ai-context/                         # AI Skill definitions
    ├── INDEX.md                    # Skills index & lookup
    ├── frontend-architecture.md    # Frontend architecture skill
    ├── angular-component-generation.md      # Component generation skill
    ├── design-system-component-generation.md # Design system skill
    ├── api-integration.md                   # API integration skill
    ├── performance-qa.md                    # Performance & QA skill
    └── social-ux-intelligence.md            # Social UX skill
```

**Purpose:** Knowledge base for development standards, architecture decisions, and AI agent guidance.

---

## Cache & Temporary Files

```
/
├── .angular/                       # Angular CLI cache (generated)
├── .nx/                            # Nx workspace cache (generated)
├── node_modules/                   # Dependencies (excluded from repo)
└── tmp/                            # Temporary build outputs
    └── libs/                       # Pre-built library artifacts
        ├── core/
        ├── domain/
        ├── features/
        └── ui/
```

**Note:** These are generated directories and should not be committed to version control.

---

## Key Files & Configurations

### Package Management
- **`package.json`** - Root workspace dependencies and npm scripts
- **`nx.json`** - Nx configuration, task runners, and workspace plugins

### TypeScript & Build
- **`tsconfig.base.json`** - Base TypeScript configuration used by all libs
- **`jest.config.ts`** - Root Jest test configuration
- **`eslint.config.mjs`** - Root ESLint configuration

### Code Quality
- **`.prettierrc`** - Code formatting rules
- **`.gitignore`** - Git ignore patterns

### Deployment
- **`Dockerfile`** - Container image for production deployment
- **`docker-compose.yml`** - Local development Docker setup
- **`nginx.conf`** - Nginx configuration for serving the app

### AI/Agent Customization
- **`.cursorrules`** - Cursor IDE rules
- **`.windsurfrules`** - Windsurf IDE rules

---

## Layer Dependencies & Import Boundaries

```
Dependency Flow (top = depends on bottom):

┌─────────────────┐
│   apps/         │  Application Shell
│   (app-shell)   │
└────────┬────────┘
         │
    ┌────▼─────────────────────────┐
    │  libs/features               │  Feature Modules
    │  (auth, home, media, etc.)   │
    └────┬──────────────────────────┘
         │
    ┌────▼─────────────────────────┐
    │  libs/domain                 │  Domain Services & Models
    │  (media, profile, social)    │
    └────┬──────────────────────────┘
         │
    ┌────┼──────────────────────────┐
    │    │                          │
    │  libs/core              libs/ui │  Shared Utilities
    │ (services, guards)    (components)
    └────────────────────────────────┘
```

**Import Rules:**
- ✅ Features can import from core, domain, and ui
- ✅ Domain can import from core and ui
- ✅ Core and UI are isolated from features
- ❌ Circular dependencies are forbidden
- ❌ Sibling features cannot import each other directly

---

## Development Workflow

### Adding a New Feature
1. Create new folder in `libs/features/{feature-name}`
2. Define routes in `{feature-name}/src/lib/lib.routes.ts`
3. Import UI components from `libs/ui`
4. Use services from `libs/domain` or `libs/core`
5. Register feature route in `app.routes.ts`

### Adding a New Domain
1. Create folder in `libs/domain/{domain-name}`
2. Define models in `models/`
3. Create services in `services/`
4. Export public API via `index.ts`

### Adding UI Components
1. Create component in `libs/ui/src/lib/{component-type}/`
2. Follow naming convention: `{name}.component.ts` for standalone components
3. Export from `libs/ui/src/index.ts`
4. Document component API in component file

---

## Build & Deployment

### Local Development
```bash
npm install              # Install dependencies
nx serve app-shell      # Start dev server
```

### Build for Production
```bash
nx build app-shell      # Build app shell
nx build ui             # Build UI library
```

### Docker Deployment
```bash
docker-compose up       # Run with compose
docker build -t app .   # Build image
```

---

## File Statistics

**Total Project Files:** ~280 (excluding node_modules)

**Breakdown:**
- Source Files (.ts, .html, .css): ~150
- Configuration Files: ~30
- Documentation Files: ~12
- Assets & i18n: ~8
- Cache & Generated: ~80

---

## Notes & Conventions

1. **Naming Convention:**
   - Components: `*.component.ts`
   - Services: `*.service.ts`
   - Models/Interfaces: `*.model.ts` or `*.ts`
   - Standalone components preferred over modules

2. **Barrel Exports:**
   - Each lib exports public API via `index.ts`
   - Internal-only files use full paths

3. **Lazy Loading:**
   - Features are lazy-loaded via routing
   - Reduces initial bundle size

4. **i18n Support:**
   - English (en) and Vietnamese (vi) translations
   - Located in `apps/app-shell/public/assets/i18n/`

5. **Design System:**
   - Centralized tokens in `libs/core/src/lib/design-system/`
   - Component styles use design tokens
   - Glassmorphism patterns for modern UI

---

## Related Documentation

- [Frontend Playbook](./ai-context/frontend-ai-playbook.md) - Development best practices
- [i18n Guidelines](./architecture/i18n-guidelines.md) - Internationalization guide

---

**End of Document**
