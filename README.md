# Social Commerce Creator Platform — Frontend

> High-performance, modular Angular 21 frontend monorepo for the Social Commerce Creator Platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (Standalone, Signals-first) |
| Monorepo | Nx 22 |
| Styling | Tailwind CSS v4 (native Angular integration) |
| i18n | Transloco |
| State | Angular Signals + RxJS |
| Linting | ESLint + Prettier |
| Testing | Jest |

## Project Structure

```
.
├── apps/
│   └── app-shell/              # Entry point — routing shell only, zero business logic
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout/     # AppShell component (header, router-outlet)
│       │   │   ├── routes/     # Lazy-loaded route definitions
│       │   │   └── app.config.ts
│       │   ├── styles.css      # Global design tokens (@theme) + base styles
│       │   └── index.html
│       └── public/
│           └── assets/i18n/    # Translation files (en.json, vi.json)
│
├── libs/
│   ├── core/                   # tag: type:core
│   │   └── src/lib/
│   │       ├── services/       # AuthService, ApiService, ThemeService
│   │       └── interceptors/   # HTTP auth + error interceptors
│   │
│   ├── ui/                     # tag: type:ui
│   │   └── src/lib/
│   │       ├── button/         # UiButton — raw CSS (no Tailwind dependency)
│   │       └── card/           # UiCard — glassmorphism card
│   │
│   └── features/               # tag: type:feature
│       ├── auth/               # scope:auth — Login, Register (lazy loaded at /auth)
│       └── dashboard/          # scope:dashboard — Dashboard (lazy loaded at /dashboard)
│
├── docs/
│   ├── ai/                     # Playbook, agent roles, raw roadmap
│   └── architecture/           # Design tokens spec, i18n guidelines
│
└── nx.json, tsconfig.base.json, eslint.config.mjs
```

## Module Boundary Rules

```
type:app     → can use: type:core, type:ui, type:feature
type:feature → can use: type:core, type:ui
type:ui      → can use: type:core
type:core    → can use: type:core only
```

Enforced via ESLint `@nx/enforce-module-boundaries`.

## Path Aliases

All imports use scoped `@fe/*` aliases (no bare module names):

```ts
import { AuthService } from '@fe/core';
import { UiButton }    from '@fe/ui';
// Feature libs are lazy-loaded via router — never imported directly
```

## Getting Started

```bash
# Install dependencies
npm install

# Serve dev server
npx nx serve app-shell

# Build production
npx nx build app-shell

# Lint all
npx nx run-many -t lint

# Test all
npx nx run-many -t test
```

## Phase Status

| Phase | Name | Status |
|---|---|---|
| **0** | Cross Project Foundation Platform | ✅ Complete |
| **1** | Frontend Foundation Platform | 🔜 Next |
| 2 | Design System Platform | ⏳ Planned |
| 3 | Auth + Identity Platform | ⏳ Planned |
| 4–16 | ... | ⏳ Planned |

## Phase 0 — What was built

- **Design Token System**: Semantic OKLCH color tokens defined in `styles.css` via Tailwind v4 `@theme`. Variables: `--color-brand-primary`, `--color-surface-base`, `--color-text-base`, etc.
- **Global CSS Architecture**: Resolved Tailwind v4 + Angular 21 esbuild integration (no PostCSS config files needed — native integration only).
- **Feature Modularization**: Pages moved out of `apps/` into `libs/features/*` as lazy-loaded Nx libraries. Zero business logic in app-shell.
- **Lazy Loading**: All routes use `loadChildren` — initial bundle ~42KB, features load on demand.
- **i18n**: Transloco configured with `en` and `vi` locales. Assets served from `public/assets/i18n/`.
- **Core Services**: `AuthService`, `ApiService`, `ThemeService`, HTTP interceptors in `@fe/core`.
- **Shared UI**: `UiButton`, `UiCard` in `@fe/ui` with inline styles (library build compatible).
- **ESLint Module Boundaries**: All 4 dependency rules enforced. Feature libs tagged `type:feature + scope:*`.
- **Runtime Config**: `window.__APP_CONFIG__` in `index.html` for environment-independent API URL.

## Architecture Decisions

See [`docs/architecture/`](./docs/architecture/) for:
- Design Tokens specification
- i18n guidelines

See [`docs/ai/frontend-ai-playbook.md`](./docs/ai/frontend-ai-playbook.md) for the full roadmap and FE philosophy.
