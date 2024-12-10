package com.acs560.dons_pay_backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.acs560.dons_pay_backend.repository.UserRepository;
import com.acs560.dons_pay_backend.entity.User;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String studentId) throws UsernameNotFoundException {
        User user = userRepository.findByStudentId(studentId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with student Id: " + studentId));
            
        return new org.springframework.security.core.userdetails.User(
            user.getStudentId(),
            user.getPin(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }}
