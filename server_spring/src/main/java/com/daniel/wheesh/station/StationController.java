package com.daniel.wheesh.station;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/station")
public class StationController {
    private final StationService service;

    @GetMapping
    private ResponseEntity<StationsResponse> getStations() {
        return ResponseEntity.ok(service.getStations());
    }
}
