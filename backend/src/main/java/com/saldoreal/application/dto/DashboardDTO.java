package com.saldoreal.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private BigDecimal totalMesAtual;
    private BigDecimal totalMesAnterior;
    private BigDecimal percentualVariacao;
    private List<Map<String, Object>> gastosPorCategoria;
    private List<Map<String, Object>> gastosPorPeriodo;
}

