package com.learningplusplus.api.dto.user;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileDto(
        UUID id,
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
