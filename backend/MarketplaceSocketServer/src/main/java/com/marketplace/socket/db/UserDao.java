package com.marketplace.socket.db;

import java.sql.*;
import java.util.Optional;

public class UserDao {

    public record UserRecord(long id, String username, String email, String passwordHash) {}

    public Optional<UserRecord> findByEmail(String email) throws SQLException {
        String sql = "SELECT id, username, email, password FROM users WHERE email = ?";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                return Optional.of(new UserRecord(
                        rs.getLong("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")
                ));
            }
        }
    }

    public Optional<UserRecord> findByUsername(String username) throws SQLException {
        String sql = "SELECT id, username, email, password FROM users WHERE username = ?";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return Optional.empty();
                return Optional.of(new UserRecord(
                        rs.getLong("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")
                ));
            }
        }
    }

    public long insertUser(String username, String email, String passwordHash) throws SQLException {
        String sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING id";
        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, passwordHash);

            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getLong(1);
            }
        }
    }
}