/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.bridge;

/**
 *
 * @author Arsany
 */
public class Main {
    public static void main(String[] args) {
        MessageForwarder forwarder = new MessageForwarder();
        MarketplaceWebSocketServer server = new MarketplaceWebSocketServer(8081, forwarder);
        server.start();
    }
}