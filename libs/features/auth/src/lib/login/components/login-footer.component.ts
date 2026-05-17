import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'auth-login-footer',
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Footer is handled by LoginLanguageSelector which contains the register link -->
    <!-- This component is kept for compatibility but renders nothing -->
  `,
})
export class LoginFooter { }