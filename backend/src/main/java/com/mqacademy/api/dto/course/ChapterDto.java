package com.mqacademy.api.dto.course;

import java.util.List;

public record ChapterDto(
        String id,
        String title,
        List<LessonDto> lessons
) {}
