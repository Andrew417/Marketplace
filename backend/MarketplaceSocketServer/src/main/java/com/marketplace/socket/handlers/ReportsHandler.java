package com.marketplace.socket.handlers;

import com.marketplace.socket.JsonUtil;
import com.marketplace.socket.dto.BuyerReportRequest;
import com.marketplace.socket.dto.SellerReportRequest;
import com.marketplace.socket.services.ReportsService;

import java.sql.SQLException;

public class ReportsHandler {

    private final ReportsService reportsService;

    public ReportsHandler(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    public String handleSellerReport(String jsonPayload) {
        try {
            SellerReportRequest req = JsonUtil.gson().fromJson(jsonPayload, SellerReportRequest.class);
            if (req == null)
                return JsonUtil.error(400, "Invalid JSON");
            if (req.seller_id == null || req.seller_id.isBlank())
                return JsonUtil.error(400, "seller_id is required");

            var data = reportsService.sellerTransactions(req.seller_id.trim());
            return JsonUtil.ok(200, "Seller transactions report", data);

        } catch (SQLException e) {
            e.printStackTrace();
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }

    public String handleBuyerReport(String jsonPayload) {
        try {
            BuyerReportRequest req = JsonUtil.gson().fromJson(jsonPayload, BuyerReportRequest.class);
            if (req == null)
                return JsonUtil.error(400, "Invalid JSON");
            if (req.buyer_id == null || req.buyer_id.isBlank())
                return JsonUtil.error(400, "buyer_id is required");

            var data = reportsService.buyerTransactions(req.buyer_id.trim());
            return JsonUtil.ok(200, "Buyer transactions report", data);

        } catch (SQLException e) {
            e.printStackTrace();
            return JsonUtil.error(503, "Database unavailable");
        } catch (Exception e) {
            e.printStackTrace();
            return JsonUtil.error(500, "Server error");
        }
    }
}