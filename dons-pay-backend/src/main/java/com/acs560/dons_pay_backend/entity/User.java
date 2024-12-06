package com.acs560.dons_pay_backend.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 15)
    private String phoneNumber;

    @Column(nullable = false, length = 6)
    private String pin;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(unique = true, nullable = false, length = 50)
    private String studentId;

    @Column(nullable = false, length = 60)
    private String password;

    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0")
    private BigDecimal donDollarsBalance = BigDecimal.ZERO;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer mealSwipesBalance = 0;

    // No-args constructor for JPA
    public User() {}

    // Constructor with all fields
    public User(String firstName, String lastName, String phoneNumber, String pin, String email, String studentId, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.pin = pin;
        this.email = email;
        this.studentId = studentId;
        this.password = password;
        this.donDollarsBalance = BigDecimal.ZERO;
        this.mealSwipesBalance = 0;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public BigDecimal getDonDollarsBalance() {
        return donDollarsBalance;
    }

    public void setDonDollarsBalance(BigDecimal donDollarsBalance) {
        this.donDollarsBalance = donDollarsBalance;
    }

    public Integer getMealSwipesBalance() {
        return mealSwipesBalance;
    }

    public void setMealSwipesBalance(Integer mealSwipesBalance) {
        this.mealSwipesBalance = mealSwipesBalance;
    }

    // Override equals and hashCode
    @Override
    public int hashCode() {
        return Objects.hash(userId, firstName, lastName, phoneNumber, pin, email, studentId, password, donDollarsBalance, mealSwipesBalance);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        User other = (User) obj;
        return Objects.equals(userId, other.userId) &&
               Objects.equals(firstName, other.firstName) &&
               Objects.equals(lastName, other.lastName) &&
               Objects.equals(phoneNumber, other.phoneNumber) &&
               Objects.equals(pin, other.pin) &&
               Objects.equals(email, other.email) &&
               Objects.equals(studentId, other.studentId) &&
               Objects.equals(password, other.password) &&
               Objects.equals(donDollarsBalance, other.donDollarsBalance) &&
               Objects.equals(mealSwipesBalance, other.mealSwipesBalance);
    }

    @Override
    public String toString() {
        return "User [userId=" + userId + ", firstName=" + firstName + ", lastName=" + lastName + ", phoneNumber=" + phoneNumber
                + ", pin=" + pin + ", email=" + email + ", studentId=" + studentId + ", password=" + password + "]";
    }
}
