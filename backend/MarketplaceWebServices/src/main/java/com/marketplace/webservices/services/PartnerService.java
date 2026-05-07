package com.marketplace.webservices.services;

import com.marketplace.webservices.repositories.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository partnerRepository;

    public List<Map<String, Object>> getAvailableProducts() {
        return partnerRepository.fetchAllAvailableItems();
    }

    @Transactional
    public String processPurchase(String partnerUserId, String itemId, int quantity) {
        Map<String, Object> item = partnerRepository.getItemDetails(itemId);
        
        if (item == null || (Integer) item.get("quantity") < quantity) {
            return "ERROR: Item unavailable or insufficient stock.";
        }

        double price = ((Number) item.get("price")).doubleValue();
        double totalAmount = price * quantity;

        boolean stockUpdated = partnerRepository.updateInventory(itemId, quantity);
        if (!stockUpdated) {
            return "ERROR: Stock update failed.";
        }

        String orderId = partnerRepository.createOrder(partnerUserId, totalAmount);
        partnerRepository.createOrderItem(orderId, itemId);

        return "SUCCESS: Order " + orderId + " placed successfully.";
    }
}