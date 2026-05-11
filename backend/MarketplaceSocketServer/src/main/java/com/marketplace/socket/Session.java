package com.marketplace.socket;

/**
 * Represents an authenticated user session.
 * userId is a UUID string (SQL Server UNIQUEIDENTIFIER).
 */
public class Session {
    private final String userId;
    private final String username;

    public Session(String userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public String getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }
}