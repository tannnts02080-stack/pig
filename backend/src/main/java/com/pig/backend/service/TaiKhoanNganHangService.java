package com.pig.backend.service;

import com.pig.backend.domain.DongTienNganHang;
import com.pig.backend.domain.TaiKhoanNganHang;
import com.pig.backend.dto.TaiKhoanNganHangDTO;
import java.math.BigDecimal;
import java.util.List;

public interface TaiKhoanNganHangService {
    List<TaiKhoanNganHang> layTatCaTaiKhoan();
    TaiKhoanNganHang layChiTietTaiKhoan(Long id);
    TaiKhoanNganHang themTaiKhoan(TaiKhoanNganHangDTO dto);
    TaiKhoanNganHang capNhatTaiKhoan(Long id, TaiKhoanNganHangDTO dto);
    void xoaTaiKhoan(Long id);
    List<DongTienNganHang> layLichSuDongTien(Long taiKhoanId);
    DongTienNganHang ghiNhanDongTienThuCong(Long taiKhoanId, String loaiDongTien, BigDecimal soTien, String lyDo);
    DongTienNganHang ghiNhanDongTienChiTiet(Long taiKhoanId, String loaiDongTien, BigDecimal soTien, String lyDo, String loaiDoiTuong, Long nhaCungCapId, Long khachHangId, String tenKhachHang, String thangNam, String loaiNghiepVu);
    void xoaTatCaDongTien();
    void xoaDongTien(Long id);
}
