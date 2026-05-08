package com.marketplace.webservices.services;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marketplace.webservices.models.User;
import com.marketplace.webservices.dto.LoginRequest;
import com.marketplace.webservices.dto.RegisterRequest;
import com.marketplace.webservices.models.Account;
import com.marketplace.webservices.repositories.AccountRepository;
import com.marketplace.webservices.repositories.AuthRepository;
import com.marketplace.webservices.response.ApiResponse;
import com.marketplace.webservices.security.JwtUtil;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 15;

    private final AuthRepository authRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(AuthRepository authRepository,
                       AccountRepository accountRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.authRepository = authRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ─── REGISTER ─────────────────────────────────────────
    @Transactional
    public ResponseEntity<ApiResponse> register(RegisterRequest request) {

        if (authRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Email already exists"));
        }

        if (authRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(400, "Username already taken"));
        }

        // Save user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        User savedUser = authRepository.save(user);

        // Create linked account with zero balance
        Account account = new Account();
        account.setUserId(savedUser.getUserId());
        accountRepository.save(account);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Account created successfully"));
    }

    // ─── LOGIN ────────────────────────────────────────────
    @Transactional
    public ResponseEntity<ApiResponse> login(LoginRequest request) {

        Optional<User> optionalUser = authRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Invalid credentials"));
        }

        User user = optionalUser.get();

        // Check lockout
        if ("LOCKED".equals(user.getStatus())) {
            OffsetDateTime unlockTime = user.getLockTime().plusMinutes(LOCK_DURATION_MINUTES);
            if (OffsetDateTime.now().isAfter(unlockTime)) {
                authRepository.resetFailedAttempts(user.getUserId());
                user.setStatus("ACTIVE");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error(401, "Account locked. Try again after 15 minutes"));
            }
        }

        // Compare password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            authRepository.incrementFailedAttempts(user.getUserId());
            int attemptsLeft = MAX_FAILED_ATTEMPTS - (user.getFailedAttempts() + 1);

            if (user.getFailedAttempts() + 1 >= MAX_FAILED_ATTEMPTS) {
                authRepository.lockAccount(user.getUserId(), OffsetDateTime.now());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error(401, "Account locked after 5 failed attempts. Try again in 15 minutes"));
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Invalid credentials. " + attemptsLeft + " attempts remaining"));
        }

        // Success
        authRepository.resetFailedAttempts(user.getUserId());
        String token = jwtUtil.generateToken(user.getUserId(), user.getEmail());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user_id", user.getUserId());

        return ResponseEntity.ok(ApiResponse.success("Login successful", data));
    }
}
