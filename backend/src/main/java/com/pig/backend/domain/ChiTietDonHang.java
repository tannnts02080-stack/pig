package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "CHI_TIET_DON_HANG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_hang_id", nullable = false)
    @JsonIgnore
    private DonHang donHang;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "san_pham_heo_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SanPhamHeo sanPhamHeo;

    @Column(name = "loai_heo", length = 50, nullable = false)
    private String loaiHeo;

    @Column(name = "loai_size", length = 100, nullable = false)
    private String loaiSize;

    @Column(name = "don_vi_tinh", length = 20, nullable = false)
    private String donViTinh;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong = 1;

    @Column(name = "so_kg", precision = 10, scale = 2)
    private BigDecimal soKg = BigDecimal.ZERO;

    @Column(name = "gia_nhap_von", precision = 18, scale = 2, nullable = false)
    private BigDecimal giaNhapVon;

    @Column(name = "gia_ban_goc", precision = 18, scale = 2, nullable = false)
    private BigDecimal giaBanGoc;

    @Column(name = "gia_ban_thuc_te", precision = 18, scale = 2, nullable = false)
    private BigDecimal giaBanThucTe;

    @Column(name = "tien_loi_tung_mon", precision = 18, scale = 2, nullable = false)
    private BigDecimal tienLoiTungMon;

    @Column(name = "thanh_tien", precision = 18, scale = 2, nullable = false)
    private BigDecimal thanhTien;

    public ChiTietDonHang() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonIgnore
    public DonHang getDonHang() { return donHang; }
    public void setDonHang(DonHang donHang) { this.donHang = donHang; }

    @JsonIgnore
    public DonHang getOrder() { return donHang; }
    public void setOrder(DonHang order) { this.donHang = order; }

    public SanPhamHeo getSanPhamHeo() { return sanPhamHeo; }
    public void setSanPhamHeo(SanPhamHeo sanPhamHeo) { this.sanPhamHeo = sanPhamHeo; }
    public SanPhamHeo getProduct() { return sanPhamHeo; }
    public void setProduct(SanPhamHeo product) { this.sanPhamHeo = product; }

    public String getLoaiHeo() { return loaiHeo; }
    public void setLoaiHeo(String loaiHeo) { this.loaiHeo = loaiHeo; }
    public String getPorkType() { return loaiHeo; }
    public void setPorkType(String porkType) { this.loaiHeo = porkType; }

    public String getLoaiSize() { return loaiSize; }
    public void setLoaiSize(String loaiSize) { this.loaiSize = loaiSize; }
    public String getSizeType() { return loaiSize; }
    public void setSizeType(String sizeType) { this.loaiSize = sizeType; }

    public String getDonViTinh() { return donViTinh; }
    public void setDonViTinh(String donViTinh) { this.donViTinh = donViTinh; }
    public String getUnit() { return donViTinh; }
    public void setUnit(String unit) { this.donViTinh = unit; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }
    public Integer getQuantity() { return soLuong; }
    public void setQuantity(Integer quantity) { this.soLuong = quantity; }

    public BigDecimal getSoKg() { return soKg; }
    public void setSoKg(BigDecimal soKg) { this.soKg = soKg; }
    public BigDecimal getWeightKg() { return soKg; }
    public void setWeightKg(BigDecimal weightKg) { this.soKg = weightKg; }

    public BigDecimal getGiaNhapVon() { return giaNhapVon; }
    public void setGiaNhapVon(BigDecimal giaNhapVon) { this.giaNhapVon = giaNhapVon; }
    public BigDecimal getCostPrice() { return giaNhapVon; }
    public void setCostPrice(BigDecimal costPrice) { this.giaNhapVon = costPrice; }

    public BigDecimal getGiaBanGoc() { return giaBanGoc; }
    public void setGiaBanGoc(BigDecimal giaBanGoc) { this.giaBanGoc = giaBanGoc; }
    public BigDecimal getSellingPrice() { return giaBanGoc; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.giaBanGoc = sellingPrice; }

    public BigDecimal getGiaBanThucTe() { return giaBanThucTe; }
    public void setGiaBanThucTe(BigDecimal giaBanThucTe) { this.giaBanThucTe = giaBanThucTe; }
    public BigDecimal getCustomPrice() { return giaBanThucTe; }
    public void setCustomPrice(BigDecimal customPrice) { this.giaBanThucTe = customPrice; }

    public BigDecimal getTienLoiTungMon() { return tienLoiTungMon; }
    public void setTienLoiTungMon(BigDecimal tienLoiTungMon) { this.tienLoiTungMon = tienLoiTungMon; }
    public BigDecimal getItemProfit() { return tienLoiTungMon; }
    public void setItemProfit(BigDecimal itemProfit) { this.tienLoiTungMon = itemProfit; }

    public BigDecimal getThanhTien() { return thanhTien; }
    public void setThanhTien(BigDecimal thanhTien) { this.thanhTien = thanhTien; }
    public BigDecimal getTotal() { return thanhTien; }
    public void setTotal(BigDecimal total) { this.thanhTien = total; }
}
