package com.acs560.dons_pay_backend.service;

import com.acs560.dons_pay_backend.repository.UserRepository;
import com.acs560.dons_pay_backend.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(String firstName, String lastName, String phoneNumber, String pin, String email, String studentId, String password) {
        // Hash the password
        String encodedPassword = passwordEncoder.encode(password);
        
        // Create a new user with the updated constructor
        User user = new User(firstName, lastName, phoneNumber, pin, email, studentId, encodedPassword);
        
        // Save the user in the repository
        userRepository.save(user);
    }

    public boolean authenticateUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Match raw password with encoded password
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
