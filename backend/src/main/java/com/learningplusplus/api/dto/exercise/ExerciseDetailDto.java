package com.learningplusplus.api.dto.exercise;

import java.util.UUID;

public record ExerciseDetailDto(
        UUID id,
        String slug,
        String title,
        String description,
        String difficulty,
        String category,
        int xpReward,
        String starterCode,
        String hints
) {}
