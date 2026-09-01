package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "DON_HANG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_don_hang", length = 50, nullable = false)
    private String maDonHang;

    @Column(name = "ngay_dat_hang", nullable = false)
    private LocalDateTime ngayDatHang = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khach_hang_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhachHang khachHang;

    @Column(name = "ten_khach_hang", length = 255, nullable = false)
    private String tenKhachHang;

    @Column(name = "so_dien_thoai_khach", length = 20)
    private String soDienThoaiKhach;

    @Column(name = "dia_chi_giao_hang", length = 500)
    private String diaChiGiaoHang;

    @Column(name = "tong_tien_ban", precision = 18, scale = 2, nullable = false)
    private BigDecimal tongTienBan = BigDecimal.ZERO;

    @Column(name = "tong_tien_von", precision = 18, scale = 2, nullable = false)
    private BigDecimal tongTienVon = BigDecimal.ZERO;

    @Column(name = "chi_phi_tien_xe_giao", precision = 18, scale = 2)
    private BigDecimal chiPhiTienXeGiao = BigDecimal.ZERO; // Tiền xe ship

    @Column(name = "nguoi_chiu_tien_xe", length = 50)
    private String nguoiChiuTienXe = "buyer"; // 'buyer' (Khách chịu) hoặc 'shop' (Mình chịu / Freeship)

    @Column(name = "chi_phi_khac", precision = 18, scale = 2)
    private BigDecimal chiPhiKhac = BigDecimal.ZERO;

    @Column(name = "tong_tien_loi", precision = 18, scale = 2, nullable = false)
    private BigDecimal tongTienLoi = BigDecimal.ZERO; // Tiền Lời = Bán - Vốn - Xe - Khác

    @Column(name = "phuong_thuc_thanh_toan", length = 50, nullable = false)
    private String phuongThucThanhToan = "Cash"; // 'Cash' / 'Bank'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tai_khoan_ngan_hang_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TaiKhoanNganHang taiKhoanNganHangNhan;

    @Column(name = "so_tien_da_thanh_toan", precision = 18, scale = 2)
    private BigDecimal soTienDaThanhToan = BigDecimal.ZERO;

    @Column(name = "cong_no_con_lai", precision = 18, scale = 2)
    private BigDecimal congNoConLai = BigDecimal.ZERO;

    @Transient
    private String trangThaiDon = "Completed"; // 'Completed' / 'Pending'

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonHang> danhSachChiTiet = new ArrayList<>();

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    public DonHang() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaDonHang() { return maDonHang; }
    public void setMaDonHang(String maDonHang) { this.maDonHang = maDonHang; }
    public String getOrderCode() { return maDonHang; }
    public void setOrderCode(String orderCode) { this.maDonHang = orderCode; }

    public LocalDateTime getNgayDatHang() { return ngayDatHang; }
    public void setNgayDatHang(LocalDateTime ngayDatHang) { this.ngayDatHang = ngayDatHang; }
    public LocalDateTime getOrderDate() { return ngayDatHang; }
    public void setOrderDate(LocalDateTime orderDate) { this.ngayDatHang = orderDate; }

    public KhachHang getKhachHang() { return khachHang; }
    public void setKhachHang(KhachHang khachHang) { this.khachHang = khachHang; }
    public KhachHang getCustomer() { return khachHang; }
    public void setCustomer(KhachHang customer) { this.khachHang = customer; }

    public String getTenKhachHang() { return tenKhachHang; }
    public void setTenKhachHang(String tenKhachHang) { this.tenKhachHang = tenKhachHang; }
    public String getCustomerName() { return tenKhachHang; }
    public void setCustomerName(String customerName) { this.tenKhachHang = customerName; }

    public String getSoDienThoaiKhach() { return soDienThoaiKhach; }
    public void setSoDienThoaiKhach(String soDienThoaiKhach) { this.soDienThoaiKhach = soDienThoaiKhach; }
    public String getCustomerPhone() { return soDienThoaiKhach; }
    public void setCustomerPhone(String customerPhone) { this.soDienThoaiKhach = customerPhone; }

    public String getDiaChiGiaoHang() { return diaChiGiaoHang; }
    public void setDiaChiGiaoHang(String diaChiGiaoHang) { this.diaChiGiaoHang = diaChiGiaoHang; }
    public String getShippingAddress() { return diaChiGiaoHang; }
    public void setShippingAddress(String shippingAddress) { this.diaChiGiaoHang = shippingAddress; }

    public BigDecimal getTongTienBan() { return tongTienBan; }
    public void setTongTienBan(BigDecimal tongTienBan) { this.tongTienBan = tongTienBan; }
    public BigDecimal getTotalAmount() { return tongTienBan; }
    public void setTotalAmount(BigDecimal totalAmount) { this.tongTienBan = totalAmount; }

    public BigDecimal getTongTienVon() { return tongTienVon; }
    public void setTongTienVon(BigDecimal tongTienVon) { this.tongTienVon = tongTienVon; }
    public BigDecimal getTotalCost() { return tongTienVon; }
    public void setTotalCost(BigDecimal totalCost) { this.tongTienVon = totalCost; }

    public BigDecimal getChiPhiTienXeGiao() { return chiPhiTienXeGiao; }
    public void setChiPhiTienXeGiao(BigDecimal chiPhiTienXeGiao) { this.chiPhiTienXeGiao = chiPhiTienXeGiao; }
    public BigDecimal getShippingCost() { return chiPhiTienXeGiao; }
    public void setShippingCost(BigDecimal shippingCost) { this.chiPhiTienXeGiao = shippingCost; }

    public String getNguoiChiuTienXe() { return nguoiChiuTienXe; }
    public void setNguoiChiuTienXe(String nguoiChiuTienXe) { this.nguoiChiuTienXe = nguoiChiuTienXe; }
    public String getShippingPayer() { return nguoiChiuTienXe; }
    public void setShippingPayer(String shippingPayer) { this.nguoiChiuTienXe = shippingPayer; }

    public BigDecimal getChiPhiKhac() { return chiPhiKhac; }
    public void setChiPhiKhac(BigDecimal chiPhiKhac) { this.chiPhiKhac = chiPhiKhac; }
    public BigDecimal getOtherCost() { return chiPhiKhac; }
    public void setOtherCost(BigDecimal otherCost) { this.chiPhiKhac = otherCost; }

    public BigDecimal getTongTienLoi() { return tongTienLoi; }
    public void setTongTienLoi(BigDecimal tongTienLoi) { this.tongTienLoi = tongTienLoi; }
    public BigDecimal getProfit() { return tongTienLoi; }
    public void setProfit(BigDecimal profit) { this.tongTienLoi = profit; }

    public String getPhuongThucThanhToan() { return phuongThucThanhToan; }
    public void setPhuongThucThanhToan(String phuongThucThanhToan) { this.phuongThucThanhToan = phuongThucThanhToan; }
    public String getPaymentMethod() { return phuongThucThanhToan; }
    public void setPaymentMethod(String paymentMethod) { this.phuongThucThanhToan = paymentMethod; }

    public TaiKhoanNganHang getTaiKhoanNganHangNhan() { return taiKhoanNganHangNhan; }
    public void setTaiKhoanNganHangNhan(TaiKhoanNganHang taiKhoanNganHangNhan) { this.taiKhoanNganHangNhan = taiKhoanNganHangNhan; }
    public TaiKhoanNganHang getBankAccount() { return taiKhoanNganHangNhan; }
    public void setBankAccount(TaiKhoanNganHang bankAccount) { this.taiKhoanNganHangNhan = bankAccount; }

    public BigDecimal getSoTienKhachTra() { return soTienDaThanhToan; }
    public void setSoTienKhachTra(BigDecimal soTienKhachTra) { this.soTienDaThanhToan = soTienKhachTra; }
    public BigDecimal getPaidAmount() { return soTienDaThanhToan; }
    public void setPaidAmount(BigDecimal paidAmount) { this.soTienDaThanhToan = paidAmount; }
    public BigDecimal getSoTienDaThanhToan() { return soTienDaThanhToan; }
    public void setSoTienDaThanhToan(BigDecimal soTienDaThanhToan) { this.soTienDaThanhToan = soTienDaThanhToan; }

    public BigDecimal getCongNoKhachThieu() { return congNoConLai; }
    public void setCongNoKhachThieu(BigDecimal congNoKhachThieu) { this.congNoConLai = congNoKhachThieu; }
    public BigDecimal getDebtAmount() { return congNoConLai; }
    public void setDebtAmount(BigDecimal debtAmount) { this.congNoConLai = debtAmount; }
    public BigDecimal getCongNoConLai() { return congNoConLai; }
    public void setCongNoConLai(BigDecimal congNoConLai) { this.congNoConLai = congNoConLai; }

    public String getTrangThaiDon() { return trangThaiDon; }
    public void setTrangThaiDon(String trangThaiDon) { this.trangThaiDon = trangThaiDon; }
    public String getStatus() { return trangThaiDon; }
    public void setStatus(String status) { this.trangThaiDon = status; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public List<ChiTietDonHang> getDanhSachChiTiet() { return danhSachChiTiet; }
    public void setDanhSachChiTiet(List<ChiTietDonHang> danhSachChiTiet) { this.danhSachChiTiet = danhSachChiTiet; }
    public List<ChiTietDonHang> getItems() { return danhSachChiTiet; }
    public void setItems(List<ChiTietDonHang> items) { this.danhSachChiTiet = items; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}
