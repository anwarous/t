package com.mqacademy.api.model;

import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter {

    @Builder.Default
    private String id = UUID.randomUUID().toString();

    private String title;
    private int orderIndex;

    @Builder.Default
    private List<Lesson> lessons = new ArrayList<>();
}
