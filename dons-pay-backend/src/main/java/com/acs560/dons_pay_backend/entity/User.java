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
    private String firstName;
    
    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(unique = true, nullable = false, length = 50)
    private String studentId;
    
    @Column(unique = true, nullable = false, length = 10)
    private String phoneNumber;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 60)
    private String pin; // Add this column for login functionality

    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0")
    private BigDecimal donDollarsBalance = BigDecimal.ZERO;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer mealSwipesBalance = 0;
    
    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    // Getter and Setter
    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
    
    
    // Required no-args constructor for JPA
    public User() {
    }

    public User(String firstName, String lastName, String studentId, String email, String pin, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.studentId = studentId;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.pin = pin;
        this.donDollarsBalance = BigDecimal.ZERO; // Default values
        this.mealSwipesBalance = 0; // Default values
    }
    
    public User(Integer userId, String firstName, String lastName, String studentId, String email, String pin, String phoneNumber,
			BigDecimal donDollarsBalance, Integer mealSwipesBalance) {
		super();
		this.userId = userId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.studentId = studentId;
		this.email = email;
		this.pin = pin;
		this.donDollarsBalance = donDollarsBalance;
		this.mealSwipesBalance = mealSwipesBalance;
	}

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

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
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


    // Getters and setters
}
