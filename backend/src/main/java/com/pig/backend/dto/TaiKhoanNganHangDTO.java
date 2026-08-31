package com.pig.backend.dto;

import java.math.BigDecimal;

public class TaiKhoanNganHangDTO {
    private Long id;
    private String maNganHang;
    private String tenNganHang;
    private String soTaiKhoan;
    private String chuTaiKhoan;
    private BigDecimal soDuHienTai;
    private Boolean trangThaiHoatDong;
    private String loaiTaiKhoan;
    private Long nhaCungCapId;
    private String tenNguoiNha;
    private String ghiChu;

    public TaiKhoanNganHangDTO() {}

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
}
