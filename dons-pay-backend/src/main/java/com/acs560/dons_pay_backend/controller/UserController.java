package com.acs560.dons_pay_backend.controller;

import com.acs560.dons_pay_backend.dto.BalanceResponse;
import com.acs560.dons_pay_backend.entity.Transaction;
import com.acs560.dons_pay_backend.entity.User;
import com.acs560.dons_pay_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/balance")
    public ResponseEntity<BalanceResponse> getUserBalance(@RequestParam String phoneNumber) {
        try {
             BalanceResponse balance = userService.getUserBalance(phoneNumber);
            return ResponseEntity.ok().body(balance);
        } catch (Exception e) {
             return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getUserTransactions(@RequestParam String phoneNumber) {
        try {
            List<Transaction> transactions = userService.getUserTransactions(phoneNumber);
            return ResponseEntity.ok().body(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/getProfile")
    public ResponseEntity<?> getProfile(@RequestParam String studentId) {
        try {
            User user = userService.findUserByStudentId(studentId);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }
    @PutMapping("/updateProfile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        try {
            User user = userService.updateUserProfile(updatedUser);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
}
