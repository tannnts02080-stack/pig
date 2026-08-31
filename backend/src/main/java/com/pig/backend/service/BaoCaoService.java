package com.pig.backend.service;

import com.pig.backend.dto.BaoCaoDashboardDTO;
import com.pig.backend.dto.TongKetNhapTrongNgayDTO;
import java.time.LocalDate;

public interface BaoCaoService {
    BaoCaoDashboardDTO layBaoCaoDashboard(String loaiBoLoc, LocalDate ngay, Integer thang, Integer nam);
    TongKetNhapTrongNgayDTO layTongKetNhapTrongNgay(LocalDate ngay);
}
