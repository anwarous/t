package com.mqacademy.api.controller;

import com.mqacademy.api.dto.progress.MarkLessonCompleteRequest;
import com.mqacademy.api.dto.progress.ProgressDto;
import com.mqacademy.api.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ResponseEntity<List<ProgressDto>> getProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(progressService.getForUser(userDetails.getUsername()));
    }

    @PostMapping("/{courseSlug}/lessons/{lessonId}/complete")
    public ResponseEntity<ProgressDto> markLessonComplete(
            @PathVariable String courseSlug,
            @PathVariable String lessonId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) MarkLessonCompleteRequest request) {
        return ResponseEntity.ok(
                progressService.markLessonComplete(userDetails.getUsername(), courseSlug, lessonId));
    }
}
