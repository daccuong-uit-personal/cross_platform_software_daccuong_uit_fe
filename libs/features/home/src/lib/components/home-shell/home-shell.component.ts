import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, BottomMenuComponent, RightSidebarComponent],
  selector: 'fe-home-shell',
  templateUrl: './home-shell.component.html',
  styleUrls: ['./home-shell.component.css'],
})
export class HomeShellComponent {}
