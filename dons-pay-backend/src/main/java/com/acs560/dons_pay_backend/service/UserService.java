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
}
