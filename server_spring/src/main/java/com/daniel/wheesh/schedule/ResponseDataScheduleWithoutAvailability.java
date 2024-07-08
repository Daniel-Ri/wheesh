package com.daniel.wheesh.schedule;

import com.daniel.wheesh.station.ResponseDataStation;
import com.daniel.wheesh.train.TrainDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataScheduleWithoutAvailability {
    private Long id;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private ResponseDataStation departureStation;
    private ResponseDataStation arrivalStation;

    @JsonProperty("Train")
    private TrainDTO train;
}
