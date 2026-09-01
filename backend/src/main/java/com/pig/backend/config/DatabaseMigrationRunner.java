package com.pig.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DatabaseMigrationRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMigrationRunner.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and applying safe SQL Server schema migrations...");

        // SAN_PHAM_HEO
        safeAddColumn("SAN_PHAM_HEO", "danh_sach_hinh_anh", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "hinh_anh", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "chi_tiet_nhap", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "ghi_chu", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "nhom_gop_id", "NVARCHAR(100)");

        // PHIEU_NHAP_KHO
        safeAddColumn("PHIEU_NHAP_KHO", "hinh_anh_chuyen_xe", "NVARCHAR(MAX)");
        safeAddColumn("PHIEU_NHAP_KHO", "ghi_chu", "NVARCHAR(MAX)");
        safeAddColumn("PHIEU_NHAP_KHO", "chi_phi_tien_bai", "DECIMAL(18,2) DEFAULT 0");

        // NHA_CUNG_CAP
        safeAddColumn("NHA_CUNG_CAP", "ghi_chu", "NVARCHAR(MAX)");
        safeAddColumn("NHA_CUNG_CAP", "nguoi_lien_he", "NVARCHAR(100)");

        // KHACH_HANG
        safeAddColumn("KHACH_HANG", "ghi_chu", "NVARCHAR(MAX)");

        // DON_HANG
        safeAddColumn("DON_HANG", "so_tien_da_thanh_toan", "DECIMAL(18,2) DEFAULT 0");
        safeAddColumn("DON_HANG", "cong_no_con_lai", "DECIMAL(18,2) DEFAULT 0");
        safeAddColumn("DON_HANG", "chi_phi_khac", "DECIMAL(18,2) DEFAULT 0");
        safeAddColumn("DON_HANG", "ghi_chu", "NVARCHAR(MAX)");

        // TAI_KHOAN_NGAN_HANG
        safeAddColumn("TAI_KHOAN_NGAN_HANG", "ghi_chu", "NVARCHAR(MAX)");
        safeAddColumn("TAI_KHOAN_NGAN_HANG", "ten_nguoi_nha", "NVARCHAR(150)");

        try {
            // Chuẩn hóa lại các phiếu nhập cũ theo logic NCC bao tiền xe
            jdbcTemplate.execute("UPDATE PHIEU_NHAP_KHO SET tong_tien_nhap = CASE WHEN LOWER(nguoi_chiu_tien_xe) = 'supplier' THEN (tien_hang_heo - ISNULL(chi_phi_tien_xe, 0) - ISNULL(chi_phi_tien_bai, 0)) ELSE (tien_hang_heo + ISNULL(chi_phi_tien_xe, 0) + ISNULL(chi_phi_tien_bai, 0)) END, so_tien_da_tra = CASE WHEN LOWER(nguoi_chiu_tien_xe) = 'supplier' THEN (tien_hang_heo - ISNULL(chi_phi_tien_xe, 0) - ISNULL(chi_phi_tien_bai, 0)) ELSE (tien_hang_heo + ISNULL(chi_phi_tien_xe, 0) + ISNULL(chi_phi_tien_bai, 0)) END WHERE nguoi_chiu_tien_xe IS NOT NULL;");
            
            // Cập nhật lại số tiền trong bảng dòng tiền
            jdbcTemplate.execute("UPDATE DONG_TIEN_NGAN_HANG SET so_tien = p.so_tien_da_tra FROM DONG_TIEN_NGAN_HANG dt INNER JOIN PHIEU_NHAP_KHO p ON dt.ma_tham_chieu = p.ma_phieu_nhap;");
            
            // Cân đối lại số dư tài khoản ngân hàng NCC đúng theo thực tế
            jdbcTemplate.execute("UPDATE TAI_KHOAN_NGAN_HANG SET so_du_hien_tai = ISNULL((SELECT SUM(CASE WHEN loai_dong_tien = 'IN' THEN so_tien ELSE -so_tien END) FROM DONG_TIEN_NGAN_HANG WHERE tai_khoan_ngan_hang_id = TAI_KHOAN_NGAN_HANG.id), 0);");
        } catch (Exception e) {
            log.warn("Migration balance recalculation note: {}", e.getMessage());
        }

        log.info("Database schema migration check completed successfully!");
    }

    private void safeAddColumn(String tableName, String columnName, String columnType) {
        try {
            String checkSql = "IF OBJECT_ID('" + tableName + "', 'U') IS NOT NULL AND COL_LENGTH('" + tableName + "', '" + columnName + "') IS NULL " +
                    "ALTER TABLE " + tableName + " ADD " + columnName + " " + columnType + ";";
            jdbcTemplate.execute(checkSql);
            log.info("Verified/Migrated column {}.{}", tableName, columnName);
        } catch (Exception e) {
            log.warn("Could not check/add column {}.{}: {}", tableName, columnName, e.getMessage());
        }
    }
}
