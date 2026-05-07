package com.marketplace.webservices.controllers;

import com.marketplace.webservices.services.PartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/store")
public class PartnerController {

    @Autowired
    private PartnerService partnerService;

    @GetMapping("/products")
    public ResponseEntity<?> getProducts() {
        return ResponseEntity.ok(partnerService.getAvailableProducts());
    }

    @PostMapping("/purchase")
    public ResponseEntity<String> placeOrder(
            @RequestHeader("X-API-KEY") String partnerUserId, 
            @RequestBody Map<String, Object> requestBody) {
        
        String itemId = (String) requestBody.get("itemId");
        int quantity = (Integer) requestBody.getOrDefault("quantity", 1);

        return ResponseEntity.ok(partnerService.processPurchase(partnerUserId, itemId, quantity));
    }
}