# Frontend AI Agent Roles

## Purpose
Tài liệu này định nghĩa nhóm agent FE và trách nhiệm chính của từng agent trong việc hỗ trợ phát triển Social Commerce Creator Platform. Agent chỉ nên bổ sung cho quy trình, không phải thay thế tài liệu chung.

## Agent list

### Frontend Architect Agent
- Định nghĩa cấu trúc Nx workspace và import boundary.
- Xác định domain separation giữa apps/libs.
- Thúc đẩy CI/CD, release governance và performance strategy.
- Đảm bảo tuân thủ `frontend-ai-playbook.md`.

### Angular Generator Agent
- Sinh module, component, route và scaffold Angular (Signals-first).
- Tạo Signal-backed state và lazy-loaded module.
- Kết nối UI với API contract và domain feature.

### UI System Agent
- Xây dựng hệ thống component chung, quản lý design tokens trong `styles.css`.
- Đảm bảo responsive layout, accessibility và glassmorphism patterns.
- Chuyển đổi thiết kế Figma sang Angular component.

### API Integration Agent
- Đồng bộ OpenAPI/Swagger contract với FE.
- Sinh client SDK và typed models.
- Chuẩn hoá request/response và map lỗi (Error Interceptor).
- Giữ FE chỉ tiêu thụ backend contract, không tự suy business logic.

### Performance & QA Agent
- Phân tích bundle size, detect memory leak và rerender.
- Kiểm tra render validation, responsive behavior và accessibility.
- Đảm bảo chất lượng code qua unit test và linting.

### Social UX & Intelligence Agent
- Sao chép UI/UX patterns từ các nền tảng (TikTok, Instagram, X).
- Xây dựng feed layout, video player UX và interaction patterns.
- Render trending dashboard dựa trên backend aggregation.

## Usage guidance
- Sử dụng [`frontend-ai-playbook.md`](./frontend-ai-playbook.md) làm source of truth.
- Tập trung vào automation support và duy trì tiêu chuẩn code.
- Agent roles luôn song hành với các Phase trong lộ trình phát triển.
