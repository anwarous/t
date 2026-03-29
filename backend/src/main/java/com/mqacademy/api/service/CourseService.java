package com.mqacademy.api.service;

import com.mqacademy.api.dto.course.ChapterDto;
import com.mqacademy.api.dto.course.CourseDetailDto;
import com.mqacademy.api.dto.course.CourseDto;
import com.mqacademy.api.dto.course.LessonDto;
import com.mqacademy.api.exception.NotFoundException;
import com.mqacademy.api.model.Chapter;
import com.mqacademy.api.model.Course;
import com.mqacademy.api.model.Lesson;
import com.mqacademy.api.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
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
                .orElseThrow(() -> new NotFoundException("Course not found: " + slug));
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
        List<ChapterDto> chapterDtos = c.getChapters().stream()
                .sorted(Comparator.comparingInt(Chapter::getOrderIndex))
                .map(this::toChapterDto)
                .toList();
        return new CourseDetailDto(
                c.getId(), c.getSlug(), c.getTitle(), c.getDescription(),
                c.getCategory(), c.getDifficulty().name(), c.getTotalLessons(),
                c.getDurationMinutes(), c.getXpReward(), c.getColorHex(),
                c.getIcon(), c.getTags(), chapterDtos
        );
    }

    private ChapterDto toChapterDto(Chapter ch) {
        List<LessonDto> lessons = ch.getLessons().stream()
                .sorted(Comparator.comparingInt(Lesson::getOrderIndex))
                .map(this::toLessonDto)
                .toList();
        return new ChapterDto(ch.getId(), ch.getTitle(), lessons);
    }

    private LessonDto toLessonDto(Lesson l) {
        return new LessonDto(l.getId(), l.getTitle(), l.getType().name(),
                l.getDurationMinutes(), l.getXpReward(), l.getVideoUrl(), l.isLocked());
    }
}
