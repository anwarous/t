package com.learningplusplus.api.repository;

import com.learningplusplus.api.model.User;
import com.learningplusplus.api.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    List<UserBadge> findByUser(User user);
    boolean existsByUserAndBadge(User user, com.learningplusplus.api.model.Badge badge);
}
