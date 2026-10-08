# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Households and businesses considering rooftop solar, as confirmed for the service page.

## Product Purpose

The Lúa Xanh Đồng Bằng website presents rooftop-solar solutions and service information, then guides visitors to request a site survey. The current survey flow validates the form and simulates submit success or failure in the browser; it does not persist leads on a server.

## Positioning

The site describes an end-to-end EPC service spanning survey, design, installation, commissioning, and after-handover support. A distinct competitive mechanism has not been confirmed; do not invent one.

## Operating Context

Prospective household and business customers review service scope and provide project information before a site survey. The supplied service-page reference depicts four stages: site survey, 3D simulation and quote, installation and commissioning, and ongoing monitoring and warranty support.

## Capabilities and Constraints

- The site is a Next.js static export under `/solar_demo` in its demo deployment.
- The survey route uses app-owned RHF/zod validation for required contact/project fields and initially unchecked contact consent. `@solar/ui/forms` owns submission in explicit demo mode, persistent demo disclosure and honest default system Toast feedback; no API is called and no lead/contact data is persisted. Its client-only UX limit stores timestamps under `solar:survey-rate-limit:v1`: three successes within five minutes start a five-minute cooldown; failures do not count. App labels/layout remain content-driven, and the form resets only after simulated success. A server build does not switch this consumer to live submission.
- The process timing, technical specifications, single-responsibility wording, and 25-year support/warranty statements shown in `public/images/demo/Dịch Vụ.png` are user-approved for the draft page but still need the user's real-world confirmation before production publication.
- Keep Zalo, phone and survey actions visible. The user requested working demo links: `https://zalo.me/0939000000` and `tel:0939000000`, using the existing placeholder number. These defaults are configurable; verified business destinations have not been supplied.

## Brand Commitments

Use the business name Lúa Xanh Đồng Bằng, its existing logo, Vietnamese content, and the current site identity. The user provided `public/images/demo/Dịch Vụ.png` as the service-page reference and asked to use existing demo images.

## Evidence on Hand

- Existing site content and routes describe rooftop-solar services for households and businesses.
- `public/images/demo/Dịch Vụ.png` contains the approved draft service-process copy and layout reference; operational promises in it remain unverified.
- `public/images/demo/solar-roof.webp` and `public/images/demo/solar-farm.webp` are available illustrative assets.
- The user confirmed that the six catalog project photos are real photographs of the projects; do not label these project photos as illustrations.
- No approved customer testimonials or verified Zalo/phone destinations are in the repository.

## Product Principles

- Describe project-specific service scope and technical fit without implying a fixed solution for every site.
- Do not turn illustrative data or unverified service promises into verified proof.
- Keep the survey's non-persistent submit behavior documented in product/engineering context until a real backend is connected; do not treat the simulated result as proof of server-side lead capture.
- Preserve the existing site navigation and responsive behavior.
