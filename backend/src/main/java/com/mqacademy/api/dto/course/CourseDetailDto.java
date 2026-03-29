package com.mqacademy.api.dto.course;

import java.util.List;

public record CourseDetailDto(
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
        String tags,
        List<ChapterDto> chapters
) {}
