# Hướng dẫn sử dụng Trang Quản trị TradingView (/tradingview)

Trang `/tradingview` là một công cụ đặc quyền dành cho Admin để trực quan hóa và phân tích dữ liệu thị trường từ các tệp JSON được lưu trữ trong hệ thống, tích hợp cùng dữ liệu cập nhật game để đối chiếu sự biến động.

## 1. Truy cập & Dashboard
- Bạn có thể truy cập trang này thông qua menu **Dashboard** (biểu tượng lưới) sau khi đăng nhập.
- Dashboard là trung tâm quản trị tập trung bao gồm: **Content Editor**, **TradingView Visualizer**, **Media Manager** và **System Cache**.

---

## 2. Các Tính năng Chính

### 🔍 Bộ chọn Item Thông minh (Row 2)
- Tìm kiếm nhanh tên sản phẩm/item trong danh sách hàng trăm tệp dữ liệu.
- **Tối ưu hóa**: Danh sách gợi ý chỉ hiển thị **5 kết quả khớp nhất** để giữ giao diện gọn gàng.

### ⏱️ Tùy chọn Độ phân giải & Khoảng thời gian
- **Resolution**: Chọn D (Daily), W (Weekly), hoặc M (Monthly).
- **Time Range**: 6M, 1Y, 3Y, hoặc All (**Chế độ này chỉ khả dụng khi không chọn Focus Year đặc định**).

### 🎯 Chế độ Focus Year Multi-Select (Nâng cao)
- **Chọn nhiều năm**: Bạn có thể chọn nhiều năm liên tiếp (ví dụ 2022 và 2023) để xem dữ liệu gộp.
- **Cơ chế thông minh**: Nếu bạn chọn một năm không liền kề với vùng đang chọn, hệ thống sẽ tự động reset về năm mới đó để đảm bảo sự tập trung.
- **Tự động cấu hình**: Khi chọn Focus Year, Resolution sẽ mặc định về **1D** để soi chi tiết.

### 📉 Hệ thống Chỉ báo Kỹ thuật (Indicators)
- **SMA 50 (Màu Đỏ)**: Đường trung bình động 50 ngày.
- **SMA 200 (Màu Xanh Dương)**: Đường trung bình động 200 ngày dùng để xác định xu hướng dài hạn.
- **Vol SMA 50 (Màu Vàng)**: Đường trung bình động của khối lượng giao dịch trong 50 phiên.
- **RSI (Relative Strength Index - Màu Tím)**: Chỉ số sức mạnh tương đối (30/70) hiển thị trên trục tọa độ riêng biệt phía dưới.
- **BTC Compare (Màu Tím)**: So sánh trực tiếp với giá Bitcoin.
    - **Trục tọa độ kép (Dual Axis)**: Khi bật, giá BTC sẽ hiển thị ở cột bên **TRÁI** (màu tím), còn giá vật phẩm hiển thị ở cột bên **PHẢI** (màu xanh).

### 📊 Bảng Chỉ số Hiệu suất (Performance Summary)
- Nằm ngay phía trên biểu đồ, cung cấp các số liệu quan trọng cho khoảng thời gian đang chọn:
    - **Price Δ**: % Thay đổi giá (Sử dụng trung bình 7 ngày đầu/cuối để triệt tiêu nhiễu).
    - **Vol Δ**: % Thay đổi khối lượng giao dịch (Momentum).
    - **High/Low**: Giá cao nhất và thấp nhất trong kỳ.
    - **Rút gọn số liệu**: Giá trị lớn được tự động chuyển sang định dạng **k** (ngàn) hoặc **M** (triệu).

### 🚩 Hệ thống Event Markers
- **Tích hợp Patch Notes**: Tự động load danh sách từ `reportings/Steamdb-730.md`.
- **Bộ lọc thông minh**: Tùy chọn **Hide "CS2 Update"** luôn được **bật mặc định**.

### 🖼️ Biểu đồ & Xuất dữ liệu
- **Thang đo Logarithm (Bắt buộc)**: Theo quy tắc dự án, mọi biểu đồ giá phải sử dụng thang đo Log để so sánh tỷ lệ % chính xác.
- **Tiêu đề Động**: Khi tải ảnh biểu đồ, tiêu đề sẽ tự động bao gồm: **[Tên Item] [Resolution] ([Range])**.
- **Performance**: Luôn tắt animation và sử dụng cơ chế Pre-indexing dữ liệu để tránh lag.

---

## 3. Cấu trúc Dữ liệu & Kỹ thuật

### 📂 Thư mục nguồn
- Dữ liệu giá vật phẩm: `/data/tradingview/`
- Dữ liệu Bitcoin: `/data/tradingview/Bitcoin (BTC)_1D.json`
- Dữ liệu sự kiện: `reportings/Steamdb-730.md`

### 🛠️ Cách thêm dữ liệu mới
1. Copy tệp JSON vào `/data/tradingview/`.
2. Định dạng ngày chuẩn trong JSON: `MMM DD YYYY` (VD: `Apr 02 2016`).

> [!IMPORTANT]
> **Lưu ý về So sánh BTC**: Khi bật BTC Compare, biểu đồ sẽ hiển thị hai cột giá khác nhau. Hãy chú ý màu sắc (Tím = BTC, Xanh = Item) để tránh nhầm lẫn về giá trị tuyệt đối.
