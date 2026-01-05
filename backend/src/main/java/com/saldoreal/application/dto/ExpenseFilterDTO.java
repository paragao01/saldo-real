package com.saldoreal.application.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseFilterDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long categoryId;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private String paymentMethod;
    private int page = 0;
    private int size = 20;
    private String sortBy = "date";
    private String sortDir = "desc";
}

