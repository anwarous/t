package com.mqacademy.api.service;

import com.mqacademy.api.dto.leaderboard.LeaderboardEntryDto;
import com.mqacademy.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final UserRepository userRepository;

    public LeaderboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<LeaderboardEntryDto> getTopUsers() {
        var users = userRepository.findTop10ByOrderByXpDesc();
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
                    u.getTotalSolved()
            ));
        }
        return result;
    }
}
