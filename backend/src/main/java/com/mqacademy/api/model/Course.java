package com.mqacademy.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    public enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String title;
    private String description;
    private String category;
    private Difficulty difficulty;
    private int totalLessons;
    private int durationMinutes;
    private int xpReward;
    private String colorHex;
    private String icon;
    private String tags;

    @Builder.Default
    private List<Chapter> chapters = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
