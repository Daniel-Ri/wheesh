package com.daniel.wheesh.seat;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.carriage.CarriageRepository;
import com.daniel.wheesh.schedule.SeatClass;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SeatSeeder {
    private static final Logger logger = LoggerFactory.getLogger(SeatSeeder.class);
    private static final int BATCH_SIZE = 100;

    private final CarriageRepository carriageRepository;
    private final SeatRepository seatRepository;

    public void seed() {
        if (seatRepository.count() == 0) {
            logger.info("No seats found in the database. Seeding initial data.");

            List<Carriage> carriages = carriageRepository.findAll();
            final String[] firstSeatLetters = {"A", "C", "F"};
            final int firstSeatNumber = 3;
            final String[] businessSeatLetters = {"A", "C", "D", "F"};
            final int businessSeatNumber = 7;
            final String[] economySeatLetters = {"A", "B", "C", "D", "F"};
            final int economySeatNumber = 18;

            List<Seat> seats = new ArrayList<>();

            for (Carriage carriage: carriages) {
                long carriageNumber = carriage.getCarriageNumber();
                if (carriageNumber == 1L || carriageNumber == 8L) {
                    for (int i = 1; i <= firstSeatNumber; i++) {
                        for (String letter: firstSeatLetters) {
                            seats.add(createSeat(carriage, i + letter, SeatClass.first));
                        }
                    }
                    for (int i = firstSeatNumber + 1; i <= firstSeatNumber + businessSeatNumber; i++) {
                        for (String letter: businessSeatLetters) {
                            seats.add(createSeat(carriage, i + letter, SeatClass.business));
                        }
                    }
                } else {
                    for (int i = 1; i <= economySeatNumber; i++) {
                        for (String letter : economySeatLetters) {
                            seats.add(createSeat(carriage, i + letter, SeatClass.economy));
                        }
                    }
                }
            }

            for (int i = 0; i < seats.size(); i += BATCH_SIZE) {
                List<Seat> batchList = seats.subList(i, Math.min(i + BATCH_SIZE, seats.size()));
                seatRepository.saveAll(batchList);
            }

            logger.info("Seeded initial seats data");
        } else {
            logger.info("Seats already exist in the database. No seeding needed.");
        }
    }

    private Seat createSeat(Carriage carriage, String seatNumber, SeatClass seatClass) {
        return Seat.builder()
            .carriage(carriage)
            .seatNumber(seatNumber)
            .seatClass(seatClass)
            .build();
    }

    public void unseed() {
        logger.info("Deleting all seats data.");
        seatRepository.deleteAll();
        logger.info("All seats data deleted.");
    }
}
