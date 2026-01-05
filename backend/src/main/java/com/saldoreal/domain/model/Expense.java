package com.saldoreal.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "despesas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "data", nullable = false)
    private LocalDate date;
    
    @Column(name = "descricao", nullable = false, length = 255)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Category category;
    
    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "forma_pagamento", length = 50)
    private String paymentMethod;
    
    @Column(name = "codigo_barras", length = 100)
    private String barcode;
    
    @Column(name = "recorrente", nullable = false)
    private Boolean recurring = false;
    
    @Column(name = "observacoes", length = 500)
    private String observations;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;
    
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

