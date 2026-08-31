package com.pig.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SanPhamHeoDTO {
    private Long id;
    private String maSanPham;
    private String tenSanPham;
    private String hinhAnh;
    private Long nhaCungCapId;
    private String tenNhaCungCap;
    private String loaiHeo;
    private String dacDiemHeo;
    private String loaiSize;
    private String donViTinh;
    private BigDecimal trongLuongMoiCon;
    private Integer soLuongCon;
    private BigDecimal soKgTonKho;
    private BigDecimal giaNhapVon;
    private BigDecimal giaBanRa;
    private LocalDate ngayNhap;
    private String chiTietNhap;
    private String ghiChu;
    private String nhomGopId;

    public SanPhamHeoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaSanPham() { return maSanPham; }
    public void setMaSanPham(String maSanPham) { this.maSanPham = maSanPham; }
    public String getProductCode() { return maSanPham; }
    public void setProductCode(String productCode) { this.maSanPham = productCode; }

    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }
    public String getProductName() { return tenSanPham; }
    public void setProductName(String productName) { this.tenSanPham = productName; }
    public String getName() { return tenSanPham; }
    public void setName(String name) { this.tenSanPham = name; }

    public String getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String hinhAnh) { this.hinhAnh = hinhAnh; }
    public String getImageUrl() { return hinhAnh; }
    public void setImageUrl(String imageUrl) { this.hinhAnh = imageUrl; }
    public String getImage() { return hinhAnh; }
    public void setImage(String image) { this.hinhAnh = image; }

    public Long getNhaCungCapId() { return nhaCungCapId; }
    public void setNhaCungCapId(Long nhaCungCapId) { this.nhaCungCapId = nhaCungCapId; }
    public Long getSupplierId() { return nhaCungCapId; }
    public void setSupplierId(Long supplierId) { this.nhaCungCapId = supplierId; }

    public String getTenNhaCungCap() { return tenNhaCungCap; }
    public void setTenNhaCungCap(String tenNhaCungCap) { this.tenNhaCungCap = tenNhaCungCap; }
    public String getSupplierName() { return tenNhaCungCap; }
    public void setSupplierName(String supplierName) { this.tenNhaCungCap = supplierName; }

    public String getLoaiHeo() { return loaiHeo; }
    public void setLoaiHeo(String loaiHeo) { this.loaiHeo = loaiHeo; }
    public String getPorkType() { return loaiHeo; }
    public void setPorkType(String porkType) { this.loaiHeo = porkType; }

    public String getDacDiemHeo() { return dacDiemHeo; }
    public void setDacDiemHeo(String dacDiemHeo) { this.dacDiemHeo = dacDiemHeo; }
    public String getPigFeature() { return dacDiemHeo; }
    public void setPigFeature(String pigFeature) { this.dacDiemHeo = pigFeature; }

    public String getLoaiSize() { return loaiSize; }
    public void setLoaiSize(String loaiSize) { this.loaiSize = loaiSize; }
    public String getSizeType() { return loaiSize; }
    public void setSizeType(String sizeType) { this.loaiSize = sizeType; }

    public String getDonViTinh() { return donViTinh; }
    public void setDonViTinh(String donViTinh) { this.donViTinh = donViTinh; }
    public String getUnit() { return donViTinh; }
    public void setUnit(String unit) { this.donViTinh = unit; }

    public BigDecimal getTrongLuongMoiCon() { return trongLuongMoiCon; }
    public void setTrongLuongMoiCon(BigDecimal trongLuongMoiCon) { this.trongLuongMoiCon = trongLuongMoiCon; }
    public BigDecimal getWeightPerHead() { return trongLuongMoiCon; }
    public void setWeightPerHead(BigDecimal weightPerHead) { this.trongLuongMoiCon = weightPerHead; }

    public Integer getSoLuongCon() { return soLuongCon; }
    public void setSoLuongCon(Integer soLuongCon) { this.soLuongCon = soLuongCon; }
    public Integer getHeadCount() { return soLuongCon; }
    public void setHeadCount(Integer headCount) { this.soLuongCon = headCount; }

    public BigDecimal getSoKgTonKho() { return soKgTonKho; }
    public void setSoKgTonKho(BigDecimal soKgTonKho) { this.soKgTonKho = soKgTonKho; }
    public BigDecimal getStockKg() { return soKgTonKho; }
    public void setStockKg(BigDecimal stockKg) { this.soKgTonKho = stockKg; }

    public BigDecimal getGiaNhapVon() { return giaNhapVon; }
    public void setGiaNhapVon(BigDecimal giaNhapVon) { this.giaNhapVon = giaNhapVon; }
    public BigDecimal getCostPrice() { return giaNhapVon; }
    public void setCostPrice(BigDecimal costPrice) { this.giaNhapVon = costPrice; }

    public BigDecimal getGiaBanRa() { return giaBanRa; }
    public void setGiaBanRa(BigDecimal giaBanRa) { this.giaBanRa = giaBanRa; }
    public BigDecimal getSellingPrice() { return giaBanRa; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.giaBanRa = sellingPrice; }

    public LocalDate getNgayNhap() { return ngayNhap; }
    public void setNgayNhap(LocalDate ngayNhap) { this.ngayNhap = ngayNhap; }
    public LocalDate getImportDate() { return ngayNhap; }
    public void setImportDate(LocalDate importDate) { this.ngayNhap = importDate; }

    public String getChiTietNhap() { return chiTietNhap; }
    public void setChiTietNhap(String chiTietNhap) { this.chiTietNhap = chiTietNhap; }
    public String getImportDetails() { return chiTietNhap; }
    public void setImportDetails(String importDetails) { this.chiTietNhap = importDetails; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public String getNhomGopId() { return nhomGopId; }
    public void setNhomGopId(String nhomGopId) { this.nhomGopId = nhomGopId; }
    public String getGroupId() { return nhomGopId; }
    public void setGroupId(String groupId) { this.nhomGopId = groupId; }

    private Long taiKhoanNganHangId;
    public Long getTaiKhoanNganHangId() { return taiKhoanNganHangId; }
    public void setTaiKhoanNganHangId(Long taiKhoanNganHangId) { this.taiKhoanNganHangId = taiKhoanNganHangId; }
    public Long getBankAccountId() { return taiKhoanNganHangId; }
    public void setBankAccountId(Long bankAccountId) { this.taiKhoanNganHangId = bankAccountId; }
}
