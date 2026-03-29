package com.mqacademy.api.dto.course;

import java.util.UUID;

public record LessonDto(
        UUID id,
        String title,
        String type,
        int durationMinutes,
        int xpReward,
        String videoUrl,
        boolean locked
) {}
