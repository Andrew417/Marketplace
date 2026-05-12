package com.marketplace.socket;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class TestClient {

    public static void main(String[] args) throws Exception {
        try (Socket s = new Socket("localhost", 9090); BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8)); BufferedWriter out = new BufferedWriter(new OutputStreamWriter(s.getOutputStream(), StandardCharsets.UTF_8))) {

            // REGISTER
            out.write("REGISTER|{\"username\":\"john\",\"email\":\"john@email.com\",\"password\":\"123456\"}\n");
            out.flush();
            System.out.println("REGISTER response: " + in.readLine());

            // LOGIN
            out.write("LOGIN|{\"email\":\"john@email.com\",\"password\":\"123456\"}\n");
            out.flush();
            System.out.println("LOGIN response: " + in.readLine());

            out.write("SEARCH|{\"name\":\"iphone\",\"brand\":\"apple\"}\n");
            out.flush();
            System.out.println("SEARCH response: " + in.readLine());

            out.write("SEARCH|\n");
            out.flush();
            System.out.println("SEARCH (no filters) response: " + in.readLine());

            // Inventory: add item
            out.write("ADD_ITEM|{\"seller_id\":\"00000000-0000-0000-0000-000000000001\",\"name\":\"iPhone 15\",\"brand\":\"Apple\",\"description\":\"New phone\",\"price\":999.99,\"quantity\":10}\n");
            out.flush();
            System.out.println("ADD_ITEM response: " + in.readLine());

// Inventory: update stock
            out.write("UPDATE_STOCK|{\"seller_id\":\"00000000-0000-0000-0000-000000000001\",\"item_id\":\"00000000-0000-0000-0000-000000000010\",\"quantity\":5}\n");
            out.flush();
            System.out.println("UPDATE_STOCK response: " + in.readLine());

// Inventory: disable item
            out.write("DISABLE_ITEM|{\"seller_id\":\"00000000-0000-0000-0000-000000000001\",\"item_id\":\"00000000-0000-0000-0000-000000000010\"}\n");
            out.flush();
            System.out.println("DISABLE_ITEM response: " + in.readLine());

// Reports: seller transactions
            out.write("REPORT_SELLER_TX|{\"seller_id\":\"00000000-0000-0000-0000-000000000001\"}\n");
            out.flush();
            System.out.println("REPORT_SELLER_TX response: " + in.readLine());

// Reports: buyer transactions
            out.write("REPORT_BUYER_TX|{\"buyer_id\":\"00000000-0000-0000-0000-000000000002\"}\n");
            out.flush();
            System.out.println("REPORT_BUYER_TX response: " + in.readLine());
        }
    }
}
