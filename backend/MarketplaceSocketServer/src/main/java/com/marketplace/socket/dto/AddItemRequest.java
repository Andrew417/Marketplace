package com.marketplace.socket.dto;

import java.math.BigDecimal;

public class AddItemRequest {
    public String seller_id;
    public String name;
    public String brand;
    public String description;
    public BigDecimal price;
    public Integer quantity;
}