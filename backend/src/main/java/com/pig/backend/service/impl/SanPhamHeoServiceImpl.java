package com.pig.backend.service.impl;

import com.pig.backend.domain.DongTienNganHang;
import com.pig.backend.domain.NhaCungCap;
import com.pig.backend.domain.SanPhamHeo;
import com.pig.backend.domain.TaiKhoanNganHang;
import com.pig.backend.dto.SanPhamHeoDTO;
import com.pig.backend.repository.DongTienNganHangRepository;
import com.pig.backend.repository.NhaCungCapRepository;
import com.pig.backend.repository.SanPhamHeoRepository;
import com.pig.backend.repository.TaiKhoanNganHangRepository;
import com.pig.backend.service.SanPhamHeoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SanPhamHeoServiceImpl implements SanPhamHeoService {

    private final SanPhamHeoRepository sanPhamHeoRepository;
    private final NhaCungCapRepository nhaCungCapRepository;
    private final TaiKhoanNganHangRepository taiKhoanNganHangRepository;
    private final DongTienNganHangRepository dongTienNganHangRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public SanPhamHeoServiceImpl(
            SanPhamHeoRepository sanPhamHeoRepository,
            NhaCungCapRepository nhaCungCapRepository,
            TaiKhoanNganHangRepository taiKhoanNganHangRepository,
            DongTienNganHangRepository dongTienNganHangRepository,
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate
    ) {
        this.sanPhamHeoRepository = sanPhamHeoRepository;
        this.nhaCungCapRepository = nhaCungCapRepository;
        this.taiKhoanNganHangRepository = taiKhoanNganHangRepository;
        this.dongTienNganHangRepository = dongTienNganHangRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<SanPhamHeo> layTatCaSanPham() {
        return sanPhamHeoRepository.findAll();
    }

    @Override
    public SanPhamHeo layChiTietSanPham(Long id) {
        return sanPhamHeoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm heo với ID: " + id));
    }

    @Override
    @Transactional
    public SanPhamHeo themSanPham(SanPhamHeoDTO dto) {
        SanPhamHeo sp = new SanPhamHeo();
        sp.setMaSanPham(dto.getMaSanPham() != null ? dto.getMaSanPham() : "HEO-" + System.currentTimeMillis());
        sp.setTenSanPham(dto.getTenSanPham());
        sp.setHinhAnh(dto.getHinhAnh());
        sp.setLoaiHeo(dto.getLoaiHeo() != null ? dto.getLoaiHeo() : "hot");
        sp.setDacDiemHeo(dto.getDacDiemHeo() != null ? dto.getDacDiemHeo() : (dto.getPigFeature() != null ? dto.getPigFeature() : "duoi_cut"));
        sp.setLoaiSize(dto.getLoaiSize());
        sp.setDonViTinh(dto.getDonViTinh() != null ? dto.getDonViTinh() : "con");
        sp.setSoLuongCon(dto.getSoLuongCon() != null ? dto.getSoLuongCon() : 0);
        
        if (dto.getSoKgTonKho() != null) {
            sp.setSoKgTonKho(dto.getSoKgTonKho());
        } else {
            BigDecimal w = dto.getTrongLuongMoiCon() != null ? dto.getTrongLuongMoiCon() : new BigDecimal("5.0");
            sp.setSoKgTonKho(BigDecimal.valueOf(sp.getSoLuongCon()).multiply(w));
        }
        sp.setTrongLuongMoiCon(dto.getTrongLuongMoiCon());
        sp.setGiaNhapVon(dto.getGiaNhapVon() != null ? dto.getGiaNhapVon() : BigDecimal.ZERO);
        sp.setGiaBanRa(dto.getGiaBanRa() != null ? dto.getGiaBanRa() : BigDecimal.ZERO);
        sp.setNgayNhap(dto.getNgayNhap() != null ? dto.getNgayNhap() : LocalDate.now());
        sp.setChiTietNhap(dto.getChiTietNhap());
        sp.setGhiChu(dto.getGhiChu());

        if (dto.getNhaCungCapId() != null) {
            nhaCungCapRepository.findById(dto.getNhaCungCapId()).ifPresent(sp::setNhaCungCap);
        }

        return sanPhamHeoRepository.save(sp);
    }

    private String formatVND(BigDecimal val) {
        if (val == null) return "0 đ";
        java.text.DecimalFormat df = new java.text.DecimalFormat("#,###");
        java.text.DecimalFormatSymbols sym = new java.text.DecimalFormatSymbols();
        sym.setGroupingSeparator('.');
        df.setDecimalFormatSymbols(sym);
        return df.format(val.setScale(0, java.math.RoundingMode.HALF_UP)) + " đ";
    }

    @Override
    @Transactional
    public SanPhamHeo capNhatSanPham(Long id, SanPhamHeoDTO dto) {
        SanPhamHeo sp = layChiTietSanPham(id);
        
        BigDecimal oldGiaVon = sp.getGiaNhapVon() != null ? sp.getGiaNhapVon() : BigDecimal.ZERO;
        int oldSoCon = sp.getSoLuongCon() != null ? sp.getSoLuongCon() : 0;
        BigDecimal oldTotalCost = oldGiaVon.multiply(BigDecimal.valueOf(oldSoCon));

        BigDecimal newGiaVon = dto.getGiaNhapVon() != null ? dto.getGiaNhapVon() : oldGiaVon;
        int newSoCon = dto.getSoLuongCon() != null ? dto.getSoLuongCon() : oldSoCon;
        BigDecimal newTotalCost = newGiaVon.multiply(BigDecimal.valueOf(newSoCon));

        NhaCungCap oldNcc = sp.getNhaCungCap();
        NhaCungCap newNcc = oldNcc;
        if (dto.getNhaCungCapId() != null) {
            newNcc = nhaCungCapRepository.findById(dto.getNhaCungCapId()).orElse(oldNcc);
            sp.setNhaCungCap(newNcc);
        }

        // Xác định chính xác 1 tài khoản ngân hàng liên kết
        TaiKhoanNganHang targetTk = sp.getTaiKhoanNganHang();
        if (dto.getTaiKhoanNganHangId() != null) {
            targetTk = taiKhoanNganHangRepository.findById(dto.getTaiKhoanNganHangId()).orElse(targetTk);
        }
        if (targetTk == null && oldNcc != null) {
            targetTk = taiKhoanNganHangRepository.findAll().stream()
                    .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()) && (tk.getNhaCungCapId() != null && tk.getNhaCungCapId().equals(oldNcc.getId())))
                    .findFirst()
                    .orElse(null);
            if (targetTk == null) {
                targetTk = taiKhoanNganHangRepository.findAll().stream()
                        .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()))
                        .findFirst()
                        .orElse(null);
            }
        }
        if (targetTk != null) {
            sp.setTaiKhoanNganHang(targetTk);
        }

        // CÂN BẰNG LẠI SỐ DƯ TÀI KHOẢN NCC VÀ SỔ DÒNG TIỀN NGÂN HÀNG
        if (oldNcc != null && newNcc != null && oldNcc.getId().equals(newNcc.getId())) {
            BigDecimal diff = newTotalCost.subtract(oldTotalCost);
            if (diff.compareTo(BigDecimal.ZERO) != 0) {
                BigDecimal curBal = oldNcc.getCongNoPhaiTra() != null ? oldNcc.getCongNoPhaiTra() : BigDecimal.ZERO;
                oldNcc.setCongNoPhaiTra(curBal.subtract(diff));
                nhaCungCapRepository.save(oldNcc);

                if (targetTk != null) {
                    targetTk.setSoDuHienTai(targetTk.getSoDuHienTai().subtract(diff));
                    taiKhoanNganHangRepository.save(targetTk);

                    DongTienNganHang dt = new DongTienNganHang();
                    dt.setTaiKhoanNganHang(targetTk);
                    dt.setLoaiDongTien(diff.compareTo(BigDecimal.ZERO) > 0 ? "OUT" : "IN");
                    dt.setSoTien(diff.abs());
                    dt.setLoaiDoiTuong("NCC");
                    dt.setNhaCungCapId(oldNcc.getId());
                    dt.setLoaiNghiepVu("CHINH_SUA_NHAP");
                    dt.setLoaiGiaoDich("CHINH_SUA");
                    dt.setMoTa("Chỉnh sửa giá heo " + sp.getTenSanPham() + " (Đổi từ " + formatVND(oldTotalCost) + " sang " + formatVND(newTotalCost) + ")");
                    dt.setNgayGiaoDich(LocalDateTime.now());
                    dongTienNganHangRepository.save(dt);
                }
            }
        } else {
            if (oldNcc != null && oldTotalCost.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal curBal = oldNcc.getCongNoPhaiTra() != null ? oldNcc.getCongNoPhaiTra() : BigDecimal.ZERO;
                oldNcc.setCongNoPhaiTra(curBal.add(oldTotalCost));
                nhaCungCapRepository.save(oldNcc);
            }
            if (newNcc != null && newTotalCost.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal curBal = newNcc.getCongNoPhaiTra() != null ? newNcc.getCongNoPhaiTra() : BigDecimal.ZERO;
                newNcc.setCongNoPhaiTra(curBal.subtract(newTotalCost));
                nhaCungCapRepository.save(newNcc);
            }
        }

        if (dto.getTenSanPham() != null) sp.setTenSanPham(dto.getTenSanPham());
        if (dto.getHinhAnh() != null) sp.setHinhAnh(dto.getHinhAnh());
        if (dto.getLoaiHeo() != null) sp.setLoaiHeo(dto.getLoaiHeo());
        if (dto.getDacDiemHeo() != null) sp.setDacDiemHeo(dto.getDacDiemHeo());
        else if (dto.getPigFeature() != null) sp.setDacDiemHeo(dto.getPigFeature());
        if (dto.getLoaiSize() != null) sp.setLoaiSize(dto.getLoaiSize());
        if (dto.getDonViTinh() != null) sp.setDonViTinh(dto.getDonViTinh());
        sp.setSoLuongCon(newSoCon);
        if (dto.getSoKgTonKho() != null) {
            sp.setSoKgTonKho(dto.getSoKgTonKho());
        } else {
            BigDecimal w = sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon() : new BigDecimal("5.0");
            sp.setSoKgTonKho(BigDecimal.valueOf(newSoCon).multiply(w));
        }
        sp.setGiaNhapVon(newGiaVon);
        if (dto.getGiaBanRa() != null) sp.setGiaBanRa(dto.getGiaBanRa());
        if (dto.getNgayNhap() != null) sp.setNgayNhap(dto.getNgayNhap());
        if (dto.getChiTietNhap() != null) sp.setChiTietNhap(dto.getChiTietNhap());
        if (dto.getGhiChu() != null) sp.setGhiChu(dto.getGhiChu());
        if (dto.getNhomGopId() != null) sp.setNhomGopId(dto.getNhomGopId().trim().isEmpty() ? null : dto.getNhomGopId());
        return sanPhamHeoRepository.save(sp);
    }

    @Override
    @Transactional
    public List<SanPhamHeo> gopSanPham(List<Long> productIds, BigDecimal giaBanRa, String nhomGopId) {
        if (productIds == null || productIds.isEmpty()) return List.of();
        
        String groupId = nhomGopId;
        if (groupId == null || groupId.trim().isEmpty()) {
            groupId = "GROUP_" + System.currentTimeMillis();
        }

        List<SanPhamHeo> prods = sanPhamHeoRepository.findAllById(productIds);
        for (SanPhamHeo sp : prods) {
            sp.setNhomGopId(groupId);
            if (giaBanRa != null && giaBanRa.compareTo(BigDecimal.ZERO) > 0) {
                sp.setGiaBanRa(giaBanRa);
            }
        }
        return sanPhamHeoRepository.saveAll(prods);
    }

    @Override
    @Transactional
    public List<SanPhamHeo> tachSanPham(Long productId, String nhomGopId) {
        if (productId != null) {
            sanPhamHeoRepository.findById(productId).ifPresent(sp -> {
                sp.setNhomGopId(null);
                sanPhamHeoRepository.save(sp);
            });
            return sanPhamHeoRepository.findAll();
        }
        if (nhomGopId != null && !nhomGopId.trim().isEmpty()) {
            List<SanPhamHeo> all = sanPhamHeoRepository.findAll();
            for (SanPhamHeo sp : all) {
                if (nhomGopId.equals(sp.getNhomGopId())) {
                    sp.setNhomGopId(null);
                }
            }
            return sanPhamHeoRepository.saveAll(all);
        }
        return sanPhamHeoRepository.findAll();
    }

    @Override
    @Transactional
    public void xoaSanPham(Long id) {
        SanPhamHeo sp = sanPhamHeoRepository.findById(id).orElse(null);
        if (sp != null) {
            NhaCungCap ncc = sp.getNhaCungCap();
            BigDecimal giaVon = sp.getGiaNhapVon() != null ? sp.getGiaNhapVon() : BigDecimal.ZERO;
            int soCon = sp.getSoLuongCon() != null ? sp.getSoLuongCon() : 0;
            BigDecimal tienHangHeo = giaVon.multiply(BigDecimal.valueOf(soCon));

            BigDecimal tienXePhu = BigDecimal.ZERO;
            String maPhieuNhap = null;
            Long pnBankId = null;
            boolean isLastItemInTrip = true;

            try {
                List<Map<String, Object>> phieuList = jdbcTemplate.queryForList(
                    "SELECT p.id, p.ma_phieu_nhap, p.chi_phi_tien_xe, p.chi_phi_tien_bai, p.nguoi_chiu_tien_xe, p.tai_khoan_ngan_hang_id, c.thanh_tien_hang " +
                    "FROM phieu_nhap_kho p " +
                    "JOIN chi_tiet_phieu_nhap c ON p.id = c.phieu_nhap_kho_id " +
                    "WHERE c.san_pham_heo_id = ?",
                    id
                );

                for (Map<String, Object> row : phieuList) {
                    Long pId = Long.valueOf(row.get("id").toString());
                    maPhieuNhap = (String) row.get("ma_phieu_nhap");
                    
                    if (row.get("thanh_tien_hang") != null) {
                        tienHangHeo = new BigDecimal(row.get("thanh_tien_hang").toString());
                    }

                    if (row.get("tai_khoan_ngan_hang_id") != null) {
                        pnBankId = Long.valueOf(row.get("tai_khoan_ngan_hang_id").toString());
                    }

                    // Đếm xem chuyến xe này còn bao nhiêu dòng size khác
                    Integer remainingCount = jdbcTemplate.queryForObject(
                        "SELECT count(*) FROM chi_tiet_phieu_nhap WHERE phieu_nhap_kho_id = ? AND san_pham_heo_id != ?",
                        Integer.class,
                        pId,
                        id
                    );

                    if (remainingCount != null && remainingCount > 0) {
                        // Vẫn còn size khác trong chuyến -> KHÔNG HOÀN TIỀN XE (tiền xe giữ nguyên)
                        isLastItemInTrip = false;
                    } else {
                        // Đây là size CUỐI CÙNG trong chuyến -> Mới hoàn nốt tiền xe & tiền bãi
                        String nguoiChiu = (String) row.get("nguoi_chiu_tien_xe");
                        if ("supplier".equalsIgnoreCase(nguoiChiu)) {
                            BigDecimal tx = row.get("chi_phi_tien_xe") != null ? new BigDecimal(row.get("chi_phi_tien_xe").toString()) : BigDecimal.ZERO;
                            BigDecimal tb = row.get("chi_phi_tien_bai") != null ? new BigDecimal(row.get("chi_phi_tien_bai").toString()) : BigDecimal.ZERO;
                            tienXePhu = tienXePhu.add(tx).add(tb);
                        }
                    }
                }
            } catch (Exception ignored) {}

            BigDecimal tongTienHoanLai = tienHangHeo.add(tienXePhu);

            TaiKhoanNganHang targetTk = sp.getTaiKhoanNganHang();
            if (targetTk == null && pnBankId != null) {
                targetTk = taiKhoanNganHangRepository.findById(pnBankId).orElse(null);
            }
            if (targetTk == null && ncc != null) {
                targetTk = taiKhoanNganHangRepository.findAll().stream()
                        .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()) && (tk.getNhaCungCapId() != null && tk.getNhaCungCapId().equals(ncc.getId())))
                        .findFirst()
                        .orElse(null);
                if (targetTk == null) {
                    targetTk = taiKhoanNganHangRepository.findAll().stream()
                            .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()))
                            .findFirst()
                            .orElse(null);
                }
            }

            if (ncc != null && tongTienHoanLai.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal curBal = ncc.getCongNoPhaiTra() != null ? ncc.getCongNoPhaiTra() : BigDecimal.ZERO;
                ncc.setCongNoPhaiTra(curBal.add(tongTienHoanLai));
                nhaCungCapRepository.save(ncc);
            }

            if (targetTk != null && tongTienHoanLai.compareTo(BigDecimal.ZERO) > 0) {
                targetTk.setSoDuHienTai(targetTk.getSoDuHienTai().add(tongTienHoanLai));
                taiKhoanNganHangRepository.save(targetTk);

                DongTienNganHang dt = new DongTienNganHang();
                dt.setTaiKhoanNganHang(targetTk);
                dt.setLoaiDongTien("IN");
                dt.setSoTien(tongTienHoanLai);
                dt.setLoaiDoiTuong("NCC");
                dt.setNhaCungCapId(ncc != null ? ncc.getId() : null);
                dt.setLoaiNghiepVu("XOA_SAN_PHAM_HOAN_TIEN");
                dt.setLoaiGiaoDich("HOAN_TIEN");
                if (isLastItemInTrip && tienXePhu.compareTo(BigDecimal.ZERO) > 0) {
                    dt.setMoTa("Hoàn lại tiền do xóa size cuối trong đơn nhập: " + sp.getTenSanPham() + " (Tiền hàng " + formatVND(tienHangHeo) + " + Tiền xe bãi " + formatVND(tienXePhu) + " = " + formatVND(tongTienHoanLai) + ")");
                } else {
                    dt.setMoTa("Hoàn lại tiền hàng do xóa size heo: " + sp.getTenSanPham() + " (" + formatVND(tongTienHoanLai) + " – Tiền xe giữ nguyên vì chuyến vẫn còn size khác)");
                }
                dt.setNgayGiaoDich(LocalDateTime.now());
                dongTienNganHangRepository.save(dt);
            }

            try {
                jdbcTemplate.update("DELETE FROM chi_tiet_phieu_nhap WHERE san_pham_heo_id = ?", id);
                jdbcTemplate.update("DELETE FROM chi_tiet_don_hang WHERE san_pham_heo_id = ?", id);
                jdbcTemplate.update("DELETE FROM phieu_nhap_kho WHERE id NOT IN (SELECT DISTINCT phieu_nhap_kho_id FROM chi_tiet_phieu_nhap WHERE phieu_nhap_kho_id IS NOT NULL)");
            } catch (Exception ignored) {}

            sanPhamHeoRepository.delete(sp);
        }
    }
}
