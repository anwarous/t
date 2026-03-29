package com.mqacademy.api.dto.course;

public record CourseDto(
        String id,
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
