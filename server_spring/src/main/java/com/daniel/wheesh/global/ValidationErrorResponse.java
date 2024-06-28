package com.daniel.wheesh.global;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidationErrorResponse {
    private final String status = "Validation Error";
    private String message;
}
