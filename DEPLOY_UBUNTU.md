# Hướng dẫn Triển khai Kanocs Blog lên Server Ubuntu

Bài viết hướng dẫn cách đưa website Next.js này lên một máy chủ sử dụng hệ điều hành Ubuntu. Do dự án có sử dụng API nội bộ (tại `src/pages/api/`), chúng ta KHÔNG thể xuất trang tĩnh (static export) mà phải chạy server Node.js.

## Bước 1: Cài đặt Môi trường cơ bản

Truy cập vào server thông qua SSH và cài đặt cấu hình cơ bản gồm Node.js, PM2 (Quản lý tiến trình) và Nginx (Web Server):

```bash
# Cập nhật Repositories
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js (Khuyến nghị phiên bản 20.x hoặc mới hơn - Next.js 15 yêu cầu >= 20.9.0)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra phiên bản Node và Npm
node -v
npm -v

# Cài đặt PM2 để chạy Next.js ngầm không bị tắt khi thoát SSH
sudo npm install -g pm2

# Cài đặt Nginx
sudo apt install -y nginx
```

## Bước 2: Tải Source Code về Server

Di chuyển tới thư mục `/var/www/` và tải mã nguồn về từ GitHub:

```bash
cd /var/www
# Thay thế URL bằng link github của bạn, hoặc tạo thư mục và copy source vào đây
sudo git clone https://github.com/azzaazeel/Next-js-Blog-Boilerplate-master.git

# Cấp quyền cho thư mục
sudo chown -R $USER:$USER /var/www/Next-js-Blog-Boilerplate-master
cd Next-js-Blog-Boilerplate-master
```

## Bước 2.1: Cập nhật mã nguồn (Khi có thay đổi mới)

Nếu sau này bạn có commit mới trên máy tính và đẩy lên GitHub, hãy chạy lệnh sau trên VPS để cập nhật:

```bash
cd /var/www/Next-js-Blog-Boilerplate-master
git pull origin main

# Sau khi pull, nhớ build lại và restart PM2
npm install --legacy-peer-deps
npm run build
pm2 restart nextjs-blog
```

## Bước 2.5: Cấu hình Biến môi trường (Environment Variables)

Dự án sử dụng hệ thống Auth và Database cần các biến cấu hình. Hãy tạo file `.env.local`:

```bash
nano .env.local
```

Copy và chỉnh sửa nội dung sau (Thay đổi Secret và Domain của bạn):
```env
BETTER_AUTH_SECRET=nhap-ma-bi-mat-cua-ban-o-day
BETTER_AUTH_URL=https://kanocs.com
```
*Lưu ý: `BETTER_AUTH_URL` phải là domain thật bắt đầu bằng https để Auth hoạt động chính xác.*

## Bước 3: Build Dự án và Xử lý Dữ liệu

Cài đặt package (modules) và tiến hành đóng gói dự án.

```bash
# Cài đặt các thư viện
npm install --legacy-peer-deps

# Build ứng dụng Next.js
npm run build
```

## Bước 4: Khởi chạy dự án bằng PM2

Sử dụng PM2 để chạy server Next.js (port 3000) trên không gian nền (background).

```bash
# Khởi tạo project trong PM2
pm2 start npm --name "nextjs-blog" -- start

# Lưu trữ cấu hình PM2 để tự động chạy lại khi server bị khởi động lại
pm2 save
pm2 startup
```
*Ghi chú: Làm theo dòng lệnh mà PM2 in ra màn hình ở câu lệnh `pm2 startup`.*

## Bước 5: Cấu hình Nginx làm Reverse Proxy

Ngay lúc này, site của bạn đã chạy ở `http://IP_CUA_SERVER:3000`. Để người dùng truy cập được bằng Tên miền (Domain) qua port 80/443 thay vì port 3000, ta thao tác với Nginx:

Tạo một file config cho domain của bạn:
```bash
sudo nano /etc/nginx/sites-available/kanocs.com
```

Thêm nội dung bên dưới (Thay `kanocs.com` bằng tên miền thật của bạn):
```nginx
server {
    listen 80;
    server_name kanocs.com www.kanocs.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Lưu file lại (Ctrl+O, Enter, Ctrl+X) và kích hoạt config:
```bash
# Tạo symbol link
sudo ln -s /etc/nginx/sites-available/kanocs.com /etc/nginx/sites-enabled/

# Kiểm tra xem code nginx có lỗi không
sudo nginx -t

# Load lại nginx
sudo systemctl restart nginx
```

## Bước 6: Cài HTTPS miễn phí với Certbot (Let's Encrypt) 

```bash
# Cài đặt snap và certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Auto lấy chứng chỉ SSL và cấu hình Nginx
sudo certbot --nginx -d kanocs.com -d www.kanocs.com
```

## Xử lý sự cố (Troubleshooting)

### 1. Lỗi "Cannot find native binding" (Tailwind Oxide)
Nếu bạn gặp lỗi liên quan đến `@tailwindcss/oxide` hoặc "native binding", nguyên nhân thường do xung đột giữa môi trường Windows và Linux. Hãy chạy lệnh sau để dọn dẹp và cài đặt lại hoàn toàn:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 2. Lỗi phiên bản Node.js
Nếu Next.js báo lỗi yêu cầu Node.js >= 20.9.0, hãy đảm bảo bạn đã chạy đúng các lệnh nâng cấp ở **Bước 1**.
