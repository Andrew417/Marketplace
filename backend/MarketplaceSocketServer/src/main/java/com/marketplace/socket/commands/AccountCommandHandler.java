package com.marketplace.socket.commands;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.marketplace.socket.Session;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
public class AccountCommandHandler implements com.marketplace.socket.MarketplaceServer.CommandHandler {

    private final DataSource dataSource;
    private final Gson gson = new Gson();

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
            sendError(out, 400, "Invalid user ID format – expected a UUID");
            return;
        }

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);  // read‑only transaction for consistency

            // Pass the parsed UUID object to the database methods
            BigDecimal balance = getBalance(conn, userUuid);
            JsonArray purchased = getPurchasedItems(conn, userUuid);
            JsonArray sold = getSoldItems(conn, userUuid);

            conn.commit();

            // 2. Construct response exactly as defined in Backend Agreements.md
            JsonObject response = new JsonObject();
            response.addProperty("status", 200);

            JsonObject data = new JsonObject();
            data.addProperty("balance", balance);
            data.add("purchased_items", purchased);
            data.add("sold_items", sold);
            data.add("items_for_sale", new JsonArray()); // Empty array to fulfill UI contract

            response.add("data", data);

            out.println(gson.toJson(response));
            out.flush();

        } catch (SQLException e) {
            e.printStackTrace();  // Log on server side
            sendError(out, 500, "Database error while retrieving account: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendError(out, 500, "Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Get balance from the accounts table.
     */
    private BigDecimal getBalance(Connection conn, UUID userId) throws SQLException {
        String sql = "SELECT balance FROM accounts WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId); // 3. Use setObject for PostgreSQL UUID compatibility
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
    private JsonArray getPurchasedItems(Connection conn, UUID userId) throws SQLException {
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

        JsonArray arr = new JsonArray();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId); // Use setObject
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                JsonObject obj = new JsonObject();
                obj.addProperty("order_id", rs.getString("order_id"));
                obj.addProperty("total_amount", rs.getBigDecimal("total_amount"));
                obj.addProperty("order_date", rs.getTimestamp("order_date").toString());
                obj.addProperty("item_id", rs.getString("item_id"));
                obj.addProperty("item_name", rs.getString("name"));
                obj.addProperty("brand", rs.getString("brand"));
                obj.addProperty("price", rs.getBigDecimal("price"));
                obj.addProperty("seller_id", rs.getString("seller_id"));
                obj.addProperty("seller_name", rs.getString("seller_name"));
                arr.add(obj);
            }
        }
        return arr;
    }

    /**
     * Get items the user has sold. Joins: orders (via order_items) where the
     * item's seller_id = userId.
     */
    private JsonArray getSoldItems(Connection conn, UUID userId) throws SQLException {
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

        JsonArray arr = new JsonArray();
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, userId); // Use setObject
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                JsonObject obj = new JsonObject();
                obj.addProperty("order_id", rs.getString("order_id"));
                obj.addProperty("total_amount", rs.getBigDecimal("total_amount"));
                obj.addProperty("order_date", rs.getTimestamp("order_date").toString());
                obj.addProperty("item_id", rs.getString("item_id"));
                obj.addProperty("item_name", rs.getString("name"));
                obj.addProperty("brand", rs.getString("brand"));
                obj.addProperty("price", rs.getBigDecimal("price"));
                obj.addProperty("buyer_id", rs.getString("buyer_id"));
                obj.addProperty("buyer_name", rs.getString("buyer_name"));
                arr.add(obj);
            }
        }
        return arr;
    }

    /**
     * Sends an error response formatted according to team agreements.
     */
    private void sendError(PrintWriter out, int statusCode, String message) {
        JsonObject error = new JsonObject();
        error.addProperty("status", statusCode);
        error.addProperty("message", message);
        out.println(gson.toJson(error));
        out.flush();
    }
}
