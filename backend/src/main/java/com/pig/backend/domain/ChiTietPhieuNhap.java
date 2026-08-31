package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "CHI_TIET_PHIEU_NHAP")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChiTietPhieuNhap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "phieu_nhap_kho_id", nullable = false)
    @JsonIgnore
    private PhieuNhapKho phieuNhapKho;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "san_pham_heo_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SanPhamHeo sanPhamHeo;

    @Column(name = "loai_size", length = 100, nullable = false)
    private String loaiSize;

    @Column(name = "don_vi_tinh", length = 20, nullable = false)
    private String donViTinh = "Con";

    @Column(name = "so_luong_con", nullable = false)
    private Integer soLuongCon = 0;

    @Column(name = "so_kg", precision = 18, scale = 2, nullable = false)
    private BigDecimal soKg = BigDecimal.ZERO;

    @Column(name = "gia_nhap_von", precision = 18, scale = 2, nullable = false)
    private BigDecimal giaNhapVon;

    @Column(name = "thanh_tien_hang", precision = 18, scale = 2, nullable = false)
    private BigDecimal thanhTienHang;

    public ChiTietPhieuNhap() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonIgnore
    public PhieuNhapKho getPhieuNhapKho() { return phieuNhapKho; }
    public void setPhieuNhapKho(PhieuNhapKho phieuNhapKho) { this.phieuNhapKho = phieuNhapKho; }
    @JsonIgnore
    public PhieuNhapKho getPurchase() { return phieuNhapKho; }
    public void setPurchase(PhieuNhapKho purchase) { this.phieuNhapKho = purchase; }

    public SanPhamHeo getSanPhamHeo() { return sanPhamHeo; }
    public void setSanPhamHeo(SanPhamHeo sanPhamHeo) { this.sanPhamHeo = sanPhamHeo; }
    public SanPhamHeo getProduct() { return sanPhamHeo; }
    public void setProduct(SanPhamHeo product) { this.sanPhamHeo = product; }

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

    public BigDecimal getThanhTienHang() { return thanhTienHang; }
    public void setThanhTienHang(BigDecimal thanhTienHang) { this.thanhTienHang = thanhTienHang; }
    public BigDecimal getItemTotal() { return thanhTienHang; }
    public void setItemTotal(BigDecimal itemTotal) { this.thanhTienHang = itemTotal; }
}
