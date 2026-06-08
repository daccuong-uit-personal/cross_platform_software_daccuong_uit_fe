# Dynamic CSS Variables - Quick Start Guide

## For Developers

This guide explains how to use the new Dynamic CSS Variables System when building new components or updating existing ones.

## Core Principle

❌ **DON'T USE HARDCODED PIXELS:**
```css
/* Bad - ignores user settings */
.button {
  padding: 16px;
  font-size: 15px;
}
```

✅ **USE CSS VARIABLES:**
```css
/* Good - respects user settings */
.button {
  padding: var(--spacing-4);
  font-size: var(--font-size-body);
}
```

---

## Available Variables

### Font Size Variables

| Variable | Default | When to Use |
|---|---|---|
| `--font-size-heading-lg` | 24px | Page titles, main headings |
| `--font-size-heading-md` | 20px | Section titles, menu headers |
| `--font-size-lg` | 18px | Subtitle text, prominent labels |
| `--font-size-md` | 16px | Slightly larger body text |
| `--font-size-body` | **15px** | Regular body text, default |
| `--font-size-sm` | 13px | Labels, captions, small text |
| `--font-size-xs` | 11px | Tiny helper text, footnotes |

### Spacing Variables

| Variable | Default | Use For |
|---|---|---|
| `--spacing-1` | 4px | Minimal gaps, tiny spacing |
| `--spacing-2` | 8px | Small gaps between elements |
| `--spacing-3` | 12px | Standard gap between sections |
| `--spacing-4` | 16px | **Default padding** |
| `--spacing-5` | 20px | Larger padding |
| `--spacing-6` | 24px | Card padding, prominent spacing |
| `--spacing-7` | 28px | Sidebar padding |
| `--spacing-8` | 32px | Section gap, header spacing |

---

## Common Patterns

### 1. Card Component

```css
.card {
  padding: var(--spacing-6);      /* 24px or scaled */
  margin-bottom: var(--spacing-8); /* 32px or scaled */
  border-radius: 8px;
  background: var(--color-surface-base);
}

.card-title {
  font-size: var(--font-size-heading-md); /* ~20px or scaled */
  font-weight: 700;
  margin-bottom: var(--spacing-3);  /* 12px or scaled */
}

.card-text {
  font-size: var(--font-size-body);  /* 15px or scaled */
  line-height: 1.6;
  margin-bottom: var(--spacing-2);   /* 8px or scaled */
}
```

### 2. Form Elements

```css
.form-group {
  margin-bottom: var(--spacing-4); /* 16px or scaled */
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);  /* 13px or scaled */
  margin-bottom: var(--spacing-2);  /* 8px or scaled */
  font-weight: 500;
}

.form-input {
  padding: var(--spacing-2) var(--spacing-3);  /* 8px 12px or scaled */
  font-size: var(--font-size-body);
  border: 1px solid var(--color-border-subtle);
}

.form-help {
  font-size: var(--font-size-xs);  /* 11px or scaled */
  color: var(--color-text-muted);
  margin-top: var(--spacing-1);    /* 4px or scaled */
}
```

### 3. Navigation

```css
.nav-item {
  padding: var(--spacing-3) var(--spacing-4);  /* 12px 16px or scaled */
  font-size: var(--font-size-body);
  gap: var(--spacing-2);
}

.nav-label {
  font-size: var(--font-size-sm);  /* 13px or scaled */
  color: var(--color-text-muted);
}

.nav-icon {
  width: 24px;  /* Keep fixed - icons don't scale with text */
  height: 24px;
}
```

### 4. Header / Footer

```css
.header {
  padding: var(--spacing-4) var(--spacing-6);  /* 16px 24px or scaled */
  border-bottom: 1px solid var(--color-border-subtle);
}

.header-title {
  font-size: var(--font-size-heading-md);
  font-weight: 700;
}

.footer {
  padding: var(--spacing-8) var(--spacing-6);  /* 32px 24px or scaled */
  gap: var(--spacing-4);
}

.footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
```

### 5. Flex Layouts

```css
.flex-container {
  display: flex;
  gap: var(--spacing-3);    /* 12px or scaled */
  padding: var(--spacing-4); /* 16px or scaled */
}

.flex-item {
  flex: 1;
  padding: var(--spacing-3); /* 12px or scaled */
}
```

---

## Mixing Fixed and Dynamic Sizes

Some elements should NOT scale (e.g., borders, icons, buttons):

```css
.button-with-icon {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);         /* ✅ SCALES */
  padding: var(--spacing-2) var(--spacing-3);  /* ✅ SCALES */
}

.button-icon {
  width: 20px;   /* ❌ FIXED - icons stay same size */
  height: 20px;
}

.button-text {
  font-size: var(--font-size-body);  /* ✅ SCALES */
}

.divider {
  height: 1px;   /* ❌ FIXED - borders stay 1px */
  background: var(--color-border-subtle);
}
```

---

## Dynamic vs Static Values

### ✅ USE VARIABLES FOR:
- Text content sizing (`font-size`)
- Padding/margin around content (`padding`, `margin`)
- Gaps between elements (`gap`, `margin`)
- Line height (could vary with font)
- Most visual spacing

### ❌ KEEP HARDCODED FOR:
- Icon sizes (20px, 24px, etc.) — users don't expect icons to grow
- Border widths (1px, 2px)
- Border radius (8px, 12px) — shape shouldn't change
- Shadow blur radius (4px, 10px)
- Z-index values
- Fixed layout dimensions (unless responsiveness needed)

---

## Component Migration Example

### Before (Hardcoded)

```css
.profile-card {
  padding: 24px;
  margin-bottom: 20px;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.profile-description {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.profile-actions {
  display: flex;
  gap: 12px;
}
```

### After (Dynamic)

```css
.profile-card {
  padding: var(--spacing-6);      /* 24px → scales */
  margin-bottom: var(--spacing-5); /* 20px → scales */
}

.profile-name {
  font-size: var(--font-size-md); /* 16px → scales */
  font-weight: 700;
  margin-bottom: var(--spacing-2); /* 8px → scales */
}

.profile-description {
  font-size: var(--font-size-sm);  /* 14px → scales */
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-3); /* 12px → scales */
}

.profile-actions {
  display: flex;
  gap: var(--spacing-3); /* 12px → scales */
}
```

---

## Testing Your Component

### Manual Testing

1. **Build component:**
   ```bash
   nx build @fe/features-profile
   ```

2. **Open app in browser**

3. **Go to Settings → Appearance & Layout**

4. **Change font size to "X-Large":**
   - ✅ Component text should grow
   - ✅ Padding should expand
   - ✅ Gaps should widen

5. **Change density to "Spacious":**
   - ✅ Card padding should increase
   - ✅ Margins should expand
   - ✅ Gaps should widen

6. **Verify cascade:**
   - Change back to "Normal"
   - ✅ Sizes should shrink back proportionally
   - ✅ No jumpy reflow

### Browser DevTools Check

```javascript
// In DevTools Console
const style = getComputedStyle(document.documentElement);

// Verify font scaling
console.log(style.getPropertyValue('--font-size-body'));
console.log(style.getPropertyValue('--font-size-heading-lg'));

// Verify spacing scaling
console.log(style.getPropertyValue('--spacing-scale-base'));
console.log(style.getPropertyValue('--spacing-4'));
```

---

## What If I Need Custom Spacing?

### Uncommon but Valid

If you need spacing that doesn't fit standard tiers:

```css
/* Use calc with fractions of base */
.unusual-spacing {
  padding: calc(var(--spacing-scale-base) * 3.5); /* Between 3 and 4 */
  margin: calc(var(--spacing-scale-base) * 2.25); /* Between 2 and 2.5 */
}
```

**But prefer using standard tiers when possible** — it maintains design system cohesion.

---

## Common Mistakes

### ❌ Mistake 1: Using font-size multipliers for padding

```css
/* WRONG - mixing concepts */
.card {
  padding: calc(var(--font-size-scale) * 16px);  /* Confusing */
  font-size: var(--font-size-body);
}
```

**FIX:**
```css
/* RIGHT - use spacing for padding */
.card {
  padding: var(--spacing-4);  /* Clear intent */
  font-size: var(--font-size-body);
}
```

### ❌ Mistake 2: Hardcoding percentages that should scale

```css
/* WRONG - fixed ratio doesn't scale well */
.sidebar {
  width: 280px;  /* Doesn't adapt to density changes */
  padding: 16px;
}
```

**FIX:**
```css
/* RIGHT - use CSS variables where sensible */
.sidebar {
  width: var(--page-sidebar-width, 280px);  /* Configurable */
  padding: var(--spacing-4);  /* Scales */
}
```

### ❌ Mistake 3: Nesting too many calc() levels

```css
/* WRONG - hard to read, inefficient */
.text {
  font-size: calc(var(--font-size-body) * var(--font-size-scale) * 1.2);
}
```

**FIX:**
```css
/* RIGHT - use predefined tiers */
.text {
  font-size: var(--font-size-lg);  /* Already includes scaling */
}
```

---

## Reference

- **Full Documentation:** `docs/DYNAMIC_CSS_SYSTEM.md`
- **Global Styles:** `apps/app-shell/src/styles.css`
- **Settings Service:** `libs/core/src/lib/design-system/ui-settings.service.ts`
- **Design Tokens:** `docs/contracts/design-tokens.json`

---

## Questions?

Check the architecture document or review examples in:
- `libs/features/profile/src/lib/profile/profile.component.css`
- `libs/features/settings/src/lib/settings/settings.css`
