package com.pig.backend.service.impl;

import com.pig.backend.domain.*;
import com.pig.backend.dto.TaoDonHangRequest;
import com.pig.backend.dto.TraHangRequest;
import com.pig.backend.repository.*;
import com.pig.backend.service.DonHangService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class DonHangServiceImpl implements DonHangService {

    private final DonHangRepository donHangRepository;
    private final SanPhamHeoRepository sanPhamHeoRepository;
    private final TaiKhoanNganHangRepository taiKhoanNganHangRepository;
    private final DongTienNganHangRepository dongTienNganHangRepository;
    private final NhaCungCapRepository nhaCungCapRepository;

    public DonHangServiceImpl(
            DonHangRepository donHangRepository,
            SanPhamHeoRepository sanPhamHeoRepository,
            TaiKhoanNganHangRepository taiKhoanNganHangRepository,
            DongTienNganHangRepository dongTienNganHangRepository,
            NhaCungCapRepository nhaCungCapRepository
    ) {
        this.donHangRepository = donHangRepository;
        this.sanPhamHeoRepository = sanPhamHeoRepository;
        this.taiKhoanNganHangRepository = taiKhoanNganHangRepository;
        this.dongTienNganHangRepository = dongTienNganHangRepository;
        this.nhaCungCapRepository = nhaCungCapRepository;
    }

    @Override
    @Transactional
    public List<DonHang> layTatCaDonHang() {
        try {
            LocalDateTime twoYearsAgo = LocalDateTime.now().minusYears(2);
            donHangRepository.deleteByNgayDatHangBefore(twoYearsAgo);
        } catch (Exception ignored) {}
        return donHangRepository.findAllByOrderByNgayDatHangDesc();
    }

    @Override
    public DonHang layChiTietDonHang(Long id) {
        return donHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID: " + id));
    }

    @Override
    @Transactional
    public DonHang taoDonHang(TaoDonHangRequest request) {
        List<TaoDonHangRequest.ChiTietMonBanRequest> danhSachMon = request.getDanhSachMon() != null ? request.getDanhSachMon() : request.getItems();
        if (danhSachMon == null || danhSachMon.isEmpty()) {
            throw new RuntimeException("Đơn hàng phải có ít nhất 1 sản phẩm heo!");
        }

        String maDonHang = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        BigDecimal tongTienBan = BigDecimal.ZERO;
        BigDecimal tongTienVon = BigDecimal.ZERO;
        BigDecimal chiPhiTienXe = request.getChiPhiTienXe() != null ? request.getChiPhiTienXe() : (request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO);
        BigDecimal chiPhiKhac = request.getChiPhiKhac() != null ? request.getChiPhiKhac() : (request.getOtherExpenses() != null ? request.getOtherExpenses() : BigDecimal.ZERO);

        List<ChiTietDonHang> danhSachChiTiet = new ArrayList<>();

        for (TaoDonHangRequest.ChiTietMonBanRequest itemReq : danhSachMon) {
            Long spId = itemReq.getSanPhamId() != null ? itemReq.getSanPhamId() : itemReq.getProductId();
            SanPhamHeo sp = sanPhamHeoRepository.findById(spId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy heo ID: " + spId));

            int soLuong = itemReq.getSoLuong() != null && itemReq.getSoLuong() > 0 ? itemReq.getSoLuong() : 1;
            BigDecimal giaBanThucTe = itemReq.getGiaBanTuyChinh() != null ? itemReq.getGiaBanTuyChinh() : (itemReq.getCustomPrice() != null ? itemReq.getCustomPrice() : sp.getGiaBanRa());
            BigDecimal giaVon = sp.getGiaNhapVon();

            BigDecimal thanhTien = giaBanThucTe.multiply(BigDecimal.valueOf(soLuong));
            BigDecimal thanhTienVon = giaVon.multiply(BigDecimal.valueOf(soLuong));
            BigDecimal tienLoiTungMon = thanhTien.subtract(thanhTienVon);

            tongTienBan = tongTienBan.add(thanhTien);
            tongTienVon = tongTienVon.add(thanhTienVon);

            // TRỪ KHO CHUẨN XÁC THEO SIZE VÀ NCC
            if ("Con".equalsIgnoreCase(sp.getDonViTinh())) {
                int conLai = Math.max(0, sp.getSoLuongCon() - soLuong);
                sp.setSoLuongCon(conLai);
                BigDecimal w = sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon() : new BigDecimal("5.0");
                sp.setSoKgTonKho(BigDecimal.valueOf(conLai).multiply(w));
            } else {
                BigDecimal kgConLai = sp.getSoKgTonKho().subtract(BigDecimal.valueOf(soLuong)).max(BigDecimal.ZERO);
                sp.setSoKgTonKho(kgConLai);
            }
            sanPhamHeoRepository.save(sp);

            ChiTietDonHang ctdh = new ChiTietDonHang();
            ctdh.setSanPhamHeo(sp);
            ctdh.setLoaiHeo(sp.getLoaiHeo());
            ctdh.setLoaiSize(sp.getLoaiSize());
            ctdh.setDonViTinh(sp.getDonViTinh());
            ctdh.setSoLuong(soLuong);
            ctdh.setSoKg(sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon().multiply(BigDecimal.valueOf(soLuong)) : BigDecimal.ZERO);
            ctdh.setGiaNhapVon(giaVon);
            ctdh.setGiaBanGoc(sp.getGiaBanRa());
            ctdh.setGiaBanThucTe(giaBanThucTe);
            ctdh.setItemProfit(tienLoiTungMon);
            ctdh.setThanhTien(thanhTien);

            danhSachChiTiet.add(ctdh);
        }

        String nguoiChiuTienXe = request.getNguoiChiuTienXe() != null ? request.getNguoiChiuTienXe() : (request.getShippingPayer() != null ? request.getShippingPayer() : "buyer");

        // TÍNH LỢI NHUẬN RÒNG: 
        // Nếu Shop chịu tiền xe (Freeship): Tiền Lời = Tiền Bán - Tiền Nhập Lô NCC - Chi Phí Tiền Xe - Khác
        // Nếu Khách chịu tiền xe: Tiền Lời = Tiền Bán - Tiền Nhập Lô NCC - Khác (Khách tự trả tiền xe)
        BigDecimal tongTienLoi;
        if ("shop".equalsIgnoreCase(nguoiChiuTienXe)) {
            tongTienLoi = tongTienBan.subtract(tongTienVon).subtract(chiPhiTienXe).subtract(chiPhiKhac);
        } else {
            tongTienLoi = tongTienBan.subtract(tongTienVon).subtract(chiPhiKhac);
        }

        BigDecimal soTienDaTra = request.getSoTienThanhToan() != null ? request.getSoTienThanhToan() : (request.getPaidAmount() != null ? request.getPaidAmount() : tongTienBan);
        BigDecimal congNoConLai = tongTienBan.subtract(soTienDaTra).max(BigDecimal.ZERO);

        Long bankId = request.getTaiKhoanNganHangId() != null ? request.getTaiKhoanNganHangId() : request.getBankAccountId();
        String phuongThuc = request.getPhuongThucThanhToan() != null ? request.getPhuongThucThanhToan() : (request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash");

        TaiKhoanNganHang tkNganHang = null;
        if ("Bank".equalsIgnoreCase(phuongThuc) && bankId != null) {
            tkNganHang = taiKhoanNganHangRepository.findById(bankId).orElse(null);
        }

        String tenKhach = request.getTenKhachHang() != null && !request.getTenKhachHang().isBlank() ? request.getTenKhachHang() : (request.getCustomerName() != null ? request.getCustomerName() : "Khách Vãng Lai");

        DonHang dh = new DonHang();
        dh.setMaDonHang(maDonHang);
        dh.setNgayDatHang(LocalDateTime.now());
        dh.setTenKhachHang(tenKhach);
        dh.setSoDienThoaiKhach(request.getSoDienThoai() != null ? request.getSoDienThoai() : request.getCustomerPhone());
        dh.setDiaChiGiaoHang(request.getDiaChiGiaoHang() != null ? request.getDiaChiGiaoHang() : request.getCustomerAddress());
        dh.setTongTienBan(tongTienBan);
        dh.setTongTienVon(tongTienVon);
        dh.setChiPhiTienXeGiao(chiPhiTienXe);
        dh.setNguoiChiuTienXe(nguoiChiuTienXe);
        dh.setChiPhiKhac(chiPhiKhac);
        dh.setTongTienLoi(tongTienLoi);
        dh.setPhuongThucThanhToan(phuongThuc);
        dh.setTaiKhoanNganHangNhan(tkNganHang);
        dh.setSoTienDaThanhToan(soTienDaTra);
        dh.setCongNoConLai(congNoConLai);
        dh.setGhiChu(request.getGhiChu() != null ? request.getGhiChu() : request.getNotes());

        for (ChiTietDonHang c : danhSachChiTiet) {
            c.setDonHang(dh);
        }
        dh.setDanhSachChiTiet(danhSachChiTiet);

        DonHang donHangDaLuu = donHangRepository.save(dh);

        // GHI NHẬN DÒNG TIỀN VÀO (+) NẾU CHUYỂN KHOẢN NGÂN HÀNG
        if (tkNganHang != null && soTienDaTra.compareTo(BigDecimal.ZERO) > 0) {
            tkNganHang.setSoDuHienTai(tkNganHang.getSoDuHienTai().add(soTienDaTra));
            taiKhoanNganHangRepository.save(tkNganHang);

            // NẾU LÀ STK CỦA NHÀ CUNG CẤP: TỰ ĐỘNG CỘNG TIỀN (+) VÀO SỐ DƯ TÀI KHOẢN NCC
            Long nccId = tkNganHang.getNhaCungCapId();
            if (nccId != null) {
                nhaCungCapRepository.findById(nccId).ifPresent(ncc -> {
                    BigDecimal curBal = ncc.getCongNoPhaiTra() != null ? ncc.getCongNoPhaiTra() : BigDecimal.ZERO;
                    ncc.setCongNoPhaiTra(curBal.add(soTienDaTra));
                    nhaCungCapRepository.save(ncc);
                });
            }

            DongTienNganHang dt = new DongTienNganHang();
            dt.setTaiKhoanNganHang(tkNganHang);
            dt.setLoaiDongTien("IN");
            dt.setSoTien(soTienDaTra);
            dt.setLoaiGiaoDich(nccId != null ? "KHACH_TRA_NCC" : "DON_HANG");
            dt.setLoaiDoiTuong(tkNganHang.getLoaiTaiKhoan() != null ? tkNganHang.getLoaiTaiKhoan() : (nccId != null ? "NCC" : "NGUOI_NHA"));
            dt.setNhaCungCapId(nccId);
            dt.setTenKhachHang(donHangDaLuu.getTenKhachHang());
            dt.setThangNam(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM").format(java.time.LocalDate.now()));
            dt.setLoaiNghiepVu(nccId != null ? "KHACH_TRA_NCC" : "LOI_NHUAN_NGUOI_NHA");
            dt.setMaThamChieu(donHangDaLuu.getMaDonHang());
            dt.setMoTa("Thu tiền bán heo đơn " + donHangDaLuu.getMaDonHang() + " (" + donHangDaLuu.getTenKhachHang() + ")");
            dt.setNgayGiaoDich(LocalDateTime.now());
            dongTienNganHangRepository.save(dt);
        }

        return donHangDaLuu;
    }

    @Override
    @Transactional
    public DonHang traHang(Long id, TraHangRequest request) {
        DonHang dh = layChiTietDonHang(id);
        if (dh.getDanhSachChiTiet() == null || dh.getDanhSachChiTiet().isEmpty()) {
            throw new RuntimeException("Đơn hàng không có sản phẩm nào để xử lý!");
        }

        // Tìm món tương ứng trong đơn
        ChiTietDonHang ctdh = null;
        if (request.getChiTietDonHangId() != null) {
            ctdh = dh.getDanhSachChiTiet().stream()
                    .filter(c -> c.getId().equals(request.getChiTietDonHangId()))
                    .findFirst()
                    .orElse(null);
        }
        if (ctdh == null && request.getSanPhamHeoId() != null) {
            ctdh = dh.getDanhSachChiTiet().stream()
                    .filter(c -> c.getSanPhamHeo() != null && c.getSanPhamHeo().getId().equals(request.getSanPhamHeoId()))
                    .findFirst()
                    .orElse(null);
        }
        if (ctdh == null) {
            ctdh = dh.getDanhSachChiTiet().get(0);
        }

        SanPhamHeo sp = ctdh.getSanPhamHeo();
        NhaCungCap ncc = (sp != null && sp.getNhaCungCap() != null) ? sp.getNhaCungCap() : null;
        if (ncc == null && request.getNhaCungCapId() != null) {
            ncc = nhaCungCapRepository.findById(request.getNhaCungCapId()).orElse(null);
        }
        String nccName = ncc != null ? ncc.getTenNhaCungCap() : "NCC";
        String lyDoStr = request.getLyDo() != null && !request.getLyDo().isBlank() ? request.getLyDo() : "Hàng xấu/lỗi";

        boolean isGiamGia = "GIAM_GIA".equalsIgnoreCase(request.getLoaiXuLy());

        // =========================================================================
        // TRƯỜNG HỢP 1: GIẢM GIÁ / BỒI THƯỜNG (KHÁCH VẪN NHẬN HEO)
        // =========================================================================
        if (isGiamGia) {
            BigDecimal soTienGiam = request.getSoTienGiamGia() != null && request.getSoTienGiamGia().compareTo(BigDecimal.ZERO) > 0 
                    ? request.getSoTienGiamGia() 
                    : (request.getGiaHoanTien() != null ? request.getGiaHoanTien() : BigDecimal.ZERO);
            
            if (soTienGiam.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Số tiền giảm giá bồi thường phải lớn hơn 0 đ!");
            }

            boolean nccChiu = "NCC".equalsIgnoreCase(request.getNguoiChiuGiamGia());

            // 1. Hoàn tiền bồi thường cho khách (qua ngân hàng nếu chọn Bank)
            if ("Bank".equalsIgnoreCase(request.getNguonHoanTien()) && request.getTaiKhoanNganHangId() != null) {
                TaiKhoanNganHang tkShop = taiKhoanNganHangRepository.findById(request.getTaiKhoanNganHangId()).orElse(null);
                if (tkShop != null) {
                    tkShop.setSoDuHienTai(tkShop.getSoDuHienTai().subtract(soTienGiam));
                    taiKhoanNganHangRepository.save(tkShop);

                    DongTienNganHang dt = new DongTienNganHang();
                    dt.setTaiKhoanNganHang(tkShop);
                    dt.setLoaiDongTien("OUT");
                    dt.setSoTien(soTienGiam);
                    dt.setLoaiGiaoDich("HOAN_TIEN_KHACH");
                    dt.setLoaiDoiTuong("NGUOI_NHA");
                    dt.setThangNam(DateTimeFormatter.ofPattern("yyyy-MM").format(LocalDate.now()));
                    dt.setLoaiNghiepVu("HOAN_TIEN_KHACH");
                    dt.setMaThamChieu(dh.getMaDonHang());
                    dt.setMoTa("Bồi thường / giảm giá đơn " + dh.getMaDonHang() + " cho khách " + dh.getTenKhachHang() + " (" + lyDoStr + ")");
                    dt.setNgayGiaoDich(LocalDateTime.now());
                    dongTienNganHangRepository.save(dt);
                }
            }

            // 2. Xử lý phân chia chi phí giảm giá
            if (nccChiu) {
                // NCC chịu tiền giảm -> Giảm nợ NCC (Cộng vào số dư NCC)
                TaiKhoanNganHang tkNCC = (sp != null && sp.getTaiKhoanNganHang() != null) ? sp.getTaiKhoanNganHang() : null;
                if (tkNCC == null && ncc != null) {
                    final Long targetNccId = ncc.getId();
                    tkNCC = taiKhoanNganHangRepository.findAll().stream()
                            .filter(t -> targetNccId.equals(t.getNhaCungCapId()))
                            .findFirst()
                            .orElse(null);
                }

                if (tkNCC != null) {
                    tkNCC.setSoDuHienTai(tkNCC.getSoDuHienTai().add(soTienGiam));
                    taiKhoanNganHangRepository.save(tkNCC);

                    DongTienNganHang dt = new DongTienNganHang();
                    dt.setTaiKhoanNganHang(tkNCC);
                    dt.setLoaiDongTien("IN");
                    dt.setSoTien(soTienGiam);
                    dt.setLoaiGiaoDich("GIAM_GIA_NCC");
                    dt.setLoaiDoiTuong("NCC");
                    dt.setNhaCungCapId(ncc != null ? ncc.getId() : null);
                    dt.setTenKhachHang(dh.getTenKhachHang());
                    dt.setThangNam(DateTimeFormatter.ofPattern("yyyy-MM").format(LocalDate.now()));
                    dt.setLoaiNghiepVu("GIAM_GIA_NCC");
                    dt.setMaThamChieu(dh.getMaDonHang());
                    dt.setMoTa("Giảm giá heo lỗi cho khách (" + lyDoStr + ") - Giảm nợ / Trừ tiền hàng NCC " + nccName + " (Đơn " + dh.getMaDonHang() + ")");
                    dt.setNgayGiaoDich(LocalDateTime.now());
                    dongTienNganHangRepository.save(dt);
                }

                // Cả tiền bán và tiền vốn đều giảm đi soTienGiam -> Tiền lời không đổi!
                dh.setTongTienBan(dh.getTongTienBan().subtract(soTienGiam).max(BigDecimal.ZERO));
                dh.setTongTienVon(dh.getTongTienVon().subtract(soTienGiam).max(BigDecimal.ZERO));
            } else {
                // Shop mình chịu tiền giảm -> Tiền bán giảm, tiền vốn giữ nguyên -> Tiền lời giảm đi soTienGiam!
                dh.setTongTienBan(dh.getTongTienBan().subtract(soTienGiam).max(BigDecimal.ZERO));
            }

            BigDecimal ship = dh.getChiPhiTienXeGiao() != null ? dh.getChiPhiTienXeGiao() : BigDecimal.ZERO;
            BigDecimal other = dh.getChiPhiKhac() != null ? dh.getChiPhiKhac() : BigDecimal.ZERO;
            if ("shop".equalsIgnoreCase(dh.getNguoiChiuTienXe())) {
                dh.setTongTienLoi(dh.getTongTienBan().subtract(dh.getTongTienVon()).subtract(ship).subtract(other));
            } else {
                dh.setTongTienLoi(dh.getTongTienBan().subtract(dh.getTongTienVon()).subtract(other));
            }

            String payerText = nccChiu ? ("NCC " + nccName + " chịu (Giảm nợ NCC)") : "Shop chịu (Trừ vào tiền lời)";
            String noteEntry = "[GIẢM GIÁ / BỒI THƯỜNG " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "]: Giảm giá " + soTienGiam + " đ cho khách (" + lyDoStr + "). Người chịu: " + payerText;
            dh.setGhiChu(dh.getGhiChu() != null && !dh.getGhiChu().isBlank() ? (dh.getGhiChu() + "\n" + noteEntry) : noteEntry);

            return donHangRepository.save(dh);
        }

        // =========================================================================
        // TRƯỜNG HỢP 2: TRẢ HEO VỀ KHO & HOÀN TIỀN
        // =========================================================================
        int soLuongTra = request.getSoLuongTra() != null && request.getSoLuongTra() > 0 ? request.getSoLuongTra() : 1;
        if (soLuongTra > ctdh.getSoLuong()) {
            throw new RuntimeException("Số lượng trả (" + soLuongTra + ") vượt quá số lượng trong đơn hàng (" + ctdh.getSoLuong() + ")!");
        }

        // 1. HOÀN KHO: CỘNG LẠI SỐ LƯỢNG HEO VÀO KHO
        if (sp != null) {
            if ("Con".equalsIgnoreCase(sp.getDonViTinh())) {
                sp.setSoLuongCon(sp.getSoLuongCon() + soLuongTra);
                BigDecimal w = sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon() : new BigDecimal("5.0");
                sp.setSoKgTonKho(BigDecimal.valueOf(sp.getSoLuongCon()).multiply(w));
            } else {
                sp.setSoKgTonKho(sp.getSoKgTonKho().add(BigDecimal.valueOf(soLuongTra)));
            }
            sanPhamHeoRepository.save(sp);
        }

        // 2. ĐỐI SOÁT & TRỪ TIỀN NHÀ CUNG CẤP (NCC)
        BigDecimal unitCost = request.getGiaVonTruNcc() != null ? request.getGiaVonTruNcc() : ctdh.getGiaNhapVon();
        BigDecimal totalCostDeduction = unitCost.multiply(BigDecimal.valueOf(soLuongTra));

        if (Boolean.TRUE.equals(request.getTruTienNcc()) && ncc != null) {
            BigDecimal curBal = ncc.getCongNoPhaiTra() != null ? ncc.getCongNoPhaiTra() : BigDecimal.ZERO;
            ncc.setCongNoPhaiTra(curBal.subtract(totalCostDeduction));
            nhaCungCapRepository.save(ncc);

            // Tìm STK nhà cung cấp nếu có để đồng bộ sổ dòng tiền
            TaiKhoanNganHang tkNCC = (sp != null && sp.getTaiKhoanNganHang() != null) ? sp.getTaiKhoanNganHang() : null;
            if (tkNCC == null) {
                final Long targetNccId = ncc.getId();
                tkNCC = taiKhoanNganHangRepository.findAll().stream()
                        .filter(t -> targetNccId.equals(t.getNhaCungCapId()))
                        .findFirst()
                        .orElse(null);
            }

            if (tkNCC != null) {
                tkNCC.setSoDuHienTai(tkNCC.getSoDuHienTai().add(totalCostDeduction));
                taiKhoanNganHangRepository.save(tkNCC);

                DongTienNganHang dt = new DongTienNganHang();
                dt.setTaiKhoanNganHang(tkNCC);
                dt.setLoaiDongTien("IN");
                dt.setSoTien(totalCostDeduction);
                dt.setLoaiGiaoDich("TRA_HANG_NCC");
                dt.setLoaiDoiTuong("NCC");
                dt.setNhaCungCapId(ncc.getId());
                dt.setTenKhachHang(dh.getTenKhachHang());
                dt.setThangNam(DateTimeFormatter.ofPattern("yyyy-MM").format(LocalDate.now()));
                dt.setLoaiNghiepVu("TRA_HANG_NCC");
                dt.setMaThamChieu(dh.getMaDonHang());
                dt.setMoTa("Khách trả " + soLuongTra + " con (" + lyDoStr + ") - Giảm nợ / Hoàn tiền hàng NCC " + ncc.getTenNhaCungCap() + " (Đơn " + dh.getMaDonHang() + ")");
                dt.setNgayGiaoDich(LocalDateTime.now());
                dongTienNganHangRepository.save(dt);
            }
        }

        // 3. HOÀN TIỀN CHO KHÁCH HÀNG
        BigDecimal unitRefund = request.getGiaHoanTien() != null ? request.getGiaHoanTien() : ctdh.getGiaBanThucTe();
        BigDecimal totalRefundToCustomer = unitRefund.multiply(BigDecimal.valueOf(soLuongTra));

        if ("Bank".equalsIgnoreCase(request.getNguonHoanTien()) && request.getTaiKhoanNganHangId() != null) {
            TaiKhoanNganHang tkShop = taiKhoanNganHangRepository.findById(request.getTaiKhoanNganHangId()).orElse(null);
            if (tkShop != null) {
                tkShop.setSoDuHienTai(tkShop.getSoDuHienTai().subtract(totalRefundToCustomer));
                taiKhoanNganHangRepository.save(tkShop);

                DongTienNganHang dt = new DongTienNganHang();
                dt.setTaiKhoanNganHang(tkShop);
                dt.setLoaiDongTien("OUT");
                dt.setSoTien(totalRefundToCustomer);
                dt.setLoaiGiaoDich("HOAN_TIEN_KHACH");
                dt.setLoaiDoiTuong("NGUOI_NHA");
                dt.setThangNam(DateTimeFormatter.ofPattern("yyyy-MM").format(LocalDate.now()));
                dt.setLoaiNghiepVu("HOAN_TIEN_KHACH");
                dt.setMaThamChieu(dh.getMaDonHang());
                dt.setMoTa("Hoàn tiền trả heo đơn " + dh.getMaDonHang() + " cho khách " + dh.getTenKhachHang() + " (" + soLuongTra + " con)");
                dt.setNgayGiaoDich(LocalDateTime.now());
                dongTienNganHangRepository.save(dt);
            }
        }

        // 4. CẬP NHẬT LẠI ĐƠN HÀNG
        ctdh.setSoLuong(ctdh.getSoLuong() - soLuongTra);
        ctdh.setThanhTien(ctdh.getGiaBanThucTe().multiply(BigDecimal.valueOf(ctdh.getSoLuong())));
        ctdh.setItemProfit(ctdh.getThanhTien().subtract(ctdh.getGiaNhapVon().multiply(BigDecimal.valueOf(ctdh.getSoLuong()))));

        dh.setTongTienBan(dh.getTongTienBan().subtract(totalRefundToCustomer).max(BigDecimal.ZERO));
        dh.setTongTienVon(dh.getTongTienVon().subtract(totalCostDeduction).max(BigDecimal.ZERO));
        
        BigDecimal ship = dh.getChiPhiTienXeGiao() != null ? dh.getChiPhiTienXeGiao() : BigDecimal.ZERO;
        BigDecimal other = dh.getChiPhiKhac() != null ? dh.getChiPhiKhac() : BigDecimal.ZERO;
        if ("shop".equalsIgnoreCase(dh.getNguoiChiuTienXe())) {
            dh.setTongTienLoi(dh.getTongTienBan().subtract(dh.getTongTienVon()).subtract(ship).subtract(other));
        } else {
            dh.setTongTienLoi(dh.getTongTienBan().subtract(dh.getTongTienVon()).subtract(other));
        }

        String noteEntry = "[ĐÃ TRẢ HÀNG " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "]: Khách trả " + soLuongTra + " con (" + lyDoStr + ") -> Hoàn khách " + totalRefundToCustomer + " đ, Trừ NCC " + nccName + " " + totalCostDeduction + " đ (Đã cộng lại kho)";
        dh.setGhiChu(dh.getGhiChu() != null && !dh.getGhiChu().isBlank() ? (dh.getGhiChu() + "\n" + noteEntry) : noteEntry);

        return donHangRepository.save(dh);
    }

    @Override
    @Transactional
    public void huyDonHang(Long id) {
        DonHang dh = layChiTietDonHang(id);

        for (ChiTietDonHang item : dh.getDanhSachChiTiet()) {
            SanPhamHeo sp = item.getSanPhamHeo();
            if (sp != null) {
                if ("Con".equalsIgnoreCase(sp.getDonViTinh())) {
                    sp.setSoLuongCon(sp.getSoLuongCon() + item.getSoLuong());
                    BigDecimal w = sp.getTrongLuongMoiCon() != null ? sp.getTrongLuongMoiCon() : new BigDecimal("5.0");
                    sp.setSoKgTonKho(BigDecimal.valueOf(sp.getSoLuongCon()).multiply(w));
                } else {
                    sp.setSoKgTonKho(sp.getSoKgTonKho().add(BigDecimal.valueOf(item.getSoLuong())));
                }
                sanPhamHeoRepository.save(sp);
            }
        }

        donHangRepository.delete(dh);
    }
}
