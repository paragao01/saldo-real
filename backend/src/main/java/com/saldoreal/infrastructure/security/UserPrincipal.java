package com.saldoreal.infrastructure.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserPrincipal {
    
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            String email = ((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal()).getUsername();
            // Em uma implementação real, você buscaria o ID do usuário pelo email
            // Por enquanto, vamos usar o token JWT para obter o ID
            return null; // Será obtido via JWT
        }
        return null;
    }
}

