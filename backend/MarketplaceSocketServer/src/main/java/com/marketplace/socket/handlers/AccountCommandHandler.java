package com.marketplace.socket.handlers;

import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.CommandHandler;
import com.marketplace.socket.Session;
import com.google.gson.JsonObject;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Handles the ACCOUNT command: returns the user's balance, plus lists of
 * purchased items, sold items, and items for sale.
 *
 * Expected command JSON: {"cmd":"ACCOUNT"}
 *
 * The user's UUID is obtained from the Session (populated after
 * authentication).
 */
public class AccountCommandHandler implements CommandHandler {

    private final DataSource dataSource;

    public AccountCommandHandler(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void handle(Session session, JsonObject request, PrintWriter out) {
        String userIdStr = session.getUserId();
        UUID userUuid;

        // 1. Validate UUID format to avoid SQL injection / errors
        try {
            userUuid = UUID.fromString(userIdStr);
        } catch (IllegalArgumentException e) {
            out.println(JsonUtil.error(400, "Invalid user ID format – expected a UUID"));
            out.flush();
            return;
        }

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);  // read‑only transaction for consistency

            // Pass the parsed UUID object to the database methods
            BigDecimal balance = getBalance(conn, userUuid);
            List<Map<String, Object>> purchased = getPurchasedItems(conn, userUuid);
            List<Map<String, Object>> sold = getSoldItems(conn, userUuid);

            conn.commit();

            // 2. Construct response using JsonUtil
            Map<String, Object> data = new HashMap<>();
            data.put("balance", balance);
            data.put("purchased_items", purchased);
            data.put("sold_items", sold);
            data.put("items_for_sale", new ArrayList<>()); // Empty array to fulfill UI contract

            out.println(JsonUtil.ok(200, "Account retrieved successfully", data));
            out.flush();

        } catch (SQLException e) {
            e.printStackTrace();  // Log on server side
            out.println(JsonUtil.error(500, "Database error while retrieving account: " + e.getMessage()));
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            out.println(JsonUtil.error(500, "Unexpected error: " + e.getMessage()));
            out.flush();
        }
    }

    /**
     * Get balance from the accounts table.
     */
    private BigDecimal getBalance(Connection conn, UUID userId) throws SQLException {
        String sql = "SELECT balance FROM accounts WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getBigDecimal("balance");
            } else {
                throw new SQLException("Account not found for user_id: " + userId);
            }
        }
    }

    /**
     * Get items the user has purchased. Joins: orders (buyer_id = userId) →
     * order_items → items → users (seller).
     */
    private List<Map<String, Object>> getPurchasedItems(Connection conn, UUID userId) throws SQLException {
        String sql = """
            SELECT o.order_id,
                   o.total_amount,
                   o.created_at AS order_date,
                   i.item_id,
                   i.name,
                   i.brand,
                   i.price,
                   seller.user_id AS seller_id,
                   seller.username AS seller_name
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN items i ON oi.item_id = i.item_id
            JOIN users seller ON i.seller_id = seller.user_id
            WHERE o.buyer_id = ?
            ORDER BY o.created_at DESC
            """;

        List<Map<String, Object>> list = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("order_id", rs.getString("order_id"));
                map.put("total_amount", rs.getBigDecimal("total_amount"));
                map.put("order_date", rs.getTimestamp("order_date").toString());
                map.put("item_id", rs.getString("item_id"));
                map.put("item_name", rs.getString("name"));
                map.put("brand", rs.getString("brand"));
                map.put("price", rs.getBigDecimal("price"));
                map.put("seller_id", rs.getString("seller_id"));
                map.put("seller_name", rs.getString("seller_name"));
                list.add(map);
            }
        }
        return list;
    }

    /**
     * Get items the user has sold. Joins: orders (via order_items) where the
     * item's seller_id = userId.
     */
    private List<Map<String, Object>> getSoldItems(Connection conn, UUID userId) throws SQLException {
        String sql = """
            SELECT o.order_id,
                   o.total_amount,
                   o.created_at AS order_date,
                   i.item_id,
                   i.name,
                   i.brand,
                   i.price,
                   buyer.user_id AS buyer_id,
                   buyer.username AS buyer_name
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN items i ON oi.item_id = i.item_id
            JOIN users buyer ON o.buyer_id = buyer.user_id
            WHERE i.seller_id = ?
            ORDER BY o.created_at DESC
            """;

        List<Map<String, Object>> list = new ArrayList<>();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("order_id", rs.getString("order_id"));
                map.put("total_amount", rs.getBigDecimal("total_amount"));
                map.put("order_date", rs.getTimestamp("order_date").toString());
                map.put("item_id", rs.getString("item_id"));
                map.put("item_name", rs.getString("name"));
                map.put("brand", rs.getString("brand"));
                map.put("price", rs.getBigDecimal("price"));
                map.put("buyer_id", rs.getString("buyer_id"));
                map.put("buyer_name", rs.getString("buyer_name"));
                list.add(map);
            }
        }
        return list;
    }
}
