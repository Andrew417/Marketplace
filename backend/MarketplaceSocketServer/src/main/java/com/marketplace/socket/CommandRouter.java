package com.marketplace.socket;

import com.marketplace.socket.handlers.AuthHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class CommandRouter {
    private final Map<String, Function<String, String>> routes = new HashMap<>();

    public CommandRouter() {
        AuthHandler authHandler = new AuthHandler();
        routes.put("REGISTER", authHandler::handleRegister);
        routes.put("LOGIN", authHandler::handleLogin);
    }

    public String dispatch(String rawMessage) {
        if (rawMessage == null || rawMessage.isBlank()) {
            return JsonUtil.error(400, "Empty request");
        }

        int sep = rawMessage.indexOf('|');
        if (sep <= 0 || sep == rawMessage.length() - 1) {
            return JsonUtil.error(400, "Invalid format. Use COMMAND|{JSON payload}");
        }

        String command = rawMessage.substring(0, sep).trim();
        String payload = rawMessage.substring(sep + 1).trim();

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