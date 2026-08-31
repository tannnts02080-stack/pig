package com.pig.backend.repository;

import com.pig.backend.domain.DongTienNganHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DongTienNganHangRepository extends JpaRepository<DongTienNganHang, Long> {
    List<DongTienNganHang> findByTaiKhoanNganHangIdOrderByNgayGiaoDichDesc(Long taiKhoanId);
    List<DongTienNganHang> findAllByOrderByNgayGiaoDichDesc();
    List<DongTienNganHang> findByMaThamChieu(String maThamChieu);
    void deleteByNgayGiaoDichBefore(java.time.LocalDateTime cutoffDate);
}
