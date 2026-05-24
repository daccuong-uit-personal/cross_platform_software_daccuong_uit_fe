import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';
import { SharedHeaderComponent } from '@fe/ui';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, RouterModule, SharedHeaderComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  authService = inject(AuthService);
}
