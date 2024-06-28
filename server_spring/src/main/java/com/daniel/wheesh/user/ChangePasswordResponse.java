package com.daniel.wheesh.user;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangePasswordResponse {
    private final String message = "Change password successfully";
}
