package com.saldoreal.infrastructure.web.controller;

import com.saldoreal.application.dto.ExpenseDTO;
import com.saldoreal.application.dto.ExpenseFilterDTO;
import com.saldoreal.application.service.ExpenseService;
import com.saldoreal.infrastructure.web.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    
    private final ExpenseService expenseService;
    private final CurrentUser currentUser;
    
    public ExpenseController(ExpenseService expenseService, CurrentUser currentUser) {
        this.expenseService = expenseService;
        this.currentUser = currentUser;
    }
    
    @PostMapping
    public ResponseEntity<ExpenseDTO> create(@Valid @RequestBody ExpenseDTO dto, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        ExpenseDTO created = expenseService.create(dto, userId);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> update(@PathVariable Long id, 
                                            @Valid @RequestBody ExpenseDTO dto,
                                            HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        ExpenseDTO updated = expenseService.update(id, dto, userId);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        expenseService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<Page<ExpenseDTO>> findAll(ExpenseFilterDTO filter, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        Page<ExpenseDTO> expenses = expenseService.findAll(filter, userId);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> findById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        ExpenseDTO expense = expenseService.findById(id, userId);
        return ResponseEntity.ok(expense);
    }
    
    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotal(ExpenseFilterDTO filter, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        BigDecimal total = expenseService.getTotal(filter, userId);
        return ResponseEntity.ok(total);
    }
}

