package com.saldoreal.infrastructure.web.controller;

import com.saldoreal.application.dto.DashboardDTO;
import com.saldoreal.application.service.DashboardService;
import com.saldoreal.infrastructure.web.CurrentUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final DashboardService dashboardService;
    private final CurrentUser currentUser;
    
    public DashboardController(DashboardService dashboardService, CurrentUser currentUser) {
        this.dashboardService = dashboardService;
        this.currentUser = currentUser;
    }
    
    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboard(HttpServletRequest request) {
        Long userId = currentUser.getUserId(request);
        DashboardDTO dashboard = dashboardService.getDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }
}

