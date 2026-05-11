package com.marketplace.socket.handlers;

import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.dto.SearchRequest;
import com.marketplace.socket.services.SearchService;

import java.sql.SQLException;

public class SearchHandler {

    private final SearchService searchService = new SearchService();

    public String handleSearch(String jsonPayload) {
        try {
            SearchRequest req = JsonUtil.gson().fromJson(jsonPayload, SearchRequest.class);
            if (req == null) {
                return JsonUtil.error(400, "Invalid JSON");
            }

            var data = searchService.search(req.name, req.brand);
            return JsonUtil.ok(200, "Search results", data);

        } catch (SQLException e) {
            e.printStackTrace();
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }
}