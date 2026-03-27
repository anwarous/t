package com.mqacademy.api.controller;

import com.mqacademy.api.dto.exercise.ExerciseDetailDto;
import com.mqacademy.api.dto.exercise.ExerciseDto;
import com.mqacademy.api.dto.exercise.SubmissionDto;
import com.mqacademy.api.dto.exercise.SubmitCodeRequest;
import com.mqacademy.api.service.ExerciseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<List<ExerciseDto>> listExercises(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(exerciseService.listByCategory(category));
        }
        return ResponseEntity.ok(exerciseService.listAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ExerciseDetailDto> getExercise(@PathVariable String slug) {
        return ResponseEntity.ok(exerciseService.getBySlug(slug));
    }

    @PostMapping("/{slug}/submit")
    public ResponseEntity<SubmissionDto> submitCode(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubmitCodeRequest request) {
        SubmissionDto result = exerciseService.submit(slug, userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
