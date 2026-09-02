package com.pig.backend.service.impl;

import com.pig.backend.domain.*;
import com.pig.backend.dto.TaoPhieuNhapRequest;
import com.pig.backend.repository.*;
import com.pig.backend.service.PhieuNhapKhoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class PhieuNhapKhoServiceImpl implements PhieuNhapKhoService {

    private final PhieuNhapKhoRepository phieuNhapKhoRepository;
    private final NhaCungCapRepository nhaCungCapRepository;
    private final SanPhamHeoRepository sanPhamHeoRepository;
    private final TaiKhoanNganHangRepository taiKhoanNganHangRepository;
    private final DongTienNganHangRepository dongTienNganHangRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    public PhieuNhapKhoServiceImpl(
            PhieuNhapKhoRepository phieuNhapKhoRepository,
            NhaCungCapRepository nhaCungCapRepository,
            SanPhamHeoRepository sanPhamHeoRepository,
            TaiKhoanNganHangRepository taiKhoanNganHangRepository,
            DongTienNganHangRepository dongTienNganHangRepository,
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate
    ) {
        this.phieuNhapKhoRepository = phieuNhapKhoRepository;
        this.nhaCungCapRepository = nhaCungCapRepository;
        this.sanPhamHeoRepository = sanPhamHeoRepository;
        this.taiKhoanNganHangRepository = taiKhoanNganHangRepository;
        this.dongTienNganHangRepository = dongTienNganHangRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PhieuNhapKho> layTatCaPhieuNhap() {
        return phieuNhapKhoRepository.findAllByOrderByNgayNhapKhoDesc();
    }

    @Override
    @Transactional
    public void xoaPhieuNhap(Long id) {
        PhieuNhapKho pn = phieuNhapKhoRepository.findById(id).orElse(null);
        if (pn == null) return;

        // 1. Hoàn lại số lượng heo tồn kho
        if (pn.getDanhSachChiTiet() != null) {
            for (ChiTietPhieuNhap oldCt : pn.getDanhSachChiTiet()) {
                SanPhamHeo sp = oldCt.getSanPhamHeo();
                if (sp != null) {
                    int oldCon = oldCt.getSoLuongCon() != null && oldCt.getSoLuongCon() > 0 ? oldCt.getSoLuongCon() : 1;
                    sp.setSoLuongCon(Math.max(0, sp.getSoLuongCon() - oldCon));
                    BigDecimal w = sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon() : new BigDecimal("5.0");
                    BigDecimal oldKg = oldCt.getSoKg() != null ? oldCt.getSoKg() : BigDecimal.valueOf(oldCon).multiply(w);
                    sp.setSoKgTonKho(sp.getSoKgTonKho().subtract(oldKg).max(BigDecimal.ZERO));
                    sanPhamHeoRepository.save(sp);
                }
            }
        }

        // 2. Xóa các dòng tiền ngân hàng liên quan đến phiếu nhập này
        String maPhieu = pn.getMaPhieuNhap();
        try {
            if (maPhieu != null) {
                jdbcTemplate.update("DELETE FROM DONG_TIEN_NGAN_HANG WHERE ma_tham_chieu = ? OR mo_ta LIKE ?", maPhieu, "%" + maPhieu + "%");
            }
            jdbcTemplate.update("DELETE FROM CHI_TIET_PHIEU_NHAP WHERE phieu_nhap_kho_id = ?", id);
            jdbcTemplate.update("DELETE FROM PHIEU_NHAP_KHO WHERE id = ?", id);

            // 3. Tự động cân bằng lại số dư ngân hàng và công nợ NCC
            jdbcTemplate.execute("UPDATE TAI_KHOAN_NGAN_HANG SET so_du_hien_tai = ISNULL((SELECT SUM(CASE WHEN loai_dong_tien = 'IN' THEN so_tien ELSE -so_tien END) FROM DONG_TIEN_NGAN_HANG WHERE tai_khoan_ngan_hang_id = TAI_KHOAN_NGAN_HANG.id), 0);");
            jdbcTemplate.execute("UPDATE NHA_CUNG_CAP SET cong_no_phai_tra = ISNULL((SELECT ABS(SUM(so_du_hien_tai)) FROM TAI_KHOAN_NGAN_HANG WHERE nha_cung_cap_id = NHA_CUNG_CAP.id AND so_du_hien_tai < 0), 0);");
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa phiếu nhập: " + e.getMessage());
        }
    }

    private String formatVND(BigDecimal val) {
        if (val == null) return "0 đ";
        java.text.DecimalFormat df = new java.text.DecimalFormat("#,###");
        java.text.DecimalFormatSymbols sym = new java.text.DecimalFormatSymbols();
        sym.setGroupingSeparator('.');
        df.setDecimalFormatSymbols(sym);
        return df.format(val.setScale(0, java.math.RoundingMode.HALF_UP)) + " đ";
    }

    private SanPhamHeo taoMoiSanPhamHeo(String targetSize, String loaiHeo, String dacDiemHeo, NhaCungCap ncc, TaiKhoanNganHang tkNganHang, String donViTinh, BigDecimal giaVonThucTe, int soCon, BigDecimal soKg, LocalDate ngayNhap, String ghiChu) {
        String finalLoaiHeo = loaiHeo != null ? loaiHeo : "hot";
        String finalDacDiem = dacDiemHeo != null ? dacDiemHeo : "duoi_cut";
        
        SanPhamHeo sp = new SanPhamHeo();
        sp.setMaSanPham("SP-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 10000));
        sp.setTenSanPham(targetSize != null ? targetSize : "Heo size");
        sp.setLoaiSize(targetSize != null ? targetSize : "Khác");
        sp.setLoaiHeo(finalLoaiHeo);
        sp.setDacDiemHeo(finalDacDiem);
        sp.setDonViTinh(donViTinh != null ? donViTinh : "Con");
        sp.setNhaCungCap(ncc);
        sp.setTaiKhoanNganHang(tkNganHang);
        sp.setSoLuongCon(soCon > 0 ? soCon : 1);
        
        boolean isKg = "Kg".equalsIgnoreCase(donViTinh) || (soKg != null && soKg.compareTo(BigDecimal.ZERO) > 0 && !"Con".equalsIgnoreCase(donViTinh));
        BigDecimal w = new BigDecimal("5.0");
        BigDecimal initialKg = isKg ? soKg : BigDecimal.valueOf(soCon > 0 ? soCon : 1).multiply(w);
        sp.setSoKgTonKho(initialKg);
        sp.setTrongLuongMoiCon(w);
        sp.setGiaNhapVon(giaVonThucTe != null ? giaVonThucTe : BigDecimal.ZERO);
        sp.setGiaBanRa(BigDecimal.ZERO);
        sp.setNgayNhap(ngayNhap != null ? ngayNhap : LocalDate.now());
        sp.setGhiChu(ghiChu);
        sp.setChiTietNhap(ghiChu);
        
        return sanPhamHeoRepository.save(sp);
    }

    @Override
    @Transactional
    public PhieuNhapKho taoPhieuNhap(TaoPhieuNhapRequest request) {
        List<TaoPhieuNhapRequest.ChiTietMonNhapRequest> danhSachMon = request.getDanhSachChiTiet() != null ? request.getDanhSachChiTiet() : request.getItems();
        if (danhSachMon == null || danhSachMon.isEmpty()) {
            throw new RuntimeException("Phiếu nhập phải có chi tiết heo!");
        }

        Long nccId = request.getNhaCungCapId() != null ? request.getNhaCungCapId() : request.getSupplierId();
        NhaCungCap ncc = nhaCungCapRepository.findById(nccId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà cung cấp ID: " + nccId));

        String maPhieu = "PUR-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + (System.currentTimeMillis() % 1000);
        BigDecimal tienHangHeo = BigDecimal.ZERO;
        BigDecimal chiPhiTienXe = request.getChiPhiTienXe() != null ? request.getChiPhiTienXe() : (request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO);
        BigDecimal chiPhiTienBai = request.getChiPhiTienBai() != null ? request.getChiPhiTienBai() : (request.getParkingFee() != null ? request.getParkingFee() : BigDecimal.ZERO);

        String loaiHeo = request.getLoaiHeo() != null ? request.getLoaiHeo() : (request.getPorkType() != null ? request.getPorkType() : "hot");
        String dacDiemHeo = request.getDacDiemHeo() != null ? request.getDacDiemHeo() : (request.getPigFeature() != null ? request.getPigFeature() : "duoi_cut");
        String nguoiChiu = request.getNguoiChiuTienXe() != null ? request.getNguoiChiuTienXe() : (request.getShippingPayer() != null ? request.getShippingPayer() : "buyer");
        boolean nccChiu = "supplier".equalsIgnoreCase(nguoiChiu);

        int tongSoConChuyenXe = 0;
        for (TaoPhieuNhapRequest.ChiTietMonNhapRequest itReq : danhSachMon) {
            int soCon = itReq.getSoLuongCon() != null ? itReq.getSoLuongCon() : (itReq.getHeadCount() != null ? itReq.getHeadCount() : 0);
            tongSoConChuyenXe += soCon;
        }

        BigDecimal chiPhiPhuMoiCon = BigDecimal.ZERO;
        if (tongSoConChuyenXe > 0) {
            BigDecimal tongChiPhiPhu = chiPhiTienXe.add(chiPhiTienBai);
            BigDecimal perHead = tongChiPhiPhu.divide(BigDecimal.valueOf(tongSoConChuyenXe), 0, java.math.RoundingMode.HALF_UP);
            if (nccChiu) {
                chiPhiPhuMoiCon = BigDecimal.ZERO; // NCC chịu (bao tiền xe) => Giữ nguyên giá vốn mua mỗi con heo
            } else {
                chiPhiPhuMoiCon = perHead; // Mình chịu => Cộng tiền xe vào giá vốn mỗi con heo
            }
        }

        Long bankId = request.getTaiKhoanNganHangId() != null ? request.getTaiKhoanNganHangId() : request.getBankAccountId();
        TaiKhoanNganHang tkNganHang = null;
        if (bankId != null) {
            tkNganHang = taiKhoanNganHangRepository.findById(bankId).orElse(null);
        }

        List<ChiTietPhieuNhap> danhSachChiTiet = new ArrayList<>();

        for (TaoPhieuNhapRequest.ChiTietMonNhapRequest itReq : danhSachMon) {
            String targetSize = itReq.getLoaiSize() != null ? itReq.getLoaiSize() : itReq.getSizeType();
            String donVi = itReq.getDonViTinh() != null ? itReq.getDonViTinh() : (itReq.getUnit() != null ? itReq.getUnit() : "Con");
            int soCon = itReq.getSoLuongCon() != null ? itReq.getSoLuongCon() : (itReq.getHeadCount() != null ? itReq.getHeadCount() : 0);
            BigDecimal soKg = itReq.getSoKg() != null ? itReq.getSoKg() : (itReq.getWeightKg() != null ? itReq.getWeightKg() : BigDecimal.ZERO);
            BigDecimal giaVonGoc = itReq.getGiaNhapVon() != null ? itReq.getGiaNhapVon() : (itReq.getCostPrice() != null ? itReq.getCostPrice() : BigDecimal.ZERO);
            BigDecimal giaVonThucTe = giaVonGoc.add(chiPhiPhuMoiCon).max(BigDecimal.ZERO);
            LocalDate ngayNhap = request.getNgayNhapKho() != null ? request.getNgayNhapKho() : (request.getImportDate() != null ? request.getImportDate() : LocalDate.now());
            
            // LUÔN TẠO MỚI 1 SẢN PHẨM RIÊNG BIỆT CHO MỖI ĐƠN/DÒNG NHẬP (KHÔNG BAO GIỜ TỰ ĐỘNG GỘP VÀO SẢN PHẨM CŨ)
            SanPhamHeo sp = taoMoiSanPhamHeo(targetSize, loaiHeo, dacDiemHeo, ncc, tkNganHang, donVi, giaVonThucTe, soCon, soKg, ngayNhap, request.getGhiChu());

            boolean isKg = "Kg".equalsIgnoreCase(donVi) || (soKg.compareTo(BigDecimal.ZERO) > 0 && !"Con".equalsIgnoreCase(donVi));
            BigDecimal thanhTien = isKg ? giaVonGoc.multiply(soKg) : giaVonGoc.multiply(BigDecimal.valueOf(soCon > 0 ? soCon : 1));
            tienHangHeo = tienHangHeo.add(thanhTien);

            ChiTietPhieuNhap ctpn = new ChiTietPhieuNhap();
            ctpn.setSanPhamHeo(sp);
            ctpn.setLoaiSize(itReq.getLoaiSize() != null ? itReq.getLoaiSize() : itReq.getSizeType());
            ctpn.setDonViTinh(donVi);
            ctpn.setSoLuongCon(soCon > 0 ? soCon : 1);
            ctpn.setSoKg(soKg);
            ctpn.setGiaNhapVon(giaVonThucTe);
            ctpn.setThanhTienHang(thanhTien);

            danhSachChiTiet.add(ctpn);
        }

        BigDecimal tongTienNhap = nccChiu 
                ? tienHangHeo.subtract(chiPhiTienXe).subtract(chiPhiTienBai).max(BigDecimal.ZERO) 
                : tienHangHeo.add(chiPhiTienXe).add(chiPhiTienBai);
        BigDecimal soTienDaTra = request.getSoTienThanhToan() != null ? request.getSoTienThanhToan() : (request.getPaidAmount() != null ? request.getPaidAmount() : tongTienNhap);
        if (nccChiu) {
            soTienDaTra = tongTienNhap; // Nếu NCC chịu tiền xe, nợ NCC và số tiền trả là tiền hàng trừ tiền xe
        }
        BigDecimal congNoConThieu = tongTienNhap.subtract(soTienDaTra).max(BigDecimal.ZERO);
        LocalDate ngayNhap = request.getNgayNhapKho() != null ? request.getNgayNhapKho() : (request.getImportDate() != null ? request.getImportDate() : LocalDate.now());

        if (tkNganHang == null && ncc != null) {
            tkNganHang = taiKhoanNganHangRepository.findAll().stream()
                    .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()) && (tk.getNhaCungCapId() != null && tk.getNhaCungCapId().equals(ncc.getId())))
                    .findFirst()
                    .orElse(null);
            if (tkNganHang == null) {
                tkNganHang = taiKhoanNganHangRepository.findAll().stream()
                        .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()))
                        .findFirst()
                        .orElse(null);
            }
        }

        PhieuNhapKho pn = new PhieuNhapKho();
        pn.setMaPhieuNhap(maPhieu);
        pn.setNhaCungCap(ncc);
        pn.setTaiKhoanNganHang(tkNganHang);
        pn.setNgayNhapKho(ngayNhap);
        pn.setLoaiHeo(loaiHeo);
        pn.setDacDiemHeo(dacDiemHeo);
        pn.setChiPhiTienXe(chiPhiTienXe);
        pn.setChiPhiTienBai(chiPhiTienBai);
        pn.setNguoiChiuTienXe(nguoiChiu);
        pn.setTienHangHeo(tienHangHeo);
        pn.setTongTienNhap(tongTienNhap);
        pn.setSoTienDaTra(soTienDaTra);
        pn.setCongNoConThieu(congNoConThieu);
        pn.setGhiChu(request.getGhiChu() != null ? request.getGhiChu() : request.getNotes());
        pn.setHinhAnhChuyenXe(request.getHinhAnhChuyenXe() != null ? request.getHinhAnhChuyenXe() : (request.getImages() != null ? request.getImages() : request.getImportImages()));

        for (ChiTietPhieuNhap ct : danhSachChiTiet) {
            ct.setPhieuNhapKho(pn);
        }
        pn.setDanhSachChiTiet(danhSachChiTiet);

        PhieuNhapKho saved = phieuNhapKhoRepository.save(pn);

        if (tkNganHang != null && soTienDaTra.compareTo(BigDecimal.ZERO) > 0) {
            DongTienNganHang dt = new DongTienNganHang();
            dt.setTaiKhoanNganHang(tkNganHang);
            dt.setLoaiDongTien("OUT");
            dt.setSoTien(soTienDaTra.abs());
            dt.setLoaiDoiTuong("NCC");
            dt.setNhaCungCapId(ncc != null ? ncc.getId() : null);
            dt.setLoaiNghiepVu("NHAP_CHUYEN_XE_HEO");
            dt.setLoaiGiaoDich("TRU_TIEN_HANG_NCC");
            dt.setMaThamChieu(saved.getMaPhieuNhap());
            String desc = "Nhập hàng từ NCC: " + ncc.getTenNhaCungCap() + " (Mã: " + saved.getMaPhieuNhap();
            if (nccChiu && chiPhiTienXe.compareTo(BigDecimal.ZERO) > 0) {
                desc += " – NCC chịu tiền xe " + formatVND(chiPhiTienXe);
            }
            desc += ")";
            dt.setMoTa(desc);
            dt.setNgayGiaoDich(LocalDateTime.now());
            dongTienNganHangRepository.saveAndFlush(dt);

            BigDecimal newBal = dongTienNganHangRepository.findByTaiKhoanNganHangId(tkNganHang.getId()).stream()
                    .map(d -> "IN".equalsIgnoreCase(d.getLoaiDongTien()) ? d.getSoTien() : d.getSoTien().negate())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            tkNganHang.setSoDuHienTai(newBal);
            taiKhoanNganHangRepository.saveAndFlush(tkNganHang);

            if (ncc != null) {
                ncc.setCongNoPhaiTra(newBal.compareTo(BigDecimal.ZERO) < 0 ? newBal.abs() : BigDecimal.ZERO);
                nhaCungCapRepository.saveAndFlush(ncc);
            }
        }

        return saved;
    }

    @Override
    @Transactional
    public PhieuNhapKho capNhatPhieuNhap(Long id, TaoPhieuNhapRequest request) {
        PhieuNhapKho pn = phieuNhapKhoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu nhập ID: " + id));

        List<ChiTietPhieuNhap> oldList = new ArrayList<>(pn.getDanhSachChiTiet());

        List<TaoPhieuNhapRequest.ChiTietMonNhapRequest> danhSachMon = request.getDanhSachChiTiet() != null ? request.getDanhSachChiTiet() : request.getItems();
        if (danhSachMon == null || danhSachMon.isEmpty()) {
            throw new RuntimeException("Phiếu nhập phải có chi tiết heo!");
        }

        Long nccId = request.getNhaCungCapId() != null ? request.getNhaCungCapId() : request.getSupplierId();
        NhaCungCap ncc = nhaCungCapRepository.findById(nccId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà cung cấp ID: " + nccId));

        BigDecimal tienHangHeo = BigDecimal.ZERO;
        BigDecimal chiPhiTienXe = request.getChiPhiTienXe() != null ? request.getChiPhiTienXe() : (request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO);
        BigDecimal chiPhiTienBai = request.getChiPhiTienBai() != null ? request.getChiPhiTienBai() : (request.getParkingFee() != null ? request.getParkingFee() : BigDecimal.ZERO);

        String loaiHeo = request.getLoaiHeo() != null ? request.getLoaiHeo() : (request.getPorkType() != null ? request.getPorkType() : "hot");
        String dacDiemHeo = request.getDacDiemHeo() != null ? request.getDacDiemHeo() : (request.getPigFeature() != null ? request.getPigFeature() : "duoi_cut");
        String nguoiChiu = request.getNguoiChiuTienXe() != null ? request.getNguoiChiuTienXe() : (request.getShippingPayer() != null ? request.getShippingPayer() : "buyer");
        boolean nccChiu = "supplier".equalsIgnoreCase(nguoiChiu);

        int tongSoConChuyenXe = 0;
        for (TaoPhieuNhapRequest.ChiTietMonNhapRequest itReq : danhSachMon) {
            int soCon = itReq.getSoLuongCon() != null ? itReq.getSoLuongCon() : (itReq.getHeadCount() != null ? itReq.getHeadCount() : 0);
            tongSoConChuyenXe += soCon;
        }

        BigDecimal chiPhiPhuMoiCon = BigDecimal.ZERO;
        if (tongSoConChuyenXe > 0) {
            BigDecimal tongChiPhiPhu = chiPhiTienXe.add(chiPhiTienBai);
            BigDecimal perHead = tongChiPhiPhu.divide(BigDecimal.valueOf(tongSoConChuyenXe), 0, java.math.RoundingMode.HALF_UP);
            if (nccChiu) {
                chiPhiPhuMoiCon = BigDecimal.ZERO; // NCC chịu (bao tiền xe) => Giữ nguyên giá vốn mua mỗi con heo
            } else {
                chiPhiPhuMoiCon = perHead; // Cộng tiền xe vào giá vốn mỗi con heo
            }
        }

        Long bankId = request.getTaiKhoanNganHangId() != null ? request.getTaiKhoanNganHangId() : request.getBankAccountId();
        TaiKhoanNganHang tkNganHang = null;
        if (bankId != null) {
            tkNganHang = taiKhoanNganHangRepository.findById(bankId).orElse(null);
        }

        pn.getDanhSachChiTiet().clear();
        List<ChiTietPhieuNhap> danhSachChiTietMoi = new ArrayList<>();

        for (int i = 0; i < danhSachMon.size(); i++) {
            TaoPhieuNhapRequest.ChiTietMonNhapRequest itReq = danhSachMon.get(i);
            String targetSize = itReq.getLoaiSize() != null ? itReq.getLoaiSize() : itReq.getSizeType();
            String donVi = itReq.getDonViTinh() != null ? itReq.getDonViTinh() : (itReq.getUnit() != null ? itReq.getUnit() : "Con");
            int soCon = itReq.getSoLuongCon() != null ? itReq.getSoLuongCon() : (itReq.getHeadCount() != null ? itReq.getHeadCount() : 0);
            BigDecimal soKg = itReq.getSoKg() != null ? itReq.getSoKg() : (itReq.getWeightKg() != null ? itReq.getWeightKg() : BigDecimal.ZERO);
            BigDecimal giaVonGoc = itReq.getGiaNhapVon() != null ? itReq.getGiaNhapVon() : (itReq.getCostPrice() != null ? itReq.getCostPrice() : BigDecimal.ZERO);
            BigDecimal giaVonThucTe = giaVonGoc.add(chiPhiPhuMoiCon).max(BigDecimal.ZERO);
            LocalDate ngayNhap = request.getNgayNhapKho() != null ? request.getNgayNhapKho() : (request.getImportDate() != null ? request.getImportDate() : LocalDate.now());

            boolean isKg = "Kg".equalsIgnoreCase(donVi) || (soKg.compareTo(BigDecimal.ZERO) > 0 && !"Con".equalsIgnoreCase(donVi));
            BigDecimal thanhTien = isKg ? giaVonGoc.multiply(soKg) : giaVonGoc.multiply(BigDecimal.valueOf(soCon > 0 ? soCon : 1));
            tienHangHeo = tienHangHeo.add(thanhTien);

            SanPhamHeo sp;
            ChiTietPhieuNhap ctpn;

            if (i < oldList.size()) {
                // TÁI SỬ DỤNG VÀ CẬP NHẬT TRỰC TIẾP VÀO SẢN PHẨM CŨ (KHÔNG TẠO Ô MỚI DƯ THỪA)
                ctpn = oldList.get(i);
                sp = ctpn.getSanPhamHeo();
                if (sp == null) {
                    sp = taoMoiSanPhamHeo(targetSize, loaiHeo, dacDiemHeo, ncc, tkNganHang, donVi, giaVonThucTe, soCon, soKg, ngayNhap, request.getGhiChu());
                } else {
                    sp.setTenSanPham(targetSize != null ? targetSize : "Heo size");
                    sp.setLoaiSize(targetSize != null ? targetSize : "Khác");
                    sp.setLoaiHeo(loaiHeo);
                    sp.setDacDiemHeo(dacDiemHeo);
                    sp.setDonViTinh(donVi);
                    sp.setNhaCungCap(ncc);
                    sp.setTaiKhoanNganHang(tkNganHang);
                    sp.setSoLuongCon(soCon > 0 ? soCon : 1);
                    BigDecimal w = sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon() : new BigDecimal("5.0");
                    BigDecimal newKg = isKg ? soKg : BigDecimal.valueOf(soCon > 0 ? soCon : 1).multiply(w);
                    sp.setSoKgTonKho(newKg);
                    sp.setGiaNhapVon(giaVonThucTe);
                    sp.setNgayNhap(ngayNhap);
                    sp.setGhiChu(request.getGhiChu());
                    sp.setChiTietNhap(request.getGhiChu());
                    sanPhamHeoRepository.save(sp);
                }
            } else {
                // Chỉ tạo mới nếu người dùng bấm thêm dòng heo mới trong modal sửa
                sp = taoMoiSanPhamHeo(targetSize, loaiHeo, dacDiemHeo, ncc, tkNganHang, donVi, giaVonThucTe, soCon, soKg, ngayNhap, request.getGhiChu());
                ctpn = new ChiTietPhieuNhap();
            }

            ctpn.setPhieuNhapKho(pn);
            ctpn.setSanPhamHeo(sp);
            ctpn.setLoaiSize(targetSize);
            ctpn.setDonViTinh(donVi);
            ctpn.setSoLuongCon(soCon > 0 ? soCon : 1);
            ctpn.setSoKg(soKg);
            ctpn.setGiaNhapVon(giaVonThucTe);
            ctpn.setThanhTienHang(thanhTien);

            danhSachChiTietMoi.add(ctpn);
        }

        // Nếu người dùng xóa bớt dòng trong modal sửa thì dọn sạch các sản phẩm dư thừa đó
        if (oldList.size() > danhSachMon.size()) {
            for (int i = danhSachMon.size(); i < oldList.size(); i++) {
                ChiTietPhieuNhap extraCt = oldList.get(i);
                if (extraCt.getSanPhamHeo() != null) {
                    try {
                        sanPhamHeoRepository.delete(extraCt.getSanPhamHeo());
                    } catch (Exception ignored) {}
                }
            }
        }

        BigDecimal tongTienNhap = nccChiu 
                ? tienHangHeo.subtract(chiPhiTienXe).subtract(chiPhiTienBai).max(BigDecimal.ZERO) 
                : tienHangHeo.add(chiPhiTienXe).add(chiPhiTienBai);
        BigDecimal soTienDaTra = request.getSoTienThanhToan() != null ? request.getSoTienThanhToan() : (request.getPaidAmount() != null ? request.getPaidAmount() : tongTienNhap);
        if (nccChiu) {
            soTienDaTra = tongTienNhap;
        }
        BigDecimal congNoConThieu = tongTienNhap.subtract(soTienDaTra).max(BigDecimal.ZERO);
        LocalDate ngayNhap = request.getNgayNhapKho() != null ? request.getNgayNhapKho() : (request.getImportDate() != null ? request.getImportDate() : LocalDate.now());

        if (tkNganHang == null && ncc != null) {
            tkNganHang = taiKhoanNganHangRepository.findAll().stream()
                    .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()) && (tk.getNhaCungCapId() != null && tk.getNhaCungCapId().equals(ncc.getId())))
                    .findFirst()
                    .orElse(null);
            if (tkNganHang == null) {
                tkNganHang = taiKhoanNganHangRepository.findAll().stream()
                        .filter(tk -> "NCC".equalsIgnoreCase(tk.getLoaiTaiKhoan()))
                        .findFirst()
                        .orElse(null);
            }
        }

        pn.setNhaCungCap(ncc);
        pn.setNgayNhapKho(ngayNhap);
        pn.setLoaiHeo(loaiHeo);
        pn.setDacDiemHeo(dacDiemHeo);
        pn.setTienHangHeo(tienHangHeo);
        pn.setChiPhiTienXe(chiPhiTienXe);
        pn.setChiPhiTienBai(chiPhiTienBai);
        pn.setNguoiChiuTienXe(nguoiChiu);
        pn.setTongTienNhap(tongTienNhap);
        pn.setSoTienDaTra(soTienDaTra);
        pn.setCongNoConThieu(congNoConThieu);
        pn.setTaiKhoanNganHangTra(tkNganHang);
        pn.setGhiChu(request.getGhiChu() != null ? request.getGhiChu() : request.getNotes());
        if (request.getHinhAnhChuyenXe() != null || request.getImages() != null || request.getImportImages() != null) {
            pn.setHinhAnhChuyenXe(request.getHinhAnhChuyenXe() != null ? request.getHinhAnhChuyenXe() : (request.getImages() != null ? request.getImages() : request.getImportImages()));
        }
        pn.getDanhSachChiTiet().addAll(danhSachChiTietMoi);

        PhieuNhapKho phieuDaLuu = phieuNhapKhoRepository.save(pn);

        if (tkNganHang != null && soTienDaTra.compareTo(BigDecimal.ZERO) > 0) {
            List<DongTienNganHang> existingDts = dongTienNganHangRepository.findByMaThamChieu(pn.getMaPhieuNhap());
            DongTienNganHang dt;
            if (existingDts != null && !existingDts.isEmpty()) {
                dt = existingDts.get(0);
                for (int i = 1; i < existingDts.size(); i++) {
                    dongTienNganHangRepository.delete(existingDts.get(i));
                }
            } else {
                dt = new DongTienNganHang();
                dt.setMaThamChieu(pn.getMaPhieuNhap());
                dt.setNgayGiaoDich(LocalDateTime.now());
            }

            dt.setTaiKhoanNganHang(tkNganHang);
            dt.setLoaiDongTien("OUT");
            dt.setSoTien(soTienDaTra.abs());
            String desc = "Nhập hàng từ NCC: " + (ncc != null ? ncc.getTenNhaCungCap() : "") + " (Mã: " + pn.getMaPhieuNhap();
            if (nccChiu && chiPhiTienXe.compareTo(BigDecimal.ZERO) > 0) {
                desc += " – NCC chịu tiền xe " + formatVND(chiPhiTienXe);
            }
            desc += ")";
            dt.setMoTa(desc);
            dt.setLoaiDoiTuong("NCC");
            dt.setNhaCungCapId(ncc != null ? ncc.getId() : null);
            dt.setLoaiNghiepVu("NHAP_CHUYEN_XE_HEO");
            dt.setLoaiGiaoDich("TRU_TIEN_HANG_NCC");
            dongTienNganHangRepository.saveAndFlush(dt);

            BigDecimal newBal = dongTienNganHangRepository.findByTaiKhoanNganHangId(tkNganHang.getId()).stream()
                    .map(d -> "IN".equalsIgnoreCase(d.getLoaiDongTien()) ? d.getSoTien() : d.getSoTien().negate())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            tkNganHang.setSoDuHienTai(newBal);
            taiKhoanNganHangRepository.saveAndFlush(tkNganHang);

            if (ncc != null) {
                ncc.setCongNoPhaiTra(newBal.compareTo(BigDecimal.ZERO) < 0 ? newBal.abs() : BigDecimal.ZERO);
                nhaCungCapRepository.saveAndFlush(ncc);
            }
        }

        return phieuDaLuu;
    }
}
