package com.saldoreal.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseDTO {
    private Long id;
    
    @NotNull(message = "Data é obrigatória")
    private LocalDate date;
    
    @NotBlank(message = "Descrição é obrigatória")
    private String description;
    
    @NotNull(message = "Categoria é obrigatória")
    private Long categoryId;
    
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal amount;
    
    private String paymentMethod;
    private String barcode;
    private Boolean recurring = false;
    private String observations;
}

