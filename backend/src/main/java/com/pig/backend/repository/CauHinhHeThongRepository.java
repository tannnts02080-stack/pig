package com.pig.backend.repository;

import com.pig.backend.domain.CauHinhHeThong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CauHinhHeThongRepository extends JpaRepository<CauHinhHeThong, Long> {
}
