---
APPLY_TO: "**/*.ts,**/*.html"
WHEN: "Creating components, styling UI, generating forms"
PRIORITY: high
---

# Design System Usage Guide

## When to Apply

This guide applies when you are:
- Creating new Angular components (buttons, inputs, cards, forms, pages)
- Updating existing components to use consistent styling
- Building any UI that affects user-facing experience
- Generating forms, settings pages, profile components
- Styling headers, menus, navigation, sidebars
- Creating layout or container components

## Quick Reference

### Import Design Tokens & Services
```typescript
import { DesignTokens, UiSettingsService } from '@fe/core';
import { COMPONENT_STYLES, FormLayoutComponent } from '@fe/ui';
```

### Use Scaling CSS Variables
```css
/* These scale automatically based on user settings */
font-size: calc(var(--font-size-scale, 1) * 1rem);
padding: calc(var(--padding-scale, 1) * 1rem);
border-radius: 0.5rem;
color: var(--color-text-base);
```

### Standard Sizes to Use
- **Button Height**: 40px (2.5rem) for standard, 32px for compact, 48px for large
- **Input Height**: 40px (2.5rem)
- **Standard Padding**: 16px (1rem), 24px (1.5rem), 32px (2rem)
- **Font Size**: 16px (1rem) for body, 14px (0.875rem) for small, 32px (2rem) for h1
- **Border Radius**: 8px (0.5rem)

### Color Tokens
```css
--color-brand-primary        /* Primary action color */
--color-surface-base         /* Page background */
--color-surface-subtle       /* Cards, inputs */
--color-text-base            /* Primary text */
--color-text-muted           /* Secondary text */
--color-border-subtle        /* Borders */
--color-success              /* Success */
--color-danger               /* Errors */
```

### Reusable Components
- `FormLayoutComponent` - For all forms (profile, settings, auth)
- `COMPONENT_STYLES.button.*` - Button styling patterns
- `COMPONENT_STYLES.input.*` - Input styling patterns
- `COMPONENT_STYLES.card.*` - Card styling patterns

## Example Component

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTokens, UiSettingsService } from '@fe/core';
import { FormLayoutComponent } from '@fe/ui';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [CommonModule, FormLayoutComponent],
  template: `
    <app-form-layout
      title="Edit Profile"
      (onSubmit)="save()"
      (onCancel)="cancel()">
      
      <div formFields class="form-fields">
        <div class="form-group">
          <label>Full Name</label>
          <input class="form-input" [(ngModel)]="model.name">
        </div>
      </div>
    </app-form-layout>
  `,
  styles: [`
    .form-fields {
      display: flex;
      flex-direction: column;
      gap: calc(var(--padding-scale, 1) * 1rem);
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    label {
      font-size: calc(var(--font-size-scale, 1) * 0.875rem);
      font-weight: 600;
      color: var(--color-text-base);
    }
    
    .form-input {
      padding: calc(var(--padding-scale, 1) * 0.75rem) calc(var(--padding-scale, 1) * 1rem);
      height: calc(var(--padding-scale, 1) * 2.5rem);
      border: 1px solid var(--color-border-subtle);
      border-radius: 0.5rem;
      background-color: var(--color-surface-subtle);
      font-size: calc(var(--font-size-scale, 1) * 1rem);
      
      &:focus {
        outline: none;
        border-color: var(--color-brand-primary);
      }
    }
  `]
})
export class MyFormComponent {
  settingsService = inject(UiSettingsService);
  
  model = { name: '' };
  
  save() { /* ... */ }
  cancel() { /* ... */ }
}
```

## Key Principles

1. **Always use CSS scale variables**: `calc(var(--font-size-scale, 1) * VALUE)`
2. **Use semantic colors**: `var(--color-brand-primary)` not color codes
3. **Use reusable components**: FormLayoutComponent for forms, COMPONENT_STYLES for patterns
4. **Respect user settings**: Font size, padding, theme choices must apply to new components
5. **Define focus states**: All interactive elements need `:focus-visible`
6. **Mobile responsive**: Test at xs, sm, md breakpoints

## Shared Header Standards

The global `ui-shared-header` component must follow these rules:
- **Height & Padding**: Dynamic — `height: calc(72px * var(--padding-scale, 1))`, `padding: 0 calc(28px * var(--padding-scale, 1))`.
- **Logo icon size**: Dynamic — `width/height: calc(30px * var(--font-size-scale, 1))`.
- **Brand name font**: Scale ×1.2 above the subtitle token — `calc(var(--font-size-subtitle) * 1.2)`.
- **Avatar size**: Dynamic — `calc(44px * var(--padding-scale, 1))`.
- **All colors**: Use semantic tokens only (`var(--color-text-base)`, `var(--color-surface-base)`, `var(--color-brand-primary)`, etc.). **No hardcoded hex values.**
- **Background**: `var(--color-surface-base)` with `backdrop-filter: blur(12px)` for glassmorphism.

## Master-Detail & Settings Layout Patterns

When designing layouts with a sidebar and content area (like Settings), **do not hardcode pixel widths**. Instead, use dynamic scaling so the UI responds to user settings:
- **Desktop**: Scale dimensions dynamically using `var(--padding-scale)` (e.g., `width: calc(340px * var(--padding-scale, 1))`). Ensure body max-width scales proportionally (e.g., `max-width: calc(1320px * var(--padding-scale, 1))`).
- **Tablet (< 1024px)**: Reduce gap to `calc(var(--padding-scale, 1) * 16px)`.
- **Mobile (< 768px)**: 
  - **Never hide (`display: none`) the navigation sidebar.**
  - Convert vertical sidebars into **horizontal scrollable tabs** sticking to the top (`position: sticky`, `overflow-x: auto`, hidden scrollbars).
  - Remove borders/padding to optimize horizontal space.
- **Icon Collapse Override**: If global components (like `ui-sidebar-menu`) collapse to icons-only at `< 1280px`, override this behavior using `::ng-deep` if the text labels are critical for context (e.g., Settings menu).

## Files to Reference

- Token constants: `libs/core/src/lib/design-system/design-tokens.ts`
- Settings service: `libs/core/src/lib/design-system/ui-settings.service.ts`
- Component patterns: `libs/ui/src/lib/styles/component-styles.ts`
- Form template: `libs/ui/src/lib/layouts/form-layout.component.ts`
- Global styles: `apps/app-shell/src/styles.css`
- Design tokens reference: [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)
- Implementation guide: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

**Full technical guide:** See [Component Generation Skill](../ai-context/design-system-component-generation.md)
