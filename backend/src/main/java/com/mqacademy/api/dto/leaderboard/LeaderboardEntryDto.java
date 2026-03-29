package com.mqacademy.api.dto.leaderboard;

public record LeaderboardEntryDto(
        int position,
        String userId,
        String username,
        String displayName,
        String avatarInitials,
        int xp,
        int level,
        String rank,
        int totalSolved
) {}
