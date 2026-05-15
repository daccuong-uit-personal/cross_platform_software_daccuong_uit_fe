# Frontend AI Playbook

## Purpose
Tài liệu này tập trung các nguyên tắc FE và AI agent cho dự án frontend social commerce creator platform.

## Why this playbook exists
- Giúp FE giữ đúng phạm vi: rendering, interaction, state, UX, và contract integration.
- Tránh quá tải agent bằng cách chỉ định rõ trách nhiệm cho từng agent.
- Giữ CI/CD và operational readiness trong FE giống như backend nhưng phù hợp với frontend.
- Tổ chức docs gọn gàng, dễ tham khảo cho team FE.

## Structure
- `docs/ai/frontend-ai-playbook.md`: tổng hợp hướng dẫn FE và roadmap vision.
- `docs/ai/agent-roles.md`: định nghĩa các agent FE và trách nhiệm của từng agent.
- `docs/ai/raw-roadmap.md`: nguyên bản roadmap để tham chiếu.

## Core FE Philosophy
- FE là nền tảng trình diễn và tương tác, không phải engine xử lý nghiệp vụ.
- FE phải tin tưởng backend contract và chỉ dùng backend làm nguồn dữ liệu nghiệp vụ.
- FE chịu trách nhiệm về hiệu năng, trải nghiệm, khả năng phản hồi và khả năng vận hành.
- FE cần sớm có CI/CD, release governance, và observability.

## FE Guardrails
### FE must
- Render nhanh, responsive, accessible.
- Dùng `OnPush`, `trackBy`, lazy loading, route splitting và virtual rendering.
- Thiết kế state bằng Signals cho UI và RxJS cho stream, API, websocket.
- Xử lý lỗi mạng mềm dẻo và tránh memory leak.
- Sử dụng SDK được sinh từ OpenAPI/Swagger.

### FE must NOT
- Tính toán ranking, pricing, inventory, permission, transaction truth.
- Duplicated backend business logic.
- Orchestrate backend workflow trong critical path.
- Treat WebSocket as source of truth.
- Create hidden cross-domain imports or coupling.

## CI/CD and Monorepo
- Dùng Nx và thiết lập workspace constraint rõ ràng.
- Kích hoạt build caching và affected builds.
- Pipeline FE phải có gating, rollback, release flow.
- Bổ sung bundle analysis, performance regression, telemetry checks.
- Document release flow, environment promotion, feature flag usage.

## Phase Vision Summary
### Phase 0 — Cross Project Foundation Platform
Goal: Xây nền tảng chung.
- Design token system, theme platform, shared utils, runtime config, i18n.
- Output: Figma token, FE architecture docs, coding standards, ESLint/Prettier, Nx rules.

### Phase 1 — Frontend Foundation Platform
Goal: Xây kiến trúc FE production-ready.
- Nx workspace, core services, API client, HTTP interceptors.
- Output: app shell, API contract layer, trace propagation.

### Phase 2 — Design System Platform
Goal: Xây hệ thống UI reusable.
- Shared components, atomic tokens, responsive behavior.
- Output: component library, design-to-code mapping.

### Phase 3 — Auth + Identity Platform
Goal: Xây auth và identity flow.
- Login, onboarding, session, profile.
- Output: auth UX patterns, token refresh, guards.

### Phase 4 — Media Platform
Goal: Xây trải nghiệm media.
- Video/image rendering, upload UX, caching, preview.
- Output: media player, upload pipelines.

### Phase 5 — Social Platform
Goal: Xây social feed và tương tác.
- Content cards, social actions, notification hints.
- Output: scalable feed components.

### Phase 6 — Realtime Platform
Goal: Thêm realtime interaction.
- Notifications, presence, invalidation.
- Output: realtime event patterns.

### Phase 7 — Search Platform
Goal: Xây discovery UX.
- Autocomplete, pagination, filters.
- Output: search experience và query strategy.

### Phase 8 — Creator Studio Platform
Goal: Hỗ trợ creator workflows.
- Dashboard, campaign management, analytics.
- Output: creator tools và modular studio pages.

### Phase 9 — Chat Platform
Goal: Thêm workflow hội thoại.
- Chat UI, streaming updates, attachments.
- Output: messaging components.

### Phase 10 — Commerce Platform
Goal: Bán hàng và checkout.
- Catalog, cart, payment, order.
- Output: commerce experience dựa trên backend API.

### Phase 11 — Live Platform
Goal: Hỗ trợ livestream.
- Live viewer, chat overlay, low-latency UX.
- Output: live event UI.

### Phase 12 — Recommendation Platform
Goal: Hiển thị gợi ý cá nhân.
- Recommendation cards, fallback content.
- Output: personalization widgets.

### Phase 13 — Performance Platform
Goal: Tối ưu hiệu năng FE.
- Bundle budgets, runtime diagnostics, memory checks.
- Output: CI regression checks và observability.

### Phase 14 — Platform Engineering
Goal: Vận hành FE delivery.
- Feature flags, canary rollout, CI/CD, environment management.
- Output: release docs, CI pipeline docs, governance.

### Phase 15 — Social Intelligence Platform
Goal: Aggregate, monitor, và surface trending content.
- Content aggregation, trending discovery, monitoring dashboard.
- RxJS streams, Web Workers, Service Workers cho persistent checks.
- Output: trending feed UI, monitoring dashboard, alert system.

### Phase 16 — Social Platform UX Replication
Goal: Sao chép giao diện và chức năng từ TikTok, Instagram, Facebook, X.
- TikTok feed layout, vertical video swipe, comment overlay, duet/stitch inspiration.
- Instagram Reels player, Stories carousel, IGTV-style streaming, Explore grid.
- Facebook feed algorithm simulation, group dynamics, live video player.
- X/Twitter timeline, thread view, retweet patterns, trending display.
- Output: multi-feed UI variants, video player UX, social interaction patterns.

## Roadmap Scorecard
- Clarity: 8/10
- Completeness: 7/10
- Feasibility: 7/10
- Alignment: 9/10
- Risk awareness: 8/10

### Key gaps
- Thêm acceptance criteria và success metrics.
- Xác định contract FE/BE cho auth, media, commerce, live.
- Làm rõ MVP path Phase 0–5.
- Bổ sung maintenance/operational readiness cho mỗi phase.

## Output artifacts to build
- Performance checklist
- Bundle governance docs
- Memory profiling guide
- Telemetry architecture spec
- Release flow documentation
- CI pipeline documentation
- Monorepo governance
- Module boundary rules
