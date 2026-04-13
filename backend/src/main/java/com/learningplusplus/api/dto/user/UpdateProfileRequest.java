package com.learningplusplus.api.dto.user;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 2, max = 50) String displayName,
        String avatarInitials
) {}
