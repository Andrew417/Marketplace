package com.marketplace.socket;

import com.marketplace.socket.handlers.AuthHandler;
import com.marketplace.socket.handlers.SearchHandler;
import com.marketplace.socket.handlers.InventoryHandler;
import com.marketplace.socket.handlers.ReportsHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class CommandRouter {

    private final Map<String, Function<String, String>> routes = new HashMap<>();

    public CommandRouter() {
        AuthHandler authHandler = new AuthHandler();
        SearchHandler searchHandler = new SearchHandler();
        InventoryHandler inventoryHandler = new InventoryHandler();
        ReportsHandler reportsHandler = new ReportsHandler();

        //Auth routes
        routes.put("REGISTER", authHandler::handleRegister);
        routes.put("LOGIN", authHandler::handleLogin);

        // Search by item name and/or brand
        routes.put("SEARCH", searchHandler::handleSearch);

        //Inventory Management
        routes.put("ADD_ITEM", inventoryHandler::handleAddItem);
        routes.put("UPDATE_STOCK", inventoryHandler::handleUpdateStock);
        routes.put("DISABLE_ITEM", inventoryHandler::handleDisableItem);

        //Reports generation
        routes.put("REPORT_SELLER_TX", reportsHandler::handleSellerReport);
        routes.put("REPORT_BUYER_TX", reportsHandler::handleBuyerReport);
    }

    public String dispatch(String rawMessage) {
        if (rawMessage == null || rawMessage.isBlank()) {
            return JsonUtil.error(400, "Empty request");
        }

        int sep = rawMessage.indexOf('|');
        if (sep <= 0) {
            return JsonUtil.error(400, "Invalid format. Use COMMAND|{JSON payload}");
        }

        String command = rawMessage.substring(0, sep).trim();

        // Allow empty payload -> treat as empty JSON object
        String payload = (sep == rawMessage.length() - 1)
                ? "{}"
                : rawMessage.substring(sep + 1).trim();

        Function<String, String> handler = routes.get(command);
        if (handler == null) {
            return JsonUtil.error(404, "Unknown command: " + command);
        }

        try {
            return handler.apply(payload);
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }
}
