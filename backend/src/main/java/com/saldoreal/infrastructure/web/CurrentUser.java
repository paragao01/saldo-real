package com.saldoreal.infrastructure.web;

import com.saldoreal.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {
    
    private final JwtTokenProvider tokenProvider;
    
    public CurrentUser(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    
    public Long getUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return null;
    }
}

