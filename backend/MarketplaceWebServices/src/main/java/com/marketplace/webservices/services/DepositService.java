package com.marketplace.webservices.services;

import com.marketplace.webservices.repositories.DepositRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepositService {

    @Autowired
    private DepositRepository depositRepository;

    @Transactional
    public String processDeposit(String userId, double amount) {
        if (amount <= 0) {
            return "ERROR: Deposit amount must be greater than 0.";
        }

        // 1. Add the money to their account balance
        boolean accountExists = depositRepository.updateAccountBalance(userId, amount);
        
        if (!accountExists) {
            return "ERROR: Account not found for this user.";
        }

        // 2. Record the deposit in the ledger
        String depositId = depositRepository.recordDeposit(userId, amount);

        return "SUCCESS: Deposited $" + amount + " to account. Deposit ID: " + depositId;
    }
}