package com.daniel.wheesh.schedule;

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
public class SchedulesResponse {
    @JsonProperty("data")
    private List<ResponseDataSchedule> schedules;
}
