package com.daniel.wheesh.passenger;

import com.daniel.wheesh.config.LocalDateDeserializer;
import com.daniel.wheesh.constraints.MinAge;
import com.daniel.wheesh.constraints.ValidEnum;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePassengerRequest {
    @ValidEnum(enumClass = Gender.class, required = false, message = "Gender can only be Male or Female")
    private String gender;

    @MinAge(value = 17, required = false, message = "You should be at least 17 years old")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dateOfBirth;

    @Pattern(regexp = "\\d{16}", message = "ID Card is in invalid format")
    private String idCard;

    private String name;

    @Email(message = "email is not in correct format")
    private String email;
}
