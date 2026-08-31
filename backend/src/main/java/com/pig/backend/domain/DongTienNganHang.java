package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "DONG_TIEN_NGAN_HANG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DongTienNganHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tai_khoan_ngan_hang_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TaiKhoanNganHang taiKhoanNganHang;

    @Column(name = "loai_dong_tien", length = 10, nullable = false)
    private String loaiDongTien; // 'IN' (Vào) / 'OUT' (Ra)

    @Column(name = "so_tien", precision = 18, scale = 2, nullable = false)
    private BigDecimal soTien;

    @Column(name = "loai_giao_dich", length = 50)
    private String loaiGiaoDich; // 'DON_HANG', 'PHIEU_NHAP', 'TIEN_XE', 'THU_CONG'

    @Column(name = "loai_doi_tuong", length = 50)
    private String loaiDoiTuong; // 'NCC' hoặc 'NGUOI_NHA'

    @Column(name = "nha_cung_cap_id")
    private Long nhaCungCapId;

    @Column(name = "khach_hang_id")
    private Long khachHangId;

    @Column(name = "ten_khach_hang", length = 150)
    private String tenKhachHang;

    @Column(name = "thang_nam", length = 20)
    private String thangNam; // '2026-08'

    @Column(name = "loai_nghiep_vu", length = 50)
    private String loaiNghiepVu; // 'KHACH_TRA_NCC', 'TIEN_COC_NCC', 'LOI_NHUAN_NGUOI_NHA'

    @Column(name = "ma_tham_chieu", length = 50)
    private String maThamChieu;

    @Column(name = "mo_ta", length = 500, nullable = false)
    private String moTa;

    @Column(name = "ngay_giao_dich")
    private LocalDateTime ngayGiaoDich = LocalDateTime.now();

    public DongTienNganHang() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TaiKhoanNganHang getTaiKhoanNganHang() { return taiKhoanNganHang; }
    public void setTaiKhoanNganHang(TaiKhoanNganHang taiKhoanNganHang) { this.taiKhoanNganHang = taiKhoanNganHang; }
    public TaiKhoanNganHang getBankAccount() { return taiKhoanNganHang; }
    public void setBankAccount(TaiKhoanNganHang bankAccount) { this.taiKhoanNganHang = bankAccount; }

    public String getLoaiDongTien() { return loaiDongTien; }
    public void setLoaiDongTien(String loaiDongTien) { this.loaiDongTien = loaiDongTien; }
    public String getFlowType() { return loaiDongTien; }
    public void setFlowType(String flowType) { this.loaiDongTien = flowType; }
    public String getType() { return loaiDongTien; }
    public void setType(String type) { this.loaiDongTien = type; }

    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
    public BigDecimal getAmount() { return soTien; }
    public void setAmount(BigDecimal amount) { this.soTien = amount; }

    public String getLoaiGiaoDich() { return loaiGiaoDich; }
    public void setLoaiGiaoDich(String loaiGiaoDich) { this.loaiGiaoDich = loaiGiaoDich; }
    public String getReferenceType() { return loaiGiaoDich; }
    public void setReferenceType(String referenceType) { this.loaiGiaoDich = referenceType; }

    public String getMaThamChieu() { return maThamChieu; }
    public void setMaThamChieu(String maThamChieu) { this.maThamChieu = maThamChieu; }
    public String getReferenceCode() { return maThamChieu; }
    public void setReferenceCode(String referenceCode) { this.maThamChieu = referenceCode; }

    public String getLoaiDoiTuong() { return loaiDoiTuong; }
    public void setLoaiDoiTuong(String loaiDoiTuong) { this.loaiDoiTuong = loaiDoiTuong; }
    public String getTargetType() { return loaiDoiTuong; }
    public void setTargetType(String targetType) { this.loaiDoiTuong = targetType; }

    public Long getNhaCungCapId() { return nhaCungCapId; }
    public void setNhaCungCapId(Long nhaCungCapId) { this.nhaCungCapId = nhaCungCapId; }
    public Long getSupplierId() { return nhaCungCapId; }
    public void setSupplierId(Long supplierId) { this.nhaCungCapId = supplierId; }

    public Long getKhachHangId() { return khachHangId; }
    public void setKhachHangId(Long khachHangId) { this.khachHangId = khachHangId; }
    public Long getCustomerId() { return khachHangId; }
    public void setCustomerId(Long customerId) { this.khachHangId = customerId; }

    public String getTenKhachHang() { return tenKhachHang; }
    public void setTenKhachHang(String tenKhachHang) { this.tenKhachHang = tenKhachHang; }
    public String getCustomerName() { return tenKhachHang; }
    public void setCustomerName(String customerName) { this.tenKhachHang = customerName; }

    public String getThangNam() { return thangNam; }
    public void setThangNam(String thangNam) { this.thangNam = thangNam; }
    public String getMonthYear() { return thangNam; }
    public void setMonthYear(String monthYear) { this.thangNam = monthYear; }

    public String getLoaiNghiepVu() { return loaiNghiepVu; }
    public void setLoaiNghiepVu(String loaiNghiepVu) { this.loaiNghiepVu = loaiNghiepVu; }
    public String getBusinessAction() { return loaiNghiepVu; }
    public void setBusinessAction(String businessAction) { this.loaiNghiepVu = businessAction; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }
    public String getDescription() { return moTa; }
    public void setDescription(String description) { this.moTa = description; }
    public String getReason() { return moTa; }
    public void setReason(String reason) { this.moTa = reason; }

    public LocalDateTime getNgayGiaoDich() { return ngayGiaoDich; }
    public void setNgayGiaoDich(LocalDateTime ngayGiaoDich) { this.ngayGiaoDich = ngayGiaoDich; }
    public LocalDateTime getTransactionDate() { return ngayGiaoDich; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.ngayGiaoDich = transactionDate; }
}
