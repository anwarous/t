package com.mqacademy.api.repository;

import com.mqacademy.api.model.User;
import com.mqacademy.api.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {
    List<UserProgress> findByUser(User user);
    Optional<UserProgress> findByUserAndCourse_Slug(User user, String courseSlug);
}
