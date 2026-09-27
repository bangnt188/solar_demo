# Database design artifacts

Đọc [thiết kế DB landing](../docs/landing-database-design.md) trước khi áp dụng.

- `schema/001_landing.sql`: canonical DDL, apply một lần vào schema trống bằng migration role; không tạo auth/survey.
- `schema/landing-content.schema.json`: contract nội dung; runtime semantic validation đã có, write authorization/admin chưa triển khai.
- `seeds/001_landing_demo.sql`: seed sandbox **DRAFT**, không tự publish và không ghi đè nội dung có sẵn.
- `seeds/landing-demo.json`: fixture cho form/DTO/validator.

Sinh lại fixture từ source hiện tại (không truy cập cloud):

```sh
node database/seeds/build-landing-seed.cjs
```

Kiểm tra với Python `jsonschema` và PostgreSQL local đã có trên PATH:

```sh
python3 database/tests/check_content.py
bash database/tests/check-landing.sh
```

Runner dùng cluster tạm riêng, Unix socket, không đọc `DATABASE_URL` hay kết nối Neon; dọn cluster khi kết thúc. Không chạy file test trực tiếp trên database chứa dữ liệu thật. DDL/seed chưa được áp dụng vào môi trường cloud. Runtime adapter và lệnh `db:migrate`, `db:seed:sandbox`, `test:integration` đã có; xem [core kết nối](../docs/backend-core.md).
