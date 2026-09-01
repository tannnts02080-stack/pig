package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TAI_KHOAN_NGAN_HANG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TaiKhoanNganHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma_ngan_hang", length = 50, nullable = false)
    private String maNganHang;

    @Column(name = "ten_ngan_hang", length = 150, nullable = false)
    private String tenNganHang;

    @Column(name = "so_tai_khoan", length = 50, nullable = false)
    private String soTaiKhoan;

    @Column(name = "chu_tai_khoan", length = 150, nullable = false)
    private String chuTaiKhoan;

    @Column(name = "so_du_hien_tai", precision = 18, scale = 2)
    private BigDecimal soDuHienTai = BigDecimal.ZERO;

    @Column(name = "trang_thai_hoat_dong")
    private Boolean trangThaiHoatDong = true;

    @Column(name = "loai_tai_khoan", length = 50)
    private String loaiTaiKhoan = "NCC"; // 'NCC' hoặc 'NGUOI_NHA'

    @Column(name = "nha_cung_cap_id")
    private Long nhaCungCapId;

    @Column(name = "ten_nguoi_nha", length = 150)
    private String tenNguoiNha; // 'Ba', 'Mẹ', ...

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    public TaiKhoanNganHang() {}

    // Getters and Setters Tiếng Việt & alias để khớp frontend
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaNganHang() { return maNganHang; }
    public void setMaNganHang(String maNganHang) { this.maNganHang = maNganHang; }
    public String getBankCode() { return maNganHang; }
    public void setBankCode(String bankCode) { this.maNganHang = bankCode; }

    public String getTenNganHang() { return tenNganHang; }
    public void setTenNganHang(String tenNganHang) { this.tenNganHang = tenNganHang; }
    public String getBankName() { return tenNganHang; }
    public void setBankName(String bankName) { this.tenNganHang = bankName; }

    public String getSoTaiKhoan() { return soTaiKhoan; }
    public void setSoTaiKhoan(String soTaiKhoan) { this.soTaiKhoan = soTaiKhoan; }
    public String getAccountNumber() { return soTaiKhoan; }
    public void setAccountNumber(String accountNumber) { this.soTaiKhoan = accountNumber; }

    public String getChuTaiKhoan() { return chuTaiKhoan; }
    public void setChuTaiKhoan(String chuTaiKhoan) { this.chuTaiKhoan = chuTaiKhoan; }
    public String getAccountHolder() { return chuTaiKhoan; }
    public void setAccountHolder(String accountHolder) { this.chuTaiKhoan = accountHolder; }

    public BigDecimal getSoDuHienTai() { return soDuHienTai; }
    public void setSoDuHienTai(BigDecimal soDuHienTai) { this.soDuHienTai = soDuHienTai; }
    public BigDecimal getCurrentBalance() { return soDuHienTai; }
    public void setCurrentBalance(BigDecimal currentBalance) { this.soDuHienTai = currentBalance; }

    public Boolean getTrangThaiHoatDong() { return trangThaiHoatDong; }
    public void setTrangThaiHoatDong(Boolean trangThaiHoatDong) { this.trangThaiHoatDong = trangThaiHoatDong; }
    public Boolean getIsActive() { return trangThaiHoatDong; }
    public void setIsActive(Boolean isActive) { this.trangThaiHoatDong = isActive; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public String getLoaiTaiKhoan() { return loaiTaiKhoan; }
    public void setLoaiTaiKhoan(String loaiTaiKhoan) { this.loaiTaiKhoan = loaiTaiKhoan; }
    public String getAccountType() { return loaiTaiKhoan; }
    public void setAccountType(String accountType) { this.loaiTaiKhoan = accountType; }

    public Long getNhaCungCapId() { return nhaCungCapId; }
    public void setNhaCungCapId(Long nhaCungCapId) { this.nhaCungCapId = nhaCungCapId; }
    public Long getSupplierId() { return nhaCungCapId; }
    public void setSupplierId(Long supplierId) { this.nhaCungCapId = supplierId; }

    public String getTenNguoiNha() { return tenNguoiNha; }
    public void setTenNguoiNha(String tenNguoiNha) { this.tenNguoiNha = tenNguoiNha; }
    public String getFamilyMemberName() { return tenNguoiNha; }
    public void setFamilyMemberName(String familyMemberName) { this.tenNguoiNha = familyMemberName; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getCreatedAt() { return ngayTao; }
    public void setCreatedAt(LocalDateTime createdAt) { this.ngayTao = createdAt; }
}
