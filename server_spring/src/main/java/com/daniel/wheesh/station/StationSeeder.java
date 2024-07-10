package com.daniel.wheesh.station;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class StationSeeder {
    private static final Logger logger = LoggerFactory.getLogger(StationSeeder.class);

    private final StationRepository stationRepository;

    public void seedStations() {
        if (stationRepository.count() == 0) {
            logger.info("No stations found in the database. Seeding initial data.");

            Station[] stations = new Station[]{
                Station.builder()
                    .name("Halim")
                    .build(),
                Station.builder()
                    .name("Karawang")
                    .build(),
                Station.builder()
                    .name("Padalarang")
                    .build(),
                Station.builder()
                    .name("Tegalluar")
                    .build(),
            };
            stationRepository.saveAll(Arrays.asList(stations));

            logger.info("Seeded initial stations data");
        } else {
            logger.info("Stations already exist in the database. No seeding needed.");
        }
    }

    public void unseedStations() {
        logger.info("Deleting all stations data.");
        stationRepository.deleteAll();
        logger.info("All stations data deleted.");
    }
}
