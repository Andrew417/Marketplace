package com.marketplace.socket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.github.cdimascio.dotenv.Dotenv;

public class Main {

    private static final int PORT = getPort();
    private static DataSource dataSource;

    private static int getPort() {
        String portEnv = System.getProperty("SOCKET_SERVER_PORT", System.getenv("SOCKET_SERVER_PORT"));
        if (portEnv != null && !portEnv.isEmpty()) {
            return Integer.parseInt(portEnv);
        }
        return 9000; // default
    }

    private static Dotenv dotenv;

    public static String getEnv(String key) {
        String val = dotenv != null ? dotenv.get(key) : null;
        if (val == null || val.isEmpty())
            val = System.getenv(key);
        return val;
    }

    public static void main(String[] args) {
        dotenv = Dotenv.configure()
                .directory("../../")
                .ignoreIfMissing()
                .load();
        System.out.println("[ENV] DB_HOST = " + getEnv("DB_HOST"));
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
        // Read from env vars (matches your .env)
        String dbHost = getEnv("DB_HOST");
        String dbPort = getEnv("DB_PORT");
        String dbName = getEnv("DB_NAME");
        String dbUser = getEnv("DB_USER");
        String dbPassword = getEnv("DB_PASSWORD");

        // Defaults
        if (dbHost == null || dbHost.isEmpty())
            dbHost = "localhost";
        if (dbPort == null || dbPort.isEmpty())
            dbPort = "26257";
        if (dbName == null || dbName.isEmpty())
            dbName = "marketplace_db";
        if (dbUser == null || dbUser.isEmpty())
            dbUser = "root";
        if (dbPassword == null)
            dbPassword = "";

        // SSL for CockroachDB Cloud
        String sslMode = dbHost.contains("cockroachlabs.cloud") ? "require" : "disable";
        String jdbcUrl = String.format(
                "jdbc:postgresql://%s:%s/%s?sslmode=%s",
                dbHost, dbPort, dbName, sslMode);

        // HikariCP config
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(dbUser);
        config.setPassword(dbPassword);
        config.setMaximumPoolSize(10);
        config.setConnectionTimeout(30000);
        config.addDataSourceProperty("applicationName", "MarketplaceSocketServer");

        dataSource = new HikariDataSource(config);
        System.out.println("[DB] Connected to: " + dbName + " @ " + dbHost);
    }
}
