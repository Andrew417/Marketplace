/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.bridge;

import java.io.IOException;
import org.java_websocket.WebSocket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 *
 * @author Arsany
 */
public class MessageForwarder {

    private final Map<WebSocket, TcpClient> clientMap = new ConcurrentHashMap<>();

    public void setupClient(WebSocket ws) {
        try {
            TcpClient client = new TcpClient();
            client.connect("localhost", 9090); // Connect to core socket server
            clientMap.put(ws, client);

            // Thread to listen for Backend -> Frontend traffic
            new Thread(() -> {
                try {
                    String response;
                    boolean hasResponse = (response = client.receive()) != null;
                    while (hasResponse) {
                        ws.send(response);
                    }

                } catch (Exception ex) {
                    cleanupClient(ws);
                }
            }).start();
        } catch (Exception ex) {
            ws.close(1006, "Backend Core Unreachable");
        }
    }

    public void handleFrontendMessage(WebSocket ws, String message) {
        TcpClient tcp = clientMap.get(ws);
        if (tcp == null) {
            return;
        }

        tcp.send(message);
    }

    public void cleanupClient(WebSocket ws) {
        TcpClient tcp = clientMap.remove(ws);
        try {
            if (tcp != null) {
                tcp.close();
            }
        } catch (IOException ignored) {
        }
    }
}
