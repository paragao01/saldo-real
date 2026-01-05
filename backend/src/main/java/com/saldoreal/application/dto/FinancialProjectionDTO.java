package com.saldoreal.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FinancialProjectionDTO {
    private Long id;
    
    @NotNull(message = "Valor inicial é obrigatório")
    @DecimalMin(value = "0.0", message = "Valor inicial deve ser maior ou igual a zero")
    private BigDecimal initialValue;
    
    @NotNull(message = "Aporte mensal é obrigatório")
    @DecimalMin(value = "0.0", message = "Aporte mensal deve ser maior ou igual a zero")
    private BigDecimal monthlyContribution;
    
    @NotNull(message = "Taxa de juros é obrigatória")
    @DecimalMin(value = "0.0", message = "Taxa de juros deve ser maior ou igual a zero")
    private BigDecimal interestRate;
    
    @NotNull(message = "Período é obrigatório")
    @Min(value = 1, message = "Período deve ser maior que zero")
    private Integer period;
    
    private BigDecimal futureValue;
}

