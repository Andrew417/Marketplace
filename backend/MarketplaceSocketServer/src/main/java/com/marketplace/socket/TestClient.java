package com.marketplace.socket;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class TestClient {

    public static void main(String[] args) throws Exception {
        try (Socket s = new Socket("127.0.0.1", 9000);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8));
                BufferedWriter out = new BufferedWriter(
                        new OutputStreamWriter(s.getOutputStream(), StandardCharsets.UTF_8))) {

            // REGISTER
            out.write("REGISTER|{\"username\":\"john\",\"email\":\"john@email.com\",\"password\":\"123456\"}\n");
            out.flush();
            System.out.println("REGISTER response: " + in.readLine());

            // LOGIN — extract real userId from token payload
            out.write("LOGIN|{\"email\":\"john@email.com\",\"password\":\"123456\"}\n");
            out.flush();
            String loginResp = in.readLine();
            System.out.println("LOGIN response: " + loginResp);

            // Parse userId from JWT payload (middle part)
            String userId = extractUserIdFromLoginResponse(loginResp);
            System.out.println("Using userId: " + userId);

            out.write("SEARCH|{\"name\":\"iphone\",\"brand\":\"apple\"}\n");
            out.flush();
            System.out.println("SEARCH response: " + in.readLine());

            out.write("SEARCH|\n");
            out.flush();
            System.out.println("SEARCH (no filters) response: " + in.readLine());

            out.write("ADD_ITEM|{\"seller_id\":\"" + userId
                    + "\",\"name\":\"iPhone 15\",\"brand\":\"Apple\",\"description\":\"New phone\",\"price\":999.99,\"quantity\":10}\n");
            out.flush();
            String addItemResp = in.readLine();
            System.out.println("ADD_ITEM response: " + addItemResp);
            String itemId = extractItemId(addItemResp);
            System.out.println("Using itemId: " + itemId);
            out.write(
                    "UPDATE_STOCK|{\"seller_id\":\"" + userId + "\",\"item_id\":\"" + itemId + "\",\"quantity\":5}\n");
            out.flush();
            System.out.println("UPDATE_STOCK response: " + in.readLine());

            out.write("DISABLE_ITEM|{\"seller_id\":\"" + userId + "\",\"item_id\":\"" + itemId + "\"}\n");
            out.flush();
            System.out.println("DISABLE_ITEM response: " + in.readLine());

            out.write("REPORT_SELLER_TX|{\"seller_id\":\"" + userId + "\"}\n");
            out.flush();
            System.out.println("REPORT_SELLER_TX response: " + in.readLine());

            out.write("REPORT_BUYER_TX|{\"buyer_id\":\"" + userId + "\"}\n");
            out.flush();
            System.out.println("REPORT_BUYER_TX response: " + in.readLine());

            out.write("ACCOUNT|{\"userId\":\"" + userId + "\"}\n");
            out.flush();
            System.out.println("ACCOUNT response: " + in.readLine());

            out.write("DEPOSIT|{\"userId\":\"" + userId + "\",\"amount\":25.00}\n");
            out.flush();
            System.out.println("DEPOSIT response: " + in.readLine());

            out.write("ITEMS_ADD|{\"userId\":\"" + userId
                    + "\",\"name\":\"Pixel 9\",\"brand\":\"Google\",\"description\":\"New phone\",\"price\":799.00,\"quantity\":3}\n");
            out.flush();
            System.out.println("ITEMS_ADD response: " + in.readLine());

            out.write("ITEMS_EDIT|{\"userId\":\"" + userId + "\",\"itemId\":\"" + itemId
                    + "\",\"name\":\"Pixel 9 Pro\",\"brand\":\"Google\",\"description\":\"Updated\",\"price\":899.00,\"quantity\":2}\n");
            out.flush();
            System.out.println("ITEMS_EDIT response: " + in.readLine());

            out.write("ITEMS_LIST|{\"userId\":\"" + userId + "\"}\n");
            out.flush();
            System.out.println("ITEMS_LIST response: " + in.readLine());

            out.write("ITEMS_REMOVE|{\"userId\":\"" + userId + "\",\"itemId\":\"" + itemId + "\"}\n");
            out.flush();
            System.out.println("ITEMS_REMOVE response: " + in.readLine());

            out.write("PURCHASE|{\"userId\":\"" + userId + "\",\"itemId\":\"649b2a24-544f-4ed6-8cff-b201c0ed8496\"}\n");
            out.flush();
            System.out.println("PURCHASE response: " + in.readLine());
        }
    }

    private static String extractUserIdFromLoginResponse(String loginResp) {
        try {
            JsonObject json = JsonParser.parseString(loginResp).getAsJsonObject();
            String token = json.getAsJsonObject("data").get("token").getAsString();
            String payload = token.split("\\.")[1];
            byte[] decoded = java.util.Base64.getUrlDecoder().decode(payload);
            JsonObject claims = JsonParser.parseString(new String(decoded, StandardCharsets.UTF_8)).getAsJsonObject();
            return claims.get("user_id").getAsString();
        } catch (Exception e) {
            System.err.println("Failed to extract userId from token: " + e.getMessage());
            return "00000000-0000-0000-0000-000000000001";
        }
    }

    private static String extractItemId(String addItemResp) {
        try {
            JsonObject json = JsonParser.parseString(addItemResp).getAsJsonObject();
            return json.getAsJsonObject("data").get("item_id").getAsString();
        } catch (Exception e) {
            System.err.println("Failed to extract itemId: " + e.getMessage());
            return "00000000-0000-0000-0000-000000000010";
        }
    }
}