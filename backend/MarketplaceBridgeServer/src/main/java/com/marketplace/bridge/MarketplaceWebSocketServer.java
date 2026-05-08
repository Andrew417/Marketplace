/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.marketplace.bridge;

import org.java_websocket.server.WebSocketServer;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import java.net.InetSocketAddress;

/**
 *
 * @author Arsany
 */
public class MarketplaceWebSocketServer extends WebSocketServer {

    private MessageForwarder forwarder;

    public MarketplaceWebSocketServer(int port, MessageForwarder forwarder) {
        super(new InetSocketAddress(port));
        this.forwarder = forwarder;

    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        forwarder.setupClient(conn);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        forwarder.handleFrontendMessage(conn, message);
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        forwarder.cleanupClient(conn);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        System.out.println("Bridge WebSocket started on 8081");
    }

}
