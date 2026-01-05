package com.saldoreal.application.service;

import com.saldoreal.application.dto.ExpenseDTO;
import com.saldoreal.application.dto.ExpenseFilterDTO;
import com.saldoreal.domain.model.Category;
import com.saldoreal.domain.model.Expense;
import com.saldoreal.domain.model.User;
import com.saldoreal.domain.repository.CategoryRepository;
import com.saldoreal.domain.repository.ExpenseRepository;
import com.saldoreal.domain.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    public ExpenseService(ExpenseRepository expenseRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public ExpenseDTO create(ExpenseDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        Expense expense = new Expense();
        expense.setDate(dto.getDate());
        expense.setDescription(dto.getDescription());
        expense.setCategory(category);
        expense.setAmount(dto.getAmount());
        expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setBarcode(dto.getBarcode());
        expense.setRecurring(dto.getRecurring() != null ? dto.getRecurring() : false);
        expense.setObservations(dto.getObservations());
        expense.setUser(user);
        
        expense = expenseRepository.save(expense);
        return toDTO(expense);
    }
    
    @Transactional
    public ExpenseDTO update(Long id, ExpenseDTO dto, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
        
        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        expense.setDate(dto.getDate());
        expense.setDescription(dto.getDescription());
        expense.setCategory(category);
        expense.setAmount(dto.getAmount());
        expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setBarcode(dto.getBarcode());
        expense.setRecurring(dto.getRecurring() != null ? dto.getRecurring() : false);
        expense.setObservations(dto.getObservations());
        
        expense = expenseRepository.save(expense);
        return toDTO(expense);
    }
    
    @Transactional
    public void delete(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
        
        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        expenseRepository.delete(expense);
    }
    
    public Page<ExpenseDTO> findAll(ExpenseFilterDTO filter, Long userId) {
        Sort sort = Sort.by(
            "desc".equalsIgnoreCase(filter.getSortDir()) 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC,
            filter.getSortBy()
        );
        
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        
        Page<Expense> expenses = expenseRepository.findWithFilters(
            userId,
            filter.getStartDate(),
            filter.getEndDate(),
            filter.getCategoryId(),
            filter.getMinAmount(),
            filter.getMaxAmount(),
            filter.getPaymentMethod(),
            pageable
        );
        
        return expenses.map(this::toDTO);
    }
    
    public ExpenseDTO findById(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));
        
        if (!expense.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        return toDTO(expense);
    }
    
    public BigDecimal getTotal(ExpenseFilterDTO filter, Long userId) {
        Page<ExpenseDTO> expenses = findAll(filter, userId);
        return expenses.getContent().stream()
                .map(ExpenseDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private ExpenseDTO toDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setDate(expense.getDate());
        dto.setDescription(expense.getDescription());
        dto.setCategoryId(expense.getCategory().getId());
        dto.setAmount(expense.getAmount());
        dto.setPaymentMethod(expense.getPaymentMethod());
        dto.setBarcode(expense.getBarcode());
        dto.setRecurring(expense.getRecurring());
        dto.setObservations(expense.getObservations());
        return dto;
    }
}

