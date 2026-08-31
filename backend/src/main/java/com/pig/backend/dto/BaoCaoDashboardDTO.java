package com.pig.backend.dto;

import com.pig.backend.domain.DonHang;
import java.math.BigDecimal;
import java.util.List;

public class BaoCaoDashboardDTO {
    private String loaiBoLoc;
    private Integer tongSoDonHang;
    private BigDecimal tongDoanhThu;
    private BigDecimal tongTienVon;
    private BigDecimal tongChiPhiTienXe;
    private BigDecimal tongChiPhiKhac;
    private BigDecimal tongTienLoi;
    private BigDecimal tongTienDaThu;
    private BigDecimal tongCongNo;
    private List<DonHang> danhSachDonHang;

    public BaoCaoDashboardDTO() {}

    public String getLoaiBoLoc() { return loaiBoLoc; }
    public void setLoaiBoLoc(String loaiBoLoc) { this.loaiBoLoc = loaiBoLoc; }
    public String getFilterType() { return loaiBoLoc; }
    public void setFilterType(String filterType) { this.loaiBoLoc = filterType; }

    public Integer getTongSoDonHang() { return tongSoDonHang; }
    public void setTongSoDonHang(Integer tongSoDonHang) { this.tongSoDonHang = tongSoDonHang; }
    public Integer getTotalOrders() { return tongSoDonHang; }
    public void setTotalOrders(Integer totalOrders) { this.tongSoDonHang = totalOrders; }

    public BigDecimal getTongDoanhThu() { return tongDoanhThu; }
    public void setTongDoanhThu(BigDecimal tongDoanhThu) { this.tongDoanhThu = tongDoanhThu; }
    public BigDecimal getTotalRevenue() { return tongDoanhThu; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.tongDoanhThu = totalRevenue; }

    public BigDecimal getTongTienVon() { return tongTienVon; }
    public void setTongTienVon(BigDecimal tongTienVon) { this.tongTienVon = tongTienVon; }
    public BigDecimal getTotalCost() { return tongTienVon; }
    public void setTotalCost(BigDecimal totalCost) { this.tongTienVon = totalCost; }

    public BigDecimal getTongChiPhiTienXe() { return tongChiPhiTienXe; }
    public void setTongChiPhiTienXe(BigDecimal tongChiPhiTienXe) { this.tongChiPhiTienXe = tongChiPhiTienXe; }
    public BigDecimal getTotalShipping() { return tongChiPhiTienXe; }
    public void setTotalShipping(BigDecimal totalShipping) { this.tongChiPhiTienXe = totalShipping; }

    public BigDecimal getTongChiPhiKhac() { return tongChiPhiKhac; }
    public void setTongChiPhiKhac(BigDecimal tongChiPhiKhac) { this.tongChiPhiKhac = tongChiPhiKhac; }
    public BigDecimal getTotalOther() { return tongChiPhiKhac; }
    public void setTotalOther(BigDecimal totalOther) { this.tongChiPhiKhac = totalOther; }

    public BigDecimal getTongTienLoi() { return tongTienLoi; }
    public void setTongTienLoi(BigDecimal tongTienLoi) { this.tongTienLoi = tongTienLoi; }
    public BigDecimal getTotalProfit() { return tongTienLoi; }
    public void setTotalProfit(BigDecimal totalProfit) { this.tongTienLoi = totalProfit; }

    public BigDecimal getTongTienDaThu() { return tongTienDaThu; }
    public void setTongTienDaThu(BigDecimal tongTienDaThu) { this.tongTienDaThu = tongTienDaThu; }
    public BigDecimal getTotalPaid() { return tongTienDaThu; }
    public void setTotalPaid(BigDecimal totalPaid) { this.tongTienDaThu = totalPaid; }

    public BigDecimal getTongCongNo() { return tongCongNo; }
    public void setTongCongNo(BigDecimal tongCongNo) { this.tongCongNo = tongCongNo; }
    public BigDecimal getTotalDebt() { return tongCongNo; }
    public void setTotalDebt(BigDecimal totalDebt) { this.tongCongNo = totalDebt; }

    public List<DonHang> getDanhSachDonHang() { return danhSachDonHang; }
    public void setDanhSachDonHang(List<DonHang> danhSachDonHang) { this.danhSachDonHang = danhSachDonHang; }
    public List<DonHang> getOrders() { return danhSachDonHang; }
    public void setOrders(List<DonHang> orders) { this.danhSachDonHang = orders; }
}
