package com.pig.backend.service;

import com.pig.backend.domain.PhieuNhapKho;
import com.pig.backend.dto.TaoPhieuNhapRequest;
import java.util.List;

public interface PhieuNhapKhoService {
    List<PhieuNhapKho> layTatCaPhieuNhap();
    PhieuNhapKho taoPhieuNhap(TaoPhieuNhapRequest request);
    PhieuNhapKho capNhatPhieuNhap(Long id, TaoPhieuNhapRequest request);
    void xoaPhieuNhap(Long id);
}
