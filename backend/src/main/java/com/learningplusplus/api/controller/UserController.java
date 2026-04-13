package com.learningplusplus.api.controller;

import com.learningplusplus.api.dto.exercise.SubmissionDto;
import com.learningplusplus.api.dto.user.UpdateProfileRequest;
import com.learningplusplus.api.dto.user.UserBadgeDto;
import com.learningplusplus.api.dto.user.UserProfileDto;
import com.learningplusplus.api.service.ExerciseService;
import com.learningplusplus.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ExerciseService exerciseService;

    public UserController(UserService userService, ExerciseService exerciseService) {
        this.userService = userService;
        this.exerciseService = exerciseService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateMe(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/me/badges")
    public ResponseEntity<List<UserBadgeDto>> getMyBadges(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getBadges(userDetails.getUsername()));
    }

    @GetMapping("/me/submissions")
    public ResponseEntity<List<SubmissionDto>> getMySubmissions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(exerciseService.getUserSubmissions(userDetails.getUsername()));
    }
}
