package com.marketplace.socket.db;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TransactionDao {

    public record TransactionRecord(
            String transactionId,
            String buyerId,
            String sellerId,
            String orderId,
            String type,
            String status,
            Timestamp createdAt
    ) {}

    public List<TransactionRecord> findBySellerId(String sellerId, int limit) throws SQLException {
        String sql = """
                SELECT transaction_id, buyer_id, seller_id, order_id, type, status, created_at
                  FROM transactions
                 WHERE seller_id = ?
                 ORDER BY created_at DESC
                 LIMIT ?
                """;

        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, sellerId);
            ps.setInt(2, limit);

            List<TransactionRecord> out = new ArrayList<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    out.add(new TransactionRecord(
                            rs.getString("transaction_id"),
                            rs.getString("buyer_id"),
                            rs.getString("seller_id"),
                            rs.getString("order_id"),
                            rs.getString("type"),
                            rs.getString("status"),
                            rs.getTimestamp("created_at")
                    ));
                }
            }
            return out;
        }
    }

    public List<TransactionRecord> findByBuyerId(String buyerId, int limit) throws SQLException {
        String sql = """
                SELECT transaction_id, buyer_id, seller_id, order_id, type, status, created_at
                  FROM transactions
                 WHERE buyer_id = ?
                 ORDER BY created_at DESC
                 LIMIT ?
                """;

        try (Connection c = DatabaseConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, buyerId);
            ps.setInt(2, limit);

            List<TransactionRecord> out = new ArrayList<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    out.add(new TransactionRecord(
                            rs.getString("transaction_id"),
                            rs.getString("buyer_id"),
                            rs.getString("seller_id"),
                            rs.getString("order_id"),
                            rs.getString("type"),
                            rs.getString("status"),
                            rs.getTimestamp("created_at")
                    ));
                }
            }
            return out;
        }
    }
}