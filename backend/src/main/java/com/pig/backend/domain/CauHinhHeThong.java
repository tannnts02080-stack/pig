package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "CAU_HINH_HE_THONG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CauHinhHeThong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_cua_hang", length = 255, nullable = false)
    private String tenCuaHang;

    @Column(name = "khau_hieu", length = 500)
    private String khauHieu;

    @Column(name = "so_dien_thoai", length = 50)
    private String soDienThoai;

    @Column(name = "dia_chi", length = 500)
    private String diaChi;

    @Column(name = "don_vi_tien_te", length = 20)
    private String donViTienTe = "VNĐ";

    public CauHinhHeThong() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenCuaHang() { return tenCuaHang; }
    public void setTenCuaHang(String tenCuaHang) { this.tenCuaHang = tenCuaHang; }
    public String getShopName() { return tenCuaHang; }
    public void setShopName(String shopName) { this.tenCuaHang = shopName; }

    public String getKhauHieu() { return khauHieu; }
    public void setKhauHieu(String khauHieu) { this.khauHieu = khauHieu; }
    public String getShopTagline() { return khauHieu; }
    public void setShopTagline(String shopTagline) { this.khauHieu = shopTagline; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getPhone() { return soDienThoai; }
    public void setPhone(String phone) { this.soDienThoai = phone; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }
    public String getAddress() { return diaChi; }
    public void setAddress(String address) { this.diaChi = address; }

    public String getDonViTienTe() { return donViTienTe; }
    public void setDonViTienTe(String donViTienTe) { this.donViTienTe = donViTienTe; }
    public String getCurrency() { return donViTienTe; }
    public void setCurrency(String currency) { this.donViTienTe = currency; }
}
