package com.marketplace.webservices.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class PartnerRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> fetchAllAvailableItems() {
        String sql = "SELECT item_id, name, brand, description, price, quantity "
                + "FROM items WHERE status = 'AVAILABLE' AND quantity > 0";
        return jdbcTemplate.queryForList(sql);
    }

    public Map<String, Object> getItemDetails(String itemId) {
        String sql = "SELECT price, seller_id, quantity FROM items WHERE item_id = ?";
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, itemId);
        return results.isEmpty() ? null : results.get(0);
    }

    public boolean updateInventory(String itemId, int quantityToBuy) {
        String sql = "UPDATE items SET quantity = quantity - ? "
                + "WHERE item_id = ? AND quantity >= ? AND status = 'AVAILABLE'";
        return jdbcTemplate.update(sql, quantityToBuy, itemId, quantityToBuy) > 0;
    }

    public String createOrder(String buyerId, double totalAmount) {
        String orderId = UUID.randomUUID().toString();
        String sql = "INSERT INTO orders (order_id, buyer_id, total_amount) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, orderId, buyerId, totalAmount);
        return orderId;
    }

    public void createOrderItem(String orderId, String itemId) {
        String orderItemId = UUID.randomUUID().toString();
        String sql = "INSERT INTO order_items (order_item_id, order_id, item_id) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, orderItemId, orderId, itemId);
    }
}
