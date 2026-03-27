package com.mqacademy.api.dto.auth;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String email,
        String displayName
) {
    public AuthResponse(String token, String username, String email, String displayName) {
        this(token, "Bearer", username, email, displayName);
    }
}
