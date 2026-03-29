package com.mqacademy.api.repository;

import com.mqacademy.api.model.Badge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BadgeRepository extends MongoRepository<Badge, String> {
    Optional<Badge> findBySlug(String slug);
}
