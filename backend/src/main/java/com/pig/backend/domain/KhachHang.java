package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "KHACH_HANG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(name = "ten_khach_hang", length = 255, nullable = false)
    private String tenKhachHang;

    @Nationalized
    @Column(name = "so_dien_thoai", length = 20)
    private String soDienThoai;

    @Nationalized
    @Column(name = "dia_chi", length = 500)
    private String diaChi;

    @Column(name = "cong_no_hien_tai", precision = 18, scale = 2)
    private BigDecimal congNoHienTai = BigDecimal.ZERO;

    @Nationalized
    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    public KhachHang() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenKhachHang() { return tenKhachHang; }
    public void setTenKhachHang(String tenKhachHang) { this.tenKhachHang = tenKhachHang; }
    public String getCustomerName() { return tenKhachHang; }
    public void setCustomerName(String customerName) { this.tenKhachHang = customerName; }
    public String getName() { return tenKhachHang; }
    public void setName(String name) { this.tenKhachHang = name; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getPhone() { return soDienThoai; }
    public void setPhone(String phone) { this.soDienThoai = phone; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
    public String getAddress() { return diaChi; }
    public void setAddress(String address) { this.diaChi = address; }

    public BigDecimal getCongNoHienTai() { return congNoHienTai; }
    public void setCongNoHienTai(BigDecimal congNoHienTai) { this.congNoHienTai = congNoHienTai; }
    public BigDecimal getDebt() { return congNoHienTai; }
    public void setDebt(BigDecimal debt) { this.congNoHienTai = debt; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public String getNotes() { return ghiChu; }
    public void setNotes(String notes) { this.ghiChu = notes; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}
