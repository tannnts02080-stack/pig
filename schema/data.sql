-- =====================================================================================
-- DỮ LIỆU MẪU BAN ĐẦU CHO HỆ THỐNG QUẢN LÝ HEO
-- BẢNG TIẾNG VIỆT
-- =====================================================================================

USE Pig;
GO

-- 1. CÀI ĐẶT CỬA HÀNG
IF NOT EXISTS (SELECT * FROM dbo.CAU_HINH_HE_THONG)
BEGIN
    INSERT INTO dbo.CAU_HINH_HE_THONG (ten_cua_hang, khau_hieu, so_dien_thoai, dia_chi, don_vi_tien_te)
    VALUES (N'TỔNG KHO BUÔN BÁN HEO SỮA', N'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con Chuẩn Sạch', '0988.888.999', N'TP. Hồ Chí Minh', 'VNĐ');
END
GO

-- 2. TÀI KHOẢN NGÂN HÀNG
IF NOT EXISTS (SELECT * FROM dbo.TAI_KHOAN_NGAN_HANG)
BEGIN
    INSERT INTO dbo.TAI_KHOAN_NGAN_HANG (ma_ngan_hang, ten_ngan_hang, so_tai_khoan, chu_tai_khoan, so_du_hien_tai, ghi_chu)
    VALUES 
    ('MB', 'MB BANK (Quân Đội)', '0988123456', 'NGUYEN VAN PHUC', 50000000.00, N'Tài khoản chính thu tiền bán hàng'),
    ('VCB', 'VIETCOMBANK', '9876543210', 'NGUYEN VAN PHUC', 25000000.00, N'Tài khoản chi trả tiền xe & nhập heo');
END
GO

-- 3. NHÀ CUNG CẤP TRANG TRẠI
IF NOT EXISTS (SELECT * FROM dbo.NHA_CUNG_CAP)
BEGIN
    INSERT INTO dbo.NHA_CUNG_CAP (ma_nha_cung_cap, ten_nha_cung_cap, so_dien_thoai, dia_chi, cong_no_phai_tra)
    VALUES 
    ('SUP01', N'Trang Trại Ba Vì (NCC A)', '0901.234.567', N'Hà Nội', 0),
    ('SUP02', N'Trại Heo Giống Đồng Nai (NCC B)', '0912.345.678', N'Đồng Nai', 0);
END
GO

-- 4. SẢN PHẨM HEO (Ô SẢN PHẨM & TỒN KHO)
IF NOT EXISTS (SELECT * FROM dbo.SAN_PHAM_HEO)
BEGIN
    INSERT INTO dbo.SAN_PHAM_HEO (ma_san_pham, ten_san_pham, hinh_anh, nha_cung_cap_id, loai_heo, loai_size, don_vi_tinh, trong_luong_moi_con, so_luong_con, so_kg_ton_kho, gia_nhap_von, gia_ban_ra, ngay_nhap, chi_tiet_nhap)
    VALUES
    ('HEO-5KG-HOT', N'Heo Sữa Tươi Nóng Nguyên Con 5Kg', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 1, 'hot', N'Heo 5Kg', N'Con', 5.0, 12, 60.0, 800000, 1200000, CAST(GETDATE() AS DATE), N'Lô heo tươi mổ sáng sớm da trắng đẹp'),
    ('HEO-7KG-HOT', N'Heo Sữa Tươi Nóng Size 7Kg', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80', 1, 'hot', N'Heo 7Kg', N'Con', 7.0, 8, 56.0, 1100000, 1650000, CAST(GETDATE() AS DATE), N'Lô heo tươi nóng thịt mềm thơm'),
    ('HEO-3KG-COLD', N'Heo Sữa Cấp Đông Size Nhỏ 3Kg', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80', 1, 'cold', N'Heo 3Kg', N'Con', 3.0, 10, 30.0, 500000, 780000, CAST(GETDATE() AS DATE), N'Heo sữa cấp đông kho âm 18 độ C hút chân không'),
    ('HEO-4KG-COLD', N'Heo Sữa Cấp Đông Chuẩn Size 4Kg', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', 1, 'cold', N'Heo 4Kg', N'Con', 4.0, 15, 60.0, 650000, 980000, CAST(GETDATE() AS DATE), N'Hàng đông lạnh kho lạnh bảo quản tốt');
END
GO
