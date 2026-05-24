# Skill: UI System Design Tokens & Component Generation

**Agent Owner:** UI System Agent  
**Last Updated:** May 2026  
**Priority:** Core skill for all UI/component work

---

## Overview

This skill enables consistent, scalable UI component creation using the design system. All new components must follow these standards for visual consistency, accessibility, and maintainability across the platform.

## When to Apply

- ✅ Creating new Angular components (buttons, inputs, cards, forms, modals)
- ✅ Updating existing components to use design tokens
- ✅ Implementing new pages or features with UI
- ✅ Styling any UI element affecting user experience
- ✅ Building reusable component libraries in `libs/ui/`
- ✅ Converting Figma designs to Angular components

## Core Principles

1. **Use Design Tokens First**: Never hardcode values like `16px`, `#161823`, `'Outfit'`
2. **Respect User Settings**: All sizes should use CSS scale variables (`--font-size-scale`, `--padding-scale`)
3. **Semantic Consistency**: Use semantic colors (`--color-brand-primary`) over primitives
4. **Responsive & Accessible**: Design for mobile-first, multiple screen sizes, and accessibility (WCAG 2.1 AA)
5. **Reusable Components**: Maximize component reuse (FormLayout, COMPONENT_STYLES, shared components)

## Design System Architecture

```
libs/core/src/lib/design-system/
├── design-tokens.ts           ← TypeScript constants for all design values
└── ui-settings.service.ts     ← Service that manages user settings globally

libs/ui/src/lib/
├── styles/component-styles.ts ← Pre-made styling patterns
└── layouts/form-layout.component.ts ← Reusable form template

apps/app-shell/src/styles.css  ← CSS variables & themes
```

## How to Use Design Tokens

### In TypeScript Components

```typescript
import { DesignTokens, UiSettingsService } from '@fe/core';

@Component({
  selector: 'my-component',
  template: `...`,
  styles: [`
    .button {
      padding: calc(var(--padding-scale, 1) * ${DesignTokens.spacing.lg});
      font-size: ${DesignTokens.fontSize.body.md};
      font-family: ${DesignTokens.typography.fontFamily.ui};
      border-radius: ${DesignTokens.borderRadius.md};
      color: ${DesignTokens.color.text.base};
      background: ${DesignTokens.color.primary};
    }
  `]
})
export class MyComponent {}
```

### In CSS/Styles

```css
.button {
  padding: calc(var(--padding-scale, 1) * 1rem);  /* Uses design token */
  font-size: calc(var(--font-size-scale, 1) * 1rem);
  border-radius: 0.5rem;  /* From DesignTokens.borderRadius.md */
  color: var(--color-text-base);
  background-color: var(--color-brand-primary);
  
  /* Hover: use semantic color */
  &:hover {
    background-color: var(--color-brand-primary-hover);
  }
}
```

### Using Component Styles Utilities

```typescript
import { COMPONENT_STYLES } from '@fe/ui';

@Component({
  selector: 'my-button',
  template: `<button>${COMPONENT_STYLES.button.base}</button>`,
  styles: [`
    button {
      ${COMPONENT_STYLES.button.base}
    }
    button.primary {
      ${COMPONENT_STYLES.button.primary}
    }
  `]
})
export class MyButtonComponent {}
```

## Component Size Standards

### Button Heights
- `xs`: 28px - Small buttons, icon buttons
- `sm`: 32px - Compact buttons
- **`md`: 40px - Standard button** ⭐
- `lg`: 48px - Large button
- `xl`: 56px - CTA button

### Input Heights
- `sm`: 32px - Compact input
- **`md`: 40px - Standard input** ⭐
- `lg`: 48px - Large input

### Spacing
- `xs`: 4px - Minimal gaps
- `sm`: 8px - Small gaps
- **`lg`: 16px - Standard padding** ⭐
- `xl`: 24px - Section padding
- `xxl`: 32px - Large section padding

### Font Sizes
- **Body**: 16px (1rem) ⭐
- Heading H1: 32px (2rem)
- Heading H2: 28px (1.75rem)
- Heading H3: 24px (1.5rem)
- Caption: 12px (0.75rem)

### Border Radius
- `sm`: 4px - Subtle rounding
- **`md`: 8px - Standard** ⭐
- `lg`: 16px - Cards, containers
- `xl`: 24px - Modals

## Typography Standards

### Font Families
- **UI (default)**: Outfit (`'Outfit', sans-serif`)
- Display: Syne (`'Syne', sans-serif`)
- Body: Inter (`'Inter', sans-serif`)
- Display/premium: Playfair Display (`'Playfair Display', serif`)

### Font Weights
- Light: 300
- Normal: 400 (body text)
- Medium: 500 (secondary text)
- Semibold: 600 (buttons, labels)
- Bold: 700 (headings)

### Line Heights
- Tight: 1.2 (headlines)
- Normal: 1.5 (body, buttons) ⭐
- Relaxed: 1.75 (long-form)
- Loose: 2 (extra space)

## Color System

### Semantic Colors (Use These!)
```
--color-brand-primary        → Primary actions (buttons, links)
--color-brand-primary-hover  → Hover state
--color-surface-base         → Page background
--color-surface-subtle       → Cards, input backgrounds
--color-text-base            → Primary text
--color-text-muted           → Secondary text
--color-border-subtle        → Borders
--color-success              → Success messages
--color-warning              → Warnings
--color-danger               → Errors
--color-info                 → Information
```

### Themes Supported
- **Light** (default, no class needed)
- **Dark** (class `dark`)
- **Ocean** (class `ocean`)
- **Forest** (class `forest`)

## Reusable Components

### FormLayoutComponent

Use for consistent form layout across app:

```html
<app-form-layout 
  title="Edit Profile"
  subtitle="Update your personal information"
  [isLoading]="isLoading$ | async"
  [errorMessage]="error$ | async"
  [submitButtonText]="'Save Changes'"
  (onSubmit)="handleSubmit()"
  (onCancel)="handleCancel()">
  
  <div formFields>
    <div class="form-group">
      <label>Full Name</label>
      <input class="form-input" [(ngModel)]="profile.fullName">
    </div>
    
    <div class="form-group">
      <label>Email</label>
      <input class="form-input" type="email" [(ngModel)]="profile.email">
    </div>
  </div>
</app-form-layout>
```

### Styling Patterns

Pre-made patterns for common elements:

```typescript
// Button styles
${COMPONENT_STYLES.button.base}
${COMPONENT_STYLES.button.primary}
${COMPONENT_STYLES.button.outline}
${COMPONENT_STYLES.button.ghost}

// Input styles
${COMPONENT_STYLES.input.base}
${COMPONENT_STYLES.input.error}
${COMPONENT_STYLES.input.success}

// Card styles
${COMPONENT_STYLES.card.base}
${COMPONENT_STYLES.card.glass}
${COMPONENT_STYLES.card.elevated}

// Text styles
${COMPONENT_STYLES.text.h1}
${COMPONENT_STYLES.text.body}
${COMPONENT_STYLES.text.caption}

// Layout utilities
${COMPONENT_STYLES.layout.flexCenter}
${COMPONENT_STYLES.layout.flexBetween}
${COMPONENT_STYLES.layout.containerMaxWidth}
```

## Scaling & Responsiveness

### CSS Scale Variables (set by UiSettingsService)

```css
/* Font size scaling: 0.85x to 1.3x */
font-size: calc(var(--font-size-scale, 1) * 1rem);

/* Padding scaling: 0.8x to 1.5x */
padding: calc(var(--padding-scale, 1) * 1rem);

/* Line height adjustment */
line-height: calc(var(--line-height, 1.5));
```

### Mobile Breakpoints

```typescript
breakpoint: {
  xs: '320px',
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  xxl: '1536px', // Extra wide
}
```

### Master-Detail & Settings Layout Standard

When building master-detail views (like Settings, Profile management):

1. **Dynamic Desktop Sizing**: Do not hardcode fixed pixel widths. Scale sizes dynamically using global variables.
   - Use `max-width: calc(1320px * var(--padding-scale, 1))` for the main body.
   - Use `width: calc(340px * var(--padding-scale, 1))` for the sidebar.
   - Use `max-width: calc(860px * var(--padding-scale, 1))` for the content.
   - Use `gap: calc(var(--padding-scale, 1) * 24px)`.
2. **Medium Screens (<1024px)**: Smoothly reduce gaps using dynamic scales and allow sidebars to shrink.
3. **Mobile Pattern (<768px)**: 
   - **DO NOT** use `display: none` on sidebars. Users must be able to navigate.
   - Convert vertical sidebars into **horizontal scrollable tab bars** sticky to the top (`position: sticky`, `overflow-x: auto`, `scrollbar-width: none`).
   - Eliminate extra borders and paddings to maximize mobile screen real estate.
4. **Icon-only Collapses**: Override global icon-only sidebar collapses (e.g., at `<1280px`) if the text is essential for the context (like settings pages).

## Accessibility Requirements

1. **High Contrast Support**: Use `document.body.classList.contains('high-contrast')`
2. **Reduce Motion**: Check `document.body.classList.contains('reduce-motion')`
3. **Focus States**: Always define `:focus-visible` states
4. **Color Contrast**: AA minimum (4.5:1 for text, 3:1 for graphics)
5. **Semantic HTML**: Use proper heading hierarchy, labels for inputs

## Example: Creating a New Button Component

```typescript
import { Component, Input } from '@angular/core';
import { COMPONENT_STYLES } from '@fe/ui';
import { DesignTokens } from '@fe/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button [class]="variant">{{ label }}</button>`,
  styles: [`
    button {
      ${COMPONENT_STYLES.button.base}
      font-family: ${DesignTokens.typography.fontFamily.ui};
    }
    
    button.primary {
      ${COMPONENT_STYLES.button.primary}
    }
    
    button.outline {
      ${COMPONENT_STYLES.button.outline}
    }
    
    button.icon {
      ${COMPONENT_STYLES.button.icon}
    }
  `]
})
export class AppButtonComponent {
  @Input() label = '';
  @Input() variant: 'primary' | 'outline' | 'icon' = 'primary';
}
```

## Example: Creating a Settings Form

```typescript
import { Component } from '@angular/core';
import { FormLayoutComponent } from '@fe/ui';
import { DesignTokens } from '@fe/core';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [CommonModule, FormLayoutComponent],
  template: `
    <app-form-layout
      title="Account Settings"
      (onSubmit)="submit()">
      
      <div formFields [style]="getFormFieldsStyle()">
        <!-- Form fields here -->
      </div>
    </app-form-layout>
  `,
  styles: [`
    [formFields] {
      display: flex;
      flex-direction: column;
      gap: calc(var(--padding-scale, 1) * ${DesignTokens.spacing.lg});
    }
  `]
})
export class SettingsFormComponent {
  getFormFieldsStyle() {
    return {
      'display': 'flex',
      'flex-direction': 'column',
      'gap': `calc(var(--padding-scale, 1) * 1rem)`
    };
  }
}
```

## Testing the Design System

1. **Change Font Size**: Settings → Appearance → Font Size
2. **Change Padding**: Settings → Appearance → Padding Scale
3. **Change Theme**: Settings → Appearance → Theme
4. **Test High Contrast**: Settings → Appearance → High Contrast Mode
5. **Verify settings persist**: Refresh page, settings should remain

## Common Mistakes to Avoid

❌ **Don't**: `padding: 16px;` → **Do**: `padding: calc(var(--padding-scale, 1) * 1rem);`

❌ **Don't**: `font-size: 14px;` → **Do**: `font-size: calc(var(--font-size-scale, 1) * 0.875rem);`

❌ **Don't**: `color: #161823;` → **Do**: `color: var(--color-text-base);`

❌ **Don't**: `font-family: Outfit;` → **Do**: `font-family: var(--font-family);`

❌ **Don't**: Inline styles → **Do**: Use CSS classes or component styles

## Related Files

- Design Tokens: `libs/core/src/lib/design-system/design-tokens.ts`
- UI Settings Service: `libs/core/src/lib/design-system/ui-settings.service.ts`
- Component Styles: `libs/ui/src/lib/styles/component-styles.ts`
- Form Layout: `libs/ui/src/lib/layouts/form-layout.component.ts`
- Global Styles: `apps/app-shell/src/styles.css`
- Settings Page: `libs/features/settings/src/lib/ui-settings/ui-settings.component.ts`

## Documentation

- Design Tokens Guide: `docs/ui-ux/DESIGN_TOKENS.md`
- Design System Reference: This skill document
- Implementation Progress: Check `/memories/session/design-system-implementation.md`
