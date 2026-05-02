package com.marketplace.webservices.services;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

@Service
public class SocketForwarder {
    @Value("${socket.server.host:localhost}")
    private String socketHost;

    @Value("${socket.server.port:9090}")
    private int socketPort;

    private final Gson gson = new Gson();

    public String sendCommand(String command, JsonObject payload) {
        // Formats message as COMMAND|{"key":"value"} per protocol
        String message = command + "|" + gson.toJson(payload);
        
        try (Socket socket = new Socket(socketHost, socketPort);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
            
            out.println(message);
            return in.readLine(); // Returns response from Socket Server
        } catch (Exception e) {
            return "ERROR|{\"code\":\"500\",\"message\":\"Socket connection failed: " + e.getMessage() + "\"}";
        }
    }
}