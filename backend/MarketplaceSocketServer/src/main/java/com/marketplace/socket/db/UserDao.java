package com.marketplace.socket.db;

import java.sql.*;
import java.util.Optional;

public class UserDao {

    // UUID stored as string
    public record UserRecord(String userId, String username, String email, String passwordHash) {}

    public Optional<UserRecord> findByEmail(String email) throws SQLException {
        String sql = "SELECT user_id, username, email, password_hash FROM users WHERE email = ?";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();

                return Optional.of(new UserRecord(
                        rs.getString("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password_hash")
                ));
            }
        }
    }

    public Optional<UserRecord> findByUsername(String username) throws SQLException {
        String sql = "SELECT user_id, username, email, password_hash FROM users WHERE username = ?";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, username);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();

                return Optional.of(new UserRecord(
                        rs.getString("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password_hash")
                ));
            }
        }
    }

    public String insertUser(String username, String email, String passwordHash) throws SQLException {
        String sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?) RETURNING user_id";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, passwordHash);

            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getString(1); // user_id
            }
        }
    }
}