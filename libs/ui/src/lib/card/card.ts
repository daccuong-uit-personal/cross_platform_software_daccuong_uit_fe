import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'lib-card',
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    lib-card section {
      width: 100%;
      border-radius: 1.5rem;
      padding: 2rem;
      background: rgb(255 255 255 / 0.78);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgb(255 255 255 / 0.35);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.06);
      transition: box-shadow 0.3s ease;
    }
    lib-card section:hover {
      box-shadow: 0 0 0 1px oklch(0.48 0.2 260 / 0.1), 0 20px 40px -10px oklch(0.48 0.2 260 / 0.2);
    }
  `],
  template: `
    <section>
      <ng-content />
    </section>
  `,
})
export class UiCard {}
