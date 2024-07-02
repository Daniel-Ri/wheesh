package com.daniel.wheesh.carriage;

import com.daniel.wheesh.train.Train;
import com.daniel.wheesh.train.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CarriageSeeder {
    private static final Logger logger = LoggerFactory.getLogger(CarriageSeeder.class);

    private final TrainRepository trainRepository;
    private final CarriageRepository carriageRepository;

    public void seed() {
        if (carriageRepository.count() == 0) {
            logger.info("No carriages found in the database. Seeding initial data.");

            List<Train> trains = trainRepository.findAll();
            List<Carriage> carriages = new ArrayList<>();

            for (Train train: trains) {
                for (long i = 1; i <= 8; i++) {
                    Carriage carriage = Carriage.builder()
                        .train(train)
                        .carriageNumber(i)
                        .build();
                    carriages.add(carriage);
                }
            }

            carriageRepository.saveAll(carriages);
            logger.info("Seeded initial carriages data");
        } else {
            logger.info("Carriages already exist in the database. No seeding needed.");
        }
    }

    public void unseed() {
        logger.info("Deleting all carriages data.");
        carriageRepository.deleteAll();
        logger.info("All carriages data deleted.");
    }
}
