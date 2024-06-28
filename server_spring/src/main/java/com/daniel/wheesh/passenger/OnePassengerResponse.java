package com.daniel.wheesh.passenger;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OnePassengerResponse {
    @JsonProperty("data")
    private ResponseDataPassenger passenger;
}
