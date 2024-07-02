package com.daniel.wheesh.train;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TrainSeeder {
    private static final Logger logger = LoggerFactory.getLogger(TrainSeeder.class);

    private final TrainRepository trainRepository;

    public void seed() {
        if (trainRepository.count() == 0) {
            logger.info("No trains found in the database. Seeding initial data.");

            List<Train> trains = new ArrayList<>();
            for (int i = 1; i <= 60; i++) {
                trains.add(
                    Train.builder()
                        .name("G%d".formatted(1200 + i))
                        .build()
                );
            }
            trainRepository.saveAll(trains);

            logger.info("Seeded initial trains data");
        } else {
            logger.info("Trains already exist in the database. No seeding needed.");
        }
    }

    public void unseed() {
        logger.info("Deleting all trains data.");
        trainRepository.deleteAll();
        logger.info("All trains data deleted.");
    }
}
