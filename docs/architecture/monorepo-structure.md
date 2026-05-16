# Architecture: Monorepo Structure & Module Boundaries

## Library Types and Tags

Every project in the monorepo must be tagged in `project.json`. Tags drive the ESLint boundary rules.

| Tag | Location | Can depend on |
|---|---|---|
| `type:app` | `apps/*` | core, ui, feature |
| `type:feature` | `libs/features/*` | core, ui |
| `type:ui` | `libs/ui` | core |
| `type:core` | `libs/core` | core only |

### Scope tags (secondary)
Used for documentation and future fine-grained rules:
`scope:shell`, `scope:auth`, `scope:dashboard`, etc.

## Path Aliases

Defined in `tsconfig.base.json`. All aliases follow the `@fe/*` convention:

| Alias | Points to |
|---|---|
| `@fe/core` | `libs/core/src/index.ts` |
| `@fe/ui` | `libs/ui/src/index.ts` |
| `@fe/features/auth` | `libs/features/auth/src/index.ts` |
| `@fe/features/dashboard` | `libs/features/dashboard/src/index.ts` |

Feature libraries should only ever be referenced via the router (`loadChildren`), not imported directly.

## Creating a New Feature Library

```bash
npx nx g @nx/angular:library \
  --name=<feature-name> \
  --directory=libs/features/<feature-name> \
  --importPath=@fe/features/<feature-name> \
  --standalone --routing --lazy \
  --strict --unitTestRunner=jest
```

Then:
1. Tag it in `project.json`: `"tags": ["type:feature", "scope:<name>"]`
2. Add a route in `apps/app-shell/src/app/routes/app.routes.ts` using `loadChildren`
3. Only export `lib.routes.ts` from `src/index.ts`

## ESLint Config Inheritance

Each library has its own `eslint.config.mjs` that:
- Extends the root `eslint.config.mjs` (which defines boundary rules)
- Adds Angular-specific selector prefix rules for that library

This is intentional Nx convention — not duplication. The root config holds the policy; the lib config holds the prefix.

## CSS and Tailwind Architecture

- **Global design tokens** live in `apps/app-shell/src/styles.css` via `@theme {}`
- **Feature components** use Tailwind utility classes (Tailwind scans `libs/**` via `@source`)
- **`@fe/ui` components** use inline `styles: []` with raw CSS + OKLCH values — because `libs/ui` is built by ng-packagr and NOT scanned by Tailwind
- **No `postcss.config.js` or `tailwind.config.js`** — Angular 21 has native Tailwind v4 integration via esbuild

## Lazy Loading

All features are lazy-loaded via the router. The app-shell initial bundle stays minimal (~42KB).

```ts
// apps/app-shell/src/app/routes/app.routes.ts
{
  path: 'auth',
  loadChildren: () => import('@fe/features/auth').then(m => m.authRoutes),
},
{
  path: 'dashboard',
  loadChildren: () => import('@fe/features/dashboard').then(m => m.dashboardRoutes),
}
```
