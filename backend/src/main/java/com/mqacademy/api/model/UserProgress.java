package com.mqacademy.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Course course;

    private String courseSlug;

    @Builder.Default
    private int completedLessons = 0;

    @Builder.Default
    private int progressPercent = 0;

    private LocalDateTime lastActivityAt;
}
