package com.marketplace.socket.services;

import com.marketplace.socket.db.ItemDao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class SearchService {

    private final ItemDao itemDao = new ItemDao();

    public Map<String, Object> search(String name, String brand) throws SQLException {
        String n = (name == null || name.isBlank()) ? "%" : "%" + name.trim() + "%";
        String b = (brand == null || brand.isBlank()) ? "%" : "%" + brand.trim() + "%";

        List<ItemDao.ItemRecord> items = itemDao.search(n, b, 50);

        // return consistent shape:
        return Map.of(
                "count", items.size(),
                "items", items
        );
    }
}