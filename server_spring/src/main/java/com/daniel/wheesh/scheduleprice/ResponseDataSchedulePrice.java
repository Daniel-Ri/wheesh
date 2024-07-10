package com.daniel.wheesh.scheduleprice;

import com.daniel.wheesh.schedule.SeatClass;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataSchedulePrice {
    private Long id;
    private SeatClass seatClass;
    private Long price;
}
