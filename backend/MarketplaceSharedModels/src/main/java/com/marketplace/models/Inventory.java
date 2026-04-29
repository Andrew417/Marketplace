/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.models;

/**
 *
 * @author Arsany
 */
public class Inventory {

    private String sellerId;
    private String itemId;
    private int stockQuantity;

    // Constructors
    public Inventory() {
    }

    public Inventory(String sellerId, String itemId, int stockQuantity) {
        this.sellerId = sellerId;
        this.itemId = itemId;
        this.stockQuantity = stockQuantity;
    }

    // Getters
    public String getSellerId() {
        return sellerId;
    }

    public String getItemId() {
        return itemId;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    // Setters
    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

}
