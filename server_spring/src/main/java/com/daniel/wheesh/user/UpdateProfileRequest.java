package com.daniel.wheesh.user;

import com.daniel.wheesh.config.MinAge;
import com.daniel.wheesh.config.NullOrNotBlank;
import com.daniel.wheesh.config.ValidEnum;
import com.daniel.wheesh.passenger.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
    private LocalDate dateOfBirth;

    @Pattern(regexp = "\\d{16}", message = "ID Card is in invalid format")
    private String idCard;

    @NullOrNotBlank(message = "Name can be null but not blank")
    private String name;
}
