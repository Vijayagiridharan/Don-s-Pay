package com.acs560.dons_pay_backend.controller;

import java.util.Map;

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
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public AuthController(UserService userService, AuthService authService, 
                         PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.userService = userService;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    /**
     * Endpoint for user registration.
     *
     * @param request contains user registration details
     * @return success message
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Generate a proper BCrypt hash
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            System.out.println("Generated hash: " + encodedPassword); // Debug print

            userService.registerUser(
                request.getName(),
                request.getStudentId(),
                request.getEmail(),
                request.getPassword()
            );
            return ResponseEntity.ok("User registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Endpoint for user login.
     *
     * @param request contains user login credentials
     * @return success message or error message
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
    
 // Debug endpoint to check stored password
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
