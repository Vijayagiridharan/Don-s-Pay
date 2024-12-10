package com.acs560.dons_pay_backend.service;

import com.acs560.dons_pay_backend.repository.TransactionRepository;
import com.acs560.dons_pay_backend.repository.UserRepository;
import com.acs560.dons_pay_backend.dto.BalanceResponse;
import com.acs560.dons_pay_backend.dto.LoadMoney;
import com.acs560.dons_pay_backend.entity.Transaction;
import com.acs560.dons_pay_backend.entity.User;

import java.math.BigDecimal;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionRepository transactionRepository;

    // Single constructor for dependency injection
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionRepository = transactionRepository;
    }

    public Integer registerUser(String firstName, String lastName, String phoneNumber, String studentId, String email, String encodedPin) {
        User user = new User(firstName, lastName, studentId, email, encodedPin, phoneNumber); // Use encodedPin here
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


    public BalanceResponse getUserBalance(String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found with phone number: " + phoneNumber));

        return new BalanceResponse(user.getDonDollarsBalance(), user.getMealSwipesBalance());
    }

    public List<Transaction> getUserTransactions(String phoneNumber) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found with phone number: " + phoneNumber));
        return transactionRepository.findByUser(user);
    }
    public BigDecimal addMoneyToUserBalance(LoadMoney loadMoney) {
        if (loadMoney.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");}
        // Find the user by studentId
        User user = userRepository.findByStudentId(loadMoney.getStudentId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Add the money to the existing balance
        user.setDonDollarsBalance(user.getDonDollarsBalance().add(loadMoney.getAmount()));

        // Save the updated user
        userRepository.save(user);

        // Return the new balance
        return user.getDonDollarsBalance();
    }
    
    public User findUserByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("User not found with student ID: " + studentId));
    }
    
    public User updateUserProfile(User updatedUser) {
        User existingUser = userRepository.findById(updatedUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + updatedUser.getUserId()));

        // Update user details
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setProfilePictureUrl(updatedUser.getProfilePictureUrl());

        // Save and return updated user
        return userRepository.save(existingUser);
    }
    public boolean updateUserPassword(String studentId, String newPassword) {
        Optional<User> userOptional = userRepository.findByStudentId(studentId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPin(encodedPassword);
            userRepository.save(user);
            return true;
        }
        return false;
    }

}
