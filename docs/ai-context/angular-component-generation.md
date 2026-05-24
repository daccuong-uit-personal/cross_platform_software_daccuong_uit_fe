# Skill: Angular Component & Feature Generation

**Agent Owner:** Angular Generator Agent  
**Last Updated:** May 2026  
**Priority:** Essential for feature development

---

## Overview

This skill defines how to scaffold and generate Angular components, modules, routes, and features following Signals-first architecture and Nx conventions. All generated code must integrate seamlessly with the monorepo structure.

## When to Apply

- ✅ Creating new standalone Angular components
- ✅ Building new feature modules in `libs/features/`
- ✅ Generating routes and lazy-loaded feature routes
- ✅ Setting up Signal-backed state management
- ✅ Creating services with dependency injection
- ✅ Building form components with reactive forms
- ✅ Scaffolding new feature shells

---

## Component Generation Standards

### Standalone Components (Preferred)

```typescript
import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Button Component - Reusable button with design tokens
 * @example
 * <app-button variant="primary" (click)="onClick()">
 *   Click me
 * </app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class.variant-primary]="variant() === 'primary'"
      [class.variant-secondary]="variant() === 'secondary'"
      [disabled]="disabled()"
      (click)="clicked.emit()"
      class="btn">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: calc(var(--padding-scale, 1) * 0.75rem) 
               calc(var(--padding-scale, 1) * 1rem);
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms ease;
      border: none;
    }
    
    .variant-primary {
      background-color: var(--color-brand-primary);
      color: white;
    }
    
    .variant-primary:hover {
      background-color: var(--color-brand-primary-hover);
    }
    
    .variant-secondary {
      background-color: var(--color-surface-subtle);
      color: var(--color-text-base);
      border: 1px solid var(--color-border-subtle);
    }
  `]
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input<boolean>(false);
  clicked = output<void>();
}
```

### Naming Convention

- Components: `{name}.component.ts`
- Services: `{name}.service.ts`
- Models/Interfaces: `{name}.model.ts` or `{name}.ts`
- Routes: `lib.routes.ts` (in feature libraries)
- Facade: `{domain}.facade.ts` (for complex state)

---

## Feature Generation

### Directory Structure

```
libs/features/{feature}/
├── project.json
├── eslint.config.mjs
├── jest.config.cts
├── ng-package.json
├── package.json
├── tsconfig.json
├── tsconfig.lib.json
├── README.md
└── src/
    ├── index.ts                 # Public API barrel export
    ├── test-setup.ts
    └── lib/
        ├── lib.routes.ts        # Feature routes
        ├── {feature}.component.ts       # Main component
        ├── data-access/         # State & services
        │   ├── index.ts
        │   ├── {feature}.facade.ts
        │   └── {feature}.service.ts
        └── components/          # Child components
            ├── sub-component-1.component.ts
            └── sub-component-2.component.ts
```

### Feature Routes Template

```typescript
// libs/features/auth/src/lib/lib.routes.ts
import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
```

### Registering in App Routes

```typescript
// apps/app-shell/src/app/routes/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@fe/core';
import { AUTH_ROUTES } from '@fe/features-auth';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: AUTH_ROUTES,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('@fe/features-home').then(m => m.HOME_ROUTES),
  },
];
```

---

## Signal-Based State Management

### Component State with Signals

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Is Even: {{ isEven() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  isEven = computed(() => this.count() % 2 === 0);
  
  constructor() {
    effect(() => {
      console.log(`Count changed to: ${this.count()}`);
    });
  }
  
  increment() {
    this.count.update(v => v + 1);
  }
}
```

### Service with Signals

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  userCount = computed(() => this.users().length);
  
  loadUsers() {
    this.loading.set(true);
    this.http.get<User[]>('/api/users').subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
```

---

## Form Generation

### Reactive Form Component

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input 
          id="name"
          formControlName="name"
          class="form-input"
          placeholder="Enter name">
        <div *ngIf="form.get('name')?.hasError('required')" class="error">
          Name is required
        </div>
      </div>
      
      <div>
        <label for="email">Email:</label>
        <input 
          id="email"
          type="email"
          formControlName="email"
          class="form-input"
          placeholder="Enter email">
      </div>
      
      <button type="submit" [disabled]="!form.valid" class="btn btn-primary">
        Submit
      </button>
    </form>
  `,
  styles: [`
    .form-input {
      padding: calc(var(--padding-scale, 1) * 0.5rem) 
               calc(var(--padding-scale, 1) * 0.75rem);
      border: 1px solid var(--color-border-subtle);
      border-radius: 0.5rem;
      font-size: 1rem;
    }
    
    .error {
      color: var(--color-danger);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  
  form!: FormGroup;
  
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## Service Generation

### Domain Service Template

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '@fe/core';

/**
 * Profile Service - Handles user profile operations
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly api = inject(ApiService);
  private readonly baseUrl = '/api/profiles';
  
  /**
   * Get user profile by ID
   * @param userId User ID
   * @returns Profile observable
   */
  getProfile(userId: string): Observable<Profile> {
    return this.api.get<Profile>(`${this.baseUrl}/${userId}`);
  }
  
  /**
   * Update user profile
   * @param userId User ID
   * @param profile Updated profile data
   * @returns Updated profile observable
   */
  updateProfile(userId: string, profile: Partial<Profile>): Observable<Profile> {
    return this.api.put<Profile>(`${this.baseUrl}/${userId}`, profile);
  }
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}
```

---

## Best Practices

### ✅ DO

- Use Signals for UI/component state
- Use RxJS for streams, API calls, and complex async logic
- Implement OnPush change detection strategy
- Use `trackBy` in `*ngFor` loops
- Lazy-load features via routing
- Follow single responsibility principle
- Export public API via `index.ts` barrel exports
- Write unit tests alongside components

### ❌ DON'T

- Use two-way binding `[(ngModel)]` in new code (use Signals + one-way binding)
- Create global god stores (NgRx)
- Mix Signals with RxJS in the same state management
- Import features directly — use lazy-loaded routes
- Hardcode values — use design tokens
- Create circular dependencies between libs

---

## Testing

### Unit Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
    
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should emit clicked event on button click', () => {
    spyOn(component.clicked, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
  
  it('should apply primary variant class', () => {
    component.variant.set('primary');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('variant-primary')).toBe(true);
  });
});
```

---

## References

- [Angular 21 Signals Docs](https://angular.io/guide/signals)
- [Nx Module Federation](https://nx.dev/concepts/module-federation)
- [Project Structure](../architecture/nx-workspace.md)
- [Design System Skill](./design-system-component-generation.md)
- [Frontend Playbook](../ai-context/frontend-ai-playbook.md)
