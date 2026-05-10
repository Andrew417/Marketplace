package com.marketplace.socket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {

    private static final int PORT = getPort();

    private static int getPort() {
        String portEnv = System.getenv("SOCKET_SERVER_PORT");
        if (portEnv != null && !portEnv.isEmpty()) {
            return Integer.parseInt(portEnv);
        }
        return 9090; // default
    }

    public static void main(String[] args) {
        System.out.println("Marketplace Socket Server Starting...");
        System.out.println("Port: " + PORT);

        CommandRouter router = new CommandRouter();

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
}