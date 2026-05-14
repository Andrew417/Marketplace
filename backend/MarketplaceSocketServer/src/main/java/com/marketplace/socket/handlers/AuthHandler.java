package com.marketplace.socket.handlers;

import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.dto.LoginRequest;
import com.marketplace.socket.dto.RegisterRequest;
import com.marketplace.socket.services.AuthService;
import java.sql.SQLException;

public class AuthHandler {

    private final AuthService authService;

    public AuthHandler(javax.sql.DataSource dataSource) {
        this.authService = new AuthService(dataSource);
    }

    public String handleRegister(String jsonPayload) {
        try {
            RegisterRequest req = JsonUtil.gson().fromJson(jsonPayload, RegisterRequest.class);

            if (req == null) {
                return JsonUtil.error(400, "Invalid JSON");
            }
            if (req.username == null || req.username.isBlank()) {
                return JsonUtil.error(400, "username is required");
            }
            if (req.email == null || req.email.isBlank()) {
                return JsonUtil.error(400, "email is required");
            }
            if (req.password == null || req.password.isBlank()) {
                return JsonUtil.error(400, "password is required");
            }

            if (req.username.length() > 50) {
                return JsonUtil.error(400, "username too long");
            }
            if (req.email.length() > 100) {
                return JsonUtil.error(400, "email too long");
            }
            if (req.password.length() < 6) {
                return JsonUtil.error(400, "password too short (min 6)");
            }

            authService.register(req.username.trim(), req.email.trim(), req.password);

            return JsonUtil.ok(201, "Account created successfully", null);
        } catch (IllegalArgumentException e) {
            return JsonUtil.error(400, e.getMessage());
        } catch (SQLException e) {
            // DB down / connection refused / SQL error
            System.err.println("Database error: " + e.getMessage());
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }

    public String handleLogin(String jsonPayload) {
        try {
            LoginRequest req = JsonUtil.gson().fromJson(jsonPayload, LoginRequest.class);

            if (req == null) {
                return JsonUtil.error(400, "Invalid JSON");
            }
            if (req.email == null || req.email.isBlank()) {
                return JsonUtil.error(400, "email is required");
            }
            if (req.password == null || req.password.isBlank()) {
                return JsonUtil.error(400, "password is required");
            }

            var data = authService.login(req.email.trim(), req.password);

            return JsonUtil.ok(200, "Login successful", data);
        } catch (IllegalArgumentException e) {
            if ("Invalid credentials".equals(e.getMessage())) {
                return JsonUtil.error(401, "Invalid credentials");
            }
            return JsonUtil.error(400, e.getMessage());
        } catch (SQLException e) {
            // DB down / connection refused / SQL error
            System.err.println("Database error: " + e.getMessage());
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }
}
