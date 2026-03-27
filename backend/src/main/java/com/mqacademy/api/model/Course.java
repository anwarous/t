package com.mqacademy.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    public enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private int totalLessons;
    private int durationMinutes;
    private int xpReward;
    private String colorHex;
    private String icon;

    @Column(name = "tags")
    private String tags;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
