# Quy định Dự án (Kanocs Blog)

### 1. Chính sách giao tiếp & Ngôn ngữ
- **Giao tiếp**: LUÔN LUÔN sử dụng tiếng Việt khi trao đổi với người dùng. Giữ tông giọng chuyên nghiệp, tài chính và dựa trên số liệu.
- **Ngôn ngữ Website**: Chỉ sử dụng tiếng Anh cho mọi nội dung hiển thị, giao diện (UI), metadata và tài liệu hướng dẫn chuyên môn. Các đoạn mã nguồn (codebase) phải thuần tiếng Anh.

### 2. Tiêu chuẩn lập trình
- **Framework**: Next.js 16 (Pages Router).
- **Styling**: Tailwind CSS v4 (Sử dụng block theme CSS-native trong `src/styles/main.css`).
- **Typography**: Font chữ hiện đại (Inter/Outfit), kích thước `text-xl` cho menu điều hướng, hạn chế in đậm để tạo giao diện sang trọng.

### 3. Dữ liệu thị trường & API
- **Lưu trữ**: File JSON dữ liệu bắt buộc đặt tại `/data/json/`.
- **Hệ thống API**:
  - `/api/market-data`: Dữ liệu gần đây (Giới hạn 100 bản ghi).
  - `/api/market-history`: Xu hướng năm (365 bản ghi via `data-history="true"` hoặc lọc theo năm cụ thể).
  - `/api/market-3y`: Xu hướng vĩ mô 3 năm (Độ phân giải tuần, ~156 bản ghi).
- **Yêu cầu**: Luôn đảm bảo tính tương thích ngược khi thay đổi phương thức lấy dữ liệu.

### 4. Quy chuẩn Biểu đồ (Chart.js)
- **Triển khai**: Sử dụng hook `useBlogCharts` từ `src/utils/useBlogCharts.ts`.
- **Cấu hình Core**: `mode: 'nearest'`, `axis: 'x'`, `intersect: false`, tắt hiệu ứng (`animation: false`).
- **Hiệu năng**: Bắt buộc sử dụng **Pre-indexing (O(M))** cho các marker. Tuyệt đối không lặp qua labels trong vòng lặp vẽ để hỗ trợ dữ liệu trên 20,000 điểm mà không gây treo trình duyệt.
- **Hiển thị**: 
  - Trục giá PHẢI dùng hệ Logarit (`logarithmic`).
  - Đầy đủ nút: Toàn màn hình (Fullscreen) và Xuất ảnh chất lượng cao.
  - Tên biểu đồ (`data-title`) phải được vẽ trực tiếp lên ảnh khi tải về.
- **Sự kiện (Markers)**: Định dạng `MMM DD YYYY: ShortCode: Description`. Vẽ đường thẳng liền (solid) với độ mờ 0.4.

### 5. Hệ màu thiết kế
- **Màu chính (Primary)**: `#45AAF2` (Dành cho Branding, Tiêu đề).
- **Màu phụ (Secondary)**: `#F7B731` (Dành cho khối lượng và điểm nhấn dữ liệu).
