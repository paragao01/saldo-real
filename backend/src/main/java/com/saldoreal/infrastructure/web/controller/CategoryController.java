package com.saldoreal.infrastructure.web.controller;

import com.saldoreal.application.dto.CategoryDTO;
import com.saldoreal.application.service.CategoryService;
import com.saldoreal.infrastructure.web.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final CategoryService categoryService;
    private final CurrentUser currentUser;
    
    public CategoryController(CategoryService categoryService, CurrentUser currentUser) {
        this.categoryService = categoryService;
        this.currentUser = currentUser;
    }
    
    @PostMapping
    public ResponseEntity<CategoryDTO> create(@Valid @RequestBody CategoryDTO dto, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        CategoryDTO created = categoryService.create(dto, userId);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> update(@PathVariable Long id,
                                            @Valid @RequestBody CategoryDTO dto,
                                            HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        CategoryDTO updated = categoryService.update(id, dto, userId);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        categoryService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> findAll(HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        List<CategoryDTO> categories = categoryService.findAll(userId);
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> findById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        CategoryDTO category = categoryService.findById(id, userId);
        return ResponseEntity.ok(category);
    }
}

