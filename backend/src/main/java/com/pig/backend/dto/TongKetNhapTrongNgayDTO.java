package com.pig.backend.dto;

import com.pig.backend.domain.PhieuNhapKho;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TongKetNhapTrongNgayDTO {
    private LocalDate ngayNhap;
    private Integer soChuyenXe;
    private Integer tongSoCon;
    private BigDecimal tongTienHangHeo;
    private BigDecimal tongTienXeKhach;
    private BigDecimal tongTienNhapTrongNgay;
    private List<PhieuNhapKho> danhSachPhieuNhap;

    public TongKetNhapTrongNgayDTO() {}

    public LocalDate getNgayNhap() { return ngayNhap; }
    public void setNgayNhap(LocalDate ngayNhap) { this.ngayNhap = ngayNhap; }
    public LocalDate getDate() { return ngayNhap; }
    public void setDate(LocalDate date) { this.ngayNhap = date; }

    public Integer getSoChuyenXe() { return soChuyenXe; }
    public void setSoChuyenXe(Integer soChuyenXe) { this.soChuyenXe = soChuyenXe; }
    public Integer getTripCount() { return soChuyenXe; }
    public void setTripCount(Integer tripCount) { this.soChuyenXe = tripCount; }

    public Integer getTongSoCon() { return tongSoCon; }
    public void setTongSoCon(Integer tongSoCon) { this.tongSoCon = tongSoCon; }
    public Integer getTotalHeads() { return tongSoCon; }
    public void setTotalHeads(Integer totalHeads) { this.tongSoCon = totalHeads; }

    public BigDecimal getTongTienHangHeo() { return tongTienHangHeo; }
    public void setTongTienHangHeo(BigDecimal tongTienHangHeo) { this.tongTienHangHeo = tongTienHangHeo; }
    public BigDecimal getTotalProductCost() { return tongTienHangHeo; }
    public void setTotalProductCost(BigDecimal totalProductCost) { this.tongTienHangHeo = totalProductCost; }

    public BigDecimal getTongTienXeKhach() { return tongTienXeKhach; }
    public void setTongTienXeKhach(BigDecimal tongTienXeKhach) { this.tongTienXeKhach = tongTienXeKhach; }
    public BigDecimal getShippingFee() { return tongTienXeKhach; }
    public void setShippingFee(BigDecimal shippingFee) { this.tongTienXeKhach = shippingFee; }
    public BigDecimal getTotalShippingFee() { return tongTienXeKhach; }
    public void setTotalShippingFee(BigDecimal totalShippingFee) { this.tongTienXeKhach = totalShippingFee; }

    public BigDecimal getTongTienNhapTrongNgay() { return tongTienNhapTrongNgay; }
    public void setTongTienNhapTrongNgay(BigDecimal tongTienNhapTrongNgay) { this.tongTienNhapTrongNgay = tongTienNhapTrongNgay; }
    public BigDecimal getTotalImportAmount() { return tongTienNhapTrongNgay; }
    public void setTotalImportAmount(BigDecimal totalImportAmount) { this.tongTienNhapTrongNgay = totalImportAmount; }

    public List<PhieuNhapKho> getDanhSachPhieuNhap() { return danhSachPhieuNhap; }
    public void setDanhSachPhieuNhap(List<PhieuNhapKho> danhSachPhieuNhap) { this.danhSachPhieuNhap = danhSachPhieuNhap; }
    public List<PhieuNhapKho> getPurchases() { return danhSachPhieuNhap; }
    public void setPurchases(List<PhieuNhapKho> purchases) { this.danhSachPhieuNhap = purchases; }
}
