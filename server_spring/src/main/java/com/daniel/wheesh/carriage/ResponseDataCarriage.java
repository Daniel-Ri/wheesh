package com.daniel.wheesh.carriage;

import com.daniel.wheesh.seat.ResponseDataSeat;
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
public class ResponseDataCarriage {
    private Long id;
    private Long carriageNumber;

    @JsonProperty("Seats")
    private List<ResponseDataSeat> seats;
}
