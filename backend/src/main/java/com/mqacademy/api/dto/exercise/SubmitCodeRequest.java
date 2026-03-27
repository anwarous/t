package com.mqacademy.api.dto.exercise;

import jakarta.validation.constraints.NotBlank;

public record SubmitCodeRequest(
        @NotBlank String code
) {}
