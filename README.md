# HỆ THỐNG QUẢN LÝ BUÔN BÁN HEO (PIG MANAGEMENT SYSTEM)
> Chuẩn mô hình kiến trúc phân lớp chuyên nghiệp giống **QueenBeautiful**:  
> **Backend**: Spring Boot 3 + Hibernate JPA (Auto-DDL `update`) + SQL Server Database `Pig`.  
> **Frontend**: React 18 + Vite + TailwindCSS (Hỗ trợ giao diện Máy tính & Điện thoại Android).  
> **Schema**: 100% Tên bảng và tên cột bằng Tiếng Anh chuẩn, RESTful API v1.

---

## 🏗️ CẤU TRÚC THƯ MỤC DỰ ÁN

```
pig/
├── backend/                               # SPRING BOOT 3 BACKEND
│   ├── src/main/java/com/pig/backend/
│   │   ├── config/                        # CorsConfig, SecurityConfig...
│   │   ├── controller/                    # RESTful APIs (/api/v1/...)
│   │   ├── dto/                           # Data Transfer Objects
│   │   ├── entity/                        # Hibernate JPA Entities (English Table Names)
│   │   ├── exception/                     # GlobalExceptionHandler
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── service/                       # Business Logic Interfaces
│   │   │   └── impl/                      # Business Logic Implementations
│   │   └── BackendApplication.java        # Class khởi chạy Spring Boot
│   ├── src/main/resources/
│   │   └── application.properties         # Cấu hình SQL Server & Hibernate Auto-DDL
│   ├── pom.xml                            # Maven Dependencies
│   └── run-local.cmd                      # Script 1-Click chạy Backend
├── frontend/ (hoặc thư mục gốc)           # REACT + VITE FRONTEND
│   ├── src/
│   │   ├── components/                    # POS, Inventory, Orders, BankAccounts, Reports...
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── schema/                                # TÀI LIỆU & SCRIPT DATABASE
│   ├── DatabaseSchema.md                  # Tài liệu mô tả chi tiết các bảng
│   ├── Pig_Schema.sql                     # Script SQL Server 100% Tiếng Anh
│   └── data.sql                           # Seed data mẫu ban đầu
├── .env                                   # Cấu hình biến môi trường
├── .env.example
├── docker-compose.yml                     # Triển khai Docker Container
├── chay_ung_dung.bat                      # Script 1-Click chạy trên Windows
└── README.md
```

---

## 🗄️ DANH SÁCH BẢNG SQL SERVER (100% ENGLISH STANDARD)

1. `bank_accounts`: Quản lý danh sách tài khoản ngân hàng (MB, VCB, TCB...).
2. `bank_cash_flows`: Nhật ký chi tiết dòng tiền VÀO (+) và RA (-).
3. `suppliers`: Nhà cung cấp / trang trại nguồn heo (NCC A, NCC B...).
4. `products`: Ô sản phẩm heo trong kho (Hàng nóng ♨️ / Hàng lạnh ❄️, Giá bán số to, Giá vốn số nhỏ, số con, số kg).
5. `customers`: Khách hàng mua heo, quán ăn, công nợ.
6. `orders`: Đơn bán hàng, thời gian đặt, chi phí tiền xe ship, **Tiền Lời (Lợi nhuận)**.
7. `order_items`: Chi tiết từng size heo bán, trừ kho đúng chuẩn Size/NCC.
8. `purchases`: Phiếu nhập kho từ trại heo, ghi nhận **Chi phí tiền xe khách chở tới**.
9. `purchase_items`: Chi tiết từng size heo nhập kho.
10. `settings`: Cài đặt thông tin cửa hàng, hotline, địa chỉ.

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY (HOW TO RUN)

### Cách 1: Chạy 1-Click trên Windows
Nhấp đúp vào file [chay_ung_dung.bat](file:///d:/Visualcode/pig/chay_ung_dung.bat).

### Cách 2: Chạy Backend Spring Boot bằng Maven
```bash
cd backend
mvn spring-boot:run
```
*(Hoặc nhấp đúp file `backend/run-local.cmd`)*

### Cách 3: Chạy Frontend Vite
```bash
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:3000` (hoặc `http://localhost:5173`).
