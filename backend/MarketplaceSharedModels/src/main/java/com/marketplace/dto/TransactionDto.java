/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.dto;

/**
 *
 * @author Arsany
 */
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDto {

    private String transactionId;
    private String buyerId;
    private String sellerId;
    private String itemId;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String status;

    // Constructors
    public TransactionDto() {
    }

    public TransactionDto(String transactionId, String buyerId, String sellerId, String itemId, BigDecimal amount, LocalDateTime timestamp, String status) {
        this.transactionId = transactionId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.itemId = itemId;
        this.amount = amount;
        this.timestamp = timestamp;
        this.status = status;
    }

    // Getters
    public String getTransactionId() {
        return transactionId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public String getSellerId() {
        return sellerId;
    }

    public String getItemId() {
        return itemId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
