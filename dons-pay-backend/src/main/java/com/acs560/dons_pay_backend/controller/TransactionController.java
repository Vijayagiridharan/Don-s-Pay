package com.acs560.dons_pay_backend.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.acs560.dons_pay_backend.dto.SendMoneyRequest;
import com.acs560.dons_pay_backend.exception.InsufficientBalanceException;
import com.acs560.dons_pay_backend.service.TransactionService;
import com.acs560.dons_pay_backend.service.UserService;
import com.acs560.dons_pay_backend.dto.LoadMoney;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/sendMoney")
    public ResponseEntity<String> sendMoney(@RequestBody SendMoneyRequest sendMoneyRequest) {
        try {
            String response = transactionService.processTransaction(sendMoneyRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (InsufficientBalanceException e) {
            return new ResponseEntity<>("Insufficient balance", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while processing the transaction", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
    @PostMapping("/addMoney")
    public ResponseEntity<BigDecimal> addMoney(@RequestBody LoadMoney loadMoneyRequest) {
        try {
            BigDecimal newBalance = userService.addMoneyToUserBalance(loadMoneyRequest);
            return new ResponseEntity<>(newBalance, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    }
