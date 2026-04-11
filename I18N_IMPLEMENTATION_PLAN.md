# Kế hoạch Triển khai Đa ngôn ngữ (En/Vi) cho Kanocs Blog

Tài liệu này phác thảo lộ trình tích hợp hệ thống đa ngôn ngữ vào dự án Next.js hiện tại, sử dụng phương pháp **Subdirectories** (ví dụ: `kanocs.com/vi`) để tối ưu SEO và quản lý.

## 1. So sánh với ixartz/Next-js-Boilerplate

Dự án hiện tại của bạn là một phiên bản tùy chỉnh (Pages Router), trong khi bản `ixartz` mới nhất đã chuyển sang **App Router**. Tuy nhiên, chúng ta vẫn có thể áp dụng các tiêu chuẩn cao cấp của nó:

| Tính năng | ixartz / next-intl Standard | Kế hoạch cho Kanocs (Pages Router) |
| :--- | :--- | :--- |
| **Thư viện** | `next-intl` (Chuẩn công nghiệp) | `next-intl` (Tương thích Pages Router) |
| **Kiến trúc** | App Router (`[locale]` segment) | Pages Router (`next.config.js` i18n) |
| **Dịch thuật** | Type-safe (Check lỗi ngay khi gõ) | Type-safe JSON |
| **Quản lý** | Crowdin integration (Option) | Local JSON (Dễ quản lý bước đầu) |
| **Metadata** | `AppConfig.ts` tập trung | `AppConfig.ts` tập trung |

## 2. Kiến trúc Đề xuất (Nâng cấp)
- **Framework**: `next-intl` để đảm bảo tính đồng nhất với các dự án lớn.
- **Locales**: `en` (mặc định), `vi`.
- **Cấu hình tập trung**: Sử dụng `src/utils/AppConfig.ts` để quản lý danh sách ngôn ngữ, tránh fix cứng trong code.

## 2. Các bước triển khai kỹ thuật

### Giai đoạn 1: Cấu hình Hệ thống
- [ ] Cập nhật `next.config.js` để bật tính năng `i18n`:
  ```javascript
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    localeDetection: true,
  }
  ```
- [ ] Tạo file `src/utils/AppConfig.ts` theo mẫu của ixartz:
  ```typescript
  export const AppConfig = {
    site_name: 'Kanocs',
    title: 'Kanocs Blog',
    description: 'Market Data Visualizer',
    locale: 'en',
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  };
  ```
- [ ] Cấu hình `next-intl` middleware và provider.
- [ ] Thiết lập Type-safe cho các file translation (JSON).

### Giai đoạn 2: Cấu trúc Dữ liệu (Markdown)
- [ ] Tổ chức lại thư mục bài viết:
  - `_articles/en/*.md`
  - `_articles/vi/*.md`
- [ ] Cập nhật các hàm `getStaticProps` và `getStaticPaths` trong `[page].tsx` để lọc bài viết theo `locale` hiện tại.

### Giai đoạn 3: Giao diện (UI/UX)
- [ ] Tạo file bản dịch (ví dụ: `locales/en.json`, `locales/vi.json`) cho các chuỗi ký tự cố định (Header, Footer, Nút bấm...).
- [ ] Xây dựng Component **LanguageSwitcher** để người dùng chuyển đổi giữa Tiếng Anh và Tiếng Việt.
- [ ] Cập nhật SEO Meta tags (Hreflang) để Google hiểu rõ quan hệ giữa hai phiên bản ngôn ngữ.

### Giai đoạn 4: Quản trị (Admin)
- [ ] Cập nhật trang Editor để cho phép chọn ngôn ngữ khi tạo/sửa bài viết.
- [ ] Đảm bảo hệ thống Dashboard hiển thị đúng danh sách bài viết theo ngôn ngữ đã chọn.

## 3. Lý do chọn Subdirectory thay vì Subdomain
1. **SEO**: Tập trung toàn bộ sức mạnh vào một tên miền duy nhất (`kanocs.com`), giúp các bài viết tiếng Việt nhanh chóng leo hạng nhờ uy tín của trang chính.
2. **Bảo trì**: Chỉ cần duy trì một source code, một database và một quy trình deployment qua PM2/Nginx.
3. **Mở rộng**: Dễ dàng thêm các ngôn ngữ khác (Trung Quốc, Nga...) trong tương lai mà không cần cấu hình DNS phức tạp.

---
*Ghi chú: Plan này sẽ được triển khai sau khi hoàn tất các tính năng cốt lõi về dữ liệu thị trường.*
