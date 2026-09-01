package com.pig.backend.service.impl;

import com.pig.backend.domain.DongTienNganHang;
import com.pig.backend.domain.TaiKhoanNganHang;
import com.pig.backend.dto.TaiKhoanNganHangDTO;
import com.pig.backend.repository.DongTienNganHangRepository;
import com.pig.backend.repository.TaiKhoanNganHangRepository;
import com.pig.backend.service.TaiKhoanNganHangService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaiKhoanNganHangServiceImpl implements TaiKhoanNganHangService {

    private final TaiKhoanNganHangRepository taiKhoanNganHangRepository;
    private final DongTienNganHangRepository dongTienNganHangRepository;
    private final com.pig.backend.repository.NhaCungCapRepository nhaCungCapRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public TaiKhoanNganHangServiceImpl(
            TaiKhoanNganHangRepository taiKhoanNganHangRepository,
            DongTienNganHangRepository dongTienNganHangRepository,
            com.pig.backend.repository.NhaCungCapRepository nhaCungCapRepository,
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate
    ) {
        this.taiKhoanNganHangRepository = taiKhoanNganHangRepository;
        this.dongTienNganHangRepository = dongTienNganHangRepository;
        this.nhaCungCapRepository = nhaCungCapRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public List<TaiKhoanNganHang> layTatCaTaiKhoan() {
        try {
            // Tự động đồng bộ số dư tài khoản ngân hàng = Tổng dòng tiền thực tế (IN - OUT)
            jdbcTemplate.execute("UPDATE TAI_KHOAN_NGAN_HANG SET so_du_hien_tai = ISNULL((SELECT SUM(CASE WHEN loai_dong_tien = 'IN' THEN so_tien ELSE -so_tien END) FROM DONG_TIEN_NGAN_HANG WHERE tai_khoan_ngan_hang_id = TAI_KHOAN_NGAN_HANG.id), 0);");
            // Tự động đồng bộ công nợ NCC = Tổng số dư trong các TK của NCC đó
            jdbcTemplate.execute("UPDATE NHA_CUNG_CAP SET cong_no_phai_tra = ISNULL((SELECT SUM(so_du_hien_tai) FROM TAI_KHOAN_NGAN_HANG WHERE nha_cung_cap_id = NHA_CUNG_CAP.id), 0);");
        } catch (Exception ignored) {}
        return taiKhoanNganHangRepository.findAll();
    }

    @Override
    public TaiKhoanNganHang layChiTietTaiKhoan(Long id) {
        return taiKhoanNganHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản ngân hàng ID: " + id));
    }

    @Override
    @Transactional
    public TaiKhoanNganHang themTaiKhoan(TaiKhoanNganHangDTO dto) {
        String tenNH = dto.getTenNganHang() != null ? dto.getTenNganHang() : (dto.getBankName() != null ? dto.getBankName() : "NGÂN HÀNG");
        String maNH = dto.getMaNganHang() != null ? dto.getMaNganHang() : (dto.getBankCode() != null ? dto.getBankCode() : tenNH.substring(0, Math.min(tenNH.length(), 4)).toUpperCase());
        String stk = dto.getSoTaiKhoan() != null ? dto.getSoTaiKhoan() : dto.getAccountNumber();
        String chuTK = dto.getChuTaiKhoan() != null ? dto.getChuTaiKhoan() : (dto.getAccountHolder() != null ? dto.getAccountHolder() : "CHỦ TÀI KHOẢN");
        BigDecimal soDu = dto.getSoDuHienTai() != null ? dto.getSoDuHienTai() : (dto.getCurrentBalance() != null ? dto.getCurrentBalance() : BigDecimal.ZERO);

        TaiKhoanNganHang tk = new TaiKhoanNganHang();
        tk.setMaNganHang(maNH.toUpperCase());
        tk.setTenNganHang(tenNH.toUpperCase());
        tk.setSoTaiKhoan(stk);
        tk.setChuTaiKhoan(chuTK.toUpperCase());
        tk.setSoDuHienTai(soDu);
        tk.setTrangThaiHoatDong(true);
        tk.setLoaiTaiKhoan(dto.getLoaiTaiKhoan() != null ? dto.getLoaiTaiKhoan() : (dto.getAccountType() != null ? dto.getAccountType() : "NCC"));
        tk.setNhaCungCapId(dto.getNhaCungCapId() != null ? dto.getNhaCungCapId() : dto.getSupplierId());
        tk.setTenNguoiNha(dto.getTenNguoiNha() != null ? dto.getTenNguoiNha() : dto.getFamilyMemberName());
        tk.setGhiChu(dto.getGhiChu() != null ? dto.getGhiChu() : dto.getNotes());
        tk.setNgayTao(LocalDateTime.now());

        return taiKhoanNganHangRepository.save(tk);
    }

    @Override
    @Transactional
    public TaiKhoanNganHang capNhatTaiKhoan(Long id, TaiKhoanNganHangDTO dto) {
        TaiKhoanNganHang tk = layChiTietTaiKhoan(id);
        if (dto.getTenNganHang() != null || dto.getBankName() != null) {
            tk.setTenNganHang((dto.getTenNganHang() != null ? dto.getTenNganHang() : dto.getBankName()).toUpperCase());
        }
        if (dto.getSoTaiKhoan() != null || dto.getAccountNumber() != null) {
            tk.setSoTaiKhoan(dto.getSoTaiKhoan() != null ? dto.getSoTaiKhoan() : dto.getAccountNumber());
        }
        if (dto.getChuTaiKhoan() != null || dto.getAccountHolder() != null) {
            tk.setChuTaiKhoan((dto.getChuTaiKhoan() != null ? dto.getChuTaiKhoan() : dto.getAccountHolder()).toUpperCase());
        }
        if (dto.getSoDuHienTai() != null || dto.getCurrentBalance() != null) {
            tk.setSoDuHienTai(dto.getSoDuHienTai() != null ? dto.getSoDuHienTai() : dto.getCurrentBalance());
        }
        if (dto.getLoaiTaiKhoan() != null || dto.getAccountType() != null) {
            tk.setLoaiTaiKhoan(dto.getLoaiTaiKhoan() != null ? dto.getLoaiTaiKhoan() : dto.getAccountType());
        }
        if (dto.getNhaCungCapId() != null || dto.getSupplierId() != null) {
            tk.setNhaCungCapId(dto.getNhaCungCapId() != null ? dto.getNhaCungCapId() : dto.getSupplierId());
        }
        if (dto.getTenNguoiNha() != null || dto.getFamilyMemberName() != null) {
            tk.setTenNguoiNha(dto.getTenNguoiNha() != null ? dto.getTenNguoiNha() : dto.getFamilyMemberName());
        }
        if (dto.getGhiChu() != null || dto.getNotes() != null) {
            tk.setGhiChu(dto.getGhiChu() != null ? dto.getGhiChu() : dto.getNotes());
        }
        return taiKhoanNganHangRepository.save(tk);
    }

    @Override
    @Transactional
    public void xoaTaiKhoan(Long id) {
        try {
            jdbcTemplate.update("UPDATE SAN_PHAM_HEO SET tai_khoan_ngan_hang_id = NULL WHERE tai_khoan_ngan_hang_id = ?", id);
            jdbcTemplate.update("UPDATE PHIEU_NHAP_KHO SET tai_khoan_ngan_hang_id = NULL WHERE tai_khoan_ngan_hang_id = ?", id);
            jdbcTemplate.update("UPDATE DON_HANG SET tai_khoan_ngan_hang_id = NULL WHERE tai_khoan_ngan_hang_id = ?", id);
            jdbcTemplate.update("DELETE FROM DONG_TIEN_NGAN_HANG WHERE tai_khoan_ngan_hang_id = ?", id);
        } catch (Exception e) {
            System.err.println("Lỗi khi ngắt liên kết tài khoản ngân hàng: " + e.getMessage());
        }
        taiKhoanNganHangRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<DongTienNganHang> layLichSuDongTien(Long taiKhoanId) {
        try {
            LocalDateTime twoYearsAgo = LocalDateTime.now().minusYears(2);
            dongTienNganHangRepository.deleteByNgayGiaoDichBefore(twoYearsAgo);
        } catch (Exception ignored) {}

        if (taiKhoanId != null) {
            return dongTienNganHangRepository.findByTaiKhoanNganHangIdOrderByNgayGiaoDichDesc(taiKhoanId);
        }
        return dongTienNganHangRepository.findAllByOrderByNgayGiaoDichDesc();
    }

    @Override
    @Transactional
    public DongTienNganHang ghiNhanDongTienThuCong(Long taiKhoanId, String loaiDongTien, BigDecimal soTien, String lyDo) {
        return ghiNhanDongTienChiTiet(taiKhoanId, loaiDongTien, soTien, lyDo, "NCC", null, null, null, null, "THU_CONG");
    }

    @Override
    @Transactional
    public DongTienNganHang ghiNhanDongTienChiTiet(
            Long taiKhoanId,
            String loaiDongTien,
            BigDecimal soTien,
            String lyDo,
            String loaiDoiTuong,
            Long nhaCungCapId,
            Long khachHangId,
            String tenKhachHang,
            String thangNam,
            String loaiNghiepVu
    ) {
        TaiKhoanNganHang tk = layChiTietTaiKhoan(taiKhoanId);
        if ("IN".equalsIgnoreCase(loaiDongTien)) {
            tk.setSoDuHienTai(tk.getSoDuHienTai().add(soTien));
        } else {
            tk.setSoDuHienTai(tk.getSoDuHienTai().subtract(soTien));
        }
        taiKhoanNganHangRepository.save(tk);

        // Tự động cập nhật số dư NCC (+ khi tiền vào, - khi tiền ra)
        if (nhaCungCapId != null) {
            nhaCungCapRepository.findById(nhaCungCapId).ifPresent(ncc -> {
                BigDecimal currentBalance = ncc.getCongNoPhaiTra() != null ? ncc.getCongNoPhaiTra() : BigDecimal.ZERO;
                if ("IN".equalsIgnoreCase(loaiDongTien)) {
                    ncc.setCongNoPhaiTra(currentBalance.add(soTien));
                } else {
                    ncc.setCongNoPhaiTra(currentBalance.subtract(soTien));
                }
                nhaCungCapRepository.save(ncc);
            });
        }

        DongTienNganHang dt = new DongTienNganHang();
        dt.setTaiKhoanNganHang(tk);
        dt.setLoaiDongTien("IN".equalsIgnoreCase(loaiDongTien) ? "IN" : "OUT");
        dt.setSoTien(soTien);
        dt.setLoaiGiaoDich(loaiNghiepVu != null ? loaiNghiepVu : "DONG_TIEN");
        dt.setLoaiDoiTuong(loaiDoiTuong != null ? loaiDoiTuong : (tk.getLoaiTaiKhoan() != null ? tk.getLoaiTaiKhoan() : "NCC"));
        dt.setNhaCungCapId(nhaCungCapId != null ? nhaCungCapId : tk.getNhaCungCapId());
        dt.setKhachHangId(khachHangId);
        dt.setTenKhachHang(tenKhachHang);
        dt.setThangNam(thangNam != null ? thangNam : java.time.format.DateTimeFormatter.ofPattern("yyyy-MM").format(java.time.LocalDate.now()));
        dt.setLoaiNghiepVu(loaiNghiepVu != null ? loaiNghiepVu : "GIAO_DICH");
        dt.setMoTa(lyDo != null ? lyDo : "Ghi nhận dòng tiền ngân hàng");
        dt.setNgayGiaoDich(LocalDateTime.now());

        return dongTienNganHangRepository.save(dt);
    }

    @Override
    @Transactional
    public void xoaTatCaDongTien() {
        dongTienNganHangRepository.deleteAll();
        List<TaiKhoanNganHang> list = taiKhoanNganHangRepository.findAll();
        for (TaiKhoanNganHang tk : list) {
            tk.setSoDuHienTai(BigDecimal.ZERO);
        }
        taiKhoanNganHangRepository.saveAll(list);
    }

    @Override
    @Transactional
    public void xoaDongTien(Long id) {
        DongTienNganHang dt = dongTienNganHangRepository.findById(id).orElse(null);
        if (dt != null) {
            dongTienNganHangRepository.delete(dt);
            try {
                jdbcTemplate.execute("UPDATE TAI_KHOAN_NGAN_HANG SET so_du_hien_tai = ISNULL((SELECT SUM(CASE WHEN loai_dong_tien = 'IN' THEN so_tien ELSE -so_tien END) FROM DONG_TIEN_NGAN_HANG WHERE tai_khoan_ngan_hang_id = TAI_KHOAN_NGAN_HANG.id), 0);");
                jdbcTemplate.execute("UPDATE NHA_CUNG_CAP SET cong_no_phai_tra = ISNULL((SELECT SUM(so_du_hien_tai) FROM TAI_KHOAN_NGAN_HANG WHERE nha_cung_cap_id = NHA_CUNG_CAP.id), 0);");
            } catch (Exception ignored) {}
        }
    }
}
