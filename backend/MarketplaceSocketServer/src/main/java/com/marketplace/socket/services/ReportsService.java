package com.marketplace.socket.services;

import com.marketplace.socket.db.TransactionDao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class ReportsService {

    private final TransactionDao transactionDao = new TransactionDao();

    public Map<String, Object> sellerTransactions(String sellerId) throws SQLException {
        List<TransactionDao.TransactionRecord> tx = transactionDao.findBySellerId(sellerId, 100);
        return Map.of("count", tx.size(), "transactions", tx);
    }

    public Map<String, Object> buyerTransactions(String buyerId) throws SQLException {
        List<TransactionDao.TransactionRecord> tx = transactionDao.findByBuyerId(buyerId, 100);
        return Map.of("count", tx.size(), "transactions", tx);
    }
}