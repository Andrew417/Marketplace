package com.marketplace.socket;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.marketplace.socket.commands.AccountCommandHandler;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.io.*;
import java.net.*;
import java.util.HashMap;
import java.util.Map;

public class MarketplaceServer {

    private static final int PORT = 1234;
    private static final Gson gson = new Gson();
    private static DataSource dataSource;

    // Command registry – add your new handlers here
    private static final Map<String, CommandHandler> handlers = new HashMap<>();

    public static void main(String[] args) {
        // 1. Database connection pool
        setupDataSource();

        // 2. Register command handlers
        handlers.put("ACCOUNT", new AccountCommandHandler(dataSource));
        // Future registrations go here, e.g.:
        // handlers.put("ITEMS_ADD", new ItemsCommandHandler(dataSource));
        // handlers.put("DEPOSIT", new DepositCommandHandler(dataSource));
        // handlers.put("PURCHASE", new PurchaseCommandHandler(dataSource));

        // 3. Start socket server
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Marketplace socket server started on port " + PORT);
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("New client: " + clientSocket.getInetAddress());
                new Thread(() -> handleClient(clientSocket)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleClient(Socket socket) {
        try (
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true)
        ) {
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println("Received: " + line);

                JsonObject request;
                try {
                    request = gson.fromJson(line, JsonObject.class);
                } catch (JsonSyntaxException e) {
                    sendError(out, "Invalid JSON");
                    continue;
                }

                String cmd = request.has("cmd") ? request.get("cmd").getAsString().toUpperCase() : "";
                if (cmd.isEmpty()) {
                    sendError(out, "Missing 'cmd' field");
                    continue;
                }

                // ---------- Authentication (PLACEHOLDER) ----------
                // TODO: Replace with JWT verification once Mathew provides it.
                // For now, expect a UUID string in "userId".
                String userId = request.has("userId") ? request.get("userId").getAsString() : null;
                if (userId == null || userId.isEmpty()) {
                    sendError(out, "Not authenticated (missing userId)");
                    continue;
                }

                Session session = new Session(userId, "");

                // Dispatch to the appropriate handler
                CommandHandler handler = handlers.get(cmd);
                if (handler != null) {
                    handler.handle(session, request, out);
                } else {
                    sendError(out, "Unknown command: " + cmd);
                }
            }
        } catch (IOException e) {
            System.out.println("Client disconnected: " + e.getMessage());
        } finally {
            try { socket.close(); } catch (IOException ignored) {}
        }
    }

    private static void sendError(PrintWriter out, String message) {
        JsonObject error = new JsonObject();
        error.addProperty("status", "ERROR");
        error.addProperty("message", message);
        out.println(gson.toJson(error));
    }

    private static void setupDataSource() {
        HikariConfig config = new HikariConfig();
        // Adjust host, port, database name, and credentials to your SQL Server instance
        config.setJdbcUrl("jdbc:sqlserver://localhost:1433;databaseName=marketplace;encrypt=false");
        config.setUsername("sa");
        config.setPassword("YourPassword123");
        config.setMaximumPoolSize(10);
        config.addDataSourceProperty("applicationName", "MarketplaceSocketServer");
        dataSource = new HikariDataSource(config);
    }

    /**
     * Interface for all command handlers.
     */
    public interface CommandHandler {
        void handle(Session session, JsonObject request, PrintWriter out);
    }
}