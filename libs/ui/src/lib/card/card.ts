import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-card',
  imports: [CommonModule],
  template: `<section class="ui-card"><ng-content /></section>`,
  styles: [
    `
      .ui-card {
        width: 100%;
        background: var(--color-bg-surface);
        border: 1px solid var(--color-border-base);
        border-radius: var(--radius-2xl);
        padding: var(--space-6);
        box-shadow: var(--shadow-md);
      }
    `
  ]
})
export class UiCard {}
