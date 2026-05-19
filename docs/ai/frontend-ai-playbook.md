# Frontend AI Playbook

## Purpose
Tài liệu **duy nhất** tổng hợp toàn bộ triết lý, nguyên tắc, và roadmap vision cho dự án frontend Social Commerce Creator Platform.

> Xem thêm agent responsibilities: [`agent-roles.md`](./agent-roles.md)

---

## Core FE Philosophy

- FE là nền tảng **trình diễn và tương tác**, không phải engine xử lý nghiệp vụ.
- FE phải **tin tưởng backend contract** và chỉ dùng backend làm nguồn dữ liệu nghiệp vụ.
- FE chịu trách nhiệm về hiệu năng, trải nghiệm, khả năng phản hồi và khả năng vận hành.
- FE cần sớm có CI/CD, release governance, và observability.

---

## FE Guardrails

### Must DO ✅
- Render nhanh, responsive, accessible.
- Dùng `OnPush`, `trackBy`, lazy loading, route splitting và virtual rendering.
- Thiết kế state bằng **Signals** cho UI, **RxJS** cho streams, API, websocket.
- Xử lý lỗi mạng mềm dẻo, tránh memory leak.
- Sử dụng TypeScript strict mode — tránh `any`.
- Retry với exponential backoff; mutex cho token refresh để tránh race conditions.
- Propagate trace IDs từ backend; log errors với Sentry (không log PII).

### Must NOT ❌
- Tính toán ranking, pricing, inventory, permission, transaction truth.
- Duplicate backend business logic.
- Orchestrate backend workflow trong critical path.
- Treat WebSocket as source of truth.
- Create hidden cross-domain imports hoặc coupling.
- Import feature lib trực tiếp — chỉ qua lazy-loaded router.

---

## State Architecture

| State Type | Tool | Use Case |
|---|---|---|
| UI/component state | Angular Signals | modal, filter, toggle, selection |
| Async streams | RxJS | API calls, WebSocket, debounce, retry |
| Avoid | NgRx / global god store | over-abstraction |

---

## Monorepo Rules (Nx)

```
apps/
└── app-shell/       # Entry point, zero business logic

libs/
├── core/            # API, auth, config, interceptors, guards — type:core
├── ui/              # Shared components, design tokens — type:ui
└── features/
    ├── auth/        # Login, Register — type:feature, scope:auth
    └── dashboard/   # Dashboard — type:feature, scope:dashboard
```

**Dependency boundary** (enforced by ESLint `@nx/enforce-module-boundaries`):
```
type:app     → core, ui, feature
type:feature → core, ui
type:ui      → core
type:core    → core only
```

---

## CI/CD & Build

- Dùng Nx affected builds (`npx nx affected -t build`) — chỉ rebuild những gì thay đổi.
- Pipeline FE phải có: build → lint → test → bundle-size check → deploy.
- Không có `postcss.config.js` hay `tailwind.config.js` — Angular 21 native Tailwind v4 qua esbuild.
- Feature flags cho gradual rollout; dev / staging / prod environments tách biệt.

---

## Phase Roadmap

| Phase | Name | Status |
|---|---|---|
| **0** | Cross Project Foundation Platform | ✅ Done |
| **1** | Frontend Foundation Platform | ✅ Done |
| **2** | Design System Platform | ✅ Done |
| **3** | Auth + Identity Platform | ✅ Done |
| **4** | Media Platform | 🔜 Next |
| **5** | Social Platform | ⏳ Planned |
| **6** | Realtime Platform | ⏳ Planned |
| **7** | Search Platform | ⏳ Planned |
| **8** | Creator Studio Platform | ⏳ Planned |
| **9** | Chat Platform | ⏳ Planned |
| **10** | Commerce Platform | ⏳ Planned |
| **11** | Live Platform | ⏳ Planned |
| **12** | Recommendation Platform | ⏳ Planned |
| **13** | Performance Platform | ⏳ Planned |
| **14** | Platform Engineering | ⏳ Planned |

### Phase 0 — What was built
- Design Token System: Semantic OKLCH color tokens trong `styles.css` via Tailwind v4 `@theme`.
- Lazy loading: tất cả routes dùng `loadChildren` — initial bundle ~42KB.
- i18n: Transloco với `en` / `vi`, assets tại `public/assets/i18n/`.
- Core services: `AuthService`, `ApiService`, `ThemeService`, HTTP interceptors.
- Shared UI: `UiButton`, `UiCard` với inline styles (ng-packagr compatible).
- ESLint Module Boundaries: 4 dependency rules enforced.
- Runtime Config: `window.__APP_CONFIG__` trong `index.html`.

### Phase 1 — What was built
- Strict TypeScript Mode: Đã fix các lỗi `any`, unused variables và type warnings.
- Http Interceptors: Hoàn thiện logic Trace Propagation `X-Correlation-ID`, 401 Unauthorized token refresh.
- API & Auth Services: Strict type cho Observable streams.
- CI/CD Checks: Đảm bảo build, lint, test cho toàn bộ nx workspace đều pass 100%.

### Phase 2 — What was built
- Global Design Tokens: Hệ thống màu semantic (Success, Danger, Warning), typography scales, và premium effects (glassmorphism) trong `styles.css`.
- Core UI Components: Refactor `UiButton` và `UiCard` sử dụng tokens. Thêm `UiInput` hỗ trợ `ControlValueAccessor` và @if control flow.
- Utility Classes: Cung cấp bộ typography (`text-h1` đến `text-body`) và layout (`page-container`) chuẩn.
- Infrastructure Stability: Toàn bộ UI library được lint-checked và build-ready để tái sử dụng cho các phase sau.

### Phase 3 — Auth + Identity Platform
- Auth Feature Refactor: Cập nhật `LoginComponent` và `RegisterComponent` sử dụng `UiInput` và `UiButton` từ Design System.
- Session Management: Tích hợp `AuthService.checkAuth()` tại `AppComponent` để khôi phục phiên đăng nhập khi reload.
- Route Protection: Cấu hình `authGuard` bảo vệ Dashboard và `guestGuard` bảo vệ các trang Login/Register.
- Validation & UX: Xử lý validation form chi tiết, thông báo lỗi qua `toast` và trạng thái `isLoading` mượt mà.

---

## Key Gaps to Address (Backlog)

- Thêm acceptance criteria và success metrics mỗi phase.
- Xác định contract FE/BE cho auth, media, commerce, live.
- Làm rõ MVP path Phase 0–5.
- Performance checklist, bundle governance docs, memory profiling guide.
- Release flow và CI pipeline documentation.
