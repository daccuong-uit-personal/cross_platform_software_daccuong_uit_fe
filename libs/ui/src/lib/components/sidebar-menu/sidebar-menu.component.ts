import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from './safe-html.pipe';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: string;
  svgIcon?: string;
  link?: string;
  exactMatch?: boolean;
  isAi?: boolean;
  badge?: string;
}

@Component({
  selector: 'ui-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent {
  @Input() items: SidebarMenuItem[] = [];
  @Input() activeItemId: string | null = null;
  
  @Output() itemClick = new EventEmitter<SidebarMenuItem>();

  onItemClick(item: SidebarMenuItem, event: Event) {
    if (!item.link) {
      event.preventDefault();
      this.itemClick.emit(item);
    }
  }
}
