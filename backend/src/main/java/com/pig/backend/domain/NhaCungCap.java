package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "NHA_CUNG_CAP")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NhaCungCap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(name = "ma_nha_cung_cap", length = 50, nullable = false, unique = true)
    private String maNhaCungCap;

    @Nationalized
    @Column(name = "ten_nha_cung_cap", length = 255, nullable = false)
    private String tenNhaCungCap;

    @Nationalized
    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;

    @Nationalized
    @Column(name = "dia_chi", length = 500)
    private String diaChi;

    @Nationalized
    @Column(name = "nguoi_lien_he", length = 100)
    private String nguoiLienHe;

    @Column(name = "cong_no_phai_tra", precision = 18, scale = 2)
    private BigDecimal congNoPhaiTra = BigDecimal.ZERO;

    @Nationalized
    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    public NhaCungCap() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaNhaCungCap() { return maNhaCungCap; }
    public void setMaNhaCungCap(String maNhaCungCap) { this.maNhaCungCap = maNhaCungCap; }
    public String getSupplierCode() { return maNhaCungCap; }
    public void setSupplierCode(String supplierCode) { this.maNhaCungCap = supplierCode; }

    public String getTenNhaCungCap() { return tenNhaCungCap; }
    public void setTenNhaCungCap(String tenNhaCungCap) { this.tenNhaCungCap = tenNhaCungCap; }
    public String getSupplierName() { return tenNhaCungCap; }
    public void setSupplierName(String supplierName) { this.tenNhaCungCap = supplierName; }
    public String getName() { return tenNhaCungCap; }
    public void setName(String name) { this.tenNhaCungCap = name; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getPhone() { return soDienThoai; }
    public void setPhone(String phone) { this.soDienThoai = phone; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
    public String getAddress() { return diaChi; }
    public void setAddress(String address) { this.diaChi = address; }

    public String getNguoiLienHe() { return nguoiLienHe; }
    public void setNguoiLienHe(String nguoiLienHe) { this.nguoiLienHe = nguoiLienHe; }
    public String getContactPerson() { return nguoiLienHe; }
    public void setContactPerson(String contactPerson) { this.nguoiLienHe = contactPerson; }

    public BigDecimal getCongNoPhaiTra() { return congNoPhaiTra; }
    public void setCongNoPhaiTra(BigDecimal congNoPhaiTra) { this.congNoPhaiTra = congNoPhaiTra; }
    public BigDecimal getDebt() { return congNoPhaiTra; }
    public void setDebt(BigDecimal debt) { this.congNoPhaiTra = debt; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}
