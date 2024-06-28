package com.daniel.wheesh.passenger;

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
public class PassengersResponse {
    @JsonProperty("data")
    private List<ResponseDataPassenger> passengers;
}
