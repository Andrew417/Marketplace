package com.marketplace.webservices.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marketplace.webservices.dto.DepositRequest;
import com.marketplace.webservices.models.Account;
import com.marketplace.webservices.models.Deposit;
import com.marketplace.webservices.repositories.AccountRepository;
import com.marketplace.webservices.repositories.DepositRepository;
import com.marketplace.webservices.response.ApiResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final DepositRepository depositRepository;

    public AccountService(AccountRepository accountRepository,
            DepositRepository depositRepository) {
        this.accountRepository = accountRepository;
        this.depositRepository = depositRepository;
    }

    // ─── DEPOSIT ──────────────────────────────────────────
    @Transactional
    public ResponseEntity<ApiResponse> deposit(UUID userId, DepositRequest request) {

        Optional<Account> optionalAccount = accountRepository.findByUserId(userId);

        if (optionalAccount.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error(404, "Account not found"));
        }

        // Add to balance
        accountRepository.addToBalance(userId, request.getAmount());

        // Record in deposits table
        Deposit deposit = new Deposit();
        deposit.setUserId(userId);
        deposit.setAmount(request.getAmount());
        depositRepository.save(deposit);

        // Fetch updated balance
        Account updated = accountRepository.findByUserId(userId).get();

        Map<String, Object> data = new HashMap<>();
        data.put("new_balance", updated.getBalance());
        data.put("deposited_amount", request.getAmount());

        return ResponseEntity.ok(ApiResponse.success("Deposit successful", data));
    }
}
