package com.saldoreal.infrastructure.web.controller;

import com.saldoreal.application.dto.FinancialProjectionDTO;
import com.saldoreal.application.service.FinancialProjectionService;
import com.saldoreal.infrastructure.web.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/projections")
@CrossOrigin(origins = "*")
public class FinancialProjectionController {
    
    private final FinancialProjectionService projectionService;
    private final CurrentUser currentUser;
    
    public FinancialProjectionController(FinancialProjectionService projectionService, CurrentUser currentUser) {
        this.projectionService = projectionService;
        this.currentUser = currentUser;
    }
    
    @PostMapping
    public ResponseEntity<FinancialProjectionDTO> create(@Valid @RequestBody FinancialProjectionDTO dto,
                                                        HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        FinancialProjectionDTO created = projectionService.create(dto, userId);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping
    public ResponseEntity<List<FinancialProjectionDTO>> findAll(HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        List<FinancialProjectionDTO> projections = projectionService.findAll(userId);
        return ResponseEntity.ok(projections);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FinancialProjectionDTO> findById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        FinancialProjectionDTO projection = projectionService.findById(id, userId);
        return ResponseEntity.ok(projection);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        projectionService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/calculate")
    public ResponseEntity<FinancialProjectionDTO> calculate(@Valid @RequestBody FinancialProjectionDTO dto) {
        FinancialProjectionDTO result = new FinancialProjectionDTO();
        result.setInitialValue(dto.getInitialValue());
        result.setMonthlyContribution(dto.getMonthlyContribution());
        result.setInterestRate(dto.getInterestRate());
        result.setPeriod(dto.getPeriod());
        
        BigDecimal futureValue = projectionService.calculateFutureValue(
            dto.getInitialValue(),
            dto.getMonthlyContribution(),
            dto.getInterestRate(),
            dto.getPeriod()
        );
        result.setFutureValue(futureValue);
        
        return ResponseEntity.ok(result);
    }
}

