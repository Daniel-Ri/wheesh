package com.daniel.wheesh.scheduleday;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDayDTO {
    private Long departureStationId;
    private Long arrivalStationId;
    private String departureTime;
    private String arrivalTime;
}
