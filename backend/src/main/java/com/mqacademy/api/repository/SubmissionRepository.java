package com.mqacademy.api.repository;

import com.mqacademy.api.model.Submission;
import com.mqacademy.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    List<Submission> findByUserOrderBySubmittedAtDesc(User user);
    List<Submission> findByUserAndExercise_Slug(User user, String exerciseSlug);
    long countByUserAndPassedTrue(User user);
}
