package com.mqacademy.api.dto.exercise;

public record ExerciseDto(
        String id,
        String slug,
        String title,
        String description,
        String difficulty,
        String category,
        int xpReward
) {}
