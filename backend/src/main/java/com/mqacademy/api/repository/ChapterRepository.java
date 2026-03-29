package com.mqacademy.api.repository;

import com.mqacademy.api.model.Chapter;
import com.mqacademy.api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChapterRepository extends JpaRepository<Chapter, UUID> {
    @Query("SELECT DISTINCT c FROM Chapter c LEFT JOIN FETCH c.lessons WHERE c.course = :course ORDER BY c.orderIndex ASC")
    List<Chapter> findByCourseOrderByOrderIndexAsc(@Param("course") Course course);
}
