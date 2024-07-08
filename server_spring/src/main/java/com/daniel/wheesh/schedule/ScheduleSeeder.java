package com.daniel.wheesh.schedule;

import com.daniel.wheesh.scheduleday.ScheduleDay;
import com.daniel.wheesh.scheduleday.ScheduleDayRepository;
import com.daniel.wheesh.train.Train;
import com.daniel.wheesh.train.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ScheduleSeeder {
    private static final Logger logger = LoggerFactory.getLogger(ScheduleSeeder.class);

    private final TrainRepository trainRepository;
    private final ScheduleDayRepository scheduleDayRepository;
    private final ScheduleRepository scheduleRepository;

    public void seed() {
        if (scheduleRepository.count() == 0) {
            logger.info("No schedules found in the database. Seeding initial data.");

            List<ScheduleDay> scheduleDays = scheduleDayRepository.findAll();
            List<Train> trains = trainRepository.findAll();
            ZoneId zoneId = ZoneId.of("Asia/Jakarta");

            List<Schedule> schedules = new ArrayList<>();
            for (int i = -2; i <= 7; i++) {
                ZonedDateTime today = ZonedDateTime.now(zoneId).truncatedTo(ChronoUnit.DAYS);
                ZonedDateTime tempDate = today.plusDays(i);
                for (int j = 0; j < scheduleDays.size(); j++) {
                    ZonedDateTime departureTime = tempDate
                        .withHour(scheduleDays.get(j).getDepartureTime().toLocalTime().getHour())
                        .withMinute(scheduleDays.get(j).getDepartureTime().toLocalTime().getMinute());
                    ZonedDateTime arrivalTime = tempDate
                        .withHour(scheduleDays.get(j).getArrivalTime().toLocalTime().getHour())
                        .withMinute(scheduleDays.get(j).getArrivalTime().toLocalTime().getMinute());

                    Schedule schedule = Schedule.builder()
                        .train(trains.get(j))
                        .departureStation(scheduleDays.get(j).getDepartureStation())
                        .arrivalStation(scheduleDays.get(j).getArrivalStation())
                        .departureTime(departureTime.toLocalDateTime())
                        .arrivalTime(arrivalTime.toLocalDateTime())
                        .build();
                    schedules.add(schedule);
                }
            }
            scheduleRepository.saveAll(schedules);

            logger.info("Seeded initial schedules data");
        } else {
            logger.info("Schedules already exist in the database. No seeding needed.");
        }
    }

    public void unseed() {
        logger.info("Deleting all schedules data.");
        scheduleRepository.deleteAll();
        logger.info("All schedules data deleted.");
    }
}
