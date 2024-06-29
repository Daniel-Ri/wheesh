package com.daniel.wheesh.user;

import com.daniel.wheesh.constraints.ValidEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendEmailTokenRequest {
    @NotEmpty(message = "Email should not be empty")
    @Email(message = "Email is in wrong format")
    String email;

    @ValidEnum(enumClass = Action.class, message = "Action can only be create or update")
    String action;
}
