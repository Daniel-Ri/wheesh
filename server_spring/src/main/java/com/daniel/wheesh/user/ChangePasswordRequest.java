package com.daniel.wheesh.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordRequest {
    @NotEmpty(message = "Old password should not be empty")
    private String oldPassword;

    @NotEmpty(message = "New password should not be empty")
    @Size(min = 6, message = "password must be at least 6 characters long")
    private String newPassword;
}
