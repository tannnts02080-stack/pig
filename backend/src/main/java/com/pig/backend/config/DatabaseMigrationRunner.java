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
