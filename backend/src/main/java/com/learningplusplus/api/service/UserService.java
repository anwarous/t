package com.learningplusplus.api.service;

import com.learningplusplus.api.dto.user.UpdateProfileRequest;
import com.learningplusplus.api.dto.user.UserBadgeDto;
import com.learningplusplus.api.dto.user.UserProfileDto;
import com.learningplusplus.api.model.User;
import com.learningplusplus.api.repository.UserBadgeRepository;
import com.learningplusplus.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private static final int XP_TO_LEVEL_UP = 60;

    private final UserRepository userRepository;
    private final UserBadgeRepository userBadgeRepository;

    public UserService(UserRepository userRepository, UserBadgeRepository userBadgeRepository) {
        this.userRepository = userRepository;
        this.userBadgeRepository = userBadgeRepository;
    }

    public UserProfileDto getProfile(String username) {
        User user = findByUsername(username);
        return toProfileDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(String username, UpdateProfileRequest request) {
        User user = findByUsername(username);
        if (request.displayName() != null && !request.displayName().isBlank()) {
            user.setDisplayName(request.displayName());
        }
        if (request.avatarInitials() != null && !request.avatarInitials().isBlank()) {
            user.setAvatarInitials(request.avatarInitials());
        }
        return toProfileDto(userRepository.save(user));
    }

    @Transactional
    public User addXp(String username, int xpAmount) {
        User user = findByUsername(username);
        int newXp = user.getXp() + xpAmount;
        int newLevel = user.getLevel();

        while (newXp >= XP_TO_LEVEL_UP) {
            newXp -= XP_TO_LEVEL_UP;
            newLevel += 1;
        }

        user.setXp(newXp);
        user.setLevel(newLevel);
        user.setRank(calculateRank(newLevel));
        return userRepository.save(user);
    }

    @Transactional
    public List<UserBadgeDto> getBadges(String username) {
        User user = findByUsername(username);
        return userBadgeRepository.findByUser(user).stream()
                .map(ub -> new UserBadgeDto(
                        ub.getId(),
                        ub.getBadge().getSlug(),
                        ub.getBadge().getName(),
                        ub.getBadge().getDescription(),
                        ub.getBadge().getIcon(),
                        ub.getBadge().getRarity().name(),
                        ub.getEarnedAt()
                ))
                .toList();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "User not found: " + username));
    }

    private UserProfileDto toProfileDto(User user) {
        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarInitials(),
                user.getXp(),
                user.getLevel(),
                user.getStreak(),
                user.getTotalSolved(),
                user.getRank(),
                user.getCreatedAt()
        );
    }

    public static int calculateLevel(int xp) {
        return Math.max(1, (xp / XP_TO_LEVEL_UP) + 1);
    }

    public static String calculateRank(int level) {
        if (level < 5)   return "Novice";
        if (level < 10)  return "Apprentice";
        if (level < 15)  return "Practitioner";
        if (level < 20)  return "Expert";
        if (level < 25)  return "Master";
        if (level < 30) return "Grandmaster";
        return "Legend";
    }
}
