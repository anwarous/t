package com.mqacademy.api.service;

import com.mqacademy.api.dto.exercise.ExerciseDetailDto;
import com.mqacademy.api.dto.exercise.ExerciseDto;
import com.mqacademy.api.dto.exercise.SubmissionDto;
import com.mqacademy.api.dto.exercise.SubmitCodeRequest;
import com.mqacademy.api.model.Exercise;
import com.mqacademy.api.model.Submission;
import com.mqacademy.api.model.User;
import com.mqacademy.api.repository.ExerciseRepository;
import com.mqacademy.api.repository.SubmissionRepository;
import com.mqacademy.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public ExerciseService(ExerciseRepository exerciseRepository,
                           SubmissionRepository submissionRepository,
                           UserRepository userRepository,
                           UserService userService) {
        this.exerciseRepository = exerciseRepository;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public List<ExerciseDto> listAll() {
        return exerciseRepository.findAll().stream().map(this::toDto).toList();
    }

    public ExerciseDetailDto getBySlug(String slug) {
        Exercise ex = exerciseRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found: " + slug));
        return toDetailDto(ex);
    }

    public List<ExerciseDto> listByCategory(String category) {
        return exerciseRepository.findByCategory(category).stream().map(this::toDto).toList();
    }

    @Transactional
    public SubmissionDto submit(String slug, String username, SubmitCodeRequest request) {
        Exercise exercise = exerciseRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found: " + slug));
        User user = userService.findByUsername(username);

        // Simulate pass/fail: code is considered passing if non-blank and length > 20
        boolean passed = request.code().trim().length() > 20;
        int xpEarned = passed ? exercise.getXpReward() : 0;

        Submission submission = Submission.builder()
                .user(user)
                .exercise(exercise)
                .code(request.code())
                .passed(passed)
                .xpEarned(xpEarned)
                .build();

        submissionRepository.save(submission);

        if (passed) {
            user = userService.addXp(username, xpEarned);
            user.setTotalSolved((int) submissionRepository.countByUserAndPassedTrue(user));
            userRepository.save(user);
        }

        return toSubmissionDto(submission);
    }

    public List<SubmissionDto> getUserSubmissions(String username) {
        User user = userService.findByUsername(username);
        return submissionRepository.findByUserOrderBySubmittedAtDesc(user)
                .stream().map(this::toSubmissionDto).toList();
    }

    private ExerciseDto toDto(Exercise e) {
        return new ExerciseDto(e.getId(), e.getSlug(), e.getTitle(), e.getDescription(),
                e.getDifficulty().name(), e.getCategory(), e.getXpReward());
    }

    private ExerciseDetailDto toDetailDto(Exercise e) {
        return new ExerciseDetailDto(e.getId(), e.getSlug(), e.getTitle(), e.getDescription(),
                e.getDifficulty().name(), e.getCategory(), e.getXpReward(),
                e.getStarterCode(), e.getHints(), e.getExamples(), e.getConstraints(), e.getTestCases());
    }

    private SubmissionDto toSubmissionDto(Submission s) {
        return new SubmissionDto(
                s.getId(),
                s.getExercise().getId(),
                s.getExercise().getSlug(),
                s.getExercise().getTitle(),
                s.getCode(),
                s.isPassed(),
                s.getXpEarned(),
                s.getSubmittedAt()
        );
    }
}
