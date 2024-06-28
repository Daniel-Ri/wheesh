package com.daniel.wheesh.passenger;

import com.daniel.wheesh.passenger.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataPassenger {
    private Long id;
    private Long userId;
    private Boolean isUser;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String idCard;
    private String name;
    private String email;
}
