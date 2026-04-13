package com.learningplusplus.api.dto.course;

import java.util.UUID;

public record CourseDto(
        UUID id,
        String slug,
        String title,
        String description,
        String category,
        String difficulty,
        int totalLessons,
        int durationMinutes,
        int xpReward,
        String colorHex,
        String icon,
        String tags
) {}
