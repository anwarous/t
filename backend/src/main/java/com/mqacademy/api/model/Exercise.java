package com.mqacademy.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    public enum Difficulty { EASY, MEDIUM, HARD }

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String title;
    private String description;
    private Difficulty difficulty;
    private String category;
    private int xpReward;
    private String starterCode;
    private String solutionCode;
    private String hints;
    private String examples;
    private String constraints;
    private String testCases;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
