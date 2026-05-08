package com.marketplace.webservices.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "transaction_id", updatable = false, nullable = false)
    private UUID transactionId;

    @Column(name = "buyer_id")
    private UUID buyerId;

    @Column(name = "seller_id")
    private UUID sellerId;

    @Column(name = "order_id")
    private UUID orderId;

    // PAYMENT or REFUND
    @Column(length = 20)
    private String type;

    // PENDING, COMPLETED, FAILED
    @Column(length = 20)
    private String status;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getTransactionId() { return transactionId; }
    public void setTransactionId(UUID transactionId) { this.transactionId = transactionId; }
    public UUID getBuyerId() { return buyerId; }
    public void setBuyerId(UUID buyerId) { this.buyerId = buyerId; }
    public UUID getSellerId() { return sellerId; }
    public void setSellerId(UUID sellerId) { this.sellerId = sellerId; }
    public UUID getOrderId() { return orderId; }
    public void setOrderId(UUID orderId) { this.orderId = orderId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
