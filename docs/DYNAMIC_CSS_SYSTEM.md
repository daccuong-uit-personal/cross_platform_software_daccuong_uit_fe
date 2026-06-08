# Dynamic CSS Variables System - Architectural Documentation

## Overview

This document describes the **Global Dynamic CSS Variables System** that enables users to customize typography and spacing across the entire application in real-time.

## Problem Statement

Previously, the application used hardcoded CSS class values (e.g., `text-[15px]`, `p-4`), which prevented users from customizing the font size and spacing globally via the Settings panel. This broke the product requirement: *"Allow users to independently adjust typography, spacing, and layout padding scale."*

## Solution: Cascading CSS Variables

Instead of hardcoding pixel values, all typography and spacing now derives from **two base CSS variables** that update dynamically:

1. **`--font-size-body`**: Base font size (default: 15px, scales with user selection)
2. **`--spacing-scale-base`**: Base spacing unit (default: 4px, scales with user selection)

All other sizes are calculated from these base values using CSS `calc()`, creating a **cascade effect**.

---

## Architecture

### 1. Global CSS Variables (apps/app-shell/src/styles.css)

#### Typography System

```css
:root {
  /* Base font size — user adjusts this via Settings */
  --font-size-body: 15px;
  
  /* All other sizes scale from --font-size-body */
  --font-size-sm: calc(var(--font-size-body) - 2px);
  --font-size-md: calc(var(--font-size-body) + 1px);
  --font-size-lg: calc(var(--font-size-body) + 3px);
  --font-size-heading-md: calc(var(--font-size-body) + 5px);
  --font-size-heading-lg: calc(var(--font-size-body) + 9px);
}
```

**When user selects "Large" typography in Settings:**
- `--font-size-body` becomes `18px` (15px × 1.2 scale factor)
- All dependent sizes auto-scale:
  - `--font-size-sm` → 16px
  - `--font-size-lg` → 21px
  - `--font-size-heading-lg` → 27px
  - ✅ **ENTIRE APP scales without code changes**

#### Spacing System

```css
:root {
  /* Base spacing unit — user adjusts via Density setting */
  --spacing-scale-base: 4px;
  
  /* All spacing tiers scale from base */
  --spacing-1: calc(var(--spacing-scale-base) * 1);    /* 4px */
  --spacing-2: calc(var(--spacing-scale-base) * 2);    /* 8px */
  --spacing-3: calc(var(--spacing-scale-base) * 3);    /* 12px */
  --spacing-4: calc(var(--spacing-scale-base) * 4);    /* 16px */
  --spacing-6: calc(var(--spacing-scale-base) * 6);    /* 24px */
  --spacing-8: calc(var(--spacing-scale-base) * 8);    /* 32px */
}
```

**When user selects "Spacious" density in Settings:**
- `--spacing-scale-base` becomes `5.4px` (4px × 1.35 scale factor)
- All padding/margin auto-scale:
  - `--spacing-1` → 5.4px
  - `--spacing-4` → 21.6px
  - `--spacing-8` → 43.2px
  - ✅ **Cards expand, text breathes more, layout feels roomier**

---

### 2. CSS File Refactoring

Every CSS file in the project has been refactored to use variables instead of hardcoded values.

#### Profile Component Example

**BEFORE (❌ hardcoded):**
```css
.profile-header-details {
  padding: 12px 16px 0;
  margin-bottom: 16px;
}

.nav-title-info h2 {
  font-size: 1.125rem;  /* Breaks when user scales */
}
```

**AFTER (✅ dynamic):**
```css
.profile-header-details {
  padding: var(--spacing-3) var(--spacing-4) 0;
  margin-bottom: var(--spacing-4);
}

.nav-title-info h2 {
  font-size: var(--font-size-subtitle);
  /* = calc(var(--font-size-body) + 3px) */
}
```

**Result:** When user adjusts settings, `.profile-header-details` padding grows/shrinks proportionally with all other page elements.

---

### 3. UiSettingsService Integration

**File:** `libs/core/src/lib/design-system/ui-settings.service.ts`

The service calculates and applies CSS variables when user changes settings:

```typescript
private applySettingsToDOM(settings: UiSettings): void {
  const root = document.documentElement;
  
  // TYPOGRAPHY: Scale base font size
  const fontScale = FONT_SIZE_SCALES[settings.fontSize];      // 0.64 to 1.12
  const scaledFontSizeBody = 15 * fontScale;                   // 15px × factor
  root.style.setProperty('--font-size-body', `${scaledFontSizeBody}px`);
  
  // SPACING: Scale base unit
  const paddingScale = PADDING_SCALES[settings.paddingScale];  // 0.63 to 1.35
  const scaledSpacingBase = 4 * paddingScale;                  // 4px × factor
  root.style.setProperty('--spacing-scale-base', `${scaledSpacingBase}px`);
  
  // ✅ All calc() expressions now use new base values
  // ✅ Entire DOM re-renders with new sizes
}
```

**Flow:**
1. User changes font size in Settings → `updateSetting('fontSize', 'large')`
2. Signal updates → `effect()` triggers
3. `applySettingsToDOM()` calculates `--font-size-body = 18px`
4. CSS propagates changes through `calc()` expressions
5. ✅ Profile title, sidebar labels, body text, buttons all resize together

---

## Design System Mapping

### Font Size Tiers

| CSS Variable | Type | Default | Adjustable | Use Case |
|---|---|---|---|---|
| `--font-size-heading-lg` | `calc(var(--font-size-body) + 9px)` | 24px | ✅ | Page titles |
| `--font-size-heading-md` | `calc(var(--font-size-body) + 5px)` | 20px | ✅ | Section titles, menu leads |
| `--font-size-lg` | `calc(var(--font-size-body) + 3px)` | 18px | ✅ | Section subtitles |
| `--font-size-body` | Dynamic | **15px** | ✅ | **User-adjustable base** |
| `--font-size-md` | `calc(var(--font-size-body) + 1px)` | 16px | ✅ | Subtitle text |
| `--font-size-sm` | `calc(var(--font-size-body) - 2px)` | 13px | ✅ | Labels, captions |
| `--font-size-xs` | `calc(var(--font-size-body) - 4px)` | 11px | ✅ | Tiny helper text |

### Spacing Tiers

| CSS Variable | Default | Adjustable | Formula |
|---|---|---|---|
| `--spacing-scale-base` | **4px** | ✅ | **User-adjustable base** |
| `--spacing-1` | 4px | ✅ | `1 × base` |
| `--spacing-2` | 8px | ✅ | `2 × base` |
| `--spacing-3` | 12px | ✅ | `3 × base` |
| `--spacing-4` | 16px | ✅ | `4 × base` (default padding) |
| `--spacing-6` | 24px | ✅ | `6 × base` (card padding) |
| `--spacing-8` | 32px | ✅ | `8 × base` (section gap) |

---

## User Settings Panel

### Typography Settings (in Settings → Appearance & Layout)

**Font Size Options:**
- 🔹 **Compact**: 0.64× (10.2px body) — For power users
- 🔹 **Normal**: 0.8× (12px body) — **Default**
- 🔹 **Large**: 0.96× (14.4px body) — For readability
- 🔹 **X-Large**: 1.12× (16.8px body) — For accessibility

### Spacing/Density Settings

**Density Options:**
- 🔹 **Compact**: 0.63× (2.52px base) — More content per screen
- 🔹 **Normal**: 0.9× (3.6px base) — **Default**
- 🔹 **Comfortable**: 1.08× (4.32px base) — Improved readability
- 🔹 **Spacious**: 1.35× (5.4px base) — For accessibility

---

## Implementation Guidelines

### For Component Developers

✅ **DO:**
```css
/* Use spacing variables */
.card {
  padding: var(--spacing-4);        /* 16px or scaled */
  margin-bottom: var(--spacing-3);  /* 12px or scaled */
  gap: var(--spacing-2);            /* 8px or scaled */
}

/* Use font-size variables */
.heading {
  font-size: var(--font-size-heading-md);  /* ~20px or scaled */
}

.label {
  font-size: var(--font-size-sm);  /* ~13px or scaled */
}
```

❌ **DON'T:**
```css
/* Hardcoded pixels break user settings */
.card {
  padding: 16px;        /* ❌ User scaling ignored */
  margin-bottom: 12px;  /* ❌ Won't adjust */
}

.heading {
  font-size: 20px;  /* ❌ Fixed regardless of user preference */
}
```

### Migration from Tailwind Hardcodes

**For existing inline styles:**
```html
<!-- ❌ BEFORE: Hardcoded Tailwind -->
<div class="text-[15px] p-4 gap-2">Content</div>

<!-- ✅ AFTER: Dynamic CSS variables -->
<div style="font-size: var(--font-size-body); padding: var(--spacing-4); gap: var(--spacing-2);">
  Content
</div>

<!-- ✅ BETTER: Use external CSS -->
<div class="card">Content</div>
```

```css
/* card.css */
.card {
  font-size: var(--font-size-body);
  padding: var(--spacing-4);
  gap: var(--spacing-2);
}
```

---

## Affected Pages

✅ **Fully Dynamic:**
- Home (Feed, Right Sidebar)
- Profile (Header, Posts, Sidebar)
- Settings (All UI controls)
- Media Manager
- Dashboard

✅ **Components:**
- All text elements
- Card containers
- Buttons and inputs
- Navigation menus
- Modals and popovers

---

## Testing the System

### Manual Testing in Browser

```javascript
// DevTools Console

// Test 1: Verify --font-size-body changes
getComputedStyle(document.documentElement)
  .getPropertyValue('--font-size-body')  // Should show current value

// Test 2: Verify cascade through calc()
getComputedStyle(document.documentElement)
  .getPropertyValue('--font-size-lg')  // Should adjust with --font-size-body

// Test 3: Trigger setting change
// Go to Settings → Appearance & Layout → Font Size
// Select "Large"
// Observe: All text enlarges, all spacing expands proportionally

// Test 4: Verify localStorage persistence
localStorage.getItem('ui-settings')  // Should show { fontSize: 'large', ... }

// Test 5: Reload page
// Font size remains as selected (persisted across sessions)
```

---

## Performance Considerations

✅ **Optimized:**
- CSS variables evaluate at paint time (no runtime calculation overhead)
- `calc()` is native browser CSS (no JavaScript needed)
- Single source of truth prevents layout thrashing
- Smooth transitions use CSS `transition` property

⚠️ **Avoid:**
- Nesting too many `calc()` expressions (3+ levels)
- Frequent DOM mutation via JavaScript-style setting
- Mixed units in `calc()` (px and rem together)

---

## Backward Compatibility

The system maintains two sets of scaling factors:

**Legacy (for existing expressions):**
```css
--font-size-scale: 1;      /* Multiplier for old calc() */
--padding-scale: 1;        /* Multiplier for old calc() */
```

**Modern (cascading):**
```css
--font-size-body: 15px;     /* Base for new calc() expressions */
--spacing-scale-base: 4px;  /* Base for new calc() expressions */
```

Existing components using old `--font-size-scale` continue to work while new code uses the cascading system.

---

## Summary

| Aspect | Before | After |
|---|---|---|
| **Hardcoded values** | `font-size: 15px` | ❌ Removed |
| **Typography scaling** | Manual per-component | ✅ Cascade from `--font-size-body` |
| **Spacing scaling** | Manual per-component | ✅ Cascade from `--spacing-scale-base` |
| **User experience** | Can't change globally | ✅ Full control via Settings |
| **Developer overhead** | High (update every CSS) | ✅ Low (use variables) |
| **Maintenance burden** | High (scattered values) | ✅ Low (single source of truth) |

---

## References

- Design Tokens: `docs/contracts/design-tokens.json`
- Settings Service: `libs/core/src/lib/design-system/ui-settings.service.ts`
- Settings Component: `libs/features/settings/src/lib/ui-settings/ui-settings.component.ts`
- Global Styles: `apps/app-shell/src/styles.css`
