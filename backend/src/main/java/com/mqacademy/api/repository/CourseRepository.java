package com.mqacademy.api.repository;

import com.mqacademy.api.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findBySlug(String slug);
    List<Course> findByDifficulty(Course.Difficulty difficulty);
    List<Course> findByCategory(String category);
}
