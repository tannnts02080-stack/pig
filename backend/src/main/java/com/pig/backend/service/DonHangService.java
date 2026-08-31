package com.pig.backend.service;

import com.pig.backend.domain.DonHang;
import com.pig.backend.dto.TaoDonHangRequest;
import com.pig.backend.dto.TraHangRequest;
import java.util.List;

public interface DonHangService {
    List<DonHang> layTatCaDonHang();
    DonHang layChiTietDonHang(Long id);
    DonHang taoDonHang(TaoDonHangRequest request);
    DonHang traHang(Long id, TraHangRequest request);
    void huyDonHang(Long id);
}
