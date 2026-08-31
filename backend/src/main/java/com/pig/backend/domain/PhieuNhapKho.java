package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "PHIEU_NHAP_KHO")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PhieuNhapKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_phieu_nhap", length = 50, nullable = false, unique = true)
    private String maPhieuNhap;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nha_cung_cap_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private NhaCungCap nhaCungCap;

    @Column(name = "ngay_nhap_kho", nullable = false)
    private LocalDate ngayNhapKho;

    @Column(name = "loai_heo", length = 50, nullable = false)
    private String loaiHeo = "hot"; // 'hot' / 'cold' / 'wrapped'

    @Column(name = "dac_diem_heo", length = 50)
    private String dacDiemHeo = "duoi_cut"; // 'duoi_cut', 'duoi_dai', 'rung_lai', 'mong_cai'

    @Column(name = "tien_hang_heo", precision = 18, scale = 2, nullable = false)
    private BigDecimal tienHangHeo = BigDecimal.ZERO;

    @Column(name = "chi_phi_tien_xe", precision = 18, scale = 2, nullable = false)
    private BigDecimal chiPhiTienXe = BigDecimal.ZERO; // Chi phí tiền xe khách chở tới

    @Column(name = "chi_phi_tien_bai", precision = 18, scale = 2, nullable = false)
    private BigDecimal chiPhiTienBai = BigDecimal.ZERO; // Chi phí tiền bến bãi / bốc xếp

    @Column(name = "nguoi_chiu_tien_xe", length = 50)
    private String nguoiChiuTienXe = "buyer"; // 'buyer' (Mình chịu) hoặc 'supplier' (NCC chịu)

    @Column(name = "tong_tien_nhap", precision = 18, scale = 2, nullable = false)
    private BigDecimal tongTienNhap = BigDecimal.ZERO; // Tổng tiền = Tiền hàng + Tiền xe + Tiền bãi

    @Column(name = "so_tien_da_tra", precision = 18, scale = 2)
    private BigDecimal soTienDaTra = BigDecimal.ZERO;

    @Column(name = "cong_no_con_thieu", precision = 18, scale = 2)
    private BigDecimal congNoConThieu = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_ngan_hang_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TaiKhoanNganHang taiKhoanNganHangTra;

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @OneToMany(mappedBy = "phieuNhapKho", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietPhieuNhap> danhSachChiTiet = new ArrayList<>();

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    public PhieuNhapKho() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaPhieuNhap() { return maPhieuNhap; }
    public void setMaPhieuNhap(String maPhieuNhap) { this.maPhieuNhap = maPhieuNhap; }
    public String getPurchaseCode() { return maPhieuNhap; }
    public void setPurchaseCode(String purchaseCode) { this.maPhieuNhap = purchaseCode; }

    public NhaCungCap getNhaCungCap() { return nhaCungCap; }
    public void setNhaCungCap(NhaCungCap nhaCungCap) { this.nhaCungCap = nhaCungCap; }
    public NhaCungCap getSupplier() { return nhaCungCap; }
    public void setSupplier(NhaCungCap supplier) { this.nhaCungCap = supplier; }

    public LocalDate getNgayNhapKho() { return ngayNhapKho; }
    public void setNgayNhapKho(LocalDate ngayNhapKho) { this.ngayNhapKho = ngayNhapKho; }
    public LocalDate getImportDate() { return ngayNhapKho; }
    public void setImportDate(LocalDate importDate) { this.ngayNhapKho = importDate; }

    public String getLoaiHeo() { return loaiHeo; }
    public void setLoaiHeo(String loaiHeo) { this.loaiHeo = loaiHeo; }
    public String getPorkType() { return loaiHeo; }
    public void setPorkType(String porkType) { this.loaiHeo = porkType; }

    public BigDecimal getTienHangHeo() { return tienHangHeo; }
    public void setTienHangHeo(BigDecimal tienHangHeo) { this.tienHangHeo = tienHangHeo; }
    public BigDecimal getProductCost() { return tienHangHeo; }
    public void setProductCost(BigDecimal productCost) { this.tienHangHeo = productCost; }

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

    public BigDecimal getTongTienNhap() { return tongTienNhap; }
    public void setTongTienNhap(BigDecimal tongTienNhap) { this.tongTienNhap = tongTienNhap; }
    public BigDecimal getTotalAmount() { return tongTienNhap; }
    public void setTotalAmount(BigDecimal totalAmount) { this.tongTienNhap = totalAmount; }

    public BigDecimal getSoTienDaTra() { return soTienDaTra; }
    public void setSoTienDaTra(BigDecimal soTienDaTra) { this.soTienDaTra = soTienDaTra; }
    public BigDecimal getPaidAmount() { return soTienDaTra; }
    public void setPaidAmount(BigDecimal paidAmount) { this.soTienDaTra = paidAmount; }

    public BigDecimal getCongNoConThieu() { return congNoConThieu; }
    public void setCongNoConThieu(BigDecimal congNoConThieu) { this.congNoConThieu = congNoConThieu; }
    public BigDecimal getDebtAmount() { return congNoConThieu; }
    public void setDebtAmount(BigDecimal debtAmount) { this.congNoConThieu = debtAmount; }

    public TaiKhoanNganHang getTaiKhoanNganHangTra() { return taiKhoanNganHangTra; }
    public void setTaiKhoanNganHangTra(TaiKhoanNganHang taiKhoanNganHangTra) { this.taiKhoanNganHangTra = taiKhoanNganHangTra; }
    public TaiKhoanNganHang getTaiKhoanNganHang() { return taiKhoanNganHangTra; }
    public void setTaiKhoanNganHang(TaiKhoanNganHang taiKhoanNganHang) { this.taiKhoanNganHangTra = taiKhoanNganHang; }
    public TaiKhoanNganHang getPaidFromAccount() { return taiKhoanNganHangTra; }
    public void setPaidFromAccount(TaiKhoanNganHang paidFromAccount) { this.taiKhoanNganHangTra = paidFromAccount; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public List<ChiTietPhieuNhap> getDanhSachChiTiet() { return danhSachChiTiet; }
    public void setDanhSachChiTiet(List<ChiTietPhieuNhap> danhSachChiTiet) { this.danhSachChiTiet = danhSachChiTiet; }
    public List<ChiTietPhieuNhap> getItems() { return danhSachChiTiet; }
    public void setItems(List<ChiTietPhieuNhap> items) { this.danhSachChiTiet = items; }

    public String getDacDiemHeo() { return dacDiemHeo; }
    public void setDacDiemHeo(String dacDiemHeo) { this.dacDiemHeo = dacDiemHeo; }
    public String getPigFeature() { return dacDiemHeo; }
    public void setPigFeature(String pigFeature) { this.dacDiemHeo = pigFeature; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getCreatedAt() { return ngayTao; }
    public void setCreatedAt(LocalDateTime createdAt) { this.ngayTao = createdAt; }
}
