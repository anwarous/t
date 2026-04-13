package com.learningplusplus.api.dto.mentor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record MentorMessageDto(
        @Pattern(regexp = "user|assistant", message = "role must be user or assistant") String role,
        @NotBlank String content
) {}
