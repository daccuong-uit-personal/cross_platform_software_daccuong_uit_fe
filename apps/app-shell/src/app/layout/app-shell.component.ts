import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@fe/core';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, RouterModule],
  templateUrl: './app-shell.component.html',
})

export class AppShellComponent {
  authService = inject(AuthService);
}
