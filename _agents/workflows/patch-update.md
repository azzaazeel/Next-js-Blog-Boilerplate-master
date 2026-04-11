---
description: Cập nhật Patch Notes từ SteamDB
---

Workflow này giúp bạn cập nhật các bản vá lỗi (patches) mới cho hệ thống dựa trên thông tin từ SteamDB.

### Các bước thực hiện:

1.  **Cập nhật file danh sách**:
    - Mở file `reportings/Steamdb-730.md`.
    - Thêm dòng mới vào đầu danh sách (sau dòng header) với định dạng: `Date	Day	Time	Patch Title			BuildID`.
    - Ví dụ: `8 April 2026	Wed	10:00	New Update Title			22627999`.

2.  **Thêm nội dung Markdown**:
    - Tạo file mới trong thư mục `reportings/steamdb/`.
    - Tên file PHẢI là BuildID (ví dụ: `22627999.md`).
    - Viết nội dung bản cập nhật vào file này bằng Markdown. Bạn có thể sử dụng các component như `<Insight />` hoặc các chart tùy ý.

3.  **Kiểm tra kết quả**:
    - Truy cập `/patches` trên trình duyệt để xem danh sách thu gọn.
    - Click vào bản vá mới nhất để kiểm tra trang chi tiết `/patches/{BuildID}`.

4.  **Triển khai (Nếu ở Production)**:
    - Nếu bạn đang chạy trên server Ubuntu, hãy chạy lệnh build để cập nhật dữ liệu tĩnh:
    ```bash
    npm run build
    pm2 restart kanocs-blog
    ```

// turbo-all
// Nếu bạn muốn mình tự động kiểm tra và đồng bộ lại danh sách, hãy gọi lệnh:
// "Hãy kiểm tra và cập nhật Patch Notes"
