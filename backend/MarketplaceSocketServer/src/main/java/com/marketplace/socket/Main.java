package com.marketplace.socket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class Main {

    private static final int PORT = getPort();
    private static DataSource dataSource;

    private static int getPort() {
        String portEnv = System.getProperty("SOCKET_SERVER_PORT", System.getenv("SOCKET_SERVER_PORT"));
        if (portEnv != null && !portEnv.isEmpty()) {
            return Integer.parseInt(portEnv);
        }
        return 9090; // default
    }

    public static void main(String[] args) {
        System.out.println("Marketplace Socket Server Starting...");
        System.out.println("Port: " + PORT);

        setupDataSource();
        CommandRouter router = new CommandRouter(dataSource);

        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Socket Server listening on port " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("New client connected: " + clientSocket.getInetAddress());

                new Thread(new ClientHandler(clientSocket, router)).start();
            }
        } catch (IOException e) {
            System.err.println("Server error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void setupDataSource() {
        HikariConfig config = new HikariConfig();
        String jdbcUrl = System.getenv().getOrDefault(
                "DB_URL",
                "jdbc:postgresql://localhost:26257/marketplace?sslmode=disable"
        );
        String dbUser = System.getenv().getOrDefault("DB_USER", "root");
        String dbPassword = System.getenv().getOrDefault("DB_PASSWORD", "");

        // CockroachDB uses the PostgreSQL driver.
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(dbUser);
        config.setPassword(dbPassword);
        config.setMaximumPoolSize(10);
        config.addDataSourceProperty("applicationName", "MarketplaceSocketServer");
        dataSource = new HikariDataSource(config);
    }
}
