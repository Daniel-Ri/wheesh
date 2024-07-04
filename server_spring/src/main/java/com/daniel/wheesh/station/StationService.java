package com.daniel.wheesh.station;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {
    private final StationRepository stationRepository;

    public StationsResponse getStations() {
        List<Station> stations = stationRepository.findAll();

        List<ResponseDataStation> responseDataStations = stations.stream()
            .map(station -> ResponseDataStation.builder()
                .id(station.getId())
                .name(station.getName())
                .build()
            )
            .toList();

        return StationsResponse.builder()
            .stations(responseDataStations)
            .build();
    }
}
