package com.daniel.wheesh.schedule;

import com.daniel.wheesh.carriage.ResponseDataCarriage;
import com.daniel.wheesh.scheduleprice.ResponseDataSchedulePrice;
import com.daniel.wheesh.station.ResponseDataStation;
import com.daniel.wheesh.train.TrainDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataScheduleWithMoreDetails {
    private Long id;

    @JsonProperty("Train")
    private TrainDTO train;

    @JsonProperty("departureStation")
    private ResponseDataStation departureStation;

    @JsonProperty("arrivalStation")
    private ResponseDataStation arrivalStation;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private Availibility firstSeatAvailable;

    private Availibility businessSeatAvailable;

    private Availibility economySeatAvailable;

    private Long firstSeatRemainder;

    private Long businessSeatRemainder;

    private Long economySeatRemainder;

    private List<ResponseDataSchedulePrice> prices;

    private List<ResponseDataCarriage> carriages;
}
