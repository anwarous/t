package com.mqacademy.api.dto.course;

public record LessonDto(
        String id,
        String title,
        String type,
        int durationMinutes,
        int xpReward,
        String videoUrl,
        boolean locked
) {}
