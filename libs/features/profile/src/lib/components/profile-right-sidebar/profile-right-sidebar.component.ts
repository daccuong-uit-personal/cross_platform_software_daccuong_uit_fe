import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'feat-profile-right-sidebar',
  templateUrl: './profile-right-sidebar.component.html',
  styleUrls: ['./profile-right-sidebar.component.css'],
})
export class ProfileRightSidebarComponent {}
