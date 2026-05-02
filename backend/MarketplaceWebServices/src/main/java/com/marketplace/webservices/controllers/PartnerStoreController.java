package com.marketplace.webservices.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonObject;
import com.marketplace.webservices.services.SocketForwarder;

@RestController
@RequestMapping("/api/store")
public class PartnerStoreController {
    @Autowired
    private SocketForwarder socketForwarder;

    @GetMapping("/products")
    public ResponseEntity<String> getProducts(@RequestHeader("X-API-KEY") String apiKey) {
        JsonObject payload = new JsonObject();
        payload.addProperty("apiKey", apiKey);
        return ResponseEntity.ok(socketForwarder.sendCommand("GET_PRODUCTS", payload));
    }
}
