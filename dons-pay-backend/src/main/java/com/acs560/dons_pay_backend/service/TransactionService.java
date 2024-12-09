package com.acs560.dons_pay_backend.service;

import com.acs560.dons_pay_backend.dto.SendMoneyRequest;
import com.acs560.dons_pay_backend.entity.Merchant;
import com.acs560.dons_pay_backend.entity.Transaction;
import com.acs560.dons_pay_backend.entity.User;
import com.acs560.dons_pay_backend.repository.MerchantRepository;
import com.acs560.dons_pay_backend.repository.TransactionRepository;
import com.acs560.dons_pay_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public String processTransaction(SendMoneyRequest sendMoneyRequest) {
        try {
            logger.info("Processing transaction for user: {}", sendMoneyRequest.getPhoneNumber());
            
            // Fetch user
            User user = userRepository.findByPhoneNumber(sendMoneyRequest.getPhoneNumber())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            logger.info("Fetched user: {}", user);

            // Fetch merchant
            Merchant merchant = merchantRepository.findByMerchantNumber(sendMoneyRequest.getMerchantNumber())
                    .orElseThrow(() -> new IllegalArgumentException("Merchant not found"));
            logger.info("Fetched merchant: {}", merchant);

            // Validate and deduct balance
            BigDecimal amount = BigDecimal.valueOf(sendMoneyRequest.getAmount());
            logger.info("Amount to transfer: {}", amount);

            if ("DON_DOLLARS".equalsIgnoreCase(sendMoneyRequest.getBalanceType())) {
                if (user.getDonDollarsBalance().compareTo(amount) < 0) {
                    throw new RuntimeException("Insufficient Don Dollars balance");
                }
                user.setDonDollarsBalance(user.getDonDollarsBalance().subtract(amount));
                logger.info("Updated user Don Dollars balance: {}", user.getDonDollarsBalance());
            } else if ("MEAL_SWIPES".equalsIgnoreCase(sendMoneyRequest.getBalanceType())) {
                if (user.getMealSwipesBalance() < amount.intValue()) {
                    throw new RuntimeException("Insufficient Meal Swipes balance");
                }
                user.setMealSwipesBalance(user.getMealSwipesBalance() - amount.intValue());
                logger.info("Updated user Meal Swipes balance: {}", user.getMealSwipesBalance());
            } else {
                throw new IllegalArgumentException("Invalid balance type");
            }

            // Update merchant balance
            merchant.setBalance(merchant.getBalance().add(amount));
            logger.info("Updated merchant balance: {}", merchant.getBalance());

            // Save updated entities
            userRepository.save(user);
            merchantRepository.save(merchant);
            logger.info("Saved updated user and merchant balances");

            // Record the transaction
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setMerchant(merchant);
            transaction.setAmount(amount);
            transaction.setType(Transaction.TransactionType.valueOf(sendMoneyRequest.getBalanceType().toUpperCase()));
            transaction.setTimestamp(LocalDateTime.now());
            transactionRepository.save(transaction);
            logger.info("Transaction recorded successfully: {}", transaction);

            return "Transaction successful";
        } catch (Exception e) {
            logger.error("An error occurred while processing the transaction: {}", e.getMessage(), e);
            throw new RuntimeException("An error occurred while processing the transaction", e);
        }
    }
}

