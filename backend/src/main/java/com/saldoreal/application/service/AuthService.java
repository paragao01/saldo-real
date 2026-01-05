package com.saldoreal.application.service;

import com.saldoreal.application.dto.AuthRequest;
import com.saldoreal.application.dto.AuthResponse;
import com.saldoreal.application.dto.RegisterRequest;
import com.saldoreal.domain.model.User;
import com.saldoreal.domain.repository.UserRepository;
import com.saldoreal.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    
    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      JwtTokenProvider tokenProvider,
                      AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        
        user = userRepository.save(user);
        
        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getId());
    }
    
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getId());
    }
}

