package com.saldoreal.domain.repository;

import com.saldoreal.domain.model.FinancialProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialProjectionRepository extends JpaRepository<FinancialProjection, Long> {
    List<FinancialProjection> findByUserId(Long userId);
}

