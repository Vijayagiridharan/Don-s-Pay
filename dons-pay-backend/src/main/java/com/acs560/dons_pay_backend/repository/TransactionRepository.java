package com.acs560.dons_pay_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.acs560.dons_pay_backend.entity.Transaction;
import com.acs560.dons_pay_backend.entity.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
	List<Transaction> findByUser(User user);
}
