package com.saldoreal.domain.repository;

import com.saldoreal.domain.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    Page<Expense> findByUserId(Long userId, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId " +
           "AND (:startDate IS NULL OR e.date >= :startDate) " +
           "AND (:endDate IS NULL OR e.date <= :endDate) " +
           "AND (:categoryId IS NULL OR e.category.id = :categoryId) " +
           "AND (:minAmount IS NULL OR e.amount >= :minAmount) " +
           "AND (:maxAmount IS NULL OR e.amount <= :maxAmount) " +
           "AND (:paymentMethod IS NULL OR e.paymentMethod = :paymentMethod)")
    Page<Expense> findWithFilters(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("categoryId") Long categoryId,
        @Param("minAmount") java.math.BigDecimal minAmount,
        @Param("maxAmount") java.math.BigDecimal maxAmount,
        @Param("paymentMethod") String paymentMethod,
        Pageable pageable
    );
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId " +
           "AND YEAR(e.date) = :year AND MONTH(e.date) = :month")
    java.math.BigDecimal getTotalByMonth(@Param("userId") Long userId, 
                                         @Param("year") int year, 
                                         @Param("month") int month);
    
    @Query("SELECT e.category.name, SUM(e.amount) FROM Expense e " +
           "WHERE e.user.id = :userId AND YEAR(e.date) = :year AND MONTH(e.date) = :month " +
           "GROUP BY e.category.name")
    List<Object[]> getTotalByCategory(@Param("userId") Long userId, 
                                      @Param("year") int year, 
                                      @Param("month") int month);
    
    @Query("SELECT e.date, SUM(e.amount) FROM Expense e " +
           "WHERE e.user.id = :userId AND e.date >= :startDate AND e.date <= :endDate " +
           "GROUP BY e.date ORDER BY e.date")
    List<Object[]> getTotalByPeriod(@Param("userId") Long userId,
                                    @Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);
}

