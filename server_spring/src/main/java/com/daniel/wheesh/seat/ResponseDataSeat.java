package com.daniel.wheesh.seat;

import com.daniel.wheesh.schedule.SeatClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataSeat {
    private Long id;
    private String seatNumber;
    private SeatClass seatClass;
    private Boolean isBooked;
}
