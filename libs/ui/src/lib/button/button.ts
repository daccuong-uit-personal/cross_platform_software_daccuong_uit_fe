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
      background-color: oklch(0.48 0.2 260);
      padding: 0.75rem 1.5rem;
      font-family: 'Outfit', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      color: #fff;
      box-shadow: 0 4px 14px 0 oklch(0.48 0.2 260 / 0.35);
      transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
      cursor: pointer;
      border: none;
    }
    lib-button button:hover {
      background-color: oklch(0.55 0.22 260);
      box-shadow: 0 0 0 4px oklch(0.48 0.2 260 / 0.15), 0 4px 14px 0 oklch(0.48 0.2 260 / 0.4);
    }
    lib-button button:active {
      transform: scale(0.98);
    }
    lib-button button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }
  `],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
    >
      <ng-content />
    </button>
  `,
})
export class UiButton {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
}
