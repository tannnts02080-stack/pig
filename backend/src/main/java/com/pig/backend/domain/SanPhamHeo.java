package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "SAN_PHAM_HEO")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SanPhamHeo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_san_pham", length = 50, nullable = false)
    private String maSanPham;

    @Column(name = "ten_san_pham", length = 255, nullable = false)
    private String tenSanPham;

    @Column(name = "hinh_anh", columnDefinition = "NVARCHAR(MAX)")
    private String hinhAnh;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nha_cung_cap_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private NhaCungCap nhaCungCap;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tai_khoan_ngan_hang_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TaiKhoanNganHang taiKhoanNganHang;

    @Column(name = "loai_heo", length = 50, nullable = false)
    private String loaiHeo = "hot"; // 'hot' (Hàng nóng) / 'cold' (Hàng lạnh) / 'wrapped' (Cuộn bọc)

    @Column(name = "dac_diem_heo", length = 50)
    private String dacDiemHeo = "duoi_cut"; // 'duoi_cut' (Đuôi cụt), 'duoi_dai' (Đuôi dài), 'rung_lai' (Rừng lai), 'mong_cai' (Móng cái)

    @Column(name = "nhom_gop_id", length = 100)
    private String nhomGopId; // ID nhóm gộp nếu được kéo gộp với các lô khác (null nếu tách riêng)

    @Column(name = "loai_size", length = 100, nullable = false)
    private String loaiSize; // Heo 5Kg, Heo 7Kg, Thịt Ba Chỉ...

    @Column(name = "don_vi_tinh", length = 20, nullable = false)
    private String donViTinh = "Con"; // 'Con' hoặc 'Kg'

    @Column(name = "trong_luong_moi_con", precision = 10, scale = 2)
    private BigDecimal trongLuongMoiCon = new BigDecimal("5.0");

    @Column(name = "so_luong_con", nullable = false)
    private Integer soLuongCon = 0;

    @Column(name = "so_kg_ton_kho", precision = 18, scale = 2, nullable = false)
    private BigDecimal soKgTonKho = BigDecimal.ZERO;

    @Column(name = "gia_nhap_von", precision = 18, scale = 2, nullable = false)
    private BigDecimal giaNhapVon = BigDecimal.ZERO; // Giá nhập số nhỏ

    @Column(name = "gia_ban_ra", precision = 18, scale = 2, nullable = false)
    private BigDecimal giaBanRa = BigDecimal.ZERO;  // Giá bán số to

    @Column(name = "ngay_nhap")
    private LocalDate ngayNhap;

    @Column(name = "chi_tiet_nhap", columnDefinition = "NVARCHAR(MAX)")
    private String chiTietNhap;

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    public SanPhamHeo() {}

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

    public NhaCungCap getNhaCungCap() { return nhaCungCap; }
    public void setNhaCungCap(NhaCungCap nhaCungCap) { this.nhaCungCap = nhaCungCap; }
    public NhaCungCap getSupplier() { return nhaCungCap; }
    public void setSupplier(NhaCungCap supplier) { this.nhaCungCap = supplier; }

    public TaiKhoanNganHang getTaiKhoanNganHang() { return taiKhoanNganHang; }
    public void setTaiKhoanNganHang(TaiKhoanNganHang taiKhoanNganHang) { this.taiKhoanNganHang = taiKhoanNganHang; }
    public TaiKhoanNganHang getBankAccount() { return taiKhoanNganHang; }
    public void setBankAccount(TaiKhoanNganHang bankAccount) { this.taiKhoanNganHang = bankAccount; }

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

    public String getDacDiemHeo() { return dacDiemHeo; }
    public void setDacDiemHeo(String dacDiemHeo) { this.dacDiemHeo = dacDiemHeo; }
    public String getPigFeature() { return dacDiemHeo; }
    public void setPigFeature(String pigFeature) { this.dacDiemHeo = pigFeature; }

    public String getNhomGopId() { return nhomGopId; }
    public void setNhomGopId(String nhomGopId) { this.nhomGopId = nhomGopId; }
    public String getGroupId() { return nhomGopId; }
    public void setGroupId(String groupId) { this.nhomGopId = groupId; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getCreatedAt() { return ngayTao; }
    public void setCreatedAt(LocalDateTime createdAt) { this.ngayTao = createdAt; }
}
