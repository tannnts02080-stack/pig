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

        safeAddColumn("SAN_PHAM_HEO", "danh_sach_hinh_anh", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "hinh_anh", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "chi_tiet_nhap", "NVARCHAR(MAX)");
        safeAddColumn("SAN_PHAM_HEO", "ghi_chu", "NVARCHAR(MAX)");

        safeAddColumn("PHIEU_NHAP_KHO", "hinh_anh_chuyen_xe", "NVARCHAR(MAX)");
        safeAddColumn("PHIEU_NHAP_KHO", "ghi_chu", "NVARCHAR(MAX)");

        safeAddColumn("NHA_CUNG_CAP", "ghi_chu", "NVARCHAR(MAX)");
        safeAddColumn("KHACH_HANG", "ghi_chu", "NVARCHAR(MAX)");
        safeAddColumn("DON_HANG", "ghi_chu", "NVARCHAR(MAX)");

        log.info("Database schema migration check completed successfully!");
    }

    private void safeAddColumn(String tableName, String columnName, String columnType) {
        try {
            String checkSql = "IF COL_LENGTH('" + tableName + "', '" + columnName + "') IS NULL " +
                    "ALTER TABLE " + tableName + " ADD " + columnName + " " + columnType + ";";
            jdbcTemplate.execute(checkSql);
            log.info("Verified column {}.{}", tableName, columnName);
        } catch (Exception e) {
            log.warn("Could not check/add column {}.{}: {}", tableName, columnName, e.getMessage());
        }
    }
}
