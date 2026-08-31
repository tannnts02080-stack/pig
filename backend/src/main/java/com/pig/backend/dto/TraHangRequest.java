package com.pig.backend.dto;

import java.math.BigDecimal;

public class TraHangRequest {
    private Long chiTietDonHangId;
    private Long sanPhamHeoId;
    private Integer soLuongTra = 1;
    private BigDecimal giaHoanTien;
    private BigDecimal giaVonTruNcc;
    private Long nhaCungCapId;
    private Boolean truTienNcc = true;
    private String lyDo;
    private String nguonHoanTien = "Cash"; // "Cash" hoặc "Bank"
    private Long taiKhoanNganHangId;

    // Tính năng Giảm Giá / Bồi Thường Khi Khách Nhận Hàng Lỗi
    private String loaiXuLy = "TRA_HEO"; // "TRA_HEO" (Trả heo hoàn tiền) hoặc "GIAM_GIA" (Giảm giá bồi thường)
    private String nguoiChiuGiamGia = "NCC"; // "NCC" (NCC chịu giảm giá) hoặc "SHOP" (Shop mình chịu giảm giá)
    private BigDecimal soTienGiamGia = BigDecimal.ZERO;

    public TraHangRequest() {}

    public Long getChiTietDonHangId() { return chiTietDonHangId; }
    public void setChiTietDonHangId(Long chiTietDonHangId) { this.chiTietDonHangId = chiTietDonHangId; }

    public Long getSanPhamHeoId() { return sanPhamHeoId; }
    public void setSanPhamHeoId(Long sanPhamHeoId) { this.sanPhamHeoId = sanPhamHeoId; }

    public Integer getSoLuongTra() { return soLuongTra; }
    public void setSoLuongTra(Integer soLuongTra) { this.soLuongTra = soLuongTra; }

    public BigDecimal getGiaHoanTien() { return giaHoanTien; }
    public void setGiaHoanTien(BigDecimal giaHoanTien) { this.giaHoanTien = giaHoanTien; }

    public BigDecimal getGiaVonTruNcc() { return giaVonTruNcc; }
    public void setGiaVonTruNcc(BigDecimal giaVonTruNcc) { this.giaVonTruNcc = giaVonTruNcc; }

    public Long getNhaCungCapId() { return nhaCungCapId; }
    public void setNhaCungCapId(Long nhaCungCapId) { this.nhaCungCapId = nhaCungCapId; }

    public Boolean getTruTienNcc() { return truTienNcc; }
    public void setTruTienNcc(Boolean truTienNcc) { this.truTienNcc = truTienNcc; }

    public String getLyDo() { return lyDo; }
    public void setLyDo(String lyDo) { this.lyDo = lyDo; }

    public String getNguonHoanTien() { return nguonHoanTien; }
    public void setNguonHoanTien(String nguonHoanTien) { this.nguonHoanTien = nguonHoanTien; }

    public Long getTaiKhoanNganHangId() { return taiKhoanNganHangId; }
    public void setTaiKhoanNganHangId(Long taiKhoanNganHangId) { this.taiKhoanNganHangId = taiKhoanNganHangId; }

    public String getLoaiXuLy() { return loaiXuLy; }
    public void setLoaiXuLy(String loaiXuLy) { this.loaiXuLy = loaiXuLy; }

    public String getNguoiChiuGiamGia() { return nguoiChiuGiamGia; }
    public void setNguoiChiuGiamGia(String nguoiChiuGiamGia) { this.nguoiChiuGiamGia = nguoiChiuGiamGia; }

    public BigDecimal getSoTienGiamGia() { return soTienGiamGia; }
    public void setSoTienGiamGia(BigDecimal soTienGiamGia) { this.soTienGiamGia = soTienGiamGia; }
}
