package com.acs560.dons_pay_backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.acs560.dons_pay_backend.dto.LoginRequest;
import com.acs560.dons_pay_backend.dto.RegisterRequest;
import com.acs560.dons_pay_backend.repository.UserRepository;
import com.acs560.dons_pay_backend.service.AuthService;
import com.acs560.dons_pay_backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor for dependency injection
    public AuthController(UserService userService, AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Endpoint for user registration.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        userService.registerUser(
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhoneNumber(),
                registerRequest.getPin(),
                registerRequest.getEmail(),
                registerRequest.getStudentId(),
                registerRequest.getPassword()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    /**
     * Endpoint for user login.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Debug prints
            System.out.println("Login attempt for email: " + request.getEmail());
            userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                System.out.println("Stored password hash: " + user.getPassword());
                System.out.println("Password match result: " +
                        passwordEncoder.matches(request.getPassword(), user.getPassword()));
            });

            String message = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok().body(message);
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    /**
     * Debug endpoint to check stored user data.
     */
    @GetMapping("/debug/user/{email}")
    public ResponseEntity<?> debugUser(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(Map.of(
                        "email", user.getEmail(),
                        "passwordHash", user.getPassword(),
                        "hashLength", user.getPassword().length()
                )))
                .orElse(ResponseEntity.notFound().build());
    }
}
