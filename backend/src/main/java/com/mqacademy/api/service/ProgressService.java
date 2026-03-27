package com.mqacademy.api.service;

import com.mqacademy.api.dto.progress.ProgressDto;
import com.mqacademy.api.model.Course;
import com.mqacademy.api.model.User;
import com.mqacademy.api.model.UserProgress;
import com.mqacademy.api.repository.CourseRepository;
import com.mqacademy.api.repository.UserProgressRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressService {

    private final UserProgressRepository progressRepository;
    private final CourseRepository courseRepository;
    private final UserService userService;

    public ProgressService(UserProgressRepository progressRepository,
                           CourseRepository courseRepository,
                           UserService userService) {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.userService = userService;
    }

    public List<ProgressDto> getForUser(String username) {
        User user = userService.findByUsername(username);
        return progressRepository.findByUser(user).stream().map(this::toDto).toList();
    }

    @Transactional
    public ProgressDto markLessonComplete(String username, String courseSlug, String lessonId) {
        User user = userService.findByUsername(username);
        Course course = courseRepository.findBySlug(courseSlug)
                .orElseThrow(() -> new EntityNotFoundException("Course not found: " + courseSlug));

        UserProgress progress = progressRepository
                .findByUserAndCourse_Slug(user, courseSlug)
                .orElseGet(() -> UserProgress.builder().user(user).course(course).build());

        int newCompleted = Math.min(progress.getCompletedLessons() + 1, course.getTotalLessons());
        int newPercent = course.getTotalLessons() > 0
                ? (newCompleted * 100) / course.getTotalLessons()
                : 0;

        progress.setCompletedLessons(newCompleted);
        progress.setProgressPercent(newPercent);
        progress.setLastActivityAt(LocalDateTime.now());

        return toDto(progressRepository.save(progress));
    }

    private ProgressDto toDto(UserProgress p) {
        return new ProgressDto(
                p.getId(),
                p.getCourse().getId(),
                p.getCourse().getSlug(),
                p.getCourse().getTitle(),
                p.getCompletedLessons(),
                p.getCourse().getTotalLessons(),
                p.getProgressPercent(),
                p.getLastActivityAt()
        );
    }
}
