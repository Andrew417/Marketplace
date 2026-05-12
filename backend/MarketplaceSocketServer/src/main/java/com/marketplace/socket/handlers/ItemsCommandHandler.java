package com.marketplace.socket.handlers;

import com.google.gson.JsonObject;
import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.CommandHandler;
import com.marketplace.socket.Session;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class ItemsCommandHandler implements CommandHandler {

    private final DataSource dataSource;

    public ItemsCommandHandler(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void handle(Session session, JsonObject request, PrintWriter out) {
        UUID userUuid;
        try {
            userUuid = UUID.fromString(session.getUserId());
        } catch (IllegalArgumentException e) {
            out.println(JsonUtil.error(400, "Invalid user ID format."));
            out.flush();
            return;
        }

        String action = request.has("action") ? request.get("action").getAsString().toUpperCase() : "";

        try (Connection conn = dataSource.getConnection()) {
            switch (action) {
                case "ADD":
                    addItem(conn, userUuid, request, out);
                    break;
                case "EDIT":
                    editItem(conn, userUuid, request, out);
                    break;
                case "REMOVE":
                    removeItem(conn, userUuid, request, out);
                    break;
                case "LIST":
                    listItems(conn, out);
                    break;
                default:
                    out.println(JsonUtil.error(400, "Invalid or missing 'action'. Use ADD, EDIT, REMOVE, or LIST."));
                    out.flush();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.println(JsonUtil.error(500, "Database error: " + e.getMessage()));
            out.flush();
        }
    }

    private void addItem(Connection conn, UUID sellerId, JsonObject req, PrintWriter out) throws SQLException {
        String sql = "INSERT INTO items (seller_id, name, brand, description, price, quantity) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, sellerId);
            stmt.setString(2, req.get("name").getAsString());
            stmt.setString(3, req.has("brand") ? req.get("brand").getAsString() : null);
            stmt.setString(4, req.has("description") ? req.get("description").getAsString() : null);
            stmt.setBigDecimal(5, req.get("price").getAsBigDecimal());
            stmt.setInt(6, req.has("quantity") ? req.get("quantity").getAsInt() : 1);

            stmt.executeUpdate();
            out.println(JsonUtil.ok(200, "Item added successfully", null));
            out.flush();
        }
    }

    private void editItem(Connection conn, UUID sellerId, JsonObject req, PrintWriter out) throws SQLException {
        UUID itemId = UUID.fromString(req.get("itemId").getAsString());
        String sql = "UPDATE items SET name = ?, brand = ?, description = ?, price = ?, quantity = ? WHERE item_id = ? AND seller_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, req.get("name").getAsString());
            stmt.setString(2, req.has("brand") ? req.get("brand").getAsString() : null);
            stmt.setString(3, req.has("description") ? req.get("description").getAsString() : null);
            stmt.setBigDecimal(4, req.get("price").getAsBigDecimal());
            stmt.setInt(5, req.get("quantity").getAsInt());
            stmt.setObject(6, itemId);
            stmt.setObject(7, sellerId);

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                out.println(JsonUtil.ok(200, "Item updated successfully", null));
            } else {
                out.println(JsonUtil.error(403, "Item not found or you are not the seller."));
            }
            out.flush();
        }
    }

    private void removeItem(Connection conn, UUID sellerId, JsonObject req, PrintWriter out) throws SQLException {
        UUID itemId = UUID.fromString(req.get("itemId").getAsString());
        String sql = "UPDATE items SET status = 'DISABLED' WHERE item_id = ? AND seller_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, itemId);
            stmt.setObject(2, sellerId);

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                out.println(JsonUtil.ok(200, "Item removed successfully", null));
            } else {
                out.println(JsonUtil.error(403, "Item not found or you are not the seller."));
            }
            out.flush();
        }
    }

    private void listItems(Connection conn, PrintWriter out) throws SQLException {
        String sql = "SELECT item_id, name, brand, description, price, quantity, status FROM items WHERE status = 'AVAILABLE'";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            ResultSet rs = stmt.executeQuery();
            List<Map<String, Object>> itemsList = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> item = new HashMap<>();
                item.put("item_id", rs.getString("item_id"));
                item.put("name", rs.getString("name"));
                item.put("brand", rs.getString("brand"));
                item.put("description", rs.getString("description"));
                item.put("price", rs.getBigDecimal("price"));
                item.put("quantity", rs.getInt("quantity"));
                itemsList.add(item);
            }

            out.println(JsonUtil.ok(200, "Items retrieved successfully", itemsList));
            out.flush();
        }
    }
}
