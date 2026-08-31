package com.pig.backend.service.impl;

import com.pig.backend.domain.DonHang;
import com.pig.backend.domain.PhieuNhapKho;
import com.pig.backend.dto.BaoCaoDashboardDTO;
import com.pig.backend.dto.TongKetNhapTrongNgayDTO;
import com.pig.backend.repository.DonHangRepository;
import com.pig.backend.repository.PhieuNhapKhoRepository;
import com.pig.backend.service.BaoCaoService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BaoCaoServiceImpl implements BaoCaoService {

    private final DonHangRepository donHangRepository;
    private final PhieuNhapKhoRepository phieuNhapKhoRepository;

    public BaoCaoServiceImpl(DonHangRepository donHangRepository, PhieuNhapKhoRepository phieuNhapKhoRepository) {
        this.donHangRepository = donHangRepository;
        this.phieuNhapKhoRepository = phieuNhapKhoRepository;
    }

    @Override
    public BaoCaoDashboardDTO layBaoCaoDashboard(String loaiBoLoc, LocalDate ngay, Integer thang, Integer nam) {
        List<DonHang> allOrders = donHangRepository.findAllByOrderByNgayDatHangDesc();
        List<DonHang> filtered = allOrders;

        if ("day".equalsIgnoreCase(loaiBoLoc) && ngay != null) {
            filtered = allOrders.stream()
                    .filter(o -> o.getNgayDatHang().toLocalDate().equals(ngay))
                    .collect(Collectors.toList());
        } else if ("month".equalsIgnoreCase(loaiBoLoc) && thang != null && nam != null) {
            filtered = allOrders.stream()
                    .filter(o -> o.getNgayDatHang().getYear() == nam && o.getNgayDatHang().getMonthValue() == thang)
                    .collect(Collectors.toList());
        } else if ("year".equalsIgnoreCase(loaiBoLoc) && nam != null) {
            filtered = allOrders.stream()
                    .filter(o -> o.getNgayDatHang().getYear() == nam)
                    .collect(Collectors.toList());
        }

        BigDecimal tongDoanhThu = filtered.stream().map(DonHang::getTongTienBan).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongTienVon = filtered.stream().map(DonHang::getTongTienVon).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongChiPhiTienXe = filtered.stream().map(DonHang::getChiPhiTienXeGiao).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongChiPhiKhac = filtered.stream().map(DonHang::getChiPhiKhac).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongTienLoi = filtered.stream().map(DonHang::getTongTienLoi).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongTienDaThu = filtered.stream().map(DonHang::getSoTienDaThanhToan).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongCongNo = filtered.stream().map(DonHang::getCongNoConLai).reduce(BigDecimal.ZERO, BigDecimal::add);

        BaoCaoDashboardDTO res = new BaoCaoDashboardDTO();
        res.setLoaiBoLoc(loaiBoLoc != null ? loaiBoLoc : "all");
        res.setTongSoDonHang(filtered.size());
        res.setTongDoanhThu(tongDoanhThu);
        res.setTongTienVon(tongTienVon);
        res.setTongChiPhiTienXe(tongChiPhiTienXe);
        res.setTongChiPhiKhac(tongChiPhiKhac);
        res.setTongTienLoi(tongTienLoi);
        res.setTongTienDaThu(tongTienDaThu);
        res.setTongCongNo(tongCongNo);
        res.setDanhSachDonHang(filtered);

        return res;
    }

    @Override
    public TongKetNhapTrongNgayDTO layTongKetNhapTrongNgay(LocalDate ngay) {
        LocalDate targetDate = ngay != null ? ngay : LocalDate.now();
        List<PhieuNhapKho> dayPurchases = phieuNhapKhoRepository.findByNgayNhapKho(targetDate);

        BigDecimal tongTienHangHeo = dayPurchases.stream().map(PhieuNhapKho::getTienHangHeo).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongTienXeKhach = dayPurchases.stream().map(PhieuNhapKho::getChiPhiTienXe).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongTienNhap = dayPurchases.stream().map(PhieuNhapKho::getTongTienNhap).reduce(BigDecimal.ZERO, BigDecimal::add);

        int tongSoCon = dayPurchases.stream()
                .flatMap(p -> p.getDanhSachChiTiet().stream())
                .mapToInt(it -> it.getSoLuongCon() != null ? it.getSoLuongCon() : 0)
                .sum();

        TongKetNhapTrongNgayDTO res = new TongKetNhapTrongNgayDTO();
        res.setNgayNhap(targetDate);
        res.setSoChuyenXe(dayPurchases.size());
        res.setTongSoCon(tongSoCon);
        res.setTongTienHangHeo(tongTienHangHeo);
        res.setTongTienXeKhach(tongTienXeKhach);
        res.setTongTienNhapTrongNgay(tongTienNhap);
        res.setDanhSachPhieuNhap(dayPurchases);

        return res;
    }
}
