package com.saldoreal.application.service;

import com.saldoreal.application.dto.CategoryDTO;
import com.saldoreal.domain.model.Category;
import com.saldoreal.domain.model.User;
import com.saldoreal.domain.repository.CategoryRepository;
import com.saldoreal.domain.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    public CategoryService(CategoryRepository categoryRepository,
                          UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public CategoryDTO create(CategoryDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Category category = new Category();
        category.setName(dto.getName());
        category.setMonthlyLimit(dto.getMonthlyLimit());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        category.setUser(user);
        
        category = categoryRepository.save(category);
        return toDTO(category);
    }
    
    @Transactional
    public CategoryDTO update(Long id, CategoryDTO dto, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        if (!category.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        category.setName(dto.getName());
        category.setMonthlyLimit(dto.getMonthlyLimit());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        
        category = categoryRepository.save(category);
        return toDTO(category);
    }
    
    @Transactional
    public void delete(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        if (!category.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        categoryRepository.delete(category);
    }
    
    public List<CategoryDTO> findAll(Long userId) {
        return categoryRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO findById(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        if (!category.getUser().getId().equals(userId)) {
            throw new RuntimeException("Acesso negado");
        }
        
        return toDTO(category);
    }
    
    private CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setMonthlyLimit(category.getMonthlyLimit());
        dto.setColor(category.getColor());
        dto.setIcon(category.getIcon());
        return dto;
    }
}

