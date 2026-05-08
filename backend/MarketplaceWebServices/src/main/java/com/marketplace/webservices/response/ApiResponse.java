package com.marketplace.webservices.response;

// Unified response format used by ALL endpoints
// Success:  { "status": 200, "message": "...", "data": {...} }
// Error:    { "status": 400, "message": "..." }

public class ApiResponse {

    private int status;
    private String message;
    private Object data;

    // ─── Constructors ─────────────────────────────────────

    // Success with data
    public ApiResponse(int status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Error — no data needed
    public ApiResponse(int status, String message) {
        this.status = status;
        this.message = message;
        this.data = null;
    }

    // ─── Static Helpers ───────────────────────────────────

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(200, message, data);
    }

    public static ApiResponse created(String message) {
        return new ApiResponse(201, message, null);
    }

    public static ApiResponse error(int status, String message) {
        return new ApiResponse(status, message, null);
    }

    // ─── Getters ──────────────────────────────────────────

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public Object getData() { return data; }
}
