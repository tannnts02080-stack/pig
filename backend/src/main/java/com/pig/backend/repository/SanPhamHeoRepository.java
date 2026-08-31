package com.pig.backend.repository;

import com.pig.backend.domain.SanPhamHeo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SanPhamHeoRepository extends JpaRepository<SanPhamHeo, Long> {
    List<SanPhamHeo> findByLoaiHeo(String loaiHeo);
    Optional<SanPhamHeo> findFirstByLoaiSize(String loaiSize);
}
