package com.daniel.wheesh.user;

import com.daniel.wheesh.config.LocalDateDeserializer;
import com.daniel.wheesh.constraints.MinAge;
import com.daniel.wheesh.constraints.NullOrNotBlank;
import com.daniel.wheesh.constraints.ValidEnum;
import com.daniel.wheesh.passenger.Gender;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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
public class UpdateProfileRequest {
    @NullOrNotBlank(message = "Username can be null but not blank")
    private String username;

    @ValidEnum(enumClass = Gender.class, required = false, message = "Gender can only be Male or Female")
    private String gender;

    @MinAge(value = 17, required = false, message = "You should be at least 17 years old")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate dateOfBirth;

    @Pattern(regexp = "\\d{16}", message = "ID Card is in invalid format")
    private String idCard;

    @NullOrNotBlank(message = "Name can be null but not blank")
    private String name;
}
