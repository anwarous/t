package com.mqacademy.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Exercise exercise;

    private String exerciseSlug;
    private String exerciseTitle;
    private String code;
    private boolean passed;
    private int xpEarned;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
}
