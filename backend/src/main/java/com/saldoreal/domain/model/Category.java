package com.saldoreal.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nome", nullable = false)
    private String name;
    
    @Column(name = "limite_mensal", precision = 10, scale = 2)
    private BigDecimal monthlyLimit;
    
    @Column(name = "cor", length = 7)
    private String color;
    
    @Column(name = "icone", length = 50)
    private String icon;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User user;
}

