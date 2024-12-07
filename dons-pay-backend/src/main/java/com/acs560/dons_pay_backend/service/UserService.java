package com.acs560.dons_pay_backend.service;

import com.acs560.dons_pay_backend.repository.UserRepository;
import com.acs560.dons_pay_backend.entity.User;

import java.math.BigDecimal;

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

    public Integer registerUser(String firstName, String lastName, String phoneNumber , String studentId, String email, String pin) {
        String encodedPin = passwordEncoder.encode(pin); // Hash the password
        User user = new User(firstName, lastName, studentId, email, pin, phoneNumber);
        userRepository.save(user);
        return user.getUserId();
        }

    public boolean authenticateUser(String studentId, String rawPin) {
        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return passwordEncoder.matches(rawPin, user.getPin());
    }
    
    public BigDecimal addMoneyToUserBalance(String studentId, BigDecimal amount) {
        // Find the user by studentId
        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Add the money to the existing balance
        user.setDonDollarsBalance(user.getDonDollarsBalance().add(amount));

        // Save the updated user
        userRepository.save(user);

        // Return the new balance
        return user.getDonDollarsBalance();
    }
}
