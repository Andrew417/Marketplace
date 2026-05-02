package com.marketplace.webservices.controllers;

import com.google.gson.JsonObject;
import com.marketplace.webservices.services.SocketForwarder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private SocketForwarder socketForwarder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody String requestBody) {
        JsonObject payload = new JsonObject(); 
        // Logic to parse requestBody into payload goes here
        return ResponseEntity.ok(socketForwarder.sendCommand("REGISTER", payload));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody String requestBody) {
        JsonObject payload = new JsonObject();
        return ResponseEntity.ok(socketForwarder.sendCommand("LOGIN", payload));
    }
}
