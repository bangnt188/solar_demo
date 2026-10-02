# Architecture Decision: extract SectionHeading vào @solar/ui

Status: Accepted; implemented trong @solar/ui và adapter Solar. Git push không đồng nghĩa phát hành package lên registry.

## Hiểu

Root đã có 9 vị trí gọi `SectionHeading`: solutions, services, FAQ, testimonial và 5 nhóm trong solutions overview. Before/after và process timeline còn viết tay cùng markup. Các consumer cùng mục đích: tiêu đề section h2, mô tả tùy chọn, ID dùng cho accessibility. Snapshot desktop/mobile ngày 2026-10-01 trong `docs/design-evidence/` là evidence lịch sử, không phải chứng nhận build mới.

## Thiết kế và lý do chọn

Primitive `packages/ui/src/components/layout/section-heading.tsx` sở hữu markup, typography cơ bản và CSS Module. Không thêm wrapper vì fragment hiện tại có quan hệ trực tiếp với grid/flex và selectors của consumer. Public export qua `@solar/ui` và `@solar/ui/components`.

Adapter `src/components/molecules/section-heading.tsx` giữ API Solar, ánh xạ token màu app và scale responsive bằng CSS custom properties cục bộ. Breakpoint 700px thuộc Solar; package không chứa breakpoint hoặc palette Solar. Class `section-heading`, `section-lead`, `eyebrow` vẫn là hook composition; rule baseline heading/description được chuyển khỏi global CSS. Các override thật như `.solution-needs-intro .section-lead` vẫn thuộc app.

Trade-off: thêm API typography vào package và một adapter nhỏ; đổi lại consumer dùng chung semantics mà không phụ thuộc Next.js, routing, backend hay viewport của Solar. Không gom marketing ActionLink vào Button vì hai contract khác intent; Breadcrumbs đã dùng package. Card giải pháp và service stage chưa đủ bằng chứng có cùng contract để extract.

## Validate security

- `title`, `description`, `eyebrow` là string được React escape; không có HTML thô, URL, request hay truy cập secret.
- Không thêm event, browser API hoặc client boundary. Có thể render trên server hoặc browser, không yêu cầu một server riêng.
- Heading mặc định h2; `level` 2–6 cho consumer chọn theo document outline. `id` nằm trên heading để giữ `aria-labelledby` và anchors.
- Theme dùng `--ui-*` với fallback semantic hiện có; giá trị Solar chỉ nằm ở adapter. Các consumer package khác không bị đổi palette.
- Đây là component text; không phát sinh hover/disabled/loading state. Màu theme và heading outline vẫn cần consumer nghiệm thu trong surface thực tế.

## Migration path

1. Thêm export và CSS Module trong submodule `packages/ui`.
2. Adapter root delegate vào primitive; 9 consumer hiện có đi qua adapter tự động.
3. Chuyển hai đoạn viết tay before/after và process timeline sang adapter; giữ ID, thứ tự và text.
4. Xóa baseline global đã chuyển, giữ các override theo context.
5. Build package trước app. Khi phát hành, commit/publish package trước, rồi cập nhật submodule pointer ở Solar; không chỉ commit pointer khi package commit chưa khả dụng.

Rollback: quay lại implementation adapter và ba rule global cũ; public export mới có thể giữ để không phá consumer đã sử dụng.

## Contract sử dụng

```tsx
import { SectionHeading } from "@solar/ui";
import "@solar/ui/styles";

<section aria-labelledby="summary-title">
  <SectionHeading id="summary-title" title="Tổng quan" description="Thông tin của mục này." />
</section>
```

Props: `title` bắt buộc; `description`, `eyebrow`, `id` tùy chọn; `level` mặc định 2; `headingClassName`, `descriptionClassName`, `eyebrowClassName` để gắn style cho từng slot. Eyebrow giữ tương thích nội dung đã có; không thêm label mới trong migration.

Tokens cục bộ: `--ui-section-heading-{color,size,gap}` và `--ui-section-description-{color,size,gap,measure}`. Chỉ override trên class của slot hoặc ancestor có phạm vi rõ ràng. Font family tiếp tục kế thừa từ surface; density/theme dùng semantic fallback của package. Không tạo thêm nguồn runtime theme.

## Validation ngày 2026-10-02

- Vite build và typecheck package qua; `git diff --check` qua cho root và submodule.
- Root typecheck thất bại ở các contract landing/backend ngoài các file extraction (ví dụ thiếu export `LandingDocument`, `LandingSeo`, `MediaRecord`). Chưa xác nhận toàn repo build production.
- Root lúc đầu trả 500 trong khi package đang build; sau build đã render HTTP 200 cho home và solutions. Chromium kiểm tra 1440px/390px, reduced-motion để capture ổn định: heading xanh rgb(0,74,173), 34px/26px, gap 12px; description 14.5px, gap 36px ở home và 0px ở các intro solutions. ID của 5 nhóm solutions giữ nguyên. Đây là kiểm tra contract mục tiêu, không phải chứng nhận toàn site.
- Preview component thật ở desktop/mobile light/dark: heading 24px, gap 12px, màu đổi theo semantic theme. Phát hiện rule `.panel h2` ghi đè demo nên đổi demo thành section riêng; surface demo cũng dùng semantic token để chữ dark theme có nền phù hợp. Chưa có lượt capture mới sau chỉnh nền demo cuối cùng.
- Before/after, process timeline và testimonial chưa nằm trong home đang render; migration ở các consumer này đã đối chiếu nguồn và package typecheck, chưa có browser capture riêng.
