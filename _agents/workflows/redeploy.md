---
description: Tự động tính toán lại dữ liệu hiệu năng và triển khai lại dự án
---

Workflow này giúp bạn cập nhật toàn bộ dữ liệu thống kê Yearly Performance và build lại dự án sau khi có dữ liệu thị trường mới trong thư mục `data/json/`.

### Các bước thực hiện:

1.  **Cập nhật dữ liệu thô**: Đảm bảo các file JSON mới đã được đưa vào thư mục `data/json/`.
2.  **Chạy quy trình tái triển khai (Redeploy)**:
    - Mở terminal tại thư mục gốc của dự án.
    - Chạy lệnh tích hợp:
    ```bash
    npm run redeploy
    ```
    - Lệnh này sẽ thực hiện chuỗi hành động:
        - `node scripts/generate-performance-json.js`: Tính toán lại bảng hiệu năng cho mọi datasource.
        - `next build`: Build lại toàn bộ website với dữ liệu mới.

3.  **Kiểm tra kết quả**:
    - Truy cập trang `/tradingview` để kiểm tra bảng **Yearly Performance Table** đã cập nhật dữ liệu mới nhất chưa.
    - Kiểm tra các biểu đồ trên trang chủ và các bài viết Insight.

// turbo-all
// Nếu bạn muốn mình tự động thực hiện quy trình này, hãy gọi lệnh:
// "Hãy thực hiện quy trình reploy"
