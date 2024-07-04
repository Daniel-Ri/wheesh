package com.daniel.wheesh.schedule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedule")
public class ScheduleController {
    private final ScheduleService service;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping("/latestDate")
    private ResponseEntity<LatestDateResponse> getLatestDate() {
        return ResponseEntity.ok(service.getLatestDate());
    }

    @GetMapping("/{departureStationId}/{arrivalStationId}/{date}")
    private ResponseEntity<SchedulesResponse> getSchedules(
        @PathVariable("departureStationId") Long departureStationId,
        @PathVariable("arrivalStationId") Long arrivalStationId,
        @PathVariable("date") String date
    ) {
        return ResponseEntity.ok(service.getSchedules(departureStationId, arrivalStationId,
            LocalDate.parse(date, formatter)));
    }

    @GetMapping("/{scheduleId}")
    private ResponseEntity<OneScheduleResponse> getOneSchedule(
        @PathVariable("scheduleId") Long scheduleId
    ) {
        return ResponseEntity.ok(service.getOneSchedule(scheduleId));
    }
}
