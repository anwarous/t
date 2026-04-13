package com.learningplusplus.api.repository;

import com.learningplusplus.api.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    Optional<Exercise> findBySlug(String slug);
    List<Exercise> findByCategory(String category);
    List<Exercise> findByDifficulty(Exercise.Difficulty difficulty);
}
