package com.marketplace.socket.db;

import java.sql.*;
import java.util.Optional;

public class UserDao {
    private final javax.sql.DataSource dataSource;

    public UserDao(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // UUID stored as string
    public record UserRecord(String userId, String username, String email, String passwordHash) {
    }

    public Optional<UserRecord> findByEmail(String email) throws SQLException {
        String sql = "SELECT user_id, username, email, password_hash FROM users WHERE email = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next())
                    return Optional.empty();

                return Optional.of(new UserRecord(
                        rs.getString("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password_hash")));
            }
        }
    }

    public Optional<UserRecord> findByUsername(String username) throws SQLException {
        String sql = "SELECT user_id, username, email, password_hash FROM users WHERE username = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, username);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next())
                    return Optional.empty();

                return Optional.of(new UserRecord(
                        rs.getString("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password_hash")));
            }
        }
    }

    public String insertUser(String username, String email, String passwordHash) throws SQLException {
        // ✅ Generate UUID in Java first
        String userId = java.util.UUID.randomUUID().toString();

        String sql = "INSERT INTO users (user_id, username, email, password_hash) VALUES (?, ?, ?, ?)";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, userId); // ✅ Pass UUID explicitly
            ps.setString(2, username);
            ps.setString(3, email);
            ps.setString(4, passwordHash);

            ps.executeUpdate(); // ✅ No RETURNING needed
            return userId; // ✅ Return the UUID we generated
        }
    }

    public void insertAccount(String userId) throws SQLException {
        String sql = "INSERT INTO accounts (account_id, user_id, balance) VALUES (?, ?, 0)";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, java.util.UUID.randomUUID().toString());
            ps.setString(2, userId);
            ps.executeUpdate();
        }
    }
}