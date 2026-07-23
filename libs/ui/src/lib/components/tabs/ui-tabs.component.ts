import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface UiTab {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  link?: string;
}

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ui-tabs.component.html',
  styleUrls: ['./ui-tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabsComponent implements AfterViewInit, OnDestroy {
  @Input() tabs: UiTab[] = [];
  @Input() activeTabId: string | null = null;
  @Output() tabChange = new EventEmitter<UiTab>();

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  @ViewChild('tabsWrapper', { static: true }) tabsWrapper!: ElementRef<HTMLDivElement>;

  visibleTabs = signal<UiTab[]>([]);
  hiddenTabs = signal<UiTab[]>([]);
  dropdownOpen = signal(false);

  private resizeObserver: ResizeObserver | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.calculateTabs();
    
    // Listen to container resize
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateTabs();
      });
      this.resizeObserver.observe(this.container.nativeElement);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', this.onWindowResize);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    this.calculateTabs();
  };

  private calculateTabs() {
    if (!this.tabs || this.tabs.length === 0) return;

    const containerWidth = this.container.nativeElement.offsetWidth;
    // Approximation: 120px per tab, plus 100px for the "More" button
    // A better approach is measuring actual DOM elements, but for simplicity
    // and performance, we'll estimate based on average char width or a fixed min-width.
    // Let's use a conservative estimate: 
    // "Xem thêm" button = 120px
    const moreBtnWidth = 140;
    
    // If we have plenty of space (e.g., desktop)
    let availableWidth = containerWidth;
    let currentWidth = 0;
    let visibleCount = 0;
    
    // Average width per character + padding
    const getEstimatedTabWidth = (tab: UiTab) => {
      const charWidth = 8; // approx 8px per char
      const padding = 40; // 20px padding each side
      const countWidth = tab.count !== undefined ? 30 : 0;
      return (tab.label.length * charWidth) + padding + countWidth;
    };

    let totalEstimatedWidth = 0;
    for (const tab of this.tabs) {
      totalEstimatedWidth += getEstimatedTabWidth(tab);
    }

    if (totalEstimatedWidth <= containerWidth) {
      // All fit perfectly
      this.visibleTabs.set([...this.tabs]);
      this.hiddenTabs.set([]);
    } else {
      // Need dropdown
      availableWidth = containerWidth - moreBtnWidth;
      
      for (const tab of this.tabs) {
        const w = getEstimatedTabWidth(tab);
        if (currentWidth + w <= availableWidth) {
          currentWidth += w;
          visibleCount++;
        } else {
          break;
        }
      }
      
      // Ensure at least 1 tab is visible if possible
      if (visibleCount === 0 && this.tabs.length > 0) {
        visibleCount = 1;
      }
      
      this.visibleTabs.set(this.tabs.slice(0, visibleCount));
      this.hiddenTabs.set(this.tabs.slice(visibleCount));
    }
    
    this.cdr.detectChanges();
  }

  onTabClick(tab: UiTab, event: Event) {
    if (!tab.link) {
      event.preventDefault();
      this.tabChange.emit(tab);
    }
    this.dropdownOpen.set(false);
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }
}
