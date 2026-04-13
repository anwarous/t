package com.learningplusplus.api.config;

import com.learningplusplus.api.model.User;
import com.learningplusplus.api.repository.ExerciseRepository;
import com.learningplusplus.api.repository.SubmissionRepository;
import com.learningplusplus.api.repository.UserRepository;
import com.learningplusplus.api.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class UserProgressMigration implements CommandLineRunner {

    private static final int XP_TO_LEVEL_UP = 60;

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final ExerciseRepository exerciseRepository;

    public UserProgressMigration(UserRepository userRepository,
                                 SubmissionRepository submissionRepository,
                                 ExerciseRepository exerciseRepository) {
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<User> users = userRepository.findAll();
        int maxSolvable = (int) exerciseRepository.count();
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

            int solvedDistinct = (int) Math.min(
                    submissionRepository.countDistinctExercise_IdByUserAndPassedTrue(user),
                    maxSolvable
            );
            if (user.getTotalSolved() != solvedDistinct) {
                user.setTotalSolved(solvedDistinct);
                changed = true;
            }
        }

        if (changed) {
            userRepository.saveAll(users);
        }
    }
}