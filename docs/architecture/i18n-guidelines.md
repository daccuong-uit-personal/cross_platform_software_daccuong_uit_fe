# Architecture: i18n Guidelines

## Setup

Internationalization uses **[Transloco](https://jsverse.github.io/transloco/)** — a reactive Angular i18n library built on RxJS.

### Configuration (app.config.ts)
```ts
provideTransloco({
  config: {
    availableLangs: ['en', 'vi'],
    defaultLang: 'en',
    reRenderOnLangChange: true,
    prodMode: !isDevMode(),
  },
  loader: TranslocoHttpLoader,
})
```

### File Locations
Translation JSON files are served as static assets:
```
apps/app-shell/public/assets/i18n/
├── en.json   # English (default)
└── vi.json   # Vietnamese
```

> **Important**: Files must be in `public/assets/` (not `src/assets/`) for Angular 21's esbuild pipeline to serve them correctly.

## Translation File Structure

```json
{
  "common": {
    "welcome": "Welcome back",
    "login": "Sign in",
    "logout": "Sign out",
    "register": "Create account"
  }
}
```

Use namespaced keys (`domain.key`) to avoid collisions as the app grows.

## Usage in Templates

### Structural directive (preferred for full scope)
```html
<div *transloco="let t">
  <h1>{{ t('common.welcome') }}</h1>
</div>
```

### Pipe (preferred for isolated strings)
```html
<p>{{ 'common.login' | transloco }}</p>
```

## Adding a New Language

1. Create `apps/app-shell/public/assets/i18n/<lang>.json`
2. Add the lang code to `availableLangs` in `app.config.ts`
3. Translate all existing keys

## Adding New Translation Keys

1. Add the key to all locale files simultaneously (never just one).
2. Use namespacing: `<feature>.<descriptor>` (e.g., `auth.emailRequired`).
3. Never hardcode user-facing strings in templates — always use `t()`.

## Switching Languages at Runtime

```ts
import { TranslocoService } from '@jsverse/transloco';

const transloco = inject(TranslocoService);
transloco.setActiveLang('vi');
```
