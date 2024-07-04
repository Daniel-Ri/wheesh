package com.daniel.wheesh.station;

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
public class StationsResponse {
    @JsonProperty("data")
    private List<ResponseDataStation> stations;
}
