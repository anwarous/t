package com.learningplusplus.api.config;

import com.learningplusplus.api.model.Badge;
import com.learningplusplus.api.model.User;
import com.learningplusplus.api.model.UserBadge;
import com.learningplusplus.api.repository.BadgeRepository;
import com.learningplusplus.api.repository.UserBadgeRepository;
import com.learningplusplus.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class EliteUserInitializer implements CommandLineRunner {

    private static final String ELITE_EMAIL = "elite.user@learningplusplus.dev";
    private static final String ELITE_USERNAME = "elite_user";
    private static final String ELITE_PASSWORD = "password";

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final PasswordEncoder passwordEncoder;

    public EliteUserInitializer(UserRepository userRepository,
                                BadgeRepository badgeRepository,
                                UserBadgeRepository userBadgeRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.badgeRepository = badgeRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        User elite = userRepository.findByUsername(ELITE_USERNAME)
            .or(() -> userRepository.findByEmail(ELITE_EMAIL))
            .orElseGet(User::new);

        elite.setUsername(ELITE_USERNAME);
        elite.setEmail(ELITE_EMAIL);
        elite.setPassword(passwordEncoder.encode(ELITE_PASSWORD));
        elite.setDisplayName("Elite User");
        elite.setAvatarInitials("EU");
        elite.setRoles(new HashSet<>(Set.of("USER")));

        // Stored as per-level progress model: 20/60 XP at level 72.
        elite.setXp(20);
        elite.setLevel(72);
        elite.setStreak(120);
        elite.setTotalSolved(350);
        elite.setRank("Legend");

        elite = userRepository.save(elite);
        final User finalElite = elite;

        List<String> badgeSlugs = List.of(
                "first-solve",
                "streak-7",
                "xp-1000",
                "solved-10",
                "xp-10000"
        );

        for (String slug : badgeSlugs) {
            badgeRepository.findBySlug(slug).ifPresent(badge -> {
                if (userBadgeRepository.existsByUserAndBadge(finalElite, badge)) {
                    return;
                }

                UserBadge userBadge = UserBadge.builder()
                        .user(finalElite)
                        .badge(badge)
                        .build();
                userBadgeRepository.save(userBadge);
            });
        }
    }
}