package com.saldoreal.application.service;

import com.saldoreal.application.dto.DashboardDTO;
import com.saldoreal.domain.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    
    private final ExpenseRepository expenseRepository;
    
    public DashboardService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    
    public DashboardDTO getDashboard(Long userId) {
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();
        
        int previousYear = currentYear;
        int previousMonth = currentMonth - 1;
        if (previousMonth == 0) {
            previousMonth = 12;
            previousYear = currentYear - 1;
        }
        
        BigDecimal totalMesAtual = expenseRepository.getTotalByMonth(userId, currentYear, currentMonth);
        if (totalMesAtual == null) totalMesAtual = BigDecimal.ZERO;
        
        BigDecimal totalMesAnterior = expenseRepository.getTotalByMonth(userId, previousYear, previousMonth);
        if (totalMesAnterior == null) totalMesAnterior = BigDecimal.ZERO;
        
        BigDecimal percentualVariacao = BigDecimal.ZERO;
        if (totalMesAnterior.compareTo(BigDecimal.ZERO) > 0) {
            percentualVariacao = totalMesAtual
                    .subtract(totalMesAnterior)
                    .divide(totalMesAnterior, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }
        
        List<Map<String, Object>> gastosPorCategoria = new ArrayList<>();
        List<Object[]> categoriaData = expenseRepository.getTotalByCategory(userId, currentYear, currentMonth);
        for (Object[] row : categoriaData) {
            Map<String, Object> item = new HashMap<>();
            item.put("categoria", row[0]);
            item.put("total", row[1]);
            gastosPorCategoria.add(item);
        }
        
        LocalDate startDate = LocalDate.of(currentYear, currentMonth, 1);
        LocalDate endDate = now;
        List<Map<String, Object>> gastosPorPeriodo = new ArrayList<>();
        List<Object[]> periodoData = expenseRepository.getTotalByPeriod(userId, startDate, endDate);
        for (Object[] row : periodoData) {
            Map<String, Object> item = new HashMap<>();
            item.put("data", row[0].toString());
            item.put("total", row[1]);
            gastosPorPeriodo.add(item);
        }
        
        return new DashboardDTO(
            totalMesAtual,
            totalMesAnterior,
            percentualVariacao,
            gastosPorCategoria,
            gastosPorPeriodo
        );
    }
}

