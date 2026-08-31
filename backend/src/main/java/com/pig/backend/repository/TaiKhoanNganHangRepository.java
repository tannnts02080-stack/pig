package com.pig.backend.repository;

import com.pig.backend.domain.TaiKhoanNganHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaiKhoanNganHangRepository extends JpaRepository<TaiKhoanNganHang, Long> {
}
