package com.marketplace.socket.handlers;

import com.google.gson.JsonObject;
import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.CommandHandler;
import com.marketplace.socket.Session;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

public class PurchaseCommandHandler implements CommandHandler {

    private final DataSource dataSource;

    public PurchaseCommandHandler(DataSource dataSource) {
        this.dataSource = dataSource;

        String stripeKey = System.getenv("STRIPE_SECRET_KEY");
        if (stripeKey == null || stripeKey.isBlank()) {
            throw new IllegalStateException("Missing STRIPE_SECRET_KEY environment variable.");
        }
        Stripe.apiKey = stripeKey;
    }

    @Override
    public void handle(Session session, JsonObject request, PrintWriter out) {
        UUID buyerId;
        try {
            buyerId = UUID.fromString(session.getUserId());
        } catch (IllegalArgumentException e) {
            out.println(JsonUtil.error(400, "Invalid user ID format."));
            out.flush();
            return;
        }

        if (!request.has("itemId")) {
            out.println(JsonUtil.error(400, "Missing 'itemId'"));
            out.flush();
            return;
        }

        UUID itemId = UUID.fromString(request.get("itemId").getAsString());

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // Start transaction

            // 1. Check if item is available and get price
            BigDecimal price = null;
            UUID sellerId = null;

            String itemQuery = "SELECT price, seller_id, quantity FROM items WHERE item_id = ? AND status = 'AVAILABLE' FOR UPDATE";
            try (PreparedStatement stmt = conn.prepareStatement(itemQuery)) {
                stmt.setObject(1, itemId);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    if (rs.getInt("quantity") <= 0) {
                        out.println(JsonUtil.error(400, "Item is out of stock."));
                        out.flush();
                        conn.rollback();
                        return;
                    }
                    price = rs.getBigDecimal("price");
                    sellerId = rs.getObject("seller_id", UUID.class);
                } else {
                    out.println(JsonUtil.error(404, "Item not found or not available."));
                    out.flush();
                    conn.rollback();
                    return;
                }
            }

            if (buyerId.equals(sellerId)) {
                out.println(JsonUtil.error(400, "You cannot buy your own item."));
                out.flush();
                conn.rollback();
                return;
            }

            // 2. Create Order
            UUID orderId = null;
            String createOrder = "INSERT INTO orders (buyer_id, total_amount) VALUES (?, ?) RETURNING order_id";
            try (PreparedStatement stmt = conn.prepareStatement(createOrder)) {
                stmt.setObject(1, buyerId);
                stmt.setBigDecimal(2, price);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    orderId = rs.getObject("order_id", UUID.class);
                }
            }

            // 3. Create Order Items
            String createOrderItem = "INSERT INTO order_items (order_id, item_id) VALUES (?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(createOrderItem)) {
                stmt.setObject(1, orderId);
                stmt.setObject(2, itemId);
                stmt.executeUpdate();
            }

            // 4. Create Stripe PaymentIntent
            // Stripe expects amounts in cents (e.g., $10.00 = 1000)
            long amountInCents = price.multiply(new BigDecimal(100)).longValue();

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("usd")
                    .putMetadata("order_id", orderId.toString()) // Julia will need this in the webhook!
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // 5. Create PENDING Transaction (Kerlos' task mentioned storing payment intent IDs)
            // Note: Make sure Kerlos adds a 'stripe_intent_id' column to transactions!
            String createTransaction = "INSERT INTO transactions (buyer_id, seller_id, order_id, type, status) VALUES (?, ?, ?, 'PAYMENT', 'PENDING')";
            try (PreparedStatement stmt = conn.prepareStatement(createTransaction)) {
                stmt.setObject(1, buyerId);
                stmt.setObject(2, sellerId);
                stmt.setObject(3, orderId);
                stmt.executeUpdate();
            }

            conn.commit(); // Commit database changes

            // 6. Return Stripe Client Secret to the frontend using JsonUtil
            out.println(JsonUtil.ok(200, "Purchase initiated", Map.of(
                    "order_id", orderId.toString(),
                    "client_secret", paymentIntent.getClientSecret()
            )));
            out.flush();

        } catch (SQLException e) {
            e.printStackTrace();
            out.println(JsonUtil.error(500, "Database error: " + e.getMessage()));
            out.flush();
        } catch (StripeException e) {
            e.printStackTrace();
            out.println(JsonUtil.error(500, "Stripe API error: " + e.getMessage()));
            out.flush();
        }
    }
}
