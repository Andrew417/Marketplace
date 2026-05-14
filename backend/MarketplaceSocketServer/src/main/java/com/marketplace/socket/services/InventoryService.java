package com.marketplace.socket.services;

import com.marketplace.socket.db.ItemDao;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Map;

public class InventoryService {

    private final ItemDao itemDao;

    public InventoryService(javax.sql.DataSource dataSource) {
        this.itemDao = new ItemDao(dataSource);
    }

    public Map<String, Object> addItem(String sellerId, String name, String brand,
            String description, BigDecimal price, int quantity) throws SQLException {

        String itemId = itemDao.insertItem(sellerId, name, brand, description, price, quantity);
        return Map.of("item_id", itemId);
    }

    public void updateStock(String sellerId, String itemId, int quantity) throws SQLException {
        int updated = itemDao.updateQuantity(sellerId, itemId, quantity);
        if (updated == 0) {
            throw new IllegalArgumentException("Item not found (or not owned by seller)");
        }
    }

    public void disableItem(String sellerId, String itemId) throws SQLException {
        int updated = itemDao.disableItem(sellerId, itemId);
        if (updated == 0) {
            throw new IllegalArgumentException("Item not found (or not owned by seller)");
        }
    }
}