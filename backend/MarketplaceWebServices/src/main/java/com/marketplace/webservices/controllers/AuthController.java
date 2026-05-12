package com.marketplace.webservices.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.marketplace.webservices.dto.LoginRequest;
import com.marketplace.webservices.dto.RegisterRequest;
import com.marketplace.webservices.response.ApiResponse;
import com.marketplace.webservices.services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ─── POST /api/auth/register ──────────────────────────
    // Story i  — Create a new account
    // Story x  — REST Web Service 1
    // Public   — No JWT required
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request,
            BindingResult bindingResult) {

        // Return first validation error if any field is invalid
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .get(0)
                    .getDefaultMessage();
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error(400, errorMessage));
        }

        return authService.register(request);
    }

    // ─── POST /api/auth/login ─────────────────────────────
    // Story ii — Login to your account
    // Story x  — REST Web Service 2
    // Public   — No JWT required
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult) {

        // Return first validation error if any field is invalid
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors()
                    .get(0)
                    .getDefaultMessage();
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error(400, errorMessage));
        }

        return authService.login(request);
    }
}
