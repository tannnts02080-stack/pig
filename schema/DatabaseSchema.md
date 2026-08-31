# 🗄️ TÀI LIỆU DATABASE & KIẾN TRÚC CLASS TIẾNG VIỆT (PIG SYSTEM)

Hệ thống Quản lý Bán buôn & Bán lẻ Heo (Heo tươi nóng & Heo cấp đông). Toàn bộ tên bảng trong Database SQL Server và tên Class Java Backend đều được đặt theo chuẩn **Tiếng Việt**.

---

## 1. Danh sách Bảng Trong SQL Server & Class Java Tương Ứng

| # | Tên Class Java (Backend) | Tên Bảng SQL Server | Ý Nghĩa / Nghiệp Vụ |
|:---|:---|:---|:---|
| 1 | `SanPhamHeo.java` | `dbo.SAN_PHAM_HEO` | Quản lý từng ô sản phẩm heo (Hình ảnh, NCC, Giá bán số to, Giá vốn số nhỏ, Tồn kho con & Kg, Hàng nóng / lạnh). |
| 2 | `NhaCungCap.java` | `dbo.NHA_CUNG_CAP` | Danh sách các trang trại nguồn heo (Trại Ba Vì, Trại Đồng Nai...) và công nợ. |
| 3 | `KhachHang.java` | `dbo.KHACH_HANG` | Khách hàng mua heo, theo dõi công nợ bán hàng. |
| 4 | `DonHang.java` | `dbo.DON_HANG` | Đơn bán hàng, lưu tiền bán, tiền vốn, chi phí tiền xe ship và **Tính Lợi Nhuận Ròng (Tiền Lời)**. |
| 5 | `ChiTietDonHang.java` | `dbo.CHI_TIET_DON_HANG` | Từng món heo bán theo size, tự động trừ tồn kho theo đúng Size & NCC. |
| 6 | `PhieuNhapKho.java` | `dbo.PHIEU_NHAP_KHO` | Phiếu nhập heo theo chuyến từ trang trại, ghi nhận **Chi phí tiền xe khách**. |
| 7 | `ChiTietPhieuNhap.java` | `dbo.CHI_TIET_PHIEU_NHAP` | Từng size heo nhập về, tự động cộng số con & số kg vào kho. |
| 8 | `TaiKhoanNganHang.java` | `dbo.TAI_KHOAN_NGAN_HANG` | Danh sách tài khoản ngân hàng nhận tiền hoặc chi tiền (MB, Vietcombank...). |
| 9 | `DongTienNganHang.java` | `dbo.DONG_TIEN_NGAN_HANG` | Nhật ký dòng tiền chi tiết VÀO (+) và RA (-) của từng tài khoản ngân hàng. |
| 10 | `CauHinhHeThong.java` | `dbo.CAU_HINH_HE_THONG` | Cài đặt thông tin cửa hàng, hotline, địa chỉ hiển thị. |

---

## 2. Cấu trúc Thư mục Backend (`com.pig.backend`)

```
backend/src/main/java/com/pig/backend/
├── config/
│   └── DataInitializer.java        # Khởi tạo dữ liệu mẫu ban đầu
├── domain/                          # Entities Tiếng Việt mapping bảng UPPER_SNAKE_CASE
│   ├── CauHinhHeThong.java
│   ├── ChiTietDonHang.java
│   ├── ChiTietPhieuNhap.java
│   ├── DongTienNganHang.java
│   ├── DonHang.java
│   ├── KhachHang.java
│   ├── NhaCungCap.java
│   ├── PhieuNhapKho.java
│   ├── SanPhamHeo.java
│   └── TaiKhoanNganHang.java
├── dto/                             # DTOs Tiếng Việt
│   ├── ApiResponse.java
│   ├── BaoCaoDashboardDTO.java
│   ├── DongTienNganHangDTO.java
│   ├── SanPhamHeoDTO.java
│   ├── TaiKhoanNganHangDTO.java
│   ├── TaoDonHangRequest.java
│   ├── TaoPhieuNhapRequest.java
│   └── TongKetNhapTrongNgayDTO.java
├── repository/                      # Spring Data JPA Repositories
│   ├── CauHinhHeThongRepository.java
│   ├── ChiTietDonHangRepository.java
│   ├── ChiTietPhieuNhapRepository.java
│   ├── DongTienNganHangRepository.java
│   ├── DonHangRepository.java
│   ├── KhachHangRepository.java
│   ├── NhaCungCapRepository.java
│   ├── PhieuNhapKhoRepository.java
│   ├── SanPhamHeoRepository.java
│   └── TaiKhoanNganHangRepository.java
├── service/                         # Service Interfaces & Implementations
│   ├── BaoCaoService.java
│   ├── DonHangService.java
│   ├── PhieuNhapKhoService.java
│   ├── SanPhamHeoService.java
│   ├── TaiKhoanNganHangService.java
│   └── impl/
│       ├── BaoCaoServiceImpl.java
│       ├── DonHangServiceImpl.java
│       ├── PhieuNhapKhoServiceImpl.java
│       ├── SanPhamHeoServiceImpl.java
│       └── TaiKhoanNganHangServiceImpl.java
└── controller/                      # RESTful Controllers
    ├── BaoCaoController.java
    ├── CauHinhHeThongController.java
    ├── DongTienNganHangController.java
    ├── DonHangController.java
    ├── HeThongController.java
    ├── KhachHangController.java
    ├── NhaCungCapController.java
    ├── PhieuNhapKhoController.java
    ├── SanPhamHeoController.java
    └── TaiKhoanNganHangController.java
```
