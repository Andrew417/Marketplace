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

public class ItemDto {

    private String itemId;
    private String sellerId;
    private String name;
    private String brand;
    private BigDecimal price;
    private int quantityAvailable;

    // Constructors
    public ItemDto() {
    }

    public ItemDto(String itemId, String sellerId, String name, String brand, BigDecimal price, int quantityAvailable) {
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.quantityAvailable = quantityAvailable;
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

    public int getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    // Setters
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

    public void setQuantityAvailable(int quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

}
