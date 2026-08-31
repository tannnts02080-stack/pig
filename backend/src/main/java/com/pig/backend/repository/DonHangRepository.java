package com.pig.backend.repository;

import com.pig.backend.domain.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Long> {
    List<DonHang> findAllByOrderByNgayDatHangDesc();
    void deleteByNgayDatHangBefore(java.time.LocalDateTime cutoffDate);
}
