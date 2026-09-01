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
            // Xóa sạch các dòng tiền của các phiếu nhập đã bị xóa khỏi kho
            jdbcTemplate.execute("DELETE FROM DONG_TIEN_NGAN_HANG WHERE loai_nghiepVu IN ('NHAP_CHUYEN_XE_HEO', 'NHAP_HANG_NCC', 'CHINH_SUA_NHAP') AND ma_tham_chieu NOT IN (SELECT ma_phieu_nhap FROM PHIEU_NHAP_KHO WHERE ma_phieu_nhap IS NOT NULL);");

            // Chuẩn hóa lại các phiếu nhập cũ theo logic NCC bao tiền xe
            jdbcTemplate.execute("UPDATE PHIEU_NHAP_KHO SET tong_tien_nhap = CASE WHEN LOWER(nguoi_chiu_tien_xe) = 'supplier' THEN (tien_hang_heo - ISNULL(chi_phi_tien_xe, 0) - ISNULL(chi_phi_tien_bai, 0)) ELSE (tien_hang_heo + ISNULL(chi_phi_tien_xe, 0) + ISNULL(chi_phi_tien_bai, 0)) END, so_tien_da_tra = CASE WHEN LOWER(nguoi_chiu_tien_xe) = 'supplier' THEN (tien_hang_heo - ISNULL(chi_phi_tien_xe, 0) - ISNULL(chi_phi_tien_bai, 0)) ELSE (tien_hang_heo + ISNULL(chi_phi_tien_xe, 0) + ISNULL(chi_phi_tien_bai, 0)) END WHERE nguoi_chiu_tien_xe IS NOT NULL;");
            
            // Cập nhật lại số tiền trong bảng dòng tiền
            jdbcTemplate.execute("UPDATE DONG_TIEN_NGAN_HANG SET so_tien = p.so_tien_da_tra FROM DONG_TIEN_NGAN_HANG dt INNER JOIN PHIEU_NHAP_KHO p ON dt.ma_tham_chieu = p.ma_phieu_nhap;");
            
            // Cân đối lại số dư tài khoản ngân hàng NCC đúng theo thực tế
            jdbcTemplate.execute("UPDATE TAI_KHOAN_NGAN_HANG SET so_du_hien_tai = ISNULL((SELECT SUM(CASE WHEN loai_dong_tien = 'IN' THEN so_tien ELSE -so_tien END) FROM DONG_TIEN_NGAN_HANG WHERE tai_khoan_ngan_hang_id = TAI_KHOAN_NGAN_HANG.id), 0);");
            
            // Cân đối lại công nợ NCC
            jdbcTemplate.execute("UPDATE NHA_CUNG_CAP SET cong_no_phai_tra = ISNULL((SELECT SUM(so_du_hien_tai) FROM TAI_KHOAN_NGAN_HANG WHERE nha_cung_cap_id = NHA_CUNG_CAP.id), 0);");

            // Tách các sản phẩm heo đang bị gộp theo từng chi tiết phiếu nhập thực tế
            try {
                java.util.List<java.util.Map<String, Object>> ctpnList = jdbcTemplate.queryForList("SELECT c.id AS ctpn_id, c.so_luong_con, c.so_kg, c.gia_nhap_von, c.loai_size, c.san_pham_heo_id, p.loai_heo, p.dac_diem_heo, p.nha_cung_cap_id, p.tai_khoan_ngan_hang_id, p.ngay_nhap_kho, p.ghi_chu FROM CHI_TIET_PHIEU_NHAP c INNER JOIN PHIEU_NHAP_KHO p ON c.phieu_nhap_kho_id = p.id;");
                if (ctpnList != null && ctpnList.size() > 1) {
                    for (int i = 0; i < ctpnList.size(); i++) {
                        java.util.Map<String, Object> r = ctpnList.get(i);
                        Long ctpnId = Long.valueOf(r.get("ctpn_id").toString());
                        int soCon = r.get("so_luong_con") != null ? Integer.parseInt(r.get("so_luong_con").toString()) : 1;
                        java.math.BigDecimal giaVon = r.get("gia_nhap_von") != null ? new java.math.BigDecimal(r.get("gia_nhap_von").toString()) : java.math.BigDecimal.ZERO;
                        String size = (String) r.get("loai_size");
                        String loaiHeo = (String) r.get("loai_heo");
                        String dacDiem = (String) r.get("dac_diem_heo");
                        Long nccId = r.get("nha_cung_cap_id") != null ? Long.valueOf(r.get("nha_cung_cap_id").toString()) : null;
                        Long tkId = r.get("tai_khoan_ngan_hang_id") != null ? Long.valueOf(r.get("tai_khoan_ngan_hang_id").toString()) : null;

                        if (i == 0) {
                            Object spId = r.get("san_pham_heo_id");
                            if (spId != null) {
                                jdbcTemplate.update("UPDATE SAN_PHAM_HEO SET so_luong_con = ?, gia_nhap_von = ?, so_kg_tonKho = ? WHERE id = ?", soCon, giaVon, soCon * 5.0, spId);
                            }
                        } else {
                            String maSP = "SP-" + System.currentTimeMillis() + "-" + i;
                            jdbcTemplate.update("INSERT INTO SAN_PHAM_HEO (ma_san_pham, ten_san_pham, loai_size, loai_heo, dac_diem_heo, don_vi_tinh, nha_cung_cap_id, tai_khoan_ngan_hang_id, so_luong_con, so_kg_ton_kho, gia_nhap_von, gia_ban_ra, ngay_nhap, trang_thai_hoat_dong) VALUES (?, ?, ?, ?, ?, 'Con', ?, ?, ?, ?, ?, 0, GETDATE(), 1)",
                                maSP, size != null ? size : "Heo sữa (3 - 3.9kg)", size != null ? size : "Heo sữa (3 - 3.9kg)", loaiHeo != null ? loaiHeo : "hot", dacDiem != null ? dacDiem : "duoi_cut", nccId, tkId, soCon, soCon * 5.0, giaVon
                            );
                            try {
                                Long newSpId = jdbcTemplate.queryForObject("SELECT id FROM SAN_PHAM_HEO WHERE ma_san_pham = ?", Long.class, maSP);
                                jdbcTemplate.update("UPDATE CHI_TIET_PHIEU_NHAP SET san_pham_heo_id = ? WHERE id = ?", newSpId, ctpnId);
                            } catch (Exception ignored) {}
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Migration product splitting note: {}", e.getMessage());
            }
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
