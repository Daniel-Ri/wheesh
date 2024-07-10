package com.daniel.wheesh.user;

import com.daniel.wheesh.passenger.ResponseDataPassenger;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponseData {
    private Long id;
    private String username;
    private String role;
    private String email;

    @JsonProperty("Passengers")
    private List<ResponseDataPassenger> passengers;
}
