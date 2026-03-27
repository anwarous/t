package com.mqacademy.api.service;

import com.mqacademy.api.dto.course.CourseDetailDto;
import com.mqacademy.api.dto.course.CourseDto;
import com.mqacademy.api.model.Course;
import com.mqacademy.api.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseDto> listAll() {
        return courseRepository.findAll().stream().map(this::toDto).toList();
    }

    public CourseDetailDto getBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Course not found: " + slug));
        return toDetailDto(course);
    }

    public List<CourseDto> listByDifficulty(String difficulty) {
        Course.Difficulty diff = Course.Difficulty.valueOf(difficulty.toUpperCase());
        return courseRepository.findByDifficulty(diff).stream().map(this::toDto).toList();
    }

    private CourseDto toDto(Course c) {
        return new CourseDto(
                c.getId(), c.getSlug(), c.getTitle(), c.getDescription(),
                c.getCategory(), c.getDifficulty().name(), c.getTotalLessons(),
                c.getDurationMinutes(), c.getXpReward(), c.getColorHex(),
                c.getIcon(), c.getTags()
        );
    }

    private CourseDetailDto toDetailDto(Course c) {
        List<String> chapters = buildMockChapters(c.getSlug(), c.getTotalLessons());
        return new CourseDetailDto(
                c.getId(), c.getSlug(), c.getTitle(), c.getDescription(),
                c.getCategory(), c.getDifficulty().name(), c.getTotalLessons(),
                c.getDurationMinutes(), c.getXpReward(), c.getColorHex(),
                c.getIcon(), c.getTags(), chapters
        );
    }

    private List<String> buildMockChapters(String slug, int totalLessons) {
        return java.util.stream.IntStream.rangeClosed(1, Math.min(totalLessons, 10))
                .mapToObj(i -> "Chapter " + i + ": " + slug + " – Lesson " + i)
                .toList();
    }
}
