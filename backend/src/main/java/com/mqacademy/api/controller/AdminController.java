package com.mqacademy.api.controller;

import com.mqacademy.api.model.Badge;
import com.mqacademy.api.model.Course;
import com.mqacademy.api.model.Exercise;
import com.mqacademy.api.model.User;
import com.mqacademy.api.repository.BadgeRepository;
import com.mqacademy.api.repository.CourseRepository;
import com.mqacademy.api.repository.ExerciseRepository;
import com.mqacademy.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ExerciseRepository exerciseRepository;
    private final BadgeRepository badgeRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository,
                           CourseRepository courseRepository,
                           ExerciseRepository exerciseRepository,
                           BadgeRepository badgeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.exerciseRepository = exerciseRepository;
        this.badgeRepository = badgeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Long>> overview() {
        Map<String, Long> result = new HashMap<>();
        result.put("users", userRepository.count());
        result.put("courses", courseRepository.count());
        result.put("exercises", exerciseRepository.count());
        result.put("badges", badgeRepository.count());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> listUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(this::toUserMap).toList());
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> body) {
        User user = new User();
        user.setUsername(requireString(body, "username"));
        user.setEmail(requireString(body, "email"));
        user.setPassword(passwordEncoder.encode(requireString(body, "password")));
        user.setDisplayName(optionalString(body, "displayName"));
        user.setAvatarInitials(optionalString(body, "avatarInitials"));
        user.setRoles(parseRoles(body.get("roles")));
        User saved = userRepository.save(user);
        return ResponseEntity.ok(toUserMap(saved));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (body.containsKey("username")) user.setUsername(optionalString(body, "username"));
        if (body.containsKey("email")) user.setEmail(optionalString(body, "email"));
        if (body.containsKey("displayName")) user.setDisplayName(optionalString(body, "displayName"));
        if (body.containsKey("avatarInitials")) user.setAvatarInitials(optionalString(body, "avatarInitials"));
        if (body.containsKey("rank")) user.setRank(optionalString(body, "rank"));
        if (body.containsKey("xp")) user.setXp(parseInt(body.get("xp"), user.getXp()));
        if (body.containsKey("level")) user.setLevel(parseInt(body.get("level"), user.getLevel()));
        if (body.containsKey("streak")) user.setStreak(parseInt(body.get("streak"), user.getStreak()));
        if (body.containsKey("totalSolved")) user.setTotalSolved(parseInt(body.get("totalSolved"), user.getTotalSolved()));
        if (body.containsKey("password") && body.get("password") != null && !String.valueOf(body.get("password")).isBlank()) {
            user.setPassword(passwordEncoder.encode(String.valueOf(body.get("password"))));
        }
        if (body.containsKey("roles")) user.setRoles(parseRoles(body.get("roles")));

        return ResponseEntity.ok(toUserMap(userRepository.save(user)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Map<String, Object>>> listCourses() {
        return ResponseEntity.ok(courseRepository.findAll().stream().map(this::toCourseMap).toList());
    }

    @PostMapping("/courses")
    public ResponseEntity<Map<String, Object>> createCourse(@RequestBody Map<String, Object> body) {
        Course c = new Course();
        c.setSlug(requireString(body, "slug"));
        c.setTitle(requireString(body, "title"));
        c.setDescription(optionalString(body, "description"));
        c.setCategory(optionalString(body, "category"));
        c.setDifficulty(parseCourseDifficulty(body.get("difficulty")));
        c.setTotalLessons(parseInt(body.get("totalLessons"), 0));
        c.setDurationMinutes(parseInt(body.get("durationMinutes"), 0));
        c.setXpReward(parseInt(body.get("xpReward"), 0));
        c.setColorHex(optionalString(body, "colorHex"));
        c.setIcon(optionalString(body, "icon"));
        c.setTags(optionalString(body, "tags"));
        return ResponseEntity.ok(toCourseMap(courseRepository.save(c)));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<Map<String, Object>> updateCourse(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        if (body.containsKey("slug")) c.setSlug(optionalString(body, "slug"));
        if (body.containsKey("title")) c.setTitle(optionalString(body, "title"));
        if (body.containsKey("description")) c.setDescription(optionalString(body, "description"));
        if (body.containsKey("category")) c.setCategory(optionalString(body, "category"));
        if (body.containsKey("difficulty")) c.setDifficulty(parseCourseDifficulty(body.get("difficulty")));
        if (body.containsKey("totalLessons")) c.setTotalLessons(parseInt(body.get("totalLessons"), c.getTotalLessons()));
        if (body.containsKey("durationMinutes")) c.setDurationMinutes(parseInt(body.get("durationMinutes"), c.getDurationMinutes()));
        if (body.containsKey("xpReward")) c.setXpReward(parseInt(body.get("xpReward"), c.getXpReward()));
        if (body.containsKey("colorHex")) c.setColorHex(optionalString(body, "colorHex"));
        if (body.containsKey("icon")) c.setIcon(optionalString(body, "icon"));
        if (body.containsKey("tags")) c.setTags(optionalString(body, "tags"));
        return ResponseEntity.ok(toCourseMap(courseRepository.save(c)));
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exercises")
    public ResponseEntity<List<Map<String, Object>>> listExercises() {
        return ResponseEntity.ok(exerciseRepository.findAll().stream().map(this::toExerciseMap).toList());
    }

    @PostMapping("/exercises")
    public ResponseEntity<Map<String, Object>> createExercise(@RequestBody Map<String, Object> body) {
        Exercise e = new Exercise();
        e.setSlug(requireString(body, "slug"));
        e.setTitle(requireString(body, "title"));
        e.setDescription(optionalString(body, "description"));
        e.setDifficulty(parseExerciseDifficulty(body.get("difficulty")));
        e.setCategory(optionalString(body, "category"));
        e.setXpReward(parseInt(body.get("xpReward"), 0));
        e.setStarterCode(optionalString(body, "starterCode"));
        e.setSolutionCode(optionalString(body, "solutionCode"));
        e.setHints(optionalString(body, "hints"));
        return ResponseEntity.ok(toExerciseMap(exerciseRepository.save(e)));
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<Map<String, Object>> updateExercise(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        Exercise e = exerciseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Exercise not found"));
        if (body.containsKey("slug")) e.setSlug(optionalString(body, "slug"));
        if (body.containsKey("title")) e.setTitle(optionalString(body, "title"));
        if (body.containsKey("description")) e.setDescription(optionalString(body, "description"));
        if (body.containsKey("difficulty")) e.setDifficulty(parseExerciseDifficulty(body.get("difficulty")));
        if (body.containsKey("category")) e.setCategory(optionalString(body, "category"));
        if (body.containsKey("xpReward")) e.setXpReward(parseInt(body.get("xpReward"), e.getXpReward()));
        if (body.containsKey("starterCode")) e.setStarterCode(optionalString(body, "starterCode"));
        if (body.containsKey("solutionCode")) e.setSolutionCode(optionalString(body, "solutionCode"));
        if (body.containsKey("hints")) e.setHints(optionalString(body, "hints"));
        return ResponseEntity.ok(toExerciseMap(exerciseRepository.save(e)));
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable UUID id) {
        exerciseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/badges")
    public ResponseEntity<List<Map<String, Object>>> listBadges() {
        return ResponseEntity.ok(badgeRepository.findAll().stream().map(this::toBadgeMap).toList());
    }

    @PostMapping("/badges")
    public ResponseEntity<Map<String, Object>> createBadge(@RequestBody Map<String, Object> body) {
        Badge b = new Badge();
        b.setSlug(requireString(body, "slug"));
        b.setName(requireString(body, "name"));
        b.setDescription(optionalString(body, "description"));
        b.setIcon(optionalString(body, "icon"));
        b.setRarity(parseBadgeRarity(body.get("rarity")));
        return ResponseEntity.ok(toBadgeMap(badgeRepository.save(b)));
    }

    @PutMapping("/badges/{id}")
    public ResponseEntity<Map<String, Object>> updateBadge(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        Badge b = badgeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Badge not found"));
        if (body.containsKey("slug")) b.setSlug(optionalString(body, "slug"));
        if (body.containsKey("name")) b.setName(optionalString(body, "name"));
        if (body.containsKey("description")) b.setDescription(optionalString(body, "description"));
        if (body.containsKey("icon")) b.setIcon(optionalString(body, "icon"));
        if (body.containsKey("rarity")) b.setRarity(parseBadgeRarity(body.get("rarity")));
        return ResponseEntity.ok(toBadgeMap(badgeRepository.save(b)));
    }

    @DeleteMapping("/badges/{id}")
    public ResponseEntity<Void> deleteBadge(@PathVariable UUID id) {
        badgeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toUserMap(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("displayName", u.getDisplayName());
        m.put("avatarInitials", u.getAvatarInitials());
        m.put("xp", u.getXp());
        m.put("level", u.getLevel());
        m.put("streak", u.getStreak());
        m.put("totalSolved", u.getTotalSolved());
        m.put("rank", u.getRank());
        m.put("roles", u.getRoles());
        m.put("createdAt", u.getCreatedAt());
        return m;
    }

    private Map<String, Object> toCourseMap(Course c) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", c.getId());
        m.put("slug", c.getSlug());
        m.put("title", c.getTitle());
        m.put("description", c.getDescription());
        m.put("category", c.getCategory());
        m.put("difficulty", c.getDifficulty() != null ? c.getDifficulty().name() : null);
        m.put("totalLessons", c.getTotalLessons());
        m.put("durationMinutes", c.getDurationMinutes());
        m.put("xpReward", c.getXpReward());
        m.put("colorHex", c.getColorHex());
        m.put("icon", c.getIcon());
        m.put("tags", c.getTags());
        return m;
    }

    private Map<String, Object> toExerciseMap(Exercise e) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", e.getId());
        m.put("slug", e.getSlug());
        m.put("title", e.getTitle());
        m.put("description", e.getDescription());
        m.put("difficulty", e.getDifficulty() != null ? e.getDifficulty().name() : null);
        m.put("category", e.getCategory());
        m.put("xpReward", e.getXpReward());
        m.put("starterCode", e.getStarterCode());
        m.put("solutionCode", e.getSolutionCode());
        m.put("hints", e.getHints());
        return m;
    }

    private Map<String, Object> toBadgeMap(Badge b) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", b.getId());
        m.put("slug", b.getSlug());
        m.put("name", b.getName());
        m.put("description", b.getDescription());
        m.put("icon", b.getIcon());
        m.put("rarity", b.getRarity() != null ? b.getRarity().name() : null);
        return m;
    }

    private int parseInt(Object value, int fallback) {
        if (value == null) return fallback;
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }

    private String optionalString(Map<String, Object> body, String key) {
        Object value = body.get(key);
        return value == null ? null : String.valueOf(value);
    }

    private String requireString(Map<String, Object> body, String key) {
        String value = optionalString(body, key);
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Missing required field: " + key);
        }
        return value;
    }

    private Set<String> parseRoles(Object value) {
        if (value instanceof List<?> list) {
            Set<String> roles = list.stream()
                    .map(String::valueOf)
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .collect(Collectors.toSet());
            return roles.isEmpty() ? Set.of("USER") : roles;
        }
        return Set.of("USER");
    }

    private Course.Difficulty parseCourseDifficulty(Object value) {
        if (value == null) return Course.Difficulty.BEGINNER;
        return Course.Difficulty.valueOf(String.valueOf(value).toUpperCase());
    }

    private Exercise.Difficulty parseExerciseDifficulty(Object value) {
        if (value == null) return Exercise.Difficulty.EASY;
        return Exercise.Difficulty.valueOf(String.valueOf(value).toUpperCase());
    }

    private Badge.Rarity parseBadgeRarity(Object value) {
        if (value == null) return Badge.Rarity.COMMON;
        return Badge.Rarity.valueOf(String.valueOf(value).toUpperCase());
    }
}
