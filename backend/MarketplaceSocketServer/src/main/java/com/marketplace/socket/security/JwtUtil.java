package com.marketplace.socket.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

public class JwtUtil {

    private static final long EXP_SECONDS = 24L * 60L * 60L; // 24 hours

    private static SecretKey key() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET env var is missing");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public static String generate(long userId, String email) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(EXP_SECONDS);

        return Jwts.builder()
                .claims(Map.of(
                        "user_id", userId,
                        "email", email
                ))
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key())
                .compact();
    }

    public static Map<String, Object> verifyAndGetClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}