package com.mqacademy.api.dto.course;

import java.util.List;
import java.util.UUID;

public record CourseDetailDto(
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
        String tags,
        List<String> chapters
) {}
