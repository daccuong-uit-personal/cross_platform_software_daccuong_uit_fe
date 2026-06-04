/**
 * UI Settings Service
 * Manages application-wide UI settings: font family, font size, padding scale
 * Single source of truth for visual configuration
 * 
 * Settings persist in localStorage and apply globally via CSS variables
 */

import { Injectable, signal, computed, effect } from '@angular/core';
import { DesignTokens } from './design-tokens';

export interface UiSettings {
  // Typography
  fontFamily: 'ui' | 'body' | 'heading' | 'display';
  fontSize: 'compact' | 'normal' | 'large' | 'xlarge';    // Scale multiplier
  lineHeight: 'tight' | 'normal' | 'relaxed' | 'loose';
  
  // Spacing
  paddingScale: 'compact' | 'normal' | 'comfortable' | 'spacious'; // Scale multiplier
  
  // Appearance
  theme: 'light' | 'dark' | 'ocean' | 'forest';
  highContrast: boolean;
  reducedMotion: boolean;
}

export const DEFAULT_UI_SETTINGS: UiSettings = {
  fontFamily: 'ui',
  fontSize: 'normal',
  lineHeight: 'normal',
  // default back to compact (original default)
  paddingScale: 'compact',
  theme: 'light',
  highContrast: false,
  reducedMotion: false,
};

// Font size multipliers (relative to base)
const FONT_SIZE_SCALES: Record<UiSettings['fontSize'], number> = {
  compact: 0.533,
  normal: 0.667,
  large: 0.800,
  xlarge: 0.934,
};

// Padding scale multipliers (relative to base)
const PADDING_SCALES: Record<UiSettings['paddingScale'], number> = {
  compact: 0.525,
  normal: 0.75,
  comfortable: 0.9,
  spacious: 1.125,
};

@Injectable({ providedIn: 'root' })
export class UiSettingsService {
  // ══════════════════════════════════════════════════════════════
  // Settings State (Signals for reactivity)
  // ══════════════════════════════════════════════════════════════
  private settings$ = signal<UiSettings>(this.loadSettings());

  // Public selectors
  fontFamily$ = computed(() => this.settings$().fontFamily);
  fontSize$ = computed(() => this.settings$().fontSize);
  lineHeight$ = computed(() => this.settings$().lineHeight);
  paddingScale$ = computed(() => this.settings$().paddingScale);
  theme$ = computed(() => this.settings$().theme);
  highContrast$ = computed(() => this.settings$().highContrast);
  reducedMotion$ = computed(() => this.settings$().reducedMotion);

  // ══════════════════════════════════════════════════════════════
  // Computed CSS Values (for component use)
  // ══════════════════════════════════════════════════════════════
  fontSizeMultiplier$ = computed(() => FONT_SIZE_SCALES[this.fontSize$()]);
  paddingMultiplier$ = computed(() => PADDING_SCALES[this.paddingScale$()]);

  // ══════════════════════════════════════════════════════════════
  // Constructor with Side Effects
  // ══════════════════════════════════════════════════════════════
  constructor() {
    // Apply settings to DOM whenever they change
    effect(() => {
      this.applySettingsToDOM(this.settings$());
    });

  }

  // ══════════════════════════════════════════════════════════════
  // Public Methods: Get/Set Settings
  // ══════════════════════════════════════════════════════════════

  /**
   * Get current settings (copy to prevent mutation)
   */
  getSettings(): UiSettings {
    return { ...this.settings$() };
  }

  /**
   * Update single setting
   */
  updateSetting<K extends keyof UiSettings>(key: K, value: UiSettings[K]): void {
    this.settings$.update(s => ({ ...s, [key]: value }));
    this.saveSettings();
  }

  /**
   * Update multiple settings at once
   */
  updateSettings(partial: Partial<UiSettings>): void {
    this.settings$.update(s => ({ ...s, ...partial }));
    this.saveSettings();
  }

  /**
   * Reset to default settings
   */
  resetToDefaults(): void {
    this.settings$.set(DEFAULT_UI_SETTINGS);
    this.saveSettings();
  }

  // ══════════════════════════════════════════════════════════════
  // Utility Methods: Generate CSS Values
  // ══════════════════════════════════════════════════════════════

  /**
   * Get scaled font size based on current setting
   * Usage: service.getScaledFontSize('1rem') → '1.15rem'
   */
  getScaledFontSize(baseSize: string): string {
    const multiplier = this.fontSizeMultiplier$();
    const baseValue = parseFloat(baseSize);
    return `${baseValue * multiplier}rem`;
  }

  /**
   * Get scaled padding based on current setting
   * Usage: service.getScaledPadding('1rem') → '1.2rem'
   */
  getScaledPadding(basePadding: string): string {
    const multiplier = this.paddingMultiplier$();
    const baseValue = parseFloat(basePadding);
    return `${baseValue * multiplier}rem`;
  }

  /**
   * Get font family value
   */
  getFontFamily(): string {
    return DesignTokens.typography.fontFamily[this.fontFamily$()];
  }

  /**
   * Get line height value
   */
  getLineHeight(): number {
    return DesignTokens.lineHeight[this.lineHeight$()];
  }

  /**
   * Get theme class name
   */
  getThemeClass(): string {
    const theme = this.theme$();
    return theme === 'light' ? '' : theme; // 'light' is default, no class needed
  }

  // ══════════════════════════════════════════════════════════════
  // Private Methods: DOM & Storage
  // ══════════════════════════════════════════════════════════════

  /**
   * Apply settings to DOM (document root)
   */
  private applySettingsToDOM(settings: UiSettings): void {
    const root = document.documentElement;

    // Apply font family
    root.style.setProperty('--font-family', this.getFontFamily());

    const fontScale = FONT_SIZE_SCALES[settings.fontSize];
    const paddingScale = PADDING_SCALES[settings.paddingScale];

    root.style.setProperty('--font-size-scale', String(fontScale));
    root.style.setProperty('--padding-scale', String(paddingScale));

    // Apply line height
    root.style.setProperty('--line-height', String(this.getLineHeight()));

    // Apply theme
    document.documentElement.className = this.getThemeClass();
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('reduce-motion', settings.reducedMotion);
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): UiSettings {
    try {
      const stored = localStorage.getItem('ui-settings');
      if (stored) {
        return { ...DEFAULT_UI_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load UI settings from localStorage', error);
    }
    return DEFAULT_UI_SETTINGS;
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('ui-settings', JSON.stringify(this.settings$()));
    } catch (error) {
      console.warn('Failed to save UI settings to localStorage', error);
    }
  }
}
