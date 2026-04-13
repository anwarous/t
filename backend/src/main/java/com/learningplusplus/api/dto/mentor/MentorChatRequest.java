package com.learningplusplus.api.dto.mentor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record MentorChatRequest(
        @NotBlank String message,
        @Valid List<MentorMessageDto> history
) {}
