package com.daniel.wheesh.scheduleprice;

import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.schedule.ScheduleRepository;
import com.daniel.wheesh.schedule.SeatClass;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SchedulePriceSeeder {
    private static final Logger logger = LoggerFactory.getLogger(SchedulePriceSeeder.class);
    private final ScheduleRepository scheduleRepository;
    private final SchedulePriceRepository schedulePriceRepository;

    public void seed() {
        if (schedulePriceRepository.count() == 0) {
            logger.info("No schedule prices found in the database. Seeding initial data.");

            List<Schedule> schedules = scheduleRepository.findAll();
            List<SchedulePrice> schedulePrices = new ArrayList<>();
            for (Schedule schedule: schedules) {
                for (SeatClass seatClass: SeatClass.values()) {
                    SchedulePrice schedulePrice = SchedulePrice.builder()
                        .schedule(schedule)
                        .seatClass(seatClass)
                        .price(calculatePrice(seatClass, schedule.getDepartureTime()))
                        .build();
                    schedulePrices.add(schedulePrice);
                }
            }

            schedulePriceRepository.saveAll(schedulePrices);

            logger.info("Seeded initial schedule prices data");
        } else {
            logger.info("Schedule prices already exist in the database. No seeding needed.");
        }
    }

    private Long calculatePrice(SeatClass seatClass, LocalDateTime departureTime) {
        if (seatClass == SeatClass.first) {
            return 600000L;
        } else if (seatClass == SeatClass.business) {
            return 450000L;
        } else { // ECONOMY
            DayOfWeek day = departureTime.getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                return 250000L;
            } else {
                return 200000L;
            }
        }
    }

    public void unseed() {
        logger.info("Deleting all schedule prices data.");
        schedulePriceRepository.deleteAll();
        logger.info("All schedule prices data deleted.");
    }
}
