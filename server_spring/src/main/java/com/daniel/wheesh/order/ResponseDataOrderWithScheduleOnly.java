package com.daniel.wheesh.order;

import com.daniel.wheesh.schedule.ResponseDataScheduleWithStationsOnly;
import com.daniel.wheesh.schedule.ResponseDataScheduleWithoutAvailability;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataOrderWithScheduleOnly {
    private Long id;
    private Boolean isNotified;

    @JsonProperty("Schedule")
    private ResponseDataScheduleWithStationsOnly schedule;
}
