package com.learningplusplus.api.service;

import com.learningplusplus.api.dto.leaderboard.LeaderboardEntryDto;
import com.learningplusplus.api.model.User;
import com.learningplusplus.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;

    public LeaderboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<LeaderboardEntryDto> getTopUsers() {
        var users = userRepository.findAll().stream()
            .sorted(Comparator
                .comparingInt(User::getLevel).reversed()
                .thenComparing(Comparator.comparingInt(User::getXp).reversed())
                .thenComparing(Comparator.comparingInt(User::getTotalSolved).reversed())
                .thenComparing(Comparator.comparingInt(User::getStreak).reversed()))
            .limit(10)
            .toList();
        List<LeaderboardEntryDto> result = new ArrayList<>();
        for (int i = 0; i < users.size(); i++) {
            var u = users.get(i);
            result.add(new LeaderboardEntryDto(
                    i + 1,
                    u.getId(),
                    u.getUsername(),
                    u.getDisplayName(),
                    u.getAvatarInitials(),
                    u.getXp(),
                    u.getLevel(),
                    u.getRank(),
                    u.getStreak(),
                    u.getTotalSolved()
            ));
        }
        return result;
    }
}
