package com.marketplace.webservices.controllers;

import com.marketplace.webservices.services.DepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DepositController {

    @Autowired
    private DepositService depositService;

    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(
            @RequestHeader("Authorization") String token, 
            @RequestBody Map<String, Object> requestBody) {
        
        // Remove the "Bearer " prefix if it exists
        String rawToken = token.replace("Bearer ", "");
        
        // TODO: Integrate JWT decoding logic here once Auth feature is merged.
        // Currently assuming the raw token acts directly as the user_id.
        String userId = rawToken; 
        
        double amount;
        try {
            amount = Double.parseDouble(requestBody.get("amount").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("ERROR: Invalid amount format.");
        }

        return ResponseEntity.ok(depositService.processDeposit(userId, amount));
    }
}