package com.marketplace.socket.handlers;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.marketplace.socket.CommandHandler;
import com.marketplace.socket.Session;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class DepositCommandHandler implements CommandHandler {

    private final DataSource dataSource;
    private final Gson gson = new Gson();

    public DepositCommandHandler(DataSource dataSource) {
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

        if (!request.has("amount")) {
            sendError(out, 400, "Missing 'amount' field in request.");
            return;
        }

        BigDecimal amount = request.get("amount").getAsBigDecimal();
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            sendError(out, 400, "Deposit amount must be greater than zero.");
            return;
        }

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            // 1. Insert into deposits log table
            String insertDeposit = "INSERT INTO deposits (user_id, amount) VALUES (?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(insertDeposit)) {
                stmt.setObject(1, userUuid);
                stmt.setBigDecimal(2, amount);
                stmt.executeUpdate();
            }

            // 2. Update account balance
            String updateBalance = "UPDATE accounts SET balance = balance + ?, updated_at = now() WHERE user_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(updateBalance)) {
                stmt.setBigDecimal(1, amount);
                stmt.setObject(2, userUuid);
                int rows = stmt.executeUpdate();
                if (rows == 0) {
                    throw new SQLException("Account not found for user.");
                }
            }

            // 3. Fetch new balance
            BigDecimal newBalance = BigDecimal.ZERO;
            String getBalance = "SELECT balance FROM accounts WHERE user_id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(getBalance)) {
                stmt.setObject(1, userUuid);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    newBalance = rs.getBigDecimal("balance");
                }
            }

            conn.commit();

            // 4. Send success response
            JsonObject response = new JsonObject();
            response.addProperty("status", 200);
            response.addProperty("message", "Deposit successful");

            JsonObject data = new JsonObject();
            data.addProperty("new_balance", newBalance);
            response.add("data", data);

            out.println(gson.toJson(response));

        } catch (SQLException e) {
            e.printStackTrace();
            sendError(out, 500, "Database error: " + e.getMessage());
        }
    }

    private void sendError(PrintWriter out, int statusCode, String message) {
        JsonObject error = new JsonObject();
        error.addProperty("status", statusCode);
        error.addProperty("message", message);
        out.println(gson.toJson(error));
    }
}
