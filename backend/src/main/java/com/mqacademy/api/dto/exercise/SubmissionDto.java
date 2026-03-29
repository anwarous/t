package com.mqacademy.api.dto.exercise;

import java.time.LocalDateTime;

public record SubmissionDto(
        String id,
        String exerciseId,
        String exerciseSlug,
        String exerciseTitle,
        String code,
        boolean passed,
        int xpEarned,
        LocalDateTime submittedAt
) {}
