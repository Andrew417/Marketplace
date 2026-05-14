package com.marketplace.socket.services;

import com.marketplace.socket.db.UserDao;
import com.marketplace.socket.security.JwtUtil;
import com.marketplace.socket.security.PasswordUtil;

import java.sql.SQLException;
import java.util.Map;

public class AuthService {

    private final UserDao userDao;

    public AuthService(javax.sql.DataSource dataSource) {
        this.userDao = new UserDao(dataSource);
    }

    public void register(String username, String email, String password) throws SQLException {
        if (userDao.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userDao.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        String hash = PasswordUtil.hash(password);
        String userId = userDao.insertUser(username, email, hash);
        userDao.insertAccount(userId);
    }

    public Map<String, Object> login(String email, String password) throws SQLException {
        UserDao.UserRecord user = userDao.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!PasswordUtil.verify(password, user.passwordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // UUID string
        String token = JwtUtil.generate(user.userId(), user.email());
        return Map.of("token", token);
    }
}