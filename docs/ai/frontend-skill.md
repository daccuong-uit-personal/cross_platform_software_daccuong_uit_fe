# Frontend Skills — Platform Engineering & AI Guidance

## 🎯 Core Principles
- **FE is UX Platform**: Render, interact, and present backend contracts beautifully.
- **Trust Backend**: Backend owns ranking, business logic, pricing, permissions, transaction truth.
- **Fail Gracefully**: Network failures, slow APIs, missing data should degrade UX, not break it.
- **Performance First**: Bundle size, render time, memory, and interactivity matter more in FE.

## ✅ Mandatory (The "Must-Haves")

### 1. State Architecture
- **Signals** for component-level UI state, selection, modal, toggle, filters.
- **RxJS** for streams, API calls, retries, debounce, WebSocket, real-time invalidation.
- Avoid shared global god store; prefer domain-scoped stores per feature.
- Make state atomic and derive selectors rather than compute on-the-fly.

### 2. Change Detection & Rendering
- Use `ChangeDetectionStrategy.OnPush` everywhere—no exception.
- Use `trackBy` for lists to prevent unnecessary DOM diffing.
- Implement `@track` on signals and virtual scrolling for large collections.
- Apply skeleton/loading states to reduce perceived latency.
- Use lazy loading and route splitting to keep initial bundles small.

### 3. API Integration
- Use generated OpenAPI/Swagger clients—never write HTTP calls manually.
- Normalize request/response formats in adapters, not in components.
- Map errors to UX-friendly messages; show backend error details only in dev/logs.
- Implement request cancellation and timeout handling via RxJS operators.

### 4. Network Resilience
- Retry failed API calls with exponential backoff (transient errors only).
- Implement a mutex for token refresh to avoid race conditions.
- Use optimistic updates for fast UX; sync with server on complete.
- Handle slow networks: show progress, allow cancel, provide fallback content.
- Never block user interaction on background API calls.

### 5. Observability
- Propagate trace IDs from backend to FE; correlate user flows.
- Send Core Web Vitals (LCP, FID, CLS) and custom metrics to telemetry backend.
- Log frontend errors and stack traces to Sentry with user/session context.
- Avoid logging sensitive data (passwords, tokens, PII).

### 6. Accessibility & Responsive
- Use semantic HTML and ARIA labels; test with screen readers.
- Ensure keyboard navigation; avoid trapping focus in modals.
- Support both touch and mouse interactions.
- Design for mobile-first; test at 320px, 768px, 1024px, 1440px.
- Avoid hardcoded colors; use design tokens for theme support.

### 7. Code Quality
- Use TypeScript strict mode and avoid `any`.
- Run ESLint, Prettier, and type checks before commit.
- Limit component complexity: max 150 lines per component.
- Organize code by feature; avoid deep nesting.
- Write unit tests for services, state, and complex logic.

## 🚫 Forbidden (The "Never-Dos")

1. **No Business Logic in FE**
   - Do not calculate ranking, pricing, inventory, permissions, transaction state.
   - Do not duplicate workflow orchestration.
   - Do not validate business rules; trust backend validation.

2. **No WebSocket as Source of Truth**
   - WebSocket is for hints, notifications, and presence only.
   - Always fetch fresh data from API when accuracy matters.

3. **No Cross-Domain Coupling**
   - Feed domain must not import from commerce, live, or chat internals.
   - Each feature lib should be independently deployable.

4. **No Manual Data Joining**
   - Do not combine raw backend responses in FE to infer business state.
   - Do not create complex derived selectors that duplicate backend aggregation.

5. **No Monolithic Shared Lib**
   - Avoid a catch-all `shared` folder; split by domain (e.g., `shared-ui`, `auth-lib`, `api-client`).

6. **No Blocking Operations**
   - Never use synchronous operations or loops that freeze the UI.
   - Use requestAnimationFrame and scheduling for long tasks.

## 🧩 Monorepo Architecture

### Nx Workspace Rules
- Enforce import boundaries: `@fe/auth/`, `@fe/feed/`, `@fe/commerce/`, etc.
- Use dependency constraints to prevent cross-domain imports.
- Each lib has a single entry point (`index.ts` in `public-api.ts`).

### App & Lib Structure
```
apps/
├── web/                 # Main web app
├── admin/               # Admin dashboard
├── creator-studio/      # Creator tools
└── mobile-shell/        # Mobile wrapper

libs/
├── core/                # API, auth, storage, config, logging
├── shared-ui/           # Design tokens, components, theme
├── features/
│   ├── auth/            # Login, onboarding, consent
│   ├── profile/         # User profile, settings
│   ├── feed/            # Social feed, content cards
│   ├── media/           # Video, image, player
│   ├── commerce/        # Catalog, cart, checkout
│   ├── creator/         # Dashboard, analytics
│   ├── chat/            # Messaging
│   ├── live/            # Streaming, events
│   ├── search/          # Autocomplete, results
│   └── analytics/       # User dashboards
└── shared/
    ├── utils/           # Formatters, validators, helpers
    ├── pipes/           # Reusable pipes
    └── directives/      # Common directives
```

### Build & CI/CD
- Use Nx affected builds to rebuild only changed projects.
- Enable distributed caching for faster CI.
- Add bundle size checks and performance regression alerts.
- Run unit tests, e2e tests, and a11y audits in CI.
- Use feature flags for gradual rollout.
- Maintain separate dev, staging, prod environments.

## 🌐 Social Intelligence & UX Replication Rules

### Social Intelligence (Phase 15)
- Aggregate trending content from backend aggregation service, not direct API.
- Use RxJS for real-time trend streams and Web Workers for heavy computation.
- Render trending insights, hashtags, creators, viral patterns.
- Store aggregated data in IndexedDB for offline browsing.
- Use Service Workers for background monitoring and periodic checks.
- Track engagement metrics but do NOT calculate ranking.

### Social UX Replication (Phase 16)
- Replicate UI/UX patterns inspired by TikTok, Instagram, Facebook, X.
- Build custom feed layouts: vertical swipe (TikTok), grid masonry (Instagram), timeline (Facebook), text-feed (X).
- Implement gesture handling: swipe, double-tap, long-press, pinch-to-zoom.
- Create video player UX with native controls (no external player SDK).
- Build interaction patterns: like, comment, share, retweet, duet inspiration.
- Optimize animations and transitions for 60fps mobile experience.
- Lazy load feed items and prefetch next videos for smooth scrolling.
- Implement virtual scrolling for large feeds and memory cleanup on unmount.
- FE NEVER embeds external platform SDK or code.
- All state, gesture, and animation logic = FE responsibility.

### Video Player Considerations
- Support HLS and DASH streaming formats.
- Implement progress bar, play/pause, mute, fullscreen, subtitle controls.
- Prefetch and preload next video for seamless transitions.
- Handle buffering, network errors, and quality switches.
- Clean up video resources on component unmount.

### Feed Rendering Performance
- Use virtual scrolling for lists exceeding 50 items.
- Implement intersection observer to pause playback outside viewport.
- Lazy load images with blur placeholder and progressive JPEG.
- Preload metadata for next 2–3 feed items.
- Cancel ongoing API calls when scrolling rapidly.

### Responsive & Gesture Design
- Mobile-first feed design: vertical swipe, bottom navigation.
- Desktop variant: horizontal scroll, side navigation.
- Touch gesture library for consistent swipe/long-press behavior.
- Avoid hardcoded viewport sizes; use CSS media queries and design tokens.

### Trending & Discovery
- Render trending hashtags, sounds, and creators.
- Implement category browse and algorithm-driven suggestions.
- Show trending notifications and alerts.
- Support search suggestions and autocomplete.

## 🤖 AI Agent Guidance

### Frontend Architect Agent
- Validate import boundaries and module federation.
- Suggest performance optimizations.
- Review CI/CD and release governance.

### Angular Generator Agent
- Scaffold modules, components, routes.
- Generate Signal-backed stores.
- Create interceptor and guard boilerplate.

### UI System Agent
- Maintain design token consistency.
- Generate components from Figma tokens.
- Ensure responsive and accessible patterns.

### API Integration Agent
- Sync OpenAPI/Swagger and generate clients.
- Normalize error mapping.
- Create API adapters.

### Performance Agent
- Analyze bundle size and runtime metrics.
- Detect memory leaks and rerenders.
- Suggest lazy loading and code split opportunities.

### QA Agent
- Validate responsive layouts and interactions.
- Run accessibility audits.
- Generate test coverage reports.

### Social UX Replication Agent
- Replicate UI/UX from TikTok, Instagram, Facebook, X.
- Build feed layout variants and video player UX.
- Implement gesture handling and animation optimization.
- Ensure 60fps mobile responsiveness and memory efficiency.

## 📦 Output Artifacts (Must Build)
- Nx workspace rules documentation.
- Design token system and theme mapping.
- API contract definitions and OpenAPI specs.
- Performance checklist and bundle governance.
- Release flow documentation.
- CI/CD pipeline configuration.
- Accessibility audit checklist.
- Memory profiling and telemetry guides.
- Social Intelligence monitoring dashboard specs.
- Social Platform UX Replication guide (TikTok, Instagram, Facebook, X UI patterns).
- Gesture handling and animation guideline.
- Video player component specifications.

