import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-button',
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    lib-button button {
      position: relative;
      display: inline-flex;
      height: 3rem;
      width: 100%;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 0.875rem;
      padding: 0.75rem 1.5rem;
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;
      border: 1px solid transparent;
    }

    /* Variants */
    lib-button button.primary {
      background-color: var(--color-brand-primary);
      color: var(--color-text-inverse);
      box-shadow: 0 4px 14px 0 var(--color-brand-primary / 0.35);
    }
    lib-button button.primary:hover:not(:disabled) {
      background-color: var(--color-brand-primary-hover);
      box-shadow: 0 0 0 4px var(--color-brand-primary / 0.15), 0 4px 14px 0 var(--color-brand-primary / 0.4);
    }

    lib-button button.outline {
      background-color: transparent;
      border-color: var(--color-brand-primary);
      color: var(--color-brand-primary);
    }
    lib-button button.outline:hover:not(:disabled) {
      background-color: var(--color-brand-primary / 0.05);
    }

    lib-button button.ghost {
      background-color: transparent;
      color: var(--color-text-muted);
    }
    lib-button button.ghost:hover:not(:disabled) {
      background-color: var(--color-surface-subtle);
      color: var(--color-text-base);
    }

    lib-button button:active:not(:disabled) {
      transform: scale(0.98);
    }

    lib-button button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(0.5);
    }
  `],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="variant"
    >
      <ng-content />
    </button>
  `,
})
export class UiButton {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() disabled = false;
}
