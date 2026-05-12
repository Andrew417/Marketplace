package com.marketplace.socket.handlers;

import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.dto.AddItemRequest;
import com.marketplace.socket.dto.DisableItemRequest;
import com.marketplace.socket.dto.UpdateStockRequest;
import com.marketplace.socket.services.InventoryService;

import java.sql.SQLException;

public class InventoryHandler {

    private final InventoryService inventoryService = new InventoryService();

    public String handleAddItem(String jsonPayload) {
        try {
            AddItemRequest req = JsonUtil.gson().fromJson(jsonPayload, AddItemRequest.class);
            if (req == null) return JsonUtil.error(400, "Invalid JSON");

            if (req.seller_id == null || req.seller_id.isBlank()) return JsonUtil.error(400, "seller_id is required");
            if (req.name == null || req.name.isBlank()) return JsonUtil.error(400, "name is required");
            if (req.price == null) return JsonUtil.error(400, "price is required");
            if (req.quantity == null) return JsonUtil.error(400, "quantity is required");
            if (req.quantity < 0) return JsonUtil.error(400, "quantity must be >= 0");

            var data = inventoryService.addItem(
                    req.seller_id.trim(),
                    req.name.trim(),
                    req.brand == null ? null : req.brand.trim(),
                    req.description == null ? null : req.description.trim(),
                    req.price,
                    req.quantity
            );

            return JsonUtil.ok(201, "Item created", data);

        } catch (IllegalArgumentException e) {
            return JsonUtil.error(400, e.getMessage());
        } catch (SQLException e) {
            e.printStackTrace();
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }

    public String handleUpdateStock(String jsonPayload) {
        try {
            UpdateStockRequest req = JsonUtil.gson().fromJson(jsonPayload, UpdateStockRequest.class);
            if (req == null) return JsonUtil.error(400, "Invalid JSON");

            if (req.seller_id == null || req.seller_id.isBlank()) return JsonUtil.error(400, "seller_id is required");
            if (req.item_id == null || req.item_id.isBlank()) return JsonUtil.error(400, "item_id is required");
            if (req.quantity == null) return JsonUtil.error(400, "quantity is required");
            if (req.quantity < 0) return JsonUtil.error(400, "quantity must be >= 0");

            inventoryService.updateStock(req.seller_id.trim(), req.item_id.trim(), req.quantity);
            return JsonUtil.ok(200, "Stock updated", null);

        } catch (IllegalArgumentException e) {
            // not found/not owned etc.
            return JsonUtil.error(404, e.getMessage());
        } catch (SQLException e) {
            e.printStackTrace();
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }

    public String handleDisableItem(String jsonPayload) {
        try {
            DisableItemRequest req = JsonUtil.gson().fromJson(jsonPayload, DisableItemRequest.class);
            if (req == null) return JsonUtil.error(400, "Invalid JSON");

            if (req.seller_id == null || req.seller_id.isBlank()) return JsonUtil.error(400, "seller_id is required");
            if (req.item_id == null || req.item_id.isBlank()) return JsonUtil.error(400, "item_id is required");

            inventoryService.disableItem(req.seller_id.trim(), req.item_id.trim());
            return JsonUtil.ok(200, "Item disabled", null);

        } catch (IllegalArgumentException e) {
            return JsonUtil.error(404, e.getMessage());
        } catch (SQLException e) {
            e.printStackTrace();
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }
}