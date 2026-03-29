package com.mqacademy.api.repository;

import com.mqacademy.api.model.Submission;
import com.mqacademy.api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByUserOrderBySubmittedAtDesc(User user);
    List<Submission> findByUserAndExerciseSlug(User user, String exerciseSlug);
    long countByUserAndPassedTrue(User user);
}
