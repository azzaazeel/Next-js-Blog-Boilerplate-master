---
description: Tự động tính toán lại dữ liệu hiệu năng và triển khai lại dự án
---

Workflow này giúp bạn cập nhật toàn bộ dữ liệu thống kê Yearly Performance và build lại dự án sau khi có dữ liệu thị trường mới trong thư mục `data/json/`.

### Các bước thực hiện:

1.  **Cập nhật dữ liệu thô**: Đảm bảo các file JSON mới đã được đưa vào thư mục `data/json/`.
2.  **Chạy quy trình tái triển khai (Redeploy)**:
    - Mở terminal tại thư mục gốc của dự án.
    - **Triển khai toàn bộ**:
    ```bash
    npm run redeploy
    ```
    - **Triển khai theo danh mục cụ thể (Ví dụ: Agents)**:
    ```bash
    npm run redeploy -- --category=Agents
    ```
    - Lệnh này sẽ thực hiện chuỗi hành động:
        - `node scripts/generate-performance-json.js`: Tính toán lại bảng hiệu năng (cho tất cả hoặc theo category).
        - `next build`: Build lại toàn bộ website với dữ liệu mới.


// turbo-all
// Nếu bạn muốn mình tự động thực hiện quy trình này, hãy gọi lệnh:
// "Hãy thực hiện quy trình reploy"
