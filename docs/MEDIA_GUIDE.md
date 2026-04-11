# Hướng dẫn Quản lý Media cho Admin

Hệ thống quản lý Media cho phép Admin tải lên hình ảnh và lấy đường dẫn URL để sử dụng trong các bài viết (Articles), bài đăng (Tweets) hoặc các phần tùy chỉnh trên website.

## 1. Truy cập
- Đăng nhập vào tài khoản Admin.
- Truy cập trang **Dashboard** (thay thế cho trang Tools cũ) tại địa chỉ `/dashboard`.
- Tìm thẻ **Media Manager** (biểu tượng hình ảnh màu tím).

## 2. Quy trình Tải ảnh (Upload)
1. Trong thẻ Media Manager, nhấn nút **Upload Image**.
2. Chọn tệp hình ảnh từ máy tính (hỗ trợ JPG, PNG, WEBP, GIF...).
3. Chờ quá trình tải lên hoàn tất. Nếu thành công, bạn sẽ thấy thông báo màu xanh và tên tệp xuất hiện trong danh sách "Gần đây".

## 3. Cách sử dụng ảnh trong bài viết
Hệ thống được thiết kế để bạn copy đường dẫn nhanh nhất:
1. Nhấn nút **Copy Link** bên cạnh tên ảnh đã tải lên. 
2. Đường dẫn sẽ có dạng: `/media/1712586712_ten_anh.jpg`.
3. Trong giao diện soạn thảo bài viết (Markdown), dán đường dẫn theo cú pháp:
   ```markdown
   ![Mô tả ảnh](/media/1712586712_ten_anh.jpg)
   ```

## 4. Các lưu ý kỹ thuật
- **Thư mục lưu trữ**: Toàn bộ ảnh được lưu tại `/public/media/` trong thư mục gốc của dự án.
- **Giới hạn dung lượng**: Tối đa **10MB** mỗi tệp.
- **Tên tệp**: Hệ thống tự động thêm **Timestamp** (dấu mốc thời gian) vào đầu tên tệp để tránh trường hợp tệp mới ghi đè lên tệp cũ có cùng tên.
- **Độ phân giải**: Nên tối ưu hóa dung lượng ảnh trước khi upload để đảm bảo tốc độ tải trang cho người dùng cuối.

## 5. Bảo mật
- Chỉ những người dùng có quyền Admin mới có thể truy cập trang Dashboard và sử dụng tính năng Upload.
- Các tệp tin sau khi upload sẽ được công khai (public) qua URL để trình duyệt của người đọc có thể hiển thị được.

> [!TIP]
> **Mẹo nhỏ**: Bạn có thể mở song song hai tab trình duyệt: một tab Dashboard để upload/copy link ảnh và một tab Editor để soạn thảo bài viết. Việc này sẽ giúp quy trình biên tập nội dung diễn ra nhanh chóng hơn rất nhiều.
