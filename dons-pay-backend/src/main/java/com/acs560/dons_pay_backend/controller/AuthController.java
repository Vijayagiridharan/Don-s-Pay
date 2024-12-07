package com.acs560.dons_pay_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.acs560.dons_pay_backend.dto.LoginRequest;
import com.acs560.dons_pay_backend.dto.RegisterRequest;
import com.acs560.dons_pay_backend.entity.User;
import com.acs560.dons_pay_backend.repository.UserRepository;
import com.acs560.dons_pay_backend.service.AuthService;
import com.acs560.dons_pay_backend.service.UserService;
import com.acs560.dons_pay_backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, AuthService authService, 
                          PasswordEncoder passwordEncoder, UserRepository userRepository, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Endpoint for user registration.
     * @param request contains user registration details
     * @return ResponseEntity with a success or error message
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Encode PIN before saving
            String encodedPin = passwordEncoder.encode(request.getPin());
            
            // Log the raw and encoded pins for verification
            System.out.println("Raw PIN during registration: " + request.getPin());
            System.out.println("Encoded PIN during registration: " + encodedPin);

            Integer userId = userService.registerUser(
                request.getFirstName(), 
                request.getLastName(),
                request.getPhoneNumber(), 
                request.getStudentId(),
                request.getEmail(), 
                encodedPin  // Use encoded PIN
            );
            return ResponseEntity.ok("User registered successfully with user id :  " + userId );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Endpoint for user login.
     * @param request contains user login credentials
     * @return ResponseEntity with a JWT token or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByStudentId(request.getStudentId());
            if (userOptional.isEmpty()) {
                // Log the specific student ID that wasn't found
                System.out.println("No user found with studentId: " + request.getStudentId());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            User user = userOptional.get();

            // Detailed debugging logs
            System.out.println("Stored PIN hash: " + user.getPin());
            System.out.println("Provided PIN: " + request.getPin());

            // Use matches method for secure password comparison
            boolean isPasswordMatch = passwordEncoder.matches(request.getPin(), user.getPin());
            
            System.out.println("Password match result: " + isPasswordMatch);

            if (!isPasswordMatch) {
                System.out.println("Password verification failed for studentId: " + user.getStudentId());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getStudentId());
            return ResponseEntity.ok(Map.of("message", "Login successful", "token", token, user.getFirstName(), user.getStudentId()));
        } catch (Exception e) {
            // Log the full exception for more detailed error tracking
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + e.getMessage());
        }
    }


}
