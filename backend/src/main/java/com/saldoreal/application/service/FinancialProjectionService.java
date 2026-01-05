package com.saldoreal.application.service;

import com.saldoreal.application.dto.FinancialProjectionDTO;
import com.saldoreal.domain.model.FinancialProjection;
import com.saldoreal.domain.model.User;
import com.saldoreal.domain.repository.FinancialProjectionRepository;
import com.saldoreal.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinancialProjectionService {
    
    private final FinancialProjectionRepository projectionRepository;
    private final UserRepository userRepository;
    
    public FinancialProjectionService(FinancialProjectionRepository projectionRepository,
                                     UserRepository userRepository) {
        this.projectionRepository = projectionRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public FinancialProjectionDTO create(FinancialProjectionDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        BigDecimal futureValue = calculateFutureValue(
            dto.getInitialValue(),
            dto.getMonthlyContribution(),
            dto.getInterestRate(),
            dto.getPeriod()
        );
        
        FinancialProjection projection = new FinancialProjection();
        projection.setInitialValue(dto.getInitialValue());
        projection.setMonthlyContribution(dto.getMonthlyContribution());
        projection.setInterestRate(dto.getInterestRate());
        projection.setPeriod(dto.getPeriod());
        projection.setFutureValue(futureValue);
        projection.setUser(user);
        
        projection = projectionRepository.save(projection);
        return toDTO(projection);
    }
    
    public List<FinancialProjectionDTO> findAll(Long userId) {
        return projectionRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public FinancialProjectionDTO findById(Long id, Long userId) {
        FinancialProjection projection = projectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeção não encontrada"));
        
        if (!projection.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        return toDTO(projection);
    }
    
    @Transactional
    public void delete(Long id, Long userId) {
        FinancialProjection projection = projectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeção não encontrada"));
        
        if (!projection.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        projectionRepository.delete(projection);
    }
    
    public BigDecimal calculateFutureValue(BigDecimal initialValue, 
                                          BigDecimal monthlyContribution,
                                          BigDecimal interestRate,
                                          Integer period) {
        BigDecimal monthlyRate = interestRate.divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP)
                .divide(new BigDecimal("12"), 6, RoundingMode.HALF_UP);
        
        BigDecimal futureValue = initialValue;
        for (int i = 0; i < period; i++) {
            futureValue = futureValue.multiply(BigDecimal.ONE.add(monthlyRate))
                    .add(monthlyContribution);
        }
        
        return futureValue.setScale(2, RoundingMode.HALF_UP);
    }
    
    private FinancialProjectionDTO toDTO(FinancialProjection projection) {
        FinancialProjectionDTO dto = new FinancialProjectionDTO();
        dto.setId(projection.getId());
        dto.setInitialValue(projection.getInitialValue());
        dto.setMonthlyContribution(projection.getMonthlyContribution());
        dto.setInterestRate(projection.getInterestRate());
        dto.setPeriod(projection.getPeriod());
        dto.setFutureValue(projection.getFutureValue());
        return dto;
    }
}

