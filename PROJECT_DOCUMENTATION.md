# 📖 TÀI LIỆU TOÀN DIỆN DỰ ÁN HỆ THỐNG QUẢN LÝ KINH DOANH HEO SỮA & HEO THỊT (PIG MANAGEMENT SYSTEM)

> **Mục đích tài liệu:** Lưu trữ toàn bộ kiến trúc, nghiệp vụ cốt lõi, cơ sở dữ liệu, API và hướng dẫn vận hành của dự án. Khi mở lại Antigravity trong bất kỳ phiên làm việc nào, Agent AI hoặc Developer có thể đọc file này để nắm trọn 100% ngữ cảnh của hệ thống.

---

## 1. 🌟 TỔNG QUAN DỰ ÁN

- **Tên dự án:** Hệ Thống Quản Lý Bán Hàng & Kho Heo Sữa / Heo Thịt Chuyên Nghiệp.
- **Mục tiêu:** Quản lý toàn bộ chuỗi cung ứng khép kín từ **Nhập chuyến xe heo từ NCC** -> **Quản lý kho (theo size & theo kg)** -> **Kê giá bán / Báo giá Zalo** -> **Bán hàng POS & Xuất hóa đơn** -> **Quản lý đơn hàng & Đổi trả** -> **Sổ dòng tiền & Cân bằng tài khoản ngân hàng NCC / Người nhà**.

---

## 2. 🛠️ TECH STACK & KIẾN TRÚC HỆ THỐNG

### 2.1. Frontend
- **Framework:** Vue 3 (Composition API với `<script setup>`).
- **Build tool:** Vite.
- **Styling:** TailwindCSS (chủ đề Dark Mode sang trọng, Glassmorphism, viền neon, màu sắc phân loại nghiệp vụ).
- **Icons & Effects:** `lucide-vue-next`, `canvas-confetti`.
- **VietQR:** Tự động tạo mã QR chuyển khoản VietQR chuẩn Napas với số tiền và nội dung đơn hàng.

### 2.2. Backend
- **Framework:** Java 17 + Spring Boot 3.
- **Database:** JPA / Hibernate + Cơ sở dữ liệu H2 (Hỗ trợ DataInitializer tự động nạp mẫu).
- **Cổng kết nối:** Backend chạy tại cổng `http://localhost:8080`, Frontend chạy tại `http://localhost:5173` (được proxy qua Vite).

---

## 3. 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
d:/Visualcode/pig/
├── backend/                              # Mã nguồn Spring Boot Backend
│   ├── src/main/java/com/pig/backend/
│   │   ├── config/                       # DataInitializer, WebConfig (CORS)
│   │   ├── controller/                   # REST API Controllers
│   │   ├── entity/                       # JPA Entities
│   │   ├── repository/                   # Spring Data Repositories
│   │   └── service/                      # Business Logic & Interfaces
│   └── pom.xml
├── src/                                  # Mã nguồn Vue 3 Frontend
│   ├── components/
│   │   ├── Inventory.vue                 # Quản lý kho, nhập chuyến xe, lịch sử chuyến
│   │   ├── Products.vue                  # Quản lý sản phẩm, bảng giá, gộp/tách lô NCC
│   │   ├── POS.vue                       # Bán hàng tại quầy POS, giỏ hàng, in bill, VietQR
│   │   ├── Orders.vue                    # Quản lý đơn hàng, đổi trả/bồi thường, hủy đơn
│   │   ├── BankAccounts.vue              # Sổ dòng tiền, STK NCC, STK Người Nhà, cân bằng số dư
│   │   ├── Customers.vue                 # Quản lý Khách hàng & Nhà cung cấp
│   │   ├── SizeManager.vue               # Cấu hình quy cách size heo & Bảng bán heo theo Kg
│   │   ├── Reports.vue                   # Báo cáo doanh thu, lợi nhuận, chi phí
│   │   ├── Settings.vue                  # Cài đặt hệ thống, thông tin cửa hàng, reset data
│   │   └── GlobalDialog.vue              # Modal xác nhận và Toast thông báo toàn cục
│   ├── utils/
│   │   ├── dialog.js                     # Quản lý state Toast & Confirm Modal
│   │   ├── formatters.js                 # Định dạng tiền tệ VND, ngày tháng, số lượng
│   │   └── vietqr.js                     # Sinh URL mã QR ngân hàng VietQR
│   ├── App.vue                           # Layout chính, thanh điều hướng Navigation
│   └── main.js                           # Entry point của Vue app
├── package.json
├── vite.config.js
└── PROJECT_DOCUMENTATION.md              # File tài liệu này
```

---

## 4. 🐖 CÁC PHÂN HỆ NGHIỆP VỤ CỐT LÕI

### 4.1. Phân hệ Quản Lý Kho & Nhập Chuyến Xe (`Inventory.vue`)
1. **Lập phiếu nhập chuyến xe mới (`/api/purchases`)**:
   - Chọn Nhà Cung Cấp.
   - Nhập thông tin chuyến: Ngày nhập, Cách bảo quản (Heo nóng / Heo đông lạnh / Heo bao bọc), Đặc điểm (Đuôi cụt / Đuôi dài / Rừng lai / Móng cái).
   - Chi phí tiền xe & tiền bãi: Chọn người chịu (Shop chịu hoặc NCC chịu).
   - **Hỗ trợ 2 hình thức nhập đồng thời**:
     - **+ Thêm dòng size**: Nhập heo theo khoảng size (VD: 3 - 3.9kg, 4 - 4.9kg) -> Nhập số con và giá vốn/con.
     - **+ Thêm dòng nhập theo kg**: Dành cho heo to/lớn nhập theo kg -> Nhập số kg thực tế của từng con và đơn giá vốn/kg.
2. **Quy tắc hiển thị Tồn kho**:
   - **Heo bán theo size**: Chỉ hiển thị **Số con** (VD: `10 con`), **KHÔNG** hiển thị tổng số kg giả lập.
   - **Heo bán theo kg**: Hiển thị **Số con** kèm **Số kg thực tế** (VD: `1 con` kèm dòng `⚖️ 30.5 kg` ở dưới), giá vốn `/kg` và thành tiền chuẩn xác.
3. **Lịch sử phiếu nhập & Sửa chuyến xe**:
   - Khi chỉnh sửa chuyến xe: Tự động đồng bộ và cập nhật đúng 1 bản ghi duy nhất trong Sổ dòng tiền (`maThamChieu = PUR-...`), không tạo giao dịch trùng lặp và không trừ tiền nhiều lần vào tài khoản ngân hàng.

---

### 4.2. Phân hệ Sản Phẩm & Bảng Giá (`Products.vue`)
1. **Thẻ sản phẩm thông minh**:
   - Heo bán theo kg: Hiển thị nổi bật số Kg ngay cạnh tiêu đề (VD: `Heo bán theo kg` + `⚖️ 30.5 kg`), huy hiệu trên góc ảnh `⚖️ 30.5 kg`, tồn kho `Còn: 1 con (30.5 kg)` và đơn giá `/ 1 kg`.
2. **Tính năng Gộp Lô & Tách Lô giữa các NCC**:
   - **Gộp lô (`/api/products/merge`)**: Cho phép kéo-thả hoặc chọn popup để gộp nhiều lô cùng Size/Bảo quản/Đặc điểm từ các NCC khác nhau về chung 1 ô bán, kê 1 giá bán đồng nhất.
   - **Tách lô (`/api/products/unmerge`)**: Cho phép tách ô đã gộp thành từng ô riêng cho từng NCC để bán giá riêng.
3. **Báo giá Zalo / SMS một chạm**:
   - Tự động quét các sản phẩm còn hàng (`totalHeads > 0`) và sinh văn bản báo giá chuẩn đẹp để dán vào Zalo gửi khách.

---

### 4.3. Phân hệ Bán Hàng Tại Quầy POS (`POS.vue`)
1. **Giỏ hàng đa sản phẩm (Multi-item Cart)**:
   - Cho phép chọn nhiều con heo từ nhiều ô khác nhau vào giỏ hàng.
   - Nếu ô gộp nhiều NCC: Có popup cho chọn bốc heo của NCC nào trước.
2. **Thanh toán & Phí vận chuyển**:
   - Chọn người chịu ship: **Khách chịu** (cộng vào tổng tiền khách trả) hoặc **Shop chịu** (trừ vào lợi nhuận đơn hàng).
   - Phương thức thanh toán: Tiền mặt (`Cash`) hoặc Chuyển khoản ngân hàng (`Bank`).
   - Tự động hiển thị mã **VietQR** có logo ngân hàng, số tiền và nội dung chuyển khoản tự động.
3. **In Hóa Đơn & Hiệu Ứng Bán Hàng**:
   - Xuất hóa đơn in nhiệt chuyên nghiệp.
   - Hiệu ứng pháo hoa Confetti khi chốt đơn thành công.

---

### 4.4. Phân hệ Đơn Hàng & Xử Lý Đổi Trả (`Orders.vue`)
1. **Bộ lọc đơn hàng chuẩn mực**:
   - Lọc theo Ngày, Tháng, Năm, 7 ngày, 30 ngày, 2 năm và Toàn bộ thời gian.
   - Tìm kiếm tức thì theo: Mã đơn (`DH-...`), Tên khách hàng, Số điện thoại, Tên sản phẩm heo.
   - Nút **"Đặt Lại"** đưa bộ lọc về tháng hiện tại.
2. **Nghiệp vụ Đổi Trả & Bồi Thường Hàng Lỗi (`/api/orders/{id}/return`)**:
   - **Trả heo**: Nhập số con trả -> Tự động hoàn tiền cho khách, cộng lại tồn kho cho sản phẩm và trừ công nợ/tiền của NCC tương ứng.
   - **Giảm giá bồi thường (Heo lỗi/kém chất lượng nhưng khách vẫn nhận)**: Nhập số tiền bồi thường -> Chọn người chịu bồi thường (NCC chịu hoặc Shop chịu).
3. **Hủy đơn hàng**: Tự động hoàn lại số lượng heo vào kho.

---

### 4.5. Phân hệ Sổ Dòng Tiền & Cân Bằng Tài Khoản (`BankAccounts.vue`)
1. **Phân loại 2 nhóm tài khoản**:
   - **Tài khoản Nhà Cung Cấp (NCC)**: Theo dõi số dư tiền hàng trả trước / tiền gửi cho NCC.
   - **Tài khoản Người Nhà (Cá nhân)**: Nhận tiền lời bán heo hàng tháng.
2. **Các nghiệp vụ dòng tiền**:
   - **Nhập chuyến heo (`NHAP_HANG`)**: Ghi nhận chi phí nhập heo từ chuyến xe.
   - **Khách chuyển trực tiếp cho NCC (`KHACH_TRA_NCC`)**: Khách mua heo chuyển thẳng tiền vào STK của NCC -> Tăng số dư của NCC đó.
   - **Gửi tiền cọc cho NCC (`TIEN_COC_NCC`)**: Chủ shop chuyển cọc/ứng trước tiền hàng cho NCC.
   - **Ghi nhận lợi nhuận Người Nhà (`LOI_NHUAN_NGUOI_NHA`)**: Tổng hợp tiền lời kinh doanh hàng tháng về tài khoản gia đình.

---

### 4.6. Phân hệ Quản Lý Size & Chi Tiết Bán Heo Theo Kg (`SizeManager.vue`)
1. **Cấu hình bảng Size chuẩn**: Thêm/Sửa/Xóa các khoảng size (3 - 3.9kg, 4 - 4.9kg, ... hoặc bán theo kg).
2. **Bảng Chi Tiết Bán Heo Theo Cân Nặng (Kg)**:
   - Thống kê nhanh: Tổng số con bán theo kg, Tổng số kg đã bán, Tổng doanh thu bán kg.
   - Bảng chi tiết từng lượt bán: Thời gian, Mã đơn, Khách hàng, Cân nặng từng con (`⚖️ 30.5 kg`), Đơn giá/kg, Thành tiền.

---

### 4.7. Phân hệ Đối Tác: Khách Hàng & Nhà Cung Cấp (`Customers.vue`)
- Quản lý danh bạ Khách hàng & NCC.
- Tự động tính toán: Tổng số đơn, Tổng sản lượng con mua/bán, Tổng doanh số tích lũy.
- Tìm kiếm theo tên, số điện thoại, địa chỉ; gắn nhãn khách VIP / Tiềm năng / Thường xuyên.

---

### 4.8. Phân hệ Thông Báo & Hộp Thoại Toàn Cục (`GlobalDialog.vue` & `dialog.js`)
- Thiết kế Glassmorphism sang trọng với 4 loại thông báo:
  - 🟢 **Thành công (`success`)**: Nền viền xanh lục bảo `Emerald`.
  - 🟡 **Cảnh báo (`warning`)**: Nền viền vàng hổ phách `Amber`.
  - 🔴 **Lỗi (`error`)**: Nền viền đỏ Ruby `Rose`.
  - 🔵 **Thông tin (`info`)**: Nền viền xanh lam `Cyan`.
- 100% thông báo chuẩn tiếng Việt có dấu, rõ ràng, lịch sự.

---

## 5. 🗄️ CƠ SỞ DỮ LIỆU & CÁC ENTITY CHÍNH

1. **`SanPhamHeo`**:
   - `id`, `maSanPham`, `tenSanPham`, `hinhAnh`, `loaiHeo`, `dacDiemHeo`, `loaiSize`, `donViTinh` ('Con'/'Kg'), `soLuongCon`, `soKgTonKho`, `giaNhapVon`, `giaBanRa`, `nhomGopId`, `nhaCungCapId`.
2. **`PhieuNhapKho` & `ChiTietPhieuNhap`**:
   - `id`, `maPhieuNhap`, `ngayNhapKho`, `loaiHeo`, `dacDiemHeo`, `chiPhiTienXe`, `chiPhiTienBai`, `nguoiChiuTienXe`, `tienHangHeo`, `tongTienNhap`, `nhaCungCapId`, `taiKhoanNganHangId`.
   - Chi tiết: `sanPhamHeoId`, `loaiSize`, `donViTinh`, `soLuongCon`, `soKg`, `giaNhapVon`, `thanhTien`.
3. **`DonHang` & `ChiTietDonHang`**:
   - `id`, `maDonHang`, `ngayDatHang`, `tenKhachHang`, `soDienThoai`, `diaChiGiaoHang`, `tongTienHang`, `chiPhiTienXe`, `nguoiChiuTienXe`, `tongThanhToan`, `phuongThucThanhToan`, `taiKhoanNganHangId`, `trangThai`.
4. **`DongTienNganHang` & `TaiKhoanNganHang`**:
   - `soTaiKhoan`, `tenNganHang`, `tenChuTaiKhoan`, `loaiTaiKhoan` ('NCC' / 'NGUOI_NHA'), `soDuHienTai`.
   - Dòng tiền: `loaiGiaoDich` ('IN' / 'OUT'), `soTien`, `loaiNghiepVu`, `maThamChieu`, `ghiChu`.

---

## 6. 🚀 HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### 6.1. Khởi động Backend (Spring Boot)
Mở terminal tại thư mục `backend/`:
```bash
cd d:\Visualcode\pig\backend
mvn spring-boot:run
```
*Backend sẽ lắng nghe tại `http://localhost:8080`.*

### 6.2. Khởi động Frontend (Vue 3 + Vite)
Mở terminal tại thư mục gốc `pig/`:
```bash
cd d:\Visualcode\pig
npm run dev
```
*Truy cập giao diện Web tại `http://localhost:5173`.*

### 6.3. Kiểm tra Build Production
```bash
npm run build
```

---

## 7. 📝 QUY TẮC PHÁT TRIỂN & BẢO TRÌ (DÀNH CHO AGENT AI)
1. **Tính toán số Kg**:
   - Heo bán theo khoảng size: Chỉ đếm số con, không tự ý cộng dồn số kg giả định.
   - Heo bán theo kg: Luôn lấy `soKgTonKho` hoặc `weightKg` thực tế của từng con nhân với đơn giá/kg.
2. **Giao dịch Dòng tiền**:
   - Khi chỉnh sửa phiếu nhập xe, luôn tìm và cập nhật bản ghi `DongTienNganHang` cũ thông qua `maThamChieu` (mã phiếu `PUR-...`), không được tạo thêm giao dịch mới gây trừ tiền 2 lần.
3. **Ngôn ngữ & Giao diện**:
   - Mọi thông báo lỗi, cảnh báo, thành công phải viết bằng tiếng Việt có dấu hoàn chỉnh, lịch sự.
   - Giữ vững phong cách giao diện Dark Mode cao cấp, viền bo tròn mềm mại và tương phản sắc nét.

---
*Tài liệu được khởi tạo và cập nhật tự động vào ngày 31/08/2026.*
