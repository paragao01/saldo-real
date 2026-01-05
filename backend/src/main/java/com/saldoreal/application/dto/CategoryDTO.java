package com.saldoreal.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CategoryDTO {
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    private String name;
    
    private BigDecimal monthlyLimit;
    private String color;
    private String icon;
}

