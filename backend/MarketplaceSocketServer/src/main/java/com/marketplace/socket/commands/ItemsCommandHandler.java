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

public class ItemsCommandHandler implements com.marketplace.socket.MarketplaceServer.CommandHandler {

    private final DataSource dataSource;
    private final Gson gson = new Gson();

    public ItemsCommandHandler(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void handle(Session session, JsonObject request, PrintWriter out) {
        UUID userUuid;
        try {
            userUuid = UUID.fromString(session.getUserId());
        } catch (IllegalArgumentException e) {
            sendError(out, 400, "Invalid user ID format.");
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
                    sendError(out, 400, "Invalid or missing 'action'. Use ADD, EDIT, REMOVE, or LIST.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            sendError(out, 500, "Database error: " + e.getMessage());
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
            sendSuccess(out, "Item added successfully");
        }
    }

    private void editItem(Connection conn, UUID sellerId, JsonObject req, PrintWriter out) throws SQLException {
        UUID itemId = UUID.fromString(req.get("itemId").getAsString());
        // Verify ownership and update
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
                sendSuccess(out, "Item updated successfully");
            } else {
                sendError(out, 403, "Item not found or you are not the seller.");
            }
        }
    }

    private void removeItem(Connection conn, UUID sellerId, JsonObject req, PrintWriter out) throws SQLException {
        UUID itemId = UUID.fromString(req.get("itemId").getAsString());
        // Soft delete by setting status to DISABLED
        String sql = "UPDATE items SET status = 'DISABLED' WHERE item_id = ? AND seller_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, itemId);
            stmt.setObject(2, sellerId);

            int rows = stmt.executeUpdate();
            if (rows > 0) {
                sendSuccess(out, "Item removed successfully");
            } else {
                sendError(out, 403, "Item not found or you are not the seller.");
            }
        }
    }

    private void listItems(Connection conn, PrintWriter out) throws SQLException {
        String sql = "SELECT item_id, name, brand, description, price, quantity, status FROM items WHERE status = 'AVAILABLE'";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            ResultSet rs = stmt.executeQuery();
            JsonArray itemsArray = new JsonArray();
            while (rs.next()) {
                JsonObject item = new JsonObject();
                item.addProperty("item_id", rs.getString("item_id"));
                item.addProperty("name", rs.getString("name"));
                item.addProperty("brand", rs.getString("brand"));
                item.addProperty("description", rs.getString("description"));
                item.addProperty("price", rs.getBigDecimal("price"));
                item.addProperty("quantity", rs.getInt("quantity"));
                itemsArray.add(item);
            }

            JsonObject response = new JsonObject();
            response.addProperty("status", 200);
            response.add("data", itemsArray);
            out.println(gson.toJson(response));
        }
    }

    private void sendSuccess(PrintWriter out, String message) {
        JsonObject response = new JsonObject();
        response.addProperty("status", 200);
        response.addProperty("message", message);
        out.println(gson.toJson(response));
    }

    private void sendError(PrintWriter out, int statusCode, String message) {
        JsonObject error = new JsonObject();
        error.addProperty("status", statusCode);
        error.addProperty("message", message);
        out.println(gson.toJson(error));
    }
}
