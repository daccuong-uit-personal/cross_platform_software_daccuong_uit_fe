import { Component, inject, signal, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { PageShellComponent, SidebarMenuItem, GLOBAL_MENU_ITEMS } from '@fe/ui';
import { TabKeepAliveService } from '@fe/core';

import { FeedComponent } from '../feed/feed.component';
import { DiscoverComponent } from '../discover/discover.component';
import { FeaturePlaceholderComponent } from '../feature-placeholder/feature-placeholder.component';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';

/** Maps a URL to a simple tab-id string for the template. */
function routeToTabId(url: string): string {
  const path = url.split('?')[0].replace(/\/+$/, '');
  if (path === '/home') return 'home';
  if (path.startsWith('/home/')) return path.slice('/home/'.length);
  return 'home';
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageShellComponent,
    FeedComponent,
    DiscoverComponent,
    FeaturePlaceholderComponent,
    RightSidebarComponent,
  ],
  selector: 'fe-home-shell',
  templateUrl: './home-shell.component.html',
  styleUrls: ['./home-shell.component.css'],
})
export class HomeShellComponent implements OnInit, OnDestroy {
  private router    = inject(Router);
  private keepAlive = inject(TabKeepAliveService);

  menuItems: SidebarMenuItem[] = GLOBAL_MENU_ITEMS;

  /**
   * Which tab is currently visible.
   * Driven by NavigationEnd events so it stays in sync with the browser URL.
   */
  activeTab = signal<string>('home');

  /**
   * Lazy-activation map: once a tab has been visited it stays rendered.
   * This prevents heavy components from being in the DOM on first load.
   */
  activatedTabs = signal<Set<string>>(new Set(['home']));

  /** Route data forwarded to FeaturePlaceholderComponent instances. */
  placeholderData: Record<string, { title: string; description: string }> = {
    notifications: { title: 'Thông báo',  description: 'Xem tất cả cảnh báo và hoạt động của bạn.' },
    following:     { title: 'Theo dõi',   description: 'Danh sách người bạn đang theo dõi và gợi ý mới.' },
    chat:          { title: 'Chat',       description: 'Tin nhắn và cuộc trò chuyện trực tiếp.' },
    'reals-ai':    { title: 'Reals AI',   description: 'Trí tuệ nhân tạo hỗ trợ sáng tạo nội dung.' },
    bookmarks:     { title: 'Dấu trang',  description: 'Bài viết đã lưu để đọc lại sau.' },
    premium:       { title: 'Premium',    description: 'Nâng cấp gói để có trải nghiệm cao cấp.' },
    more:          { title: 'Thêm',       description: 'Các tùy chọn và cài đặt bổ sung.' },
  };

  private subs = new Subscription();

  // ─── Angular lifecycle ─────────────────────────────────────────────────

  ngOnInit(): void {
    this.connectRouter();
    this.syncFromUrl(this.router.url);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ─── RouteReuseStrategy lifecycle hooks ────────────────────────────────
  //
  // Angular calls _onAttach / _onDetach when the RouteReuseStrategy
  // stores or restores this component's view without destroying it.
  //
  // On reattach: re-sync the activeTab from the router so the correct
  //   child tab is visible immediately, without waiting for NavigationEnd.
  // On detach: keep the subscription alive — the component stays in memory
  //   so the router subscription remains valid and will update state if
  //   the user navigates to a /home/* sub-route while the shell is detached.

  /** Called by Angular when RouteReuseStrategy reattaches this component. */
  _onAttach(): void {
    this.syncFromUrl(this.router.url);
  }

  // ─── Internal helpers ──────────────────────────────────────────────────

  /**
   * Subscribe to NavigationEnd to keep activeTab in sync.
   * Called once in ngOnInit; the subscription lives for the component lifetime.
   */
  private connectRouter(): void {
    this.subs.add(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      ).subscribe((e) => this.syncFromUrl(e.urlAfterRedirects))
    );
  }

  /** Update signals + service from a URL string. */
  private syncFromUrl(url: string): void {
    const tab = routeToTabId(url);
    this.activeTab.set(tab);
    this.keepAlive.setActiveRoute(url);
    // Lazy-activation: mark tab as visited on first access
    this.activatedTabs.update((s) => new Set([...s, tab]));
  }

  // ─── Template helpers ──────────────────────────────────────────────────

  /** Whether a given tab-id is currently visible. */
  isTabVisible(tabId: string): boolean {
    return this.activeTab() === tabId;
  }

  /** Whether a given tab-id has ever been activated (lazy init guard). */
  isTabActivated(tabId: string): boolean {
    return this.activatedTabs().has(tabId);
  }
}
