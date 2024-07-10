package com.daniel.wheesh.seat;

import com.daniel.wheesh.carriage.ResponseDataCarriage;
import com.daniel.wheesh.schedule.SeatClass;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataSeatWithCarriage {
    private Long id;
    private String seatNumber;
    private SeatClass seatClass;

    @JsonProperty("Carriage")
    private ResponseDataCarriage carriage;
}
