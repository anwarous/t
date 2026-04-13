package com.learningplusplus.api.controller;

import com.learningplusplus.api.dto.course.CourseDetailDto;
import com.learningplusplus.api.dto.course.CourseDto;
import com.learningplusplus.api.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> listCourses(
            @RequestParam(required = false) String difficulty) {
        if (difficulty != null && !difficulty.isBlank()) {
            return ResponseEntity.ok(courseService.listByDifficulty(difficulty));
        }
        return ResponseEntity.ok(courseService.listAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CourseDetailDto> getCourse(@PathVariable String slug) {
        return ResponseEntity.ok(courseService.getBySlug(slug));
    }
}
