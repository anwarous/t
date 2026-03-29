package com.mqacademy.api.repository;

import com.mqacademy.api.model.Chapter;
import com.mqacademy.api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChapterRepository extends JpaRepository<Chapter, UUID> {
    List<Chapter> findByCourseOrderByOrderIndexAsc(Course course);
}
