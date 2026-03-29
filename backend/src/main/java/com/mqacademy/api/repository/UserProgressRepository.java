package com.mqacademy.api.repository;

import com.mqacademy.api.model.User;
import com.mqacademy.api.model.UserProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends MongoRepository<UserProgress, String> {
    List<UserProgress> findByUser(User user);
    Optional<UserProgress> findByUserAndCourseSlug(User user, String courseSlug);
}
