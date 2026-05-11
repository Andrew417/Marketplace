package com.marketplace.webservices.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

// Data Transfer Object for POST /api/account/deposit
public class DepositRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum deposit amount is $1.00")
    private BigDecimal amount;

    // ─── Getters and Setters ──────────────────────────────
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
