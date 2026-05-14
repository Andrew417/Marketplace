package com.marketplace.socket.db;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ItemDao {
    private final javax.sql.DataSource dataSource;

    public ItemDao(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public record ItemRecord(
            String itemId,
            String sellerId,
            String name,
            String brand,
            String description,
            BigDecimal price,
            String status,
            int quantity) {

    }

    public List<ItemRecord> search(String nameLike, String brandLike, int limit) throws SQLException {
        String sql = """
                SELECT item_id, seller_id, name, brand, description, price, status, quantity
                FROM items
                WHERE status = 'AVAILABLE'
                  AND quantity > 0
                  AND (name IS NOT NULL AND LOWER(name) LIKE LOWER(?))
                  AND (brand IS NOT NULL AND LOWER(brand) LIKE LOWER(?))
                ORDER BY created_at DESC
                LIMIT ?
                """;

        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, nameLike);
            ps.setString(2, brandLike);
            ps.setInt(3, limit);

            List<ItemRecord> out = new ArrayList<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    out.add(new ItemRecord(
                            rs.getString("item_id"),
                            rs.getString("seller_id"),
                            rs.getString("name"),
                            rs.getString("brand"),
                            rs.getString("description"),
                            rs.getBigDecimal("price"),
                            rs.getString("status"),
                            rs.getInt("quantity")));
                }
            }
            return out;
        }
    }

    public String insertItem(String sellerId, String name, String brand, String description,
            java.math.BigDecimal price, int quantity) throws SQLException {

        String status = (quantity > 0) ? "AVAILABLE" : "OUT_OF_STOCK";

        // ✅ Generate UUID in Java first
        String itemId = java.util.UUID.randomUUID().toString();

        String sql = """
                INSERT INTO items (item_id, seller_id, name, brand, description, price, status, quantity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, itemId); // ✅ Pass UUID explicitly
            ps.setString(2, sellerId);
            ps.setString(3, name);
            ps.setString(4, brand);
            ps.setString(5, description);
            ps.setBigDecimal(6, price);
            ps.setString(7, status);
            ps.setInt(8, quantity);

            ps.executeUpdate(); // ✅ No RETURNING needed
            return itemId; // ✅ Return the UUID we generated
        }
    }

    public int updateQuantity(String sellerId, String itemId, int quantity) throws SQLException {
        String status = (quantity > 0) ? "AVAILABLE" : "OUT_OF_STOCK";

        String sql = """
                UPDATE items
                   SET quantity = ?,
                       status = ?
                 WHERE item_id = ?
                   AND seller_id = ?
                """;

        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setInt(1, quantity);
            ps.setString(2, status);
            ps.setString(3, itemId);
            ps.setString(4, sellerId);

            return ps.executeUpdate(); // 0 = not found/not owned, 1 = updated
        }
    }

    public int disableItem(String sellerId, String itemId) throws SQLException {
        String sql = """
                UPDATE items
                   SET status = 'DISABLED'
                 WHERE item_id = ?
                   AND seller_id = ?
                """;

        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, itemId);
            ps.setString(2, sellerId);

            return ps.executeUpdate();
        }
    }
}
