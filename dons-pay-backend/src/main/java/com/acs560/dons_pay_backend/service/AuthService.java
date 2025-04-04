package com.acs560.dons_pay_backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.acs560.dons_pay_backend.repository.UserRepository;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    public String login(String studentId, String pin) {
        try {
            logger.debug("Starting login process for user: {}", studentId);
            
            // Check if user exists
            var userOptional = userRepository.findByStudentId(studentId);
            if (userOptional.isEmpty()) {
                logger.debug("User not found with studentId: {}", studentId);
                throw new AuthenticationException("User not found") {};
            }
            
            logger.debug("User found, attempting authentication");
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(studentId, pin)
            );
            
            if (authentication.isAuthenticated()) {
                logger.debug("Authentication successful for user: {}", studentId);
                return "Login successful for user: " + authentication.getName();
            } else {
                logger.debug("Authentication failed - not authenticated");
                throw new AuthenticationException("Authentication failed") {};
            }
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for user: {}. Error: {}", studentId, e.getMessage());
            throw new AuthenticationException("Invalid credentials: " + e.getMessage()) {};
        }
    }
}