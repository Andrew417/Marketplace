package com.marketplace.socket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.LinkedHashMap;
import java.util.Map;

public class JsonUtil {
    private static final Gson GSON = new GsonBuilder().serializeNulls().create();

    public static Gson gson() {
        return GSON;
    }

    public static String ok(int status, String message, Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("message", message);
        body.put("data", data == null ? Map.of() : data);
        return GSON.toJson(body);
    }

    public static String error(int status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("message", message);
        return GSON.toJson(body);
    }
}