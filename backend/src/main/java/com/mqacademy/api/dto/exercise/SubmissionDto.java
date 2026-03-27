package com.mqacademy.api.dto.exercise;

import java.time.LocalDateTime;
import java.util.UUID;

public record SubmissionDto(
        UUID id,
        UUID exerciseId,
        String exerciseSlug,
        String exerciseTitle,
        String code,
        boolean passed,
        int xpEarned,
        LocalDateTime submittedAt
) {}
