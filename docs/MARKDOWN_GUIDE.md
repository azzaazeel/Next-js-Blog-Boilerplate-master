# Hướng dẫn soạn thảo Markdown (KANOCS Blog)

Tài liệu này hướng dẫn cách sử dụng các tính năng nâng cao (Custom Components) bên trong các file Markdown (`.md`) của bạn.

---

## 1. Thành phần Cơ bản (Standard Markdown)
Bạn vẫn có thể sử dụng tất cả cú pháp Markdown tiêu chuẩn:
- `# H1`, `## H2`, `### H3` cho tiêu đề.
- `**In đậm**`, `*In nghiêng*`.
- `[Link Text](https://url.com)`.
- `![](/path/to/image.png)` cho hình ảnh.

---

## 2. Bộ trượt ảnh tự động (Auto-Carousel)
Hệ thống sẽ **tự động** biến các cụm ảnh đặt sát nhau thành một Slide trượt nếu có từ **2 ảnh trở lên**.

**Cách dùng:**
Chỉ cần đặt các thẻ ảnh lân cận nhau (có thể cùng dòng hoặc cách nhau bởi 1 dòng trống).

```markdown
![](image1.png)
![](image2.png)
![](image3.png)
```

---

## 3. Chèn Video YouTube tự động
Hệ thống sẽ tự động chuyển đổi link YouTube thành trình phát video nếu link đó nằm trên một dòng riêng biệt.

**Cách dùng:**
```markdown
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
*(Hỗ trợ cả link `youtube.com/watch?v=` và `youtu.be/`)*

---

## 4. Biểu đồ thị trường (Interactive Charts)
Bạn có thể chèn biểu đồ chứng khoán/vật phẩm bằng cách sử dụng thẻ `<canvas>` với class `blog-chart`.

**Các biến số (Data Attributes):**
- `data-url`: Đường dẫn file JSON dữ liệu (ví dụ: `fracture_1D.json`). Có thể so sánh nhiều mã bằng dấu phẩy: `fracture_1D.json, revolution_1D.json`.
- `data-title`: Tiêu đề biểu đồ.
- `data-markers`: Các điểm đánh dấu sự kiện (định dạng: `YYYY-MM-DD:Mã:Mô tả`).
- `data-history="true"`: Sử dụng dữ liệu lịch sử.
- `data-3y="true"`: Chế độ xem 3 năm (Logarithmic scale).
- `data-mode="percent"`: Biểu thị theo % tăng trưởng thay vì giá trị tuyệt đối.

**Ví dụ:**
```html
<div className="relative h-96 my-8">
  <canvas 
    className="blog-chart" 
    data-url="fracture_1D.json" 
    data-title="Fracture Case Price"
    data-markers="2026-03-12:E1:Vulkan Update, 2026-03-16:E2:X-Ray Scanner"
  ></canvas>
</div>
```

---

## 5. Bảng thông tin Thị trường (Insight)
Sử dụng component `<Insight />` để hiển thị tóm tắt hiệu suất thị trường.

**Cách dùng:**
```html
<Insight theme="dark" />
```
*(Mặc định là theme dark, có thể chuyển sang `light` nếu muốn)*

---

## 6. Trích dẫn Tweet/Bài viết (EmbedPost)
Dùng để nhúng link bài đăng hoặc bài viết khác một cách đẹp mắt.

**Cách dùng:**
```html
<EmbedPost url="https://x.com/username/status/123" />
```

---

## 7. Hộp thông báo (Callout / Alerts)
Sử dụng component `<Callout />` để làm nổi bật các lưu ý, cảnh báo hoặc thông tin quan trọng.

**Các loại (Types):** `info` (mặc định), `warning`, `error`, `success`.

**Cú pháp:**
```html
<Callout type="warning" title="CẢNH BÁO">
  Bản cập nhật này có thể gây xung đột với một số Driver cũ của AMD.
</Callout>
```

---

## 8. Trình diễn Code (Syntax Highlighting)
Bạn có thể chèn các đoạn code với định dạng màu sắc theo ngôn ngữ.

**Cú pháp:**
<pre>
```javascript
function helloWorld() {
  console.log("Hello KANOCS!");
}
```
</pre>

---

## 9. Danh sách kiểm tra (Checklists)
Dùng để liệt kê các đầu mục công việc hoặc tính năng đã hoàn thành.

**Cú pháp:**
```markdown
- [x] Đã cập nhật xong bản đồ Dust II
- [x] Sửa lỗi hiệu năng Windows 10
- [ ] Đang chờ cập nhật găng tay mới
```

---

## 10. Chú thích chân trang (Footnotes)
Dùng để giải thích thêm các thuật ngữ ở cuối bài viết.

**Cú pháp:**
```markdown
Đây là một thuật ngữ chuyên môn[^1].

[^1]: Giải thích chi tiết về thuật ngữ đó ở đây.
```

---

*Lưu ý: Mọi tính năng trên đều đã được tối ưu hóa để hiển thị tốt trên cả giao diện sáng (Light) và tối (Dark).*
