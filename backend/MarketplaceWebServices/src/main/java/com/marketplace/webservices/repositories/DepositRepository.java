package com.marketplace.webservices.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public class DepositRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean updateAccountBalance(String userId, double amount) {
        // Adds the amount to the user's existing balance
        String sql = "UPDATE accounts SET balance = balance + ? WHERE user_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, amount, userId);
        return rowsAffected > 0;
    }

    public String recordDeposit(String userId, double amount) {
        // Keeps a paper trail of the deposit in the deposits table
        String depositId = UUID.randomUUID().toString();
        String sql = "INSERT INTO deposits (deposit_id, user_id, amount) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, depositId, userId, amount);
        
        return depositId;
    }
}