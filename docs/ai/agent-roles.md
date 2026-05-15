# Frontend AI Agent Roles

## Purpose
Tài liệu này định nghĩa nhóm agent FE và trách nhiệm chính của từng agent. Agent chỉ nên bổ sung cho quy trình, không phải thay thế tài liệu chung.

## Agent list

### Frontend Architect Agent
- Định nghĩa cấu trúc Nx workspace và import boundary.
- Xác định domain separation giữa apps/libs.
- Thúc đẩy CI/CD, release governance và performance strategy.
- Giúp hiện thực hoá rules trong `frontend-ai-playbook.md`.

### Angular Generator Agent
- Sinh module, component, route và scaffold Angular.
- Tạo Signal-backed state và lazy-loaded module.
- Kết nối UI với API contract và domain feature.
- Hỗ trợ code generation theo thiết kế và rules FE.

### UI System Agent
- Xây hệ thống component chung, design tokens và theme mapping.
- Đảm bảo responsive layout và accessibility.
- Chuyển đổi thiết kế Figma sang Angular component.
- Duy trì consistency across apps.

### API Integration Agent
- Đồng bộ OpenAPI/Swagger contract với FE.
- Sinh client SDK và typed models.
- Chuẩn hoá request/response và map lỗi.
- Giữ FE chỉ tiêu thụ backend contract, không tự suy business logic.

### Performance Agent
- Phân tích bundle size và runtime performance.
- Phát hiện rerender và memory leak.
- Kiểm tra WebSocket/network efficiency.
- Đề xuất tối ưu cho CI và release.

### QA Agent
- Kiểm tra render validation và responsive behavior.
- Đánh giá interaction flows và keyboard accessibility.
- Viết test case và regression validation.
- Đảm bảo FE quality trước release.

### Social Monitor Agent
- Theo dõi nội dung trending từ backend aggregation service.
- Render trending dashboard, alerts, và insights.
- Track user engagement với nội dung trending.
- Đảm bảo FE không gọi trực tiếp external platform API.

### Social UX Replication Agent
- Sao chép UI/UX patterns từ TikTok, Instagram, Facebook, X.
- Xây dựng feed layout variants, video player UX, interaction patterns.
- Tạo gesture handling (swipe, long-press, pinch) tương tự các platform.
- Tối ưu animation và responsive behavior cho mobile-first.

## Usage guidance
- Sử dụng `frontend-ai-playbook.md` làm source of truth.
- Agent docs chỉ là bổ sung, không phải checklist cuối cùng.
- Giữ documentation chung ngắn gọn và rõ; agent roles nên tập trung vào automation support.
