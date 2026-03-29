package com.mqacademy.api.dto.course;

import java.util.List;
import java.util.UUID;

public record ChapterDto(
        UUID id,
        String title,
        List<LessonDto> lessons
) {}
