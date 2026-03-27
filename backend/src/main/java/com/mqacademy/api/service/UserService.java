package com.mqacademy.api.service;

import com.mqacademy.api.dto.user.UpdateProfileRequest;
import com.mqacademy.api.dto.user.UserBadgeDto;
import com.mqacademy.api.dto.user.UserProfileDto;
import com.mqacademy.api.model.User;
import com.mqacademy.api.repository.UserBadgeRepository;
import com.mqacademy.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

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
    public void addXp(String username, int xpAmount) {
        User user = findByUsername(username);
        int newXp = user.getXp() + xpAmount;
        user.setXp(newXp);
        user.setLevel(calculateLevel(newXp));
        user.setRank(calculateRank(newXp));
        userRepository.save(user);
    }

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
        return Math.min(30, Math.max(1, xp / 250));
    }

    public static String calculateRank(int xp) {
        if (xp < 500)   return "Novice";
        if (xp < 1500)  return "Apprentice";
        if (xp < 3000)  return "Practitioner";
        if (xp < 6000)  return "Expert";
        if (xp < 12000) return "Master";
        if (xp < 25000) return "Grandmaster";
        return "Legend";
    }
}
