package com.mqacademy.api.model;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    public enum LessonType { VIDEO, READING, PRACTICE, QUIZ }

    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String title;
    private LessonType type;
    private int durationMinutes;
    private int xpReward;
    private String videoUrl;
    private String content;
    private int orderIndex;

    @Builder.Default
    private boolean locked = false;
}
