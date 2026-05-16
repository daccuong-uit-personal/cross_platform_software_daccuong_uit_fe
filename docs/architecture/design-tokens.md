# Architecture: Design Tokens

## Overview

Design tokens are the single source of truth for all visual decisions — colors, spacing, shadow, radius. They are defined in `apps/app-shell/src/styles.css` using Tailwind CSS v4 `@theme` blocks.

## Token Structure

```
Primitives  →  Semantic Tokens  →  Component Styles
oklch(...)     --color-brand-*    bg-brand-primary (Tailwind)
               --color-surface-*  or raw var() (component styles)
               --color-text-*
```

## Color Tokens

### Primitive Scale (OKLCH)
| Token | Value | Description |
|---|---|---|
| `--color-primary-500` | `oklch(0.55 0.22 260)` | Indigo mid |
| `--color-primary-600` | `oklch(0.48 0.2 260)` | Indigo base |
| `--color-primary-700` | `oklch(0.42 0.18 260)` | Indigo deep |

### Semantic Tokens
| Token | Maps To | Usage |
|---|---|---|
| `--color-brand-primary` | `primary-600` | Buttons, links, accents |
| `--color-brand-primary-hover` | `primary-500` | Hover states |
| `--color-surface-base` | `oklch(0.99 0.005 260)` | Page background |
| `--color-surface-subtle` | `oklch(0.97 0.01 260)` | Cards, inputs bg |
| `--color-text-base` | `oklch(0.2 0.04 260)` | Primary text |
| `--color-text-muted` | `oklch(0.45 0.02 260)` | Secondary text |

### Effect Tokens
| Token | Value | Usage |
|---|---|---|
| `--shadow-premium` | `0 20px 25px -5px rgb(0 0 0 / 0.1)...` | Card elevation |
| `--shadow-glow` | `0 0 20px 0 oklch(0.55 0.22 260 / 0.2)` | Focus glow |

## Usage Rules

### In feature components (Tailwind classes — recommended for app-layer)
```html
<div class="bg-brand-primary text-white">...</div>
<p class="text-text-muted">...</p>
```
Tailwind scans `apps/app-shell/src/**` and `libs/**` via `@source` directives. Classes are generated at build time.

### In Angular libraries (`@fe/ui` — use raw CSS variables)
Because `libs/ui` is built separately via ng-packagr, Tailwind does NOT scan it. Use raw CSS:
```ts
styles: [`
  button {
    background-color: oklch(0.48 0.2 260); /* --color-brand-primary */
  }
`]
```

## Adding New Tokens

1. Add the CSS custom property in `apps/app-shell/src/styles.css` inside the `@theme {}` block.
2. Use the token as a Tailwind class (`bg-<token>`, `text-<token>`) or as `var(--color-<token>)` in raw CSS.
3. Document it in this file.

## Background System

The page background uses a fixed mesh gradient defined in `body`:
```css
background-image:
  radial-gradient(at 0% 0%, oklch(0.96 0.04 260 / 0.35) 0px, transparent 50%),
  radial-gradient(at 100% 0%, oklch(0.96 0.04 300 / 0.2) 0px, transparent 50%),
  radial-gradient(at 50% 100%, oklch(0.96 0.04 240 / 0.15) 0px, transparent 60%);
background-attachment: fixed;
```

## Glassmorphism Utility

The `.glass-effect` class in `styles.css` provides the standard card backdrop:
```css
.glass-effect {
  background: rgb(255 255 255 / 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgb(255 255 255 / 0.3);
  box-shadow: var(--shadow-premium);
}
```
