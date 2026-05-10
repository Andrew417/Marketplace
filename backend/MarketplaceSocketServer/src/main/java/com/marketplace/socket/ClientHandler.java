package com.marketplace.socket;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class ClientHandler implements Runnable {
    private final Socket socket;
    private final CommandRouter router;

    public ClientHandler(Socket socket, CommandRouter router) {
        this.socket = socket;
        this.router = router;
    }

    @Override
    public void run() {
        try (
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
                BufferedWriter out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8))
        ) {
            String line;
            while ((line = in.readLine()) != null) {
                String response = router.dispatch(line);
                out.write(response);
                out.write("\n");
                out.flush();
            }
        } catch (IOException e) {
            System.err.println("Client IO error: " + e.getMessage());
        } finally {
            try { socket.close(); } catch (IOException ignored) {}
        }
    }
}