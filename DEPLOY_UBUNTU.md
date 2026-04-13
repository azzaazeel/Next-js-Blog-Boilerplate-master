# Hướng dẫn Triển khai Kanocs Blog lên Server Ubuntu (OpenLiteSpeed)

Bài viết hướng dẫn cách đưa website Next.js lên một máy chủ sử dụng OpenLiteSpeed (như CyberPanel, CloudPanel). Do hệ thống thường sử dụng cổng 3000 cho các dịch vụ quản lý, chúng ta sẽ chạy dự án ở cổng **3001**.

## Bước 1: Cài đặt Môi trường cơ bản

Truy cập vào server thông qua SSH và nâng cấp Node.js lên phiên bản mới nhất (Next.js 15 yêu cầu >= 20.9.0):

```bash
# Cập nhật Repositories
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 22.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt PM2 để chạy ngầm
sudo npm install -g pm2
```

## Bước 2: Tải Source Code và Cấu hình

```bash
cd /home/kanocs.com/public_html
# Clone dự án từ GitHub
sudo git clone https://github.com/azzaazeel/Next-js-Blog-Boilerplate-master.git .

# Cấp quyền cho thư mục
sudo chown -R $USER:$USER /home/kanocs.com/public_html
```

### Bước 2.5: Cấu hình mã bí mật (.env.local)

Tạo file biến môi trường:
```bash
nano .env.local
```
Dán nội dung sau (Tạo secret bằng lệnh `openssl rand -base64 32`):
```env
BETTER_AUTH_SECRET=chuoi-ngau-nhien-cua-ban
BETTER_AUTH_URL=https://kanocs.com
```

## Bước 3: Build Dự án

Lưu ý sử dụng `--legacy-peer-deps` để tránh xung đột phiên bản React 19:

```bash
# Xóa bản cũ nếu có lỗi native binding
rm -rf node_modules package-lock.json

# Cài đặt thư viện
npm install --legacy-peer-deps

# Build ứng dụng
npm run build
```

## Bước 4: Khởi chạy dự án bằng PM2 (Cổng 3001)

Chúng ta sử dụng cổng **3001** để tránh xung đột với các dịch vụ hệ thống:

```bash
# Khởi chạy project
pm2 start npm --name "nextjs-blog" -- start -- -p 3001

# Lưu cấu hình
pm2 save
pm2 startup
```

## Bước 5: Cấu hình OpenLiteSpeed Reverse Proxy

Không dùng Nginx, chúng ta cấu hình trực tiếp trong Virtual Host của LiteSpeed để chuyển hướng truy cập từ cổng 80/443 vào cổng 3001.

1. Mở file cấu hình vhost:
   ```bash
   nano /usr/local/lsws/conf/vhosts/kanocs.com/vhost.conf
   ```

2. Dán đoạn mã này vào **cuối file**:
   ```text
   extprocessor nextjs_proxy {
     type                    proxy
     address                 127.0.0.1:3001
     maxConns                100
     pcKeepAliveTimeout      60
     initTimeout             60
     retryTimeout            0
     respBuffer              0
   }

   context / {
     type                    proxy
     handler                 nextjs_proxy
     addDefaultCharset       off
   }
   ```

3. Khởi động lại LiteSpeed:
   ```bash
   sudo /usr/local/lsws/bin/lswsctrl restart
   ```

## Bước 6: Xử lý sự cố (Troubleshooting)

1. **Lỗi 500:** Kiểm tra xem `curl http://localhost:3001` có phản hồi không. Nếu có, hãy kiểm tra lại file `vhost.conf`.
2. **Lỗi Native Binding:** Luôn chạy `rm -rf node_modules` và cài lại nếu di chuyển code giữa các môi trường khác nhau.
3. **Cập nhật code mới:**

   **Tại Máy Local (Windows/Mac):**
   ```bash
   # Tự động add, commit "." và push lên GitHub
   npm run sync
   ```

   **Tại VPS (SSH):**
   ```bash
   cd /home/kanocs.com/public_html
   npm run vps-update
   ```
