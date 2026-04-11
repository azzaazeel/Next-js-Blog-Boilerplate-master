# Hướng dẫn Hệ thống Biểu đồ Phân tích (KANOCS Charting)

Hệ thống biểu đồ của bạn đã được nâng cấp lên một tiêu chuẩn chuyên nghiệp, an toàn và có khả năng mở rộng cực cao. Dưới đây là tóm tắt các tính năng hiện tại và các hướng mở rộng tiềm năng.

## 1. Các Tính năng Hiện tại (Đã kích hoạt)

### ✅ Bảo mật Dữ liệu (Secure API Proxy)
*   **Private Storage**: Dữ liệu JSON gốc được lưu trữ trong thư mục bí mật `/data`, không thể truy cập trực tiếp từ trình duyệt.
*   **API Interceptor**: Mọi yêu cầu dữ liệu đều đi qua `/api/market-data`, giúp che giấu cấu trúc file hệ thống.
*   **Data Limiting**: Tự động chỉ trả về **100 bản ghi gần nhất**, ngăn chặn việc rò rỉ toàn bộ kho dữ liệu lớn.

### ✅ Hiển thị & Tương tác chuyên nghiệp
*   **Mixed Charts**: Hiển thị đồng thời Giá (Price) và Khối lượng (Volume) trên cùng một biểu đồ.
*   **Volume Histogram**: Cột khối lượng màu Vàng (Mã màu 2) được thiết kế nằm ở 25% phía dưới biểu đồ, không đè lên đường giá.
*   **Smart Interaction**: Sử dụng chế độ `index` và `crosshair-like` giúp chuột rê đến đâu, tooltip hiện đến đó cực kỳ nhạy.
*   **Branding & Info**: Có tiêu đề biểu đồ (`data-title`) và Watermark chìm để bảo vệ bản quyền hình ảnh.
*   **Snapshot Download**: Nút tải ảnh tích hợp sẵn, khi tải xuống sẽ giữ nguyên tiêu đề và watermark.

---

## 2. Các Tính năng có thể mở rộng (Extensions)

Bạn có thể yêu cầu mình thực hiện các nâng cấp này bất cứ khi nào cần:

### 📊 Nâng cấp Kỹ thuật (Technical Analysis)
*   **Technical Indicators**: Thêm các đường chỉ báo như SMA (20, 50, 200), EMA, dải Bollinger Bands trực tiếp lên giá.
*   **Sub-panes**: Thêm khu vực biểu đồ phụ phía dưới cho RSI (đo quá mua/quá bán) hoặc MACD.
*   **Candlestick Chart**: Chuyển từ dạng đường (Line) sang dạng nến Nhật chuyên nghiệp (nếu dữ liệu JSON có đủ OHLC).

### ⚡ Tính năng Tương tác (Advanced UI)
*   **Timeframe Switcher**: Thêm các nút **1D | 1W | 1M | 1Y | All** để người dùng tự thay đổi khung thời gian ngay trên bài viết.
*   **Real-time Updates**: Tự động làm mới dữ liệu sau mỗi vài phút mà không cần tải lại trang.
*   **Multi-symbol Sync**: Cho phép so sánh hai mã (ví dụ: FEVER vs BTC) trên cùng một biểu đồ để xem tương quan.

### 📝 Chú thích & Phân tích (Annotations)
*   **Visual Notes**: Tự động vẽ các vùng Hỗ trợ/Kháng cự quan trọng dựa trên dữ liệu.
*   **Event Markers**: Đánh dấu các sự kiện quan trọng (ví dụ: ngày Listing, ngày ra tin tức lớn) bằng các icon hoặc đường kẻ dọc trên biểu đồ.

---

## 3. Cách sử dụng trong file Markdown (.md)

Để chèn một biểu đồ mới, bạn chỉ cần dùng đoạn code sau:

```html
<div className="relative w-full h-80 ...">
  <canvas 
    className="blog-chart" 
    data-url="ten-file-du-lieu.json" 
    data-title="Tiêu đề biểu đồ khi tải về" 
    data-type="line"
  ></canvas>
</div>
```

*   **data-url**: Chỉ cần ghi tên file (Ví dụ: `fever-case-1d.json`). Hệ thống tự hiểu nó nằm trong thư mục bảo mật `/data`.
*   **data-title**: Tiêu đề sẽ hiện lên biểu đồ và ảnh tải xuống.
*   **data-type**: `line` hoặc `bar`.

---
*Hệ thống được phát triển bởi Antigravity dành riêng cho dự án KANOCS.*
