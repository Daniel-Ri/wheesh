package com.daniel.wheesh.user;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SendEmailTokenResponse {
    private final String message = "Email sent successfully";
}
