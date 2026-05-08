package com.marketplace.webservices.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.marketplace.webservices.dto.DepositRequest;
import com.marketplace.webservices.response.ApiResponse;
import com.marketplace.webservices.security.JwtUtil;
import com.marketplace.webservices.services.AccountService;

import java.util.UUID;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;
    private final JwtUtil jwtUtil;

    public AccountController(AccountService accountService, JwtUtil jwtUtil) {
        this.accountService = accountService;
        this.jwtUtil = jwtUtil;
    }

    // POST /api/account/deposit
    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse> deposit(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody DepositRequest request,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, errorMessage));
        }

        String token = authHeader.substring(7);
        UUID userId = jwtUtil.extractUserId(token);

        return accountService.deposit(userId, request);
    }
}
