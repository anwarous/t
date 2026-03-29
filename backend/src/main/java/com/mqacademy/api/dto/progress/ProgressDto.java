package com.mqacademy.api.dto.progress;

import java.time.LocalDateTime;

public record ProgressDto(
        String id,
        String courseId,
        String courseSlug,
        String courseTitle,
        int completedLessons,
        int totalLessons,
        int progressPercent,
        LocalDateTime lastActivityAt
) {}
