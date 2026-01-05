package com.saldoreal.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "projecoes_financeiras")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialProjection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "valor_inicial", nullable = false, precision = 10, scale = 2)
    private BigDecimal initialValue;
    
    @Column(name = "aporte_mensal", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyContribution;
    
    @Column(name = "taxa_juros", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;
    
    @Column(name = "periodo", nullable = false)
    private Integer period;
    
    @Column(name = "valor_futuro", nullable = false, precision = 10, scale = 2)
    private BigDecimal futureValue;
    
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

