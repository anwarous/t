package com.mqacademy.api.dto.exercise;

public record ExerciseDetailDto(
        String id,
        String slug,
        String title,
        String description,
        String difficulty,
        String category,
        int xpReward,
        String starterCode,
        String hints,
        String examples,
        String constraints,
        String testCases
) {}
