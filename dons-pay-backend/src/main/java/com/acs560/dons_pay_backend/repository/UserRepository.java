package com.acs560.dons_pay_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.acs560.dons_pay_backend.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByStudentId(String studentId);
    Optional<User> findByPhoneNumber(String phoneNumber);
}
