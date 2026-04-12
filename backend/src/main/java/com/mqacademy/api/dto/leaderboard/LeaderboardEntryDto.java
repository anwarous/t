package com.mqacademy.api.dto.leaderboard;

import java.util.UUID;

public record LeaderboardEntryDto(
        int position,
        UUID userId,
        String username,
        String displayName,
        String avatarInitials,
        int xp,
        int level,
        String rank,
        int streak,
        int totalSolved
) {}
