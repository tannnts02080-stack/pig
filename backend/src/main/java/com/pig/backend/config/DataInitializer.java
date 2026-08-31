package com.pig.backend.config;

import com.pig.backend.domain.*;
import com.pig.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final CauHinhHeThongRepository cauHinhHeThongRepository;
    private final NhaCungCapRepository nhaCungCapRepository;
    private final TaiKhoanNganHangRepository taiKhoanNganHangRepository;
    private final SanPhamHeoRepository sanPhamHeoRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(
            CauHinhHeThongRepository cauHinhHeThongRepository,
            NhaCungCapRepository nhaCungCapRepository,
            TaiKhoanNganHangRepository taiKhoanNganHangRepository,
            SanPhamHeoRepository sanPhamHeoRepository,
            JdbcTemplate jdbcTemplate
    ) {
        this.cauHinhHeThongRepository = cauHinhHeThongRepository;
        this.nhaCungCapRepository = nhaCungCapRepository;
        this.taiKhoanNganHangRepository = taiKhoanNganHangRepository;
        this.sanPhamHeoRepository = sanPhamHeoRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    private void autoMigrateSchema() {
        String[] sqls = {
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'chi_phi_tien_bai') ALTER TABLE phieu_nhap_kho ADD chi_phi_tien_bai DECIMAL(18,2) DEFAULT 0;",
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'chi_phi_tien_xe') ALTER TABLE phieu_nhap_kho ADD chi_phi_tien_xe DECIMAL(18,2) DEFAULT 0;",
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'cong_no_con_thieu') ALTER TABLE phieu_nhap_kho ADD cong_no_con_thieu DECIMAL(18,2) DEFAULT 0;",
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'so_tien_da_tra') ALTER TABLE phieu_nhap_kho ADD so_tien_da_tra DECIMAL(18,2) DEFAULT 0;",
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'tien_hang_heo') ALTER TABLE phieu_nhap_kho ADD tien_hang_heo DECIMAL(18,2) DEFAULT 0;",
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'nguoi_chiu_tien_xe') ALTER TABLE phieu_nhap_kho ADD nguoi_chiu_tien_xe VARCHAR(50) DEFAULT 'buyer';",
            "IF OBJECT_ID('size_config', 'U') IS NULL CREATE TABLE size_config (id BIGINT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL, description NVARCHAR(MAX), sale_type VARCHAR(50) NOT NULL, price_per_unit DECIMAL(18,2), weight_kg DECIMAL(10,2), price_per_kg DECIMAL(18,2), range_tiers_json NVARCHAR(MAX));",
            "IF OBJECT_ID('size_config', 'U') IS NOT NULL ALTER TABLE size_config ALTER COLUMN name NVARCHAR(255) NOT NULL;",
            "IF OBJECT_ID('tai_khoan_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('tai_khoan_ngan_hang') AND name = 'loai_tai_khoan') ALTER TABLE tai_khoan_ngan_hang ADD loai_tai_khoan VARCHAR(50) DEFAULT 'NCC';",
            "IF OBJECT_ID('tai_khoan_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('tai_khoan_ngan_hang') AND name = 'nha_cung_cap_id') ALTER TABLE tai_khoan_ngan_hang ADD nha_cung_cap_id BIGINT;",
            "IF OBJECT_ID('tai_khoan_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('tai_khoan_ngan_hang') AND name = 'ten_nguoi_nha') ALTER TABLE tai_khoan_ngan_hang ADD ten_nguoi_nha NVARCHAR(150);",
            "IF OBJECT_ID('san_pham_heo', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('san_pham_heo') AND name = 'tai_khoan_ngan_hang_id') ALTER TABLE san_pham_heo ADD tai_khoan_ngan_hang_id BIGINT;",
            "IF OBJECT_ID('san_pham_heo', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('san_pham_heo') AND name = 'dac_diem_heo') ALTER TABLE san_pham_heo ADD dac_diem_heo VARCHAR(50) DEFAULT 'duoi_cut';",
            "IF OBJECT_ID('san_pham_heo', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('san_pham_heo') AND name = 'nhom_gop_id') ALTER TABLE san_pham_heo ADD nhom_gop_id VARCHAR(100);",
            "IF OBJECT_ID('phieu_nhap_kho', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('phieu_nhap_kho') AND name = 'dac_diem_heo') ALTER TABLE phieu_nhap_kho ADD dac_diem_heo VARCHAR(50) DEFAULT 'duoi_cut';",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dong_tien_ngan_hang') AND name = 'loai_doi_tuong') ALTER TABLE dong_tien_ngan_hang ADD loai_doi_tuong VARCHAR(50);",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dong_tien_ngan_hang') AND name = 'nha_cung_cap_id') ALTER TABLE dong_tien_ngan_hang ADD nha_cung_cap_id BIGINT;",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dong_tien_ngan_hang') AND name = 'khach_hang_id') ALTER TABLE dong_tien_ngan_hang ADD khach_hang_id BIGINT;",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dong_tien_ngan_hang') AND name = 'ten_khach_hang') ALTER TABLE dong_tien_ngan_hang ADD ten_khach_hang NVARCHAR(150);",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dong_tien_ngan_hang') AND name = 'thang_nam') ALTER TABLE dong_tien_ngan_hang ADD thang_nam VARCHAR(20);",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dong_tien_ngan_hang') AND name = 'loai_nghiep_vu') ALTER TABLE dong_tien_ngan_hang ADD loai_nghiep_vu VARCHAR(50);",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL DELETE FROM dong_tien_ngan_hang WHERE ngay_giao_dich < DATEADD(year, -2, GETDATE());",
            "IF OBJECT_ID('don_hang', 'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('don_hang') AND name = 'nguoi_chiu_tien_xe') ALTER TABLE don_hang ADD nguoi_chiu_tien_xe VARCHAR(50) DEFAULT 'buyer';",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL UPDATE tai_khoan_ngan_hang SET so_du_hien_tai = so_du_hien_tai + 2 * (SELECT ISNULL(SUM(so_tien),0) FROM dong_tien_ngan_hang WHERE tai_khoan_ngan_hang_id = tai_khoan_ngan_hang.id AND loai_giao_dich = 'TRA_HANG_NCC' AND loai_dong_tien = 'OUT') WHERE EXISTS (SELECT 1 FROM dong_tien_ngan_hang WHERE tai_khoan_ngan_hang_id = tai_khoan_ngan_hang.id AND loai_giao_dich = 'TRA_HANG_NCC' AND loai_dong_tien = 'OUT');",
            "IF OBJECT_ID('dong_tien_ngan_hang', 'U') IS NOT NULL UPDATE dong_tien_ngan_hang SET loai_dong_tien = 'IN', mo_ta = REPLACE(mo_ta, 'Trừ tiền hàng', 'Giảm nợ / Hoàn tiền hàng') WHERE loai_giao_dich = 'TRA_HANG_NCC' AND loai_dong_tien = 'OUT';"
        };
        for (String sql : sqls) {
            try {
                jdbcTemplate.execute(sql);
            } catch (Exception e) {
                System.err.println("Migration notice: " + e.getMessage());
            }
        }
    }

    @Override
    public void run(String... args) {
        autoMigrateSchema();

        if (cauHinhHeThongRepository.count() == 0) {
            CauHinhHeThong ch = new CauHinhHeThong();
            ch.setTenCuaHang("TỔNG KHO BUÔN BÁN HEO SỮA");
            ch.setKhauHieu("Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con Chuẩn Sạch");
            ch.setSoDienThoai("0988.888.999");
            ch.setDiaChi("TP. Hồ Chí Minh");
            ch.setDonViTienTe("VNĐ");
            cauHinhHeThongRepository.save(ch);
        }

        System.out.println("=======================================================");
        System.out.println("🐷 PIG MANAGEMENT BACKEND (SPRING BOOT - TIẾNG VIỆT) ĐANG CHẠY 🐷");
        System.out.println("🌐 RESTful API: http://localhost:8080/api/v1");
        System.out.println("🗄️ Database: Microsoft SQL Server [Pig] (Dữ liệu của bạn được lưu vĩnh viễn)");
        System.out.println("=======================================================");
    }
}
