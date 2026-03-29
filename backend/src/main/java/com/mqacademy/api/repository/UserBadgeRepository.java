package com.mqacademy.api.repository;

import com.mqacademy.api.model.User;
import com.mqacademy.api.model.UserBadge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBadgeRepository extends MongoRepository<UserBadge, String> {
    List<UserBadge> findByUser(User user);
}
