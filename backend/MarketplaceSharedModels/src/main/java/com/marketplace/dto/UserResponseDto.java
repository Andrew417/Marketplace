/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.dto;

/**
 *
 * @author Arsany
 */
import java.math.BigDecimal;

public class UserResponseDto {

    private String userId;
    private String username;
    private String email;
    private BigDecimal balance;

    // Constructors
    public UserResponseDto() {
    }

    public UserResponseDto(String userId, String username, String email, BigDecimal balance) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.balance = balance;
    }

    // Getters
    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    // Setters
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

}
