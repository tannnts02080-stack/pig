package com.pig.backend.service;

import com.pig.backend.domain.SanPhamHeo;
import com.pig.backend.dto.SanPhamHeoDTO;
import java.util.List;

public interface SanPhamHeoService {
    List<SanPhamHeo> layTatCaSanPham();
    SanPhamHeo layChiTietSanPham(Long id);
    SanPhamHeo themSanPham(SanPhamHeoDTO dto);
    SanPhamHeo capNhatSanPham(Long id, SanPhamHeoDTO dto);
    void xoaSanPham(Long id);
    List<SanPhamHeo> gopSanPham(List<Long> productIds, java.math.BigDecimal giaBanRa, String nhomGopId);
    List<SanPhamHeo> tachSanPham(Long productId, String nhomGopId);
}
