package com.mqacademy.api.dto.user;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserBadgeDto(
        UUID id,
        String badgeSlug,
        String badgeName,
        String badgeDescription,
        String badgeIcon,
        String rarity,
        LocalDateTime earnedAt
) {}
