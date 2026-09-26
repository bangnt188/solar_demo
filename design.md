# Global UI — Atomic Design

## Goal

Build the supplied UI as reusable defaults for the existing site, not as a catalog/showcase page. Keep routes and content in their existing owners. Composition runs upward through atoms → molecules → organisms → sections → screens; pages pass data/children and do not contain repeated UI implementation.

## Layer contract

| Layer | Modules | Contract |
| --- | --- | --- |
| Atoms | `src/components/atoms/action-link.tsx`, `range-input.tsx` | Small semantic controls, style variants, and explicit value/handler props. No campaign copy or screen composition. |
| Molecules | `src/components/molecules/section-heading.tsx`, `savings-estimator.tsx`, `faq-disclosure.tsx`, `comparison-panel.tsx`, `process-step.tsx`, `testimonial-card.tsx` | Compose atoms or semantic elements behind typed content props. Stateful behavior belongs only to the estimator/disclosure. |
| Organisms | `src/components/organisms/announcement-bar.tsx`, `conversion-dock.tsx`, `site-chrome.tsx`; `src/features/survey/survey-form.tsx` | Reusable global/form UI. Brand, nav, announcement, footer, form labels/options, email, and destinations arrive through props from content data. |
| Sections | `src/components/sections/*-section.tsx` | Page-level groups assembled from molecules/organisms; accept typed data and child slots. No route-level duplicate markup. |
| Screens | `src/components/screens/home-screen.tsx`, `survey-screen.tsx` | Compose sections and pass props. Own screen order/layout, not reusable primitives or campaign copy. |
| Routes | `src/app/(public)/page.tsx`, `src/app/(public)/khao-sat/page.tsx`, `src/app/layout.tsx` | Thin callers: supply content/catalog props to a screen or global organisms. |

CSS remains global and centralized in `src/styles/tokens.css` and `src/styles/components.css`. Existing semantic token names are the source of truth; components consume global defaults and add only their own semantic class. Avoid a parallel token system, Tailwind, monolithic UI modules, or duplicated section markup.

## Component map

| Design item | Atomic composition | Current integration |
| --- | --- | --- |
| C-01 Announcement | `AnnouncementBar` organism receives message children and action props | Global `RootLayout`; dismissible. |
| C-02 Sticky navigation | `SiteHeader` organism receives brand, nav links, and CTA props | Global `RootLayout`; responsive details menu and sticky offset. |
| C-03 Hero | `HeroSection` composes `ActionLink` atoms with hero content props | `HomeScreen`. |
| C-04 Savings calculator | `SavingsCalculatorSection` receives `SavingsEstimator`; estimator composes `RangeInput` and `ActionLink` | Reusable, intentionally not composed into `HomeScreen`. |
| C-05 Benefit/solution cards | `SolutionsSection` composes cards from typed solution data and action destination | `HomeScreen`. |
| C-06 Before/after | `BeforeAfterSection` receives before/after `ComparisonPanel` children | Reusable, intentionally not composed into `HomeScreen`. |
| C-07 Process | `ProcessTimelineSection` maps process data to `ProcessStep` molecules | Reusable, intentionally not composed into `HomeScreen`. |
| C-08 Testimonial | `TestimonialSection` maps typed entries to `TestimonialCard` molecules | It renders nothing for an empty list. No approved testimonial data exists; do not fabricate a quote or attribution. |
| C-09 Lead form | `SurveyScreen` composes the prop-driven `SurveyForm` feature | Existing survey route; retains five required fields and opens an email draft. |
| C-10 FAQ | `FaqSection` maps content to native `FaqDisclosure` molecules | `HomeScreen`; keyboard-accessible `<details>/<summary>`. |
| Breadcrumb | `src/components/molecules/breadcrumbs.tsx` nhận danh sách label/href; trạng thái trang hiện tại dùng `aria-current` | Route dự án/thiết bị/khảo sát; dữ liệu từ `src/lib/seo.ts` cũng dùng cho `BreadcrumbList`, không thêm JS client. |
| C-11 Floating CTA | Right-fixed vertical stack of Zalo, phone, and survey icon actions | Global `RootLayout`; survey is active. Zalo and phone render disabled until verified destinations are supplied. |

## Content and behavior

- `src/data/content/home.ts` owns content for the sections currently composed by `HomeScreen`; the calculator, comparison, and process examples are deliberately not included in the screen data.
- `src/data/content/site-chrome.ts` owns global brand, nav, announcement, footer, and conversion destinations.
- `src/data/content/survey.ts` owns survey-screen copy and form labels/options. `SurveyForm` receives its content as props.
- The reusable estimator accepts assumptions and explanatory copy as props. The sample's illustrative 82% savings and 1.36 kWp-per-million-bill assumptions are not a quote or guarantee.
- The survey form is not presented as server-side lead capture. No form submission is claimed unless a real endpoint is added.
- C-08 stays absent from the rendered screen until approved customer quote/attribution data is supplied.
- Search metadata và JSON-LD thuộc `src/lib/seo.ts` và `src/components/seo/json-ld.tsx`, không trộn vào section nội dung. Quy tắc xuất bản và giới hạn dữ liệu xem `docs/seo-aeo-review.md`.
- Ảnh minh họa trong `public/images/demo/` dùng WebP lossless thay PNG; giữ nguyên pixel, alt và bố cục.

## Motion contract

- `src/app/(public)/layout.tsx` gắn `MotionRuntime` một lần cho tất cả route công khai. Hero và các phần tử `data-motion` bắt đầu ngoài viewport, rồi trượt vào trong khoảng 2 giây; dịch vụ dùng `data-motion-scrub="service"` để ảnh/chữ đi từ ngoài hai mép theo scroll và đảo chiều. Nội dung server-render trước khi observer hoạt động.
- `PartnersMarquee` giữ một hàng tên đối tác SSR, chỉ nhân đôi hàng thứ hai sau hydration khi đủ chỗ chạy. Tạm dừng tự động khi hover/chạm, tab ẩn hoặc ngoài viewport; không có nút điều khiển. Khi không có JS hoặc `prefers-reduced-motion`, tên vẫn hiện tĩnh.
- `src/styles/tokens.css` định nghĩa motion/elevation; `src/styles/components.css` áp dụng hover card, FAQ, CTA và reduced-motion. Lenis chỉ chạy trên desktop có chuột (≥1024px, hover/pointer fine); wheel dùng native trên macOS, còn nền tảng khác dùng `smoothWheel`, `wheelMultiplier: 0.8`, `lerp: 0.1`. `syncTouch: false`, RAF do runtime quản lý; browser không cung cấp loại thiết bị wheel đáng tin cậy nên không phân loại trackpad bằng số delta. Mobile dùng native scroll. Hợp đồng xem `docs/animation-plan.md`.


## Verification

- `npm run typecheck`, `npm run build`, and `npm run test:export` passed after the Atomic Design refactor.
- Browser smoke used the configured `/solar_demo/` base path: slider updated at maximum, FAQ opened by keyboard, announcement dismissed, populated section counts rendered, and internal links kept the base path.
- At 390px, mobile navigation opened by keyboard and document width equaled viewport width. Survey route retained five required fields and rejected an empty form.
