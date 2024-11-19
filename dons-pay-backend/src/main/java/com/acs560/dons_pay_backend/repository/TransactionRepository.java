package com.acs560.dons_pay_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.acs560.dons_pay_backend.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
}
