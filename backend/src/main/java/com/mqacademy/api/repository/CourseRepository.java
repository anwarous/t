package com.mqacademy.api.repository;

import com.mqacademy.api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByDifficulty(Course.Difficulty difficulty);
    List<Course> findByCategory(String category);
}
