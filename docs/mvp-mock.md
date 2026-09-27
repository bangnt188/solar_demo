# MVP dự kiến — nhánh mvp-dev

Ngày 27/09/2026. Khách hàng chưa chốt yêu cầu MVP. Quyết định hiện tại của chủ dự án: lưu phần thử nghiệm ở `mvp-dev`, chỉ dựng mock trước. Không coi các thiết kế/backend artifacts có sẵn là cam kết phạm vi hay bản production.

## Hiểu

Landing đang tiếp tục được chỉnh sửa trên `dev`. Nhánh `mvp-dev` nằm trong checkout riêng và lấy snapshot các file nguồn không bị ignore từ working tree hiện tại, bao gồm landing và phần nền tảng MVP đã chuẩn bị. Thư mục gốc và các nhánh `dev`/`main` không bị reset, clean hoặc cập nhật commit bởi công việc này. Snapshot có cả chỉnh sửa landing chưa commit; không phải bản release đã được khách hàng nghiệm thu.

Google Sheets là một phần tích hợp còn thiếu ở lần chuẩn bị trước. Ở bước này cần kiểm contract/mô phỏng retry, chưa cần bật tài khoản Google hoặc thu lead thật.

## Thiết kế — Architecture Decision

Tách **build target** (`DEPLOY_TARGET=demo|server`) khỏi **integration mode** (`INTEGRATION_MODE=mock|cloud`). Mode mặc định là `mock` cho cả hai build target. Chọn mock là chủ động, không phải fallback khi cloud lỗi.

| Module | Mock đang có | Live còn lại |
| --- | --- | --- |
| Neon/content | `createMockContent`, nguồn nội dung landing local | Adapter PostgreSQL/migration đã chuẩn bị nhưng chỉ dùng khi bật cloud; chưa provision Neon |
| R2 | Cùng validation/re-encode ảnh, transport lưu metadata trong memory; put/head/delete | S3 adapter đã chuẩn bị; chưa gọi bucket thực tế |
| Google Sheets | `createSubmissionSheet` + `createMockSubmissionSheet`, định dạng `values.update`/RAW, hàng cố định | Auth service account, HTTP/SDK transport, cấp quyền Sheet và nghiệm thu cloud chưa triển khai |

Router public giữ allowlist ba resource landing/projects/equipment. `npm run dev:mvp` chạy Next runtime ở `/`, ép mock, sandbox, noindex và origin metadata `https://mvp.invalid`. Browser mở `http://localhost:3000/`; origin metadata này không phải domain triển khai.

### Contract Sheets dự kiến

- `SheetSubmission`: ID bất biến, `rowNumber` do DB cấp sau commit, thời điểm nhận và các trường khảo sát. Prototype nhận synthetic data; chưa phải validator/form contract khách hàng đã duyệt.
- Mapping A–I: `submission_id`, `received_at`, `name`, `phone`, `location`, `building`, `bill`, `note`, `consent_version`.
- Ghi `'Raw_Submissions'!A<row>:I<row>` với `valueInputOption=RAW`, không append. Retry cùng submission dùng cùng range/payload. [Google values.update](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update), [RAW semantics](https://developers.google.com/workspace/sheets/api/reference/rest/v4/ValueInputOption).
- Mock từ chối hai ID/nội dung khác nhau trên một hàng hoặc một ID chuyển hàng. Đây là assertion phát hiện vi phạm contract trong thử nghiệm; Google không tự cung cấp ràng buộc unique/immutable đó. Khi làm live, Neon phải giữ row allocation unique và payload bất biến.
- `snapshot()` chỉ dành cho kiểm tra mock, trả bản sao. Không có HTTP đọc danh sách submission. Mock giới hạn 1.000 hàng, mất khi process kết thúc; không dùng làm hàng đợi hay nguồn lưu trữ thật.

Trade-off: chưa kiểm chứng OAuth, quyền Sheet, timeout/quota và concurrent worker với cloud. Đổi lại có thể kiểm data mapping/retry mà không tạo tài nguyên, gửi dữ liệu hay chốt nghiệp vụ sớm. Giữ adapter Neon/R2 đã có để dùng sau khi scope được duyệt; không xóa công việc đã chuẩn bị.

## Validate security — threat model ngắn

- **Vô tình gọi cloud:** application chọn mock trước khi đọc credential; `getDatabase`, migration và cloud smoke yêu cầu mode cloud rõ ràng. Mock Sheets không có HTTP/auth implementation; gọi composition bằng mode cloud trả unavailable. Test dùng credential sai và chặn fetch để phát hiện gọi nhầm.
- **Nhầm mock là dữ liệu thật:** script ghi `MOCK ONLY`, mock mất khi restart; `APP_ENV=production` hoặc `VERCEL_ENV=production` từ chối mock. Mọi route mock đều noindex dù `SEO_INDEXABLE=true`.
- **Trùng lead khi retry:** transport contract ghi range xác định, không append. Mock kiểm collision; lease/outbox/row allocation bền vững vẫn phải triển khai ở Neon sau này.
- **Công thức/PII:** payload Sheets dùng RAW, không log tên/điện thoại/nội dung. Chỉ dùng synthetic data trong demo; không export sang CSV trong slice này. Không thêm endpoint nhận lead hoặc upload public khi chưa có các control của MVP plan.

Chốt mode trong code là biện pháp vận hành, không phải sandbox ngăn mọi network của lập trình viên. Constructor nhận dependency vẫn dùng được trong integration tests PostgreSQL tạm. Không để credential cloud trong môi trường dùng thử mock.

## Đề xuất sử dụng và bước tiếp theo

```sh
npm ci
npm run dev:mvp
# UI + public read API với mock, không cần .env/credentials

npm run demo:integrations
# Synthetic content + R2 + Sheets, chỉ memory, không mạng

npm run test:core
npm run test:mock-http
npm run build:demo
npm run test:export
```

Test PostgreSQL cũ vẫn chạy bằng `npm run test:integration`, tạo cluster local tạm và chủ động chọn cloud adapter cho test; không truy cập Neon. Source snapshot không chứa `.env.local`, node_modules hay build outputs.

Sau khi khách hàng chốt: cập nhật scope/consent/retention, duyệt auth/admin, tạo môi trường sandbox, rồi mới cấu hình `INTEGRATION_MODE=cloud`. Thêm Google service-account adapter với scope Sheets tối thiểu và Sheet riêng; triển khai submission persist, row allocation, lease/retry/replay, timeout và nghiệm thu mất response/quota/403. Không chỉ đổi env và coi survey/Sheets đã hoàn thành.

Không push/merge/deploy từ bước mock này. Khi bỏ thử nghiệm, checkout khác vẫn giữ landing hiện tại; không cần rollback cloud vì chưa tạo hay ghi tài nguyên cloud.
