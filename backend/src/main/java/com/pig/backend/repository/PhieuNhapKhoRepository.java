package com.pig.backend.repository;

import com.pig.backend.domain.PhieuNhapKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhieuNhapKhoRepository extends JpaRepository<PhieuNhapKho, Long> {
    List<PhieuNhapKho> findAllByOrderByNgayNhapKhoDesc();
    List<PhieuNhapKho> findByNgayNhapKho(LocalDate ngayNhapKho);
    void deleteByNgayNhapKhoBefore(LocalDate cutoffDate);
}
