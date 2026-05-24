# Skill: Performance Optimization & Quality Assurance

**Agent Owner:** Performance & QA Agent  
**Last Updated:** May 2026  
**Priority:** Critical for production readiness

---

## Overview

This skill defines strategies for monitoring and optimizing application performance, ensuring code quality, and catching regressions before they reach production. Performance and accessibility are non-negotiable requirements.

## Core Principles

1. **Measure First**: Use metrics to drive optimization decisions
2. **Accessibility First**: WCAG 2.1 AA compliance is mandatory
3. **Mobile First**: Optimize for mobile experience
4. **Zero Regressions**: Automated testing catches issues early
5. **Continuous Monitoring**: Track metrics in staging and production

---

## Performance Metrics

### Core Web Vitals

```typescript
// libs/core/src/lib/services/performance.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  /**
   * Measure and report Core Web Vitals
   */
  reportMetrics() {
    // Largest Contentful Paint (LCP)
    // Target: < 2.5s
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('LCP:', entry.renderTime || entry.loadTime);
      });
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID) / Interaction to Next Paint (INP)
    // Target: < 100ms
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('INP:', entry.processingDuration);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input', 'interaction'] });
    
    // Cumulative Layout Shift (CLS)
    // Target: < 0.1
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += (entry as any).value;
          console.log('CLS:', clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}
```

### Performance Budgets

```json
{
  "bundles": [
    {
      "name": "app-shell",
      "maxSize": "250kb"
    },
    {
      "name": "features-home",
      "maxSize": "150kb"
    },
    {
      "name": "features-auth",
      "maxSize": "100kb"
    },
    {
      "name": "ui",
      "maxSize": "100kb"
    }
  ]
}
```

---

## Change Detection Optimization

### OnPush Strategy (Mandatory)

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * ✅ Correct - OnPush strategy
 * Component only updates when:
 * 1. Input properties change
 * 2. Output event is fired
 * 3. Event handler runs
 */
@Component({
  selector: 'app-post-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class PostCardComponent {
  // Implementation
}

/**
 * ❌ Incorrect - Default strategy
 * Component checks for changes on every event
 */
@Component({
  selector: 'app-slow-card',
  template: `...`
})
export class SlowCardComponent {
  // Will cause performance issues
}
```

### TrackBy Function Pattern

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let post of posts; trackBy: trackByPostId">
      {{ post.title }}
    </div>
  `
})
export class PostListComponent {
  posts = [
    { id: '1', title: 'Post 1' },
    { id: '2', title: 'Post 2' },
  ];
  
  /**
   * ✅ Use trackBy to identify items by unique ID
   * Prevents unnecessary DOM operations
   */
  trackByPostId(index: number, post: { id: string }) {
    return post.id;
  }
  
  /**
   * ❌ Without trackBy - forces full list re-render
   */
  // *ngFor="let post of posts" ← causes reflow/repaint
}
```

### Virtual Scrolling

```typescript
import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-infinite-feed',
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="200" class="feed-viewport">
      <div class="post-item" *cdkVirtualFor="let post of posts; trackBy: trackByPostId">
        <app-post-card [post]="post"></app-post-card>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .feed-viewport {
      height: 600px;
      overflow-y: auto;
    }
  `]
})
export class InfiniteFeedComponent {
  posts = Array(10000).fill(null).map((_, i) => ({
    id: i.toString(),
    title: `Post ${i}`,
  }));
  
  trackByPostId(index: number, post: { id: string }) {
    return post.id;
  }
}
```

---

## Bundle Size Analysis

### Webpack Bundle Analyzer

```bash
# Install
npm install --save-dev @angular-builders/custom-webpack webpack-bundle-analyzer

# Build with analysis
npx nx build app-shell --stats-json

# View treemap
npm run analyze
```

### Lazy Loading Structure

```typescript
// ✅ Correct - Features are lazy loaded
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('@fe/features-home').then(m => m.HOME_ROUTES)
  },
  {
    path: 'media',
    loadChildren: () => import('@fe/features-media').then(m => m.MEDIA_ROUTES)
  }
];

// ❌ Incorrect - Everything in app shell
import * as Home from '@fe/features-home';  // Bundled with app-shell
```

---

## Accessibility (WCAG 2.1 AA)

### Semantic HTML

```typescript
@Component({
  selector: 'app-post',
  standalone: true,
  template: `
    <!-- ✅ Semantic structure -->
    <article role="article" aria-label="Post by {{ post.author }}">
      <header>
        <h2>{{ post.title }}</h2>
        <time datetime="{{ post.createdAt }}">{{ post.createdAt | date }}</time>
      </header>
      
      <main>
        <p>{{ post.content }}</p>
        <img [src]="post.image" [alt]="post.imageAlt" />
      </main>
      
      <footer>
        <button 
          [attr.aria-label]="liked ? 'Unlike post' : 'Like post'"
          (click)="toggleLike()">
          {{ liked ? '❤️' : '🤍' }}
        </button>
      </footer>
    </article>
  `
})
export class PostComponent {
  post = {
    title: 'Sample',
    author: 'John',
    createdAt: new Date(),
    content: 'Content',
    image: 'image.jpg',
    imageAlt: 'Description of image'  // Always provide alt text
  };
  liked = false;
  
  toggleLike() {
    this.liked = !this.liked;
  }
}
```

### Keyboard Navigation

```typescript
@Component({
  selector: 'app-button-group',
  standalone: true,
  template: `
    <div role="group" [attr.aria-label]="ariaLabel">
      <button 
        *ngFor="let btn of buttons"
        [attr.aria-pressed]="btn.active"
        [attr.tabindex]="btn.active ? '0' : '-1'"
        (click)="selectButton(btn)"
        (keydown.enter)="selectButton(btn)"
        (keydown.space)="selectButton(btn)">
        {{ btn.label }}
      </button>
    </div>
  `
})
export class ButtonGroupComponent {
  ariaLabel = 'Filter options';
  buttons = [
    { label: 'Recent', active: true },
    { label: 'Popular', active: false },
  ];
  
  selectButton(btn: any) {
    this.buttons.forEach(b => b.active = false);
    btn.active = true;
  }
}
```

### Color Contrast

```css
/* ✅ WCAG AA compliant (4.5:1 for normal text, 3:1 for large text) */
.button {
  /* Dark gray on white = 7.5:1 ratio */
  color: #1a1a1a;
  background: #ffffff;
  border: 2px solid #1a1a1a;
}

.button:focus {
  /* Clear focus indicator (3px minimum) */
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}

/* ❌ Insufficient contrast (2.1:1) */
.weak-text {
  color: #999999;  /* Gray text */
  background: #f5f5f5;  /* Light background
  /* Fails WCAG AA */
}
```

---

## Testing Strategy

### Unit Tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent],
    }).compileComponents();
    
    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should render post content', () => {
    component.post = { id: '1', title: 'Test', content: 'Content' };
    fixture.detectChanges();
    
    const title = fixture.nativeElement.querySelector('h2');
    expect(title.textContent).toBe('Test');
  });
  
  it('should emit like event when liked', () => {
    spyOn(component.liked, 'emit');
    
    const button = fixture.nativeElement.querySelector('[aria-label*="Like"]');
    button.click();
    
    expect(component.liked.emit).toHaveBeenCalled();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can create a post', async ({ page }) => {
  await page.goto('/home');
  
  // Click create button
  await page.click('[aria-label="Create post"]');
  
  // Fill form
  await page.fill('textarea[name="content"]', 'My first post');
  
  // Submit
  await page.click('button:has-text("Post")');
  
  // Verify post appears
  await expect(page.locator('text=My first post')).toBeVisible();
});
```

---

## Monitoring & Analytics

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/angular";

// Initialize in main.ts
Sentry.init({
  dsn: environment.sentryDsn,
  tracesSampleRate: 1.0,
  environment: environment.production ? 'production' : 'development',
  beforeSend(event) {
    // Don't send PII
    if (event.request?.url) {
      delete event.request.cookies;
    }
    return event;
  }
});

// Use in services
@Injectable({ providedIn: 'root' })
export class ApiService {
  handleError(error: HttpErrorResponse) {
    Sentry.captureException(error, {
      tags: {
        'http.status': error.status,
        'http.url': error.url,
      },
      extra: {
        traceId: error.headers.get('x-trace-id'),
      }
    });
  }
}
```

### User Analytics (if applicable)

```typescript
import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  
  trackPageView() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Send to analytics endpoint
        this.sendAnalytics({
          event: 'page_view',
          path: event.url,
          timestamp: new Date().toISOString(),
        });
      });
  }
  
  trackEvent(name: string, properties?: Record<string, any>) {
    this.sendAnalytics({
      event: name,
      properties,
      timestamp: new Date().toISOString(),
    });
  }
  
  private sendAnalytics(data: any) {
    navigator.sendBeacon('/api/analytics', JSON.stringify(data));
  }
}
```

---

## Memory Leak Prevention

### Unsubscribe Pattern

```typescript
import { Component, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-feed',
  standalone: true,
  template: `...`
})
export class FeedComponent implements OnDestroy {
  private postService = inject(PostService);
  
  /**
   * ✅ Modern pattern - auto cleanup
   */
  posts$ = this.postService.getPosts().pipe(
    takeUntilDestroyed()
  );
  
  /**
   * ❌ Old pattern - manual unsubscribe
   * (Don't use unless necessary)
   */
  // private destroy$ = new Subject<void>();
  // 
  // ngOnInit() {
  //   this.postService.getPosts()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(posts => {...});
  // }
  //
  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }
}
```

---

## Best Practices

### ✅ DO

- Use OnPush change detection
- Implement trackBy in loops
- Virtual scroll for long lists
- Lazy load features
- Monitor Core Web Vitals
- Test accessibility
- Use strict TypeScript
- Implement error tracking
- Optimize images
- Minify and tree-shake

### ❌ DON'T

- Default change detection strategy
- Forget trackBy in ngFor
- Load everything upfront
- Ignore bundle size
- Hardcode timeouts
- Create memory leaks
- Skip accessibility tests
- Ignore error logs
- Use uncompressed images
- Log PII

---

## Audit Checklist

- [ ] All components use OnPush change detection
- [ ] All loops have trackBy functions
- [ ] No circular dependencies
- [ ] Bundle size within budget
- [ ] 90+ Lighthouse score
- [ ] WCAG 2.1 AA compliant
- [ ] No console errors/warnings
- [ ] No memory leaks detected
- [ ] Error tracking configured
- [ ] Performance metrics tracked

---

## References

- [Frontend Playbook](../ai-context/frontend-ai-playbook.md)
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
