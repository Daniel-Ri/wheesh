package com.daniel.wheesh.user;

import jakarta.validation.constraints.NotEmpty;

public record LoginRequest(
    @NotEmpty(message = "usernameOrEmail should not be empty")
    String usernameOrEmail,
    @NotEmpty(message = "password should not be empty")
    String password) {
}
