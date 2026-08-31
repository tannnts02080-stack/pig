-- =====================================================================================
-- DATABASE: Pig (Microsoft SQL Server)
-- TÊN BẢNG TIẾNG VIỆT (UPPER_SNAKE_CASE) THEO CHUẨN CỦA BẠN
-- =====================================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Pig')
BEGIN
    CREATE DATABASE Pig COLLATE Vietnamese_CI_AS;
END
GO

USE Pig;
GO

-- DROP CÁC BẢNG CŨ NẾU CÓ THEO THỨ TỰ KHÓA NGOẠI
IF OBJECT_ID('dbo.CHI_TIET_DON_HANG', 'U') IS NOT NULL DROP TABLE dbo.CHI_TIET_DON_HANG;
IF OBJECT_ID('dbo.CHI_TIET_PHIEU_NHAP', 'U') IS NOT NULL DROP TABLE dbo.CHI_TIET_PHIEU_NHAP;
IF OBJECT_ID('dbo.DONG_TIEN_NGAN_HANG', 'U') IS NOT NULL DROP TABLE dbo.DONG_TIEN_NGAN_HANG;
IF OBJECT_ID('dbo.DON_HANG', 'U') IS NOT NULL DROP TABLE dbo.DON_HANG;
IF OBJECT_ID('dbo.PHIEU_NHAP_KHO', 'U') IS NOT NULL DROP TABLE dbo.PHIEU_NHAP_KHO;
IF OBJECT_ID('dbo.SAN_PHAM_HEO', 'U') IS NOT NULL DROP TABLE dbo.SAN_PHAM_HEO;
IF OBJECT_ID('dbo.KHACH_HANG', 'U') IS NOT NULL DROP TABLE dbo.KHACH_HANG;
IF OBJECT_ID('dbo.NHA_CUNG_CAP', 'U') IS NOT NULL DROP TABLE dbo.NHA_CUNG_CAP;
IF OBJECT_ID('dbo.TAI_KHOAN_NGAN_HANG', 'U') IS NOT NULL DROP TABLE dbo.TAI_KHOAN_NGAN_HANG;
IF OBJECT_ID('dbo.CAU_HINH_HE_THONG', 'U') IS NOT NULL DROP TABLE dbo.CAU_HINH_HE_THONG;

-- DROP CÁC BẢNG TIẾNG ANH CŨ (NẾU CÒN)
IF OBJECT_ID('dbo.order_items', 'U') IS NOT NULL DROP TABLE dbo.order_items;
IF OBJECT_ID('dbo.purchase_items', 'U') IS NOT NULL DROP TABLE dbo.purchase_items;
IF OBJECT_ID('dbo.bank_cash_flows', 'U') IS NOT NULL DROP TABLE dbo.bank_cash_flows;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.purchases', 'U') IS NOT NULL DROP TABLE dbo.purchases;
IF OBJECT_ID('dbo.products', 'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.customers', 'U') IS NOT NULL DROP TABLE dbo.customers;
IF OBJECT_ID('dbo.suppliers', 'U') IS NOT NULL DROP TABLE dbo.suppliers;
IF OBJECT_ID('dbo.bank_accounts', 'U') IS NOT NULL DROP TABLE dbo.bank_accounts;
IF OBJECT_ID('dbo.settings', 'U') IS NOT NULL DROP TABLE dbo.settings;
GO

-- 1. BẢNG TÀI KHOẢN NGÂN HÀNG
CREATE TABLE dbo.TAI_KHOAN_NGAN_HANG (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ma_ngan_hang VARCHAR(50) NOT NULL,
    ten_ngan_hang NVARCHAR(150) NOT NULL,
    so_tai_khoan VARCHAR(50) NOT NULL UNIQUE,
    chu_tai_khoan NVARCHAR(150) NOT NULL,
    so_du_hien_tai DECIMAL(18,2) DEFAULT 0,
    trang_thai_hoat_dong BIT DEFAULT 1,
    ghi_chu NVARCHAR(500),
    ngay_tao DATETIME2 DEFAULT GETDATE()
);
GO

-- 2. BẢNG DÒNG TIỀN NGÂN HÀNG (NHẬT KÝ THU/CHI NGÂN HÀNG)
CREATE TABLE dbo.DONG_TIEN_NGAN_HANG (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    tai_khoan_ngan_hang_id BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.TAI_KHOAN_NGAN_HANG(id),
    loai_dong_tien VARCHAR(10) NOT NULL, -- 'IN' (Vào) / 'OUT' (Ra)
    so_tien DECIMAL(18,2) NOT NULL,
    loai_giao_dich VARCHAR(50),          -- 'DON_HANG', 'PHIEU_NHAP', 'TIEN_XE', 'THU_CONG'
    ma_tham_chieu NVARCHAR(50),
    mo_ta NVARCHAR(500) NOT NULL,
    ngay_giao_dich DATETIME2 DEFAULT GETDATE()
);
GO

-- 3. BẢNG NHÀ CUNG CẤP TRANG TRẠI HEO
CREATE TABLE dbo.NHA_CUNG_CAP (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ma_nha_cung_cap NVARCHAR(50) NOT NULL UNIQUE,
    ten_nha_cung_cap NVARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(20),
    dia_chi NVARCHAR(500),
    nguoi_lien_he NVARCHAR(100),
    cong_no_phai_tra DECIMAL(18,2) DEFAULT 0,
    ghi_chu NVARCHAR(MAX),
    ngay_tao DATETIME2 DEFAULT GETDATE()
);
GO

-- 4. BẢNG SẢN PHẨM HEO (Ô SẢN PHẨM TRONG CỬA HÀNG & KHO)
CREATE TABLE dbo.SAN_PHAM_HEO (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ma_san_pham NVARCHAR(50) NOT NULL,
    ten_san_pham NVARCHAR(255) NOT NULL,
    hinh_anh NVARCHAR(MAX),
    nha_cung_cap_id BIGINT NULL FOREIGN KEY REFERENCES dbo.NHA_CUNG_CAP(id),
    loai_heo NVARCHAR(50) NOT NULL DEFAULT 'hot',   -- 'hot' (Hàng nóng) / 'cold' (Hàng lạnh)
    loai_size NVARCHAR(100) NOT NULL,              -- Heo 5Kg, Heo 7Kg, Thịt Ba Chỉ...
    don_vi_tinh NVARCHAR(20) NOT NULL DEFAULT N'Con', -- Con / Kg
    trong_luong_moi_con DECIMAL(10,2) DEFAULT 5.0,
    so_luong_con INT NOT NULL DEFAULT 0,
    so_kg_ton_kho DECIMAL(18,2) NOT NULL DEFAULT 0,
    gia_nhap_von DECIMAL(18,2) NOT NULL DEFAULT 0,  -- Giá nhập số nhỏ
    gia_ban_ra DECIMAL(18,2) NOT NULL DEFAULT 0,    -- Giá bán số to
    ngay_nhap DATE DEFAULT CAST(GETDATE() AS DATE),
    chi_tiet_nhap NVARCHAR(MAX),
    ghi_chu NVARCHAR(MAX),
    ngay_tao DATETIME2 DEFAULT GETDATE()
);
GO

-- 5. BẢNG KHÁCH HÀNG
CREATE TABLE dbo.KHACH_HANG (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ten_khach_hang NVARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(20),
    dia_chi NVARCHAR(500),
    cong_no_hien_tai DECIMAL(18,2) DEFAULT 0,
    ghi_chu NVARCHAR(MAX),
    ngay_tao DATETIME2 DEFAULT GETDATE()
);
GO

-- 6. BẢNG ĐƠN HÀNG (BÁN HÀNG & TÍNH LỢI NHUẬN)
CREATE TABLE dbo.DON_HANG (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ma_don_hang NVARCHAR(50) NOT NULL UNIQUE,
    ngay_dat_hang DATETIME2 NOT NULL DEFAULT GETDATE(),
    khach_hang_id BIGINT NULL FOREIGN KEY REFERENCES dbo.KHACH_HANG(id),
    ten_khach_hang NVARCHAR(255) NOT NULL,
    so_dien_thoai_khach VARCHAR(20),
    dia_chi_giao_hang NVARCHAR(500),
    tong_tien_ban DECIMAL(18,2) NOT NULL DEFAULT 0,
    tong_tien_von DECIMAL(18,2) NOT NULL DEFAULT 0,
    chi_phi_tien_xe_giao DECIMAL(18,2) NOT NULL DEFAULT 0, -- Chi phí tiền xe giao
    chi_phi_khac DECIMAL(18,2) NOT NULL DEFAULT 0,
    tong_tien_loi DECIMAL(18,2) NOT NULL DEFAULT 0,        -- Tiền Lời = Bán - Vốn - Tiền Xe
    phuong_thuc_thanh_toan NVARCHAR(50) NOT NULL DEFAULT 'Cash', -- Cash / Bank
    tai_khoan_ngan_hang_id BIGINT NULL FOREIGN KEY REFERENCES dbo.TAI_KHOAN_NGAN_HANG(id),
    so_tien_da_thanh_toan DECIMAL(18,2) NOT NULL DEFAULT 0,
    cong_no_con_lai DECIMAL(18,2) NOT NULL DEFAULT 0,
    ghi_chu NVARCHAR(MAX),
    ngay_tao DATETIME2 DEFAULT GETDATE()
);
GO

-- 7. BẢNG CHI TIẾT ĐƠN HÀNG
CREATE TABLE dbo.CHI_TIET_DON_HANG (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    don_hang_id BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.DON_HANG(id) ON DELETE CASCADE,
    san_pham_heo_id BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.SAN_PHAM_HEO(id),
    loai_heo NVARCHAR(50) NOT NULL,
    loai_size NVARCHAR(100) NOT NULL,
    don_vi_tinh NVARCHAR(20) NOT NULL,
    so_luong INT NOT NULL DEFAULT 1,
    so_kg DECIMAL(10,2) DEFAULT 0,
    gia_nhap_von DECIMAL(18,2) NOT NULL,
    gia_ban_goc DECIMAL(18,2) NOT NULL,
    gia_ban_thuc_te DECIMAL(18,2) NOT NULL,
    tien_loi_tung_mon DECIMAL(18,2) NOT NULL,
    thanh_tien DECIMAL(18,2) NOT NULL
);
GO

-- 8. BẢNG PHIẾU NHẬP KHO (GHI NHẬN CHUYẾN NHẬP & TIỀN XE KHÁCH)
CREATE TABLE dbo.PHIEU_NHAP_KHO (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ma_phieu_nhap NVARCHAR(50) NOT NULL UNIQUE,
    nha_cung_cap_id BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.NHA_CUNG_CAP(id),
    ngay_nhap_kho DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    loai_heo NVARCHAR(50) NOT NULL DEFAULT 'hot',
    tien_hang_heo DECIMAL(18,2) NOT NULL DEFAULT 0,
    chi_phi_tien_xe DECIMAL(18,2) NOT NULL DEFAULT 0,      -- Tiền xe khách chở heo
    tong_tien_nhap DECIMAL(18,2) NOT NULL DEFAULT 0,       -- Tổng tiền = Tiền hàng + Tiền xe
    so_tien_da_tra DECIMAL(18,2) NOT NULL DEFAULT 0,
    cong_no_con_thieu DECIMAL(18,2) NOT NULL DEFAULT 0,
    tai_khoan_ngan_hang_id BIGINT NULL FOREIGN KEY REFERENCES dbo.TAI_KHOAN_NGAN_HANG(id),
    ghi_chu NVARCHAR(MAX),
    ngay_tao DATETIME2 DEFAULT GETDATE()
);
GO

-- 9. BẢNG CHI TIẾT PHIẾU NHẬP
CREATE TABLE dbo.CHI_TIET_PHIEU_NHAP (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    phieu_nhap_kho_id BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.PHIEU_NHAP_KHO(id) ON DELETE CASCADE,
    san_pham_heo_id BIGINT NOT NULL FOREIGN KEY REFERENCES dbo.SAN_PHAM_HEO(id),
    loai_size NVARCHAR(100) NOT NULL,
    don_vi_tinh NVARCHAR(20) NOT NULL DEFAULT 'Con',
    so_luong_con INT DEFAULT 0,
    so_kg DECIMAL(18,2) DEFAULT 0,
    gia_nhap_von DECIMAL(18,2) NOT NULL,
    thanh_tien_hang DECIMAL(18,2) NOT NULL
);
GO

-- 10. BẢNG CẤU HÌNH HỆ THỐNG
CREATE TABLE dbo.CAU_HINH_HE_THONG (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ten_cua_hang NVARCHAR(255) NOT NULL,
    khau_hieu NVARCHAR(500),
    so_dien_thoai VARCHAR(50),
    dia_chi NVARCHAR(500),
    don_vi_tien_te VARCHAR(20) DEFAULT 'VNĐ'
);
GO

-- INDEXES NÂNG CAO HIỆU NĂNG TRUY VẤN
CREATE NONCLUSTERED INDEX ix_san_pham_heo_loai ON dbo.SAN_PHAM_HEO(loai_heo);
CREATE NONCLUSTERED INDEX ix_san_pham_heo_ncc ON dbo.SAN_PHAM_HEO(nha_cung_cap_id);
CREATE NONCLUSTERED INDEX ix_don_hang_ngay ON dbo.DON_HANG(ngay_dat_hang);
CREATE NONCLUSTERED INDEX ix_phieu_nhap_ngay ON dbo.PHIEU_NHAP_KHO(ngay_nhap_kho);
CREATE NONCLUSTERED INDEX ix_dong_tien_tk ON dbo.DONG_TIEN_NGAN_HANG(tai_khoan_ngan_hang_id);
GO
