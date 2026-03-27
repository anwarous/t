package com.mqacademy.api.dto.progress;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProgressDto(
        UUID id,
        UUID courseId,
        String courseSlug,
        String courseTitle,
        int completedLessons,
        int totalLessons,
        int progressPercent,
        LocalDateTime lastActivityAt
) {}
