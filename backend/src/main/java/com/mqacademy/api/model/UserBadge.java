package com.mqacademy.api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "user_badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBadge {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Badge badge;

    @Builder.Default
    private LocalDateTime earnedAt = LocalDateTime.now();
}
