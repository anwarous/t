package com.mqacademy.api.dto.user;

import java.time.LocalDateTime;

public record UserProfileDto(
        String id,
        String username,
        String email,
        String displayName,
        String avatarInitials,
        int xp,
        int level,
        int streak,
        int totalSolved,
        String rank,
        LocalDateTime createdAt
) {}
