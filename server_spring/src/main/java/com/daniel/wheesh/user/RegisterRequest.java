package com.daniel.wheesh.user;

import com.daniel.wheesh.config.MinAge;
import com.daniel.wheesh.config.ValidEnum;
import com.daniel.wheesh.passenger.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotEmpty(message = "username should not be empty")
    private String username;

    @NotEmpty(message = "password should not be empty")
    @Size(min = 6, message = "password must be at least 6 characters long")
    private String password;

    @ValidEnum(enumClass = Gender.class, message = "Gender can only be Male or Female")
    @NotEmpty(message = "gender should not be empty")
    private String gender;

    @MinAge(value = 17, message = "You should be at least 17 years old")
    private LocalDate dateOfBirth;

    @Pattern(regexp = "\\d{16}", message = "ID Card is in invalid format")
    private String idCard;

    @NotEmpty(message = "name should not be empty")
    private String name;

    @NotEmpty(message = "email should not be empty")
    @Email(message = "email is not in correct format")
    private String email;

    @NotEmpty(message = "emailToken should not be empty")
    private String emailToken;
}
