package com.pig.backend.repository;

import com.pig.backend.domain.SizeConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeConfigRepository extends JpaRepository<SizeConfig, Long> {
}
