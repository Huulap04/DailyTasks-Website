# Daily Tasks — Project Timeline

> Mục tiêu: hoàn thiện Daily Tasks thành một PWA responsive, ổn định và có thể chia sẻ công khai.
>
> Nhịp làm việc đề xuất: 2–3 giờ/ngày trong khoảng 3 tuần.

## Trạng thái hiện tại

Đã hoàn thành:

- Xác thực bằng JWT, bcrypt và PostgreSQL/Supabase.
- CRUD Todo, priority, category và reminder.
- Validation API, migration database, security headers và rate limit.
- Cấu hình môi trường local/production.
- UX cơ bản: filter, sort, overdue, bulk actions, Undo delete và pagination.
- Frontend lint/build thành công.

Đang làm:

- Tinh chỉnh UI chọn nhiều công việc để chỉ hiện khi bật từ menu ba chấm.

## Timeline

| Giai đoạn                | Thời gian | Công việc                                                                                                   | Kết quả                                   |
| ------------------------ | --------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 0. Chốt bản hiện tại     | 1 ngày    | Test UX mục 6, chỉnh UI chọn nhiều task, commit/push phần còn lại                                           | Bản local ổn định                         |
| 1. Redesign giao diện    | 3–4 ngày  | Dùng Stitch tạo UI, chọn design system, áp dụng responsive desktop/tablet/mobile                            | Giao diện chuyên nghiệp, nhất quán        |
| 2. Hoàn thiện Todo UX    | 2–3 ngày  | Deadline/quá hạn, filter/sort, bulk mode, Undo delete, empty/loading/error states, accessibility            | Luồng quản lý task mượt                   |
| 3. PWA nền tảng          | 3–4 ngày  | Web manifest, icons, service worker, offline page, cache app shell, install prompt, mobile safe area        | Cài được như app trên điện thoại          |
| 4. Notification/reminder | 2–3 ngày  | Xin quyền notification, nhắc deadline, trạng thái permission, fallback khi offline                          | Có nhắc việc cơ bản                       |
| 5. Test & sửa lỗi        | 3–4 ngày  | Unit test backend, API integration test, test responsive, test PWA offline/install, test phân quyền user    | Bản ổn định trước public                  |
| 6. Tài liệu & deploy     | 2 ngày    | README mới, `.env.example`, API docs, Docker/CI cơ bản, chỉnh backend cho Vercel, deploy frontend + backend | Có link public cho người khác trải nghiệm |

## Thứ tự thực hiện

```text
1. Chốt và push phần UX hiện tại
2. Làm UI mới từ Stitch
3. Áp UI vào React
4. Làm PWA
5. Test đầy đủ
6. Chuẩn bị Vercel và deploy public
```

## Tính năng để sau bản public đầu tiên

- Subtasks/checklist.
- Tags nhiều-nhiều.
- Task lặp lại.
- Chia sẻ task/cộng tác nhóm.
- Quên mật khẩu và email verification.
- Đồng bộ realtime.
- Analytics/Sentry.
- Đồng bộ dark mode theo thiết bị.

## Definition of Done cho bản public đầu tiên

- Người dùng đăng ký, đăng nhập và quản lý task được.
- Giao diện responsive trên điện thoại, tablet và desktop.
- Cài được thành PWA.
- Hiển thị được trạng thái offline và có cache giao diện cơ bản.
- API validation, CORS, rate limit và JWT hoạt động.
- Không có `.env` hoặc secret trong GitHub.
- Lint, build và test chính đều pass.
- Frontend/backend đã deploy và dùng được bằng URL public.
