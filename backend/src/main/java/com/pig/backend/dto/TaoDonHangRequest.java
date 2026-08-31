package com.pig.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class TaoDonHangRequest {
    private String tenKhachHang;
    private String soDienThoai;
    private String diaChiGiaoHang;
    private List<ChiTietMonBanRequest> danhSachMon;
    private BigDecimal chiPhiTienXe;
    private String nguoiChiuTienXe = "buyer"; // 'buyer' (Khách chịu) hoặc 'shop' (Shop chịu / Freeship)
    private BigDecimal chiPhiKhac;
    private String phuongThucThanhToan;
    private Long taiKhoanNganHangId;
    private BigDecimal soTienThanhToan;
    private String ghiChu;

    public TaoDonHangRequest() {}

    public String getTenKhachHang() { return tenKhachHang; }
    public void setTenKhachHang(String tenKhachHang) { this.tenKhachHang = tenKhachHang; }
    public String getCustomerName() { return tenKhachHang; }
    public void setCustomerName(String customerName) { this.tenKhachHang = customerName; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getCustomerPhone() { return soDienThoai; }
    public void setCustomerPhone(String customerPhone) { this.soDienThoai = customerPhone; }

    public String getDiaChiGiaoHang() { return diaChiGiaoHang; }
    public void setDiaChiGiaoHang(String diaChiGiaoHang) { this.diaChiGiaoHang = diaChiGiaoHang; }
    public String getCustomerAddress() { return diaChiGiaoHang; }
    public void setCustomerAddress(String customerAddress) { this.diaChiGiaoHang = customerAddress; }

    public List<ChiTietMonBanRequest> getDanhSachMon() { return danhSachMon; }
    public void setDanhSachMon(List<ChiTietMonBanRequest> danhSachMon) { this.danhSachMon = danhSachMon; }
    public List<ChiTietMonBanRequest> getItems() { return danhSachMon; }
    public void setItems(List<ChiTietMonBanRequest> items) { this.danhSachMon = items; }

    public BigDecimal getChiPhiTienXe() { return chiPhiTienXe; }
    public void setChiPhiTienXe(BigDecimal chiPhiTienXe) { this.chiPhiTienXe = chiPhiTienXe; }
    public BigDecimal getShippingFee() { return chiPhiTienXe; }
    public void setShippingFee(BigDecimal shippingFee) { this.chiPhiTienXe = shippingFee; }

    public String getNguoiChiuTienXe() { return nguoiChiuTienXe; }
    public void setNguoiChiuTienXe(String nguoiChiuTienXe) { this.nguoiChiuTienXe = nguoiChiuTienXe; }
    public String getShippingPayer() { return nguoiChiuTienXe; }
    public void setShippingPayer(String shippingPayer) { this.nguoiChiuTienXe = shippingPayer; }

    public BigDecimal getChiPhiKhac() { return chiPhiKhac; }
    public void setChiPhiKhac(BigDecimal chiPhiKhac) { this.chiPhiKhac = chiPhiKhac; }
    public BigDecimal getOtherExpenses() { return chiPhiKhac; }
    public void setOtherExpenses(BigDecimal otherExpenses) { this.chiPhiKhac = otherExpenses; }

    public String getPhuongThucThanhToan() { return phuongThucThanhToan; }
    public void setPhuongThucThanhToan(String phuongThucThanhToan) { this.phuongThucThanhToan = phuongThucThanhToan; }
    public String getPaymentMethod() { return phuongThucThanhToan; }
    public void setPaymentMethod(String paymentMethod) { this.phuongThucThanhToan = paymentMethod; }

    public Long getTaiKhoanNganHangId() { return taiKhoanNganHangId; }
    public void setTaiKhoanNganHangId(Long taiKhoanNganHangId) { this.taiKhoanNganHangId = taiKhoanNganHangId; }
    public Long getBankAccountId() { return taiKhoanNganHangId; }
    public void setBankAccountId(Long bankAccountId) { this.taiKhoanNganHangId = bankAccountId; }

    public BigDecimal getSoTienThanhToan() { return soTienThanhToan; }
    public void setSoTienThanhToan(BigDecimal soTienThanhToan) { this.soTienThanhToan = soTienThanhToan; }
    public BigDecimal getPaidAmount() { return soTienThanhToan; }
    public void setPaidAmount(BigDecimal paidAmount) { this.soTienThanhToan = paidAmount; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public static class ChiTietMonBanRequest {
        private Long sanPhamId;
        private Integer soLuong;
        private BigDecimal giaBanTuyChinh;

        public ChiTietMonBanRequest() {}

        public Long getSanPhamId() { return sanPhamId; }
        public void setSanPhamId(Long sanPhamId) { this.sanPhamId = sanPhamId; }
        public Long getProductId() { return sanPhamId; }
        public void setProductId(Long productId) { this.sanPhamId = productId; }

        public Integer getSoLuong() { return soLuong; }
        public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }
        public Integer getQuantity() { return soLuong; }
        public void setQuantity(Integer quantity) { this.soLuong = quantity; }

        public BigDecimal getGiaBanTuyChinh() { return giaBanTuyChinh; }
        public void setGiaBanTuyChinh(BigDecimal giaBanTuyChinh) { this.giaBanTuyChinh = giaBanTuyChinh; }
        public BigDecimal getCustomPrice() { return giaBanTuyChinh; }
        public void setCustomPrice(BigDecimal customPrice) { this.giaBanTuyChinh = customPrice; }
    }
}
