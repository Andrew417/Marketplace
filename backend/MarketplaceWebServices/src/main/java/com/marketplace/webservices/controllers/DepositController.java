package com.marketplace.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonObject;
import com.marketplace.webservices.services.SocketForwarder;

@RestController
@RequestMapping("/api")
public class DepositController {
    @Autowired
    private SocketForwarder socketForwarder;

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestHeader("Authorization") String token, @RequestBody String requestBody) {
        JsonObject payload = new JsonObject();
        payload.addProperty("token", token.replace("Bearer ", ""));
        return ResponseEntity.ok(socketForwarder.sendCommand("DEPOSIT", payload));
    }
}
