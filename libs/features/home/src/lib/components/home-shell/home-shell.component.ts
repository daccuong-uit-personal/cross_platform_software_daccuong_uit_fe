import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageShellComponent, SidebarMenuItem, GLOBAL_MENU_ITEMS } from '@fe/ui';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, PageShellComponent, RightSidebarComponent],
  selector: 'fe-home-shell',
  templateUrl: './home-shell.component.html',
  styleUrls: ['./home-shell.component.css'],
})
export class HomeShellComponent {
  menuItems: SidebarMenuItem[] = GLOBAL_MENU_ITEMS;
}
