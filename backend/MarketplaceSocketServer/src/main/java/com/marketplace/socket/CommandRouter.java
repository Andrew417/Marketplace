package com.marketplace.socket;

import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.marketplace.socket.handlers.AccountCommandHandler;
import com.marketplace.socket.handlers.AuthHandler;
import com.marketplace.socket.handlers.DepositCommandHandler;
import com.marketplace.socket.handlers.InventoryHandler;
import com.marketplace.socket.handlers.ItemsCommandHandler;
import com.marketplace.socket.handlers.PurchaseCommandHandler;
import com.marketplace.socket.handlers.ReportsHandler;
import com.marketplace.socket.handlers.SearchHandler;
import com.marketplace.socket.services.ReportsService;
import com.marketplace.socket.services.SearchService;

import javax.sql.DataSource;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class CommandRouter {

    private final Map<String, Function<String, String>> routes = new HashMap<>();

    public CommandRouter(DataSource dataSource) {
        this(dataSource, true);
    }

    public CommandRouter(DataSource dataSource, boolean includePurchaseRoutes) {
        AuthHandler authHandler = new AuthHandler(dataSource);
        InventoryHandler inventoryHandler = new InventoryHandler(dataSource);
        AccountCommandHandler accountHandler = new AccountCommandHandler(dataSource);
        ItemsCommandHandler itemsHandler = new ItemsCommandHandler(dataSource);
        DepositCommandHandler depositHandler = new DepositCommandHandler(dataSource);
        SearchHandler searchHandler = new SearchHandler(new SearchService(dataSource));
        ReportsHandler reportsHandler = new ReportsHandler(new ReportsService(dataSource));

        // Auth routes
        routes.put("REGISTER", authHandler::handleRegister);
        routes.put("LOGIN", authHandler::handleLogin);

        // Search by item name and/or brand
        routes.put("SEARCH", searchHandler::handleSearch);

        // Inventory Management
        routes.put("ADD_ITEM", inventoryHandler::handleAddItem);
        routes.put("UPDATE_STOCK", inventoryHandler::handleUpdateStock);
        routes.put("DISABLE_ITEM", inventoryHandler::handleDisableItem);

        // Reports generation
        routes.put("REPORT_SELLER_TX", reportsHandler::handleSellerReport);
        routes.put("REPORT_BUYER_TX", reportsHandler::handleBuyerReport);

        // Account and purchase routes (expect userId in payload)
        routes.put("ACCOUNT", wrapCommandHandler(accountHandler));
        routes.put("DEPOSIT", wrapCommandHandler(depositHandler));
        if (includePurchaseRoutes) {
            PurchaseCommandHandler purchaseHandler = new PurchaseCommandHandler(dataSource);
            routes.put("PURCHASE", wrapCommandHandler(purchaseHandler));
        }

        // Items management routes (command name maps to action)
        routes.put("ITEMS_ADD", wrapItemsHandler(itemsHandler, "ADD"));
        routes.put("ITEMS_EDIT", wrapItemsHandler(itemsHandler, "EDIT"));
        routes.put("ITEMS_REMOVE", wrapItemsHandler(itemsHandler, "REMOVE"));
        routes.put("ITEMS_LIST", wrapItemsHandler(itemsHandler, "LIST"));
    }

    public String dispatch(String rawMessage) {
        if (rawMessage == null || rawMessage.isBlank()) {
            return JsonUtil.error(400, "Empty request");
        }

        String trimmed = rawMessage.trim();
        String command;
        String payload;

        if (trimmed.startsWith("{")) {
            JsonObject request = parsePayload(trimmed);
            if (request == null) {
                return JsonUtil.error(400, "Invalid JSON");
            }
            if (!request.has("cmd") || request.get("cmd").getAsString().isBlank()) {
                return JsonUtil.error(400, "Missing 'cmd' field");
            }
            command = request.get("cmd").getAsString().trim();
            payload = trimmed;
        } else {
            int sep = trimmed.indexOf('|');
            if (sep <= 0) {
                return JsonUtil.error(400, "Invalid format. Use COMMAND|{JSON payload}");
            }

            command = trimmed.substring(0, sep).trim();

            // Allow empty payload -> treat as empty JSON object
            payload = (sep == trimmed.length() - 1)
                    ? "{}"
                    : trimmed.substring(sep + 1).trim();
        }

        command = command.toUpperCase();

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

    private Function<String, String> wrapItemsHandler(ItemsCommandHandler handler, String action) {
        return payload -> {
            JsonObject request = parsePayload(payload);
            if (request == null) {
                return JsonUtil.error(400, "Invalid JSON");
            }
            request.addProperty("action", action);
            return invokeCommandHandler(handler, request);
        };
    }

    private Function<String, String> wrapCommandHandler(CommandHandler handler) {
        return payload -> {
            JsonObject request = parsePayload(payload);
            if (request == null) {
                return JsonUtil.error(400, "Invalid JSON");
            }
            return invokeCommandHandler(handler, request);
        };
    }

    private String invokeCommandHandler(CommandHandler handler, JsonObject request) {
        String userId = request.has("userId") ? request.get("userId").getAsString() : null;
        if (userId == null || userId.isBlank()) {
            return JsonUtil.error(401, "Missing userId");
        }

        Session session = new Session(userId, "");
        StringWriter buffer = new StringWriter();
        PrintWriter out = new PrintWriter(buffer);

        handler.handle(session, request, out);
        out.flush();

        String response = buffer.toString().trim();
        if (response.isEmpty()) {
            return JsonUtil.error(500, "Empty response");
        }

        return response;
    }

    private JsonObject parsePayload(String payload) {
        try {
            return JsonUtil.gson().fromJson(payload, JsonObject.class);
        } catch (JsonSyntaxException e) {
            return null;
        }
    }
}
