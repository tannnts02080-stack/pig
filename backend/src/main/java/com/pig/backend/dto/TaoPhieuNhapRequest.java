package com.pig.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TaoPhieuNhapRequest {
    private Long nhaCungCapId;
    private LocalDate ngayNhapKho;
    private String loaiHeo;
    private String dacDiemHeo;
    private BigDecimal chiPhiTienXe;
    private BigDecimal chiPhiTienBai;
    private String nguoiChiuTienXe; // 'buyer' (Mình chịu) hoặc 'supplier' (NCC chịu)
    private BigDecimal soTienThanhToan;
    private Long taiKhoanNganHangId;
    private String ghiChu;
    private List<ChiTietMonNhapRequest> danhSachChiTiet;

    public TaoPhieuNhapRequest() {}

    public Long getNhaCungCapId() { return nhaCungCapId; }
    public void setNhaCungCapId(Long nhaCungCapId) { this.nhaCungCapId = nhaCungCapId; }
    public Long getSupplierId() { return nhaCungCapId; }
    public void setSupplierId(Long supplierId) { this.nhaCungCapId = supplierId; }

    public LocalDate getNgayNhapKho() { return ngayNhapKho; }
    public void setNgayNhapKho(LocalDate ngayNhapKho) { this.ngayNhapKho = ngayNhapKho; }
    public LocalDate getImportDate() { return ngayNhapKho; }
    public void setImportDate(LocalDate importDate) { this.ngayNhapKho = importDate; }

    public String getLoaiHeo() { return loaiHeo; }
    public void setLoaiHeo(String loaiHeo) { this.loaiHeo = loaiHeo; }
    public String getPorkType() { return loaiHeo; }
    public void setPorkType(String porkType) { this.loaiHeo = porkType; }

    public String getDacDiemHeo() { return dacDiemHeo; }
    public void setDacDiemHeo(String dacDiemHeo) { this.dacDiemHeo = dacDiemHeo; }
    public String getPigFeature() { return dacDiemHeo; }
    public void setPigFeature(String pigFeature) { this.dacDiemHeo = pigFeature; }

    public BigDecimal getChiPhiTienXe() { return chiPhiTienXe; }
    public void setChiPhiTienXe(BigDecimal chiPhiTienXe) { this.chiPhiTienXe = chiPhiTienXe; }
    public BigDecimal getShippingFee() { return chiPhiTienXe; }
    public void setShippingFee(BigDecimal shippingFee) { this.chiPhiTienXe = shippingFee; }

    public BigDecimal getChiPhiTienBai() { return chiPhiTienBai; }
    public void setChiPhiTienBai(BigDecimal chiPhiTienBai) { this.chiPhiTienBai = chiPhiTienBai; }
    public BigDecimal getParkingFee() { return chiPhiTienBai; }
    public void setParkingFee(BigDecimal parkingFee) { this.chiPhiTienBai = parkingFee; }

    public String getNguoiChiuTienXe() { return nguoiChiuTienXe; }
    public void setNguoiChiuTienXe(String nguoiChiuTienXe) { this.nguoiChiuTienXe = nguoiChiuTienXe; }
    public String getShippingPayer() { return nguoiChiuTienXe; }
    public void setShippingPayer(String shippingPayer) { this.nguoiChiuTienXe = shippingPayer; }

    public BigDecimal getSoTienThanhToan() { return soTienThanhToan; }
    public void setSoTienThanhToan(BigDecimal soTienThanhToan) { this.soTienThanhToan = soTienThanhToan; }
    public BigDecimal getPaidAmount() { return soTienThanhToan; }
    public void setPaidAmount(BigDecimal paidAmount) { this.soTienThanhToan = paidAmount; }

    public Long getTaiKhoanNganHangId() { return taiKhoanNganHangId; }
    public void setTaiKhoanNganHangId(Long taiKhoanNganHangId) { this.taiKhoanNganHangId = taiKhoanNganHangId; }
    public Long getBankAccountId() { return taiKhoanNganHangId; }
    public void setBankAccountId(Long bankAccountId) { this.taiKhoanNganHangId = bankAccountId; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public List<ChiTietMonNhapRequest> getDanhSachChiTiet() { return danhSachChiTiet; }
    public void setDanhSachChiTiet(List<ChiTietMonNhapRequest> danhSachChiTiet) { this.danhSachChiTiet = danhSachChiTiet; }
    public List<ChiTietMonNhapRequest> getItems() { return danhSachChiTiet; }
    public void setItems(List<ChiTietMonNhapRequest> items) { this.danhSachChiTiet = items; }

    public static class ChiTietMonNhapRequest {
        private Long sanPhamId;
        private String loaiSize;
        private String donViTinh;
        private Integer soLuongCon;
        private BigDecimal soKg;
        private BigDecimal giaNhapVon;

        public ChiTietMonNhapRequest() {}

        public Long getSanPhamId() { return sanPhamId; }
        public void setSanPhamId(Long sanPhamId) { this.sanPhamId = sanPhamId; }
        public Long getProductId() { return sanPhamId; }
        public void setProductId(Long productId) { this.sanPhamId = productId; }

        public String getLoaiSize() { return loaiSize; }
        public void setLoaiSize(String loaiSize) { this.loaiSize = loaiSize; }
        public String getSizeType() { return loaiSize; }
        public void setSizeType(String sizeType) { this.loaiSize = sizeType; }

        public String getDonViTinh() { return donViTinh; }
        public void setDonViTinh(String donViTinh) { this.donViTinh = donViTinh; }
        public String getUnit() { return donViTinh; }
        public void setUnit(String unit) { this.donViTinh = unit; }

        public Integer getSoLuongCon() { return soLuongCon; }
        public void setSoLuongCon(Integer soLuongCon) { this.soLuongCon = soLuongCon; }
        public Integer getHeadCount() { return soLuongCon; }
        public void setHeadCount(Integer headCount) { this.soLuongCon = headCount; }

        public BigDecimal getSoKg() { return soKg; }
        public void setSoKg(BigDecimal soKg) { this.soKg = soKg; }
        public BigDecimal getWeightKg() { return soKg; }
        public void setWeightKg(BigDecimal weightKg) { this.soKg = weightKg; }

        public BigDecimal getGiaNhapVon() { return giaNhapVon; }
        public void setGiaNhapVon(BigDecimal giaNhapVon) { this.giaNhapVon = giaNhapVon; }
        public BigDecimal getCostPrice() { return giaNhapVon; }
        public void setCostPrice(BigDecimal costPrice) { this.giaNhapVon = costPrice; }
    }
}
