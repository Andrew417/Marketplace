/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.models;

/**
 *
 * @author Arsany
 */
import java.math.BigDecimal;

public class Item {

    private String itemId;
    private String sellerId;
    private String name;
    private String brand;
    private BigDecimal price;
    private int quantity;
    private boolean isAvailable;

    // Constructors
    public Item() {
    }

    public Item(String itemId, String sellerId, String name, String brand, BigDecimal price, int quantity) {
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.quantity = quantity;
        this.isAvailable = true;
    }

    // Getters
    public String getItemId() {
        return itemId;
    }

    public String getSellerId() {
        return sellerId;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public boolean isIsAvailable() {
        return isAvailable;
    }

    // Setters
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}
