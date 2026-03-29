package com.mqacademy.api.repository;

import com.mqacademy.api.model.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends MongoRepository<Exercise, String> {
    Optional<Exercise> findBySlug(String slug);
    List<Exercise> findByCategory(String category);
    List<Exercise> findByDifficulty(Exercise.Difficulty difficulty);
}
