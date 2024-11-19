package com.acs560.dons_pay_backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 50)
    private String studentId;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 60)
    private String password; // Add this column for login functionality

    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0")
    private BigDecimal donDollarsBalance = BigDecimal.ZERO;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer mealSwipesBalance = 0;
    
    
    // Required no-args constructor for JPA
    public User() {
    }

    public User(String name, String studentId, String email, String password) {
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.password = password;
        this.donDollarsBalance = BigDecimal.ZERO; // Default values
        this.mealSwipesBalance = 0; // Default values
    }
    
    public User(Integer userId, String name, String studentId, String email, String password,
			BigDecimal donDollarsBalance, Integer mealSwipesBalance) {
		super();
		this.userId = userId;
		this.name = name;
		this.studentId = studentId;
		this.email = email;
		this.password = password;
		this.donDollarsBalance = donDollarsBalance;
		this.mealSwipesBalance = mealSwipesBalance;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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

	@Override
	public String toString() {
		return "User [userId=" + userId + ", name=" + name + ", studentId=" + studentId + ", email=" + email
				+ ", password=" + password + ", donDollarsBalance=" + donDollarsBalance + ", mealSwipesBalance="
				+ mealSwipesBalance + "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(donDollarsBalance, email, mealSwipesBalance, name, password, studentId, userId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		User other = (User) obj;
		return Objects.equals(donDollarsBalance, other.donDollarsBalance) && Objects.equals(email, other.email)
				&& Objects.equals(mealSwipesBalance, other.mealSwipesBalance) && Objects.equals(name, other.name)
				&& Objects.equals(password, other.password) && Objects.equals(studentId, other.studentId)
				&& Objects.equals(userId, other.userId);
	}

    // Getters and setters
}
