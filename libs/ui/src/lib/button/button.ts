import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-button',
  imports: [CommonModule],
  template: `<button [type]="type" [disabled]="disabled" class="ui-button"><ng-content /></button>`,
  styles: [
    `
      .ui-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 3rem;
        padding: var(--space-3) var(--space-5);
        border-radius: var(--radius-xl);
        border: none;
        font-weight: var(--font-weight-semibold);
        background: var(--color-primary-500);
        color: var(--color-text-inverse);
        transition: var(--transition-fast);
      }
      .ui-button:hover:not(:disabled) {
        background: var(--color-primary-600);
      }
      .ui-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    `
  ]
})
export class UiButton {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
}
