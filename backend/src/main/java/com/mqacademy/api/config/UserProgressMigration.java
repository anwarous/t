package com.mqacademy.api.config;

import com.mqacademy.api.model.User;
import com.mqacademy.api.repository.UserRepository;
import com.mqacademy.api.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class UserProgressMigration implements CommandLineRunner {

    private static final int XP_TO_LEVEL_UP = 60;

    private final UserRepository userRepository;

    public UserProgressMigration(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        boolean changed = false;

        for (User user : users) {
            int originalXp = user.getXp();
            int normalizedLevel = Math.max(1, (Math.max(0, originalXp) / XP_TO_LEVEL_UP) + 1);
            int normalizedXp = Math.max(0, originalXp) % XP_TO_LEVEL_UP;

            if (user.getStreak() < 1) {
                user.setStreak(1);
                changed = true;
            }

            if (user.getLevel() != normalizedLevel) {
                user.setLevel(normalizedLevel);
                changed = true;
            }

            if (user.getXp() != normalizedXp) {
                user.setXp(normalizedXp);
                changed = true;
            }

            String rank = UserService.calculateRank(normalizedLevel);
            if (!rank.equals(user.getRank())) {
                user.setRank(rank);
                changed = true;
            }
        }

        if (changed) {
            userRepository.saveAll(users);
        }
    }
}